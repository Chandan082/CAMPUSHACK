import { Router } from 'express';
import {
  listEvents,
  listAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { requireAuth, requireRoles } from '../middlewares/auth.js';

const router = Router();

router.get('/public', listEvents);

router.use(requireAuth);

router.get('/', listEvents);
router.get('/admin/all', requireRoles('admin', 'faculty'), listAllEvents);
router.get('/:id', getEvent);
router.post('/', requireRoles('admin', 'faculty'), createEvent);
router.patch('/:id', requireRoles('admin', 'faculty'), updateEvent);
router.delete('/:id', requireRoles('admin', 'faculty'), deleteEvent);

export default router;
