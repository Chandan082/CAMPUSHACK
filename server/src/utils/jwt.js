import jwt from 'jsonwebtoken';

export function signToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.sign(payload, secret, {
    expiresIn: options.expiresIn || '7d',
  });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.verify(token, secret);
}
