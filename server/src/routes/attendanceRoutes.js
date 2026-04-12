import { Router } from 'express';
import {
  createSession,
  checkIn,
  listMyAttendance,
  listSessions,
  listAllSessions,
} from '../controllers/attendanceController.js';
import { requireAuth, requireRoles } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/sessions', requireRoles('faculty', 'admin'), createSession);
router.get('/sessions/mine', requireRoles('faculty', 'admin'), listSessions);
router.get('/sessions/all', requireRoles('admin'), listAllSessions);
router.post('/check-in', checkIn);
router.get('/mine', listMyAttendance);

export default router;
