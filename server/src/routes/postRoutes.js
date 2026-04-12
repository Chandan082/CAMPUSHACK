import { Router } from 'express';
import {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listPosts);
router.get('/:id', getPost);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
