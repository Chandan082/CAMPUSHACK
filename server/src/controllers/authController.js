import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateOtp } from '../utils/otpGenerator.js';
import { signToken } from '../utils/jwt.js';
import { sendOtpEmail } from '../config/mail.js';

const OTP_TTL_MS = 10 * 60 * 1000;

async function issueOtpForEmail(email) {
  await OTP.deleteMany({ email: email.toLowerCase() });
  const code = generateOtp(6);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  await OTP.create({ email: email.toLowerCase(), code, expiresAt });
  await sendOtpEmail(email, code);
  return { code, expiresAt };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const allowedRoles = ['student', 'faculty', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      isVerified: false,
    });

    await issueOtpForEmail(user.email);

    res.status(201).json({
      message: 'Registration successful. Check your email for the verification code.',
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const record = await OTP.findOne({ email: email.toLowerCase(), code: String(code).trim() });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await OTP.deleteMany({ email: email.toLowerCase() });

    const token = signToken({ sub: user._id.toString(), role: user.role });

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    await issueOtpForEmail(user.email);

    res.json({ message: 'A new verification code has been sent to your email.' });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: user.email,
      });
    }

    const token = signToken({ sub: user._id.toString(), role: user.role });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
    },
  });
}
