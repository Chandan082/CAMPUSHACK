import { Router } from 'express';
import {
  register,
  verifyEmail,
  resendOtp,
  login,
  requestLoginOtp,
  loginWithOtp,
  me,
} from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/login-otp/request', requestLoginOtp);
router.post('/login-otp/verify', loginWithOtp);
router.get('/me', requireAuth, me);

export default router;
