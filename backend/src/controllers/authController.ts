/**
 * Authentication Controller
 * Handles user authentication operations in the backend
 * - User registration
 * - User login
 * - JWT token generation
 */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * User Registration
 * Creates a new user account
 * - Validates unique email/username
 * - Hashes password
 * - Generates JWT token
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

/**
 * User Login
 * Authenticates existing user
 * - Validates credentials
 * - Generates JWT token
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};
