import Attendance from '../models/Attendance.js';
import AttendanceSession from '../models/AttendanceSession.js';

export async function createSession(req, res, next) {
  try {
    const { title, course, expiresInMinutes = 30 } = req.body;
    const sessionCode = AttendanceSession.generateSessionCode();
    const expiresAt = new Date(Date.now() + Number(expiresInMinutes) * 60 * 1000);

    const session = await AttendanceSession.create({
      sessionCode,
      title,
      course,
      createdBy: req.user._id,
      expiresAt,
    });

    const qrPayload = JSON.stringify({
      type: 'campushack-attendance',
      sessionCode: session.sessionCode,
      expiresAt: session.expiresAt.toISOString(),
    });

    res.status(201).json({
      session,
      qrPayload,
    });
  } catch (err) {
    next(err);
  }
}

export async function checkIn(req, res, next) {
  try {
    const { sessionCode, course } = req.body;
    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    const session = await AttendanceSession.findOne({
      sessionCode: String(sessionCode).trim().toUpperCase(),
      isActive: true,
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired attendance session' });
    }

    try {
      const record = await Attendance.create({
        user: req.user._id,
        sessionCode: session.sessionCode,
        course: course || session.course,
        method: 'qr',
      });
      res.status(201).json({ message: 'Attendance recorded', attendance: record });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ message: 'You already checked in for this session' });
      }
      throw e;
    }
  } catch (err) {
    next(err);
  }
}

export async function listMyAttendance(req, res, next) {
  try {
    const items = await Attendance.find({ user: req.user._id })
      .sort({ checkedInAt: -1 })
      .limit(100);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function listSessions(req, res, next) {
  try {
    const sessions = await AttendanceSession.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ items: sessions });
  } catch (err) {
    next(err);
  }
}

export async function listAllSessions(req, res, next) {
  try {
    const sessions = await AttendanceSession.find().sort({ createdAt: -1 }).limit(100);
    res.json({ items: sessions });
  } catch (err) {
    next(err);
  }
}
