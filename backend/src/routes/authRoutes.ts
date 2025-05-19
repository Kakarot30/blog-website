/**
 * Authentication Routes
 * Defines API endpoints for user authentication
 * Routes:
 * - POST /signup: Create new user account
 * - POST /login: Authenticate existing user
 */
import express from 'express';
import { signup, login } from '../controllers/authController';

const router = express.Router();

// User registration endpoint
router.post('/signup', signup);

// User login endpoint
router.post('/login', login);

export default router;
