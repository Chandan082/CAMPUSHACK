import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const token = header.slice(7);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}
