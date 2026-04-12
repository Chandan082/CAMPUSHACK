import { Router } from 'express';
import {
  listResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listResources);
router.get('/:id', getResource);
router.post('/', createResource);
router.patch('/:id', updateResource);
router.delete('/:id', deleteResource);

export default router;
