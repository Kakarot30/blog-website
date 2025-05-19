/**
 * Blog Routes
 * Defines API endpoints for blog operations
 * Routes:
 * - GET /: Get all blogs (optional status filter)
 * - GET /:id: Get single blog by ID
 * - POST /save-draft: Save blog as draft
 * - POST /publish: Publish blog
 * - DELETE /:id: Delete blog
 */
import express, { Router } from 'express';
import { 
  getBlogs, 
  getBlogById, 
  saveDraft, 
  publishBlog,
  deleteBlog
} from '../controllers/blogController';

const router: Router = express.Router();

// Blog CRUD routes
router.get('/', getBlogs);                 // Get all blogs
router.get('/:id', getBlogById);           // Get single blog
router.post('/save-draft', saveDraft);     // Save as draft
router.post('/publish', publishBlog);      // Publish blog
router.delete('/:id', deleteBlog);         // Delete blog

export default router;