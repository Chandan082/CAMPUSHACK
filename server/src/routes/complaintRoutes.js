import { Router } from 'express';
import {
  createComplaint,
  listMyComplaints,
  listAllComplaints,
  getComplaint,
  updateComplaintAdmin,
} from '../controllers/complaintController.js';
import { requireAuth, requireRoles } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', createComplaint);
router.get('/mine', listMyComplaints);
router.get('/admin/all', requireRoles('admin'), listAllComplaints);
router.patch('/admin/:id', requireRoles('admin'), updateComplaintAdmin);
router.get('/:id', getComplaint);

export default router;
