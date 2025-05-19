/**
 * Authentication Types
 * Defines types and interfaces for authentication-related data
 */

// User model interface
export interface User {
  id: string;
  username: string;
  email: string;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup credentials interface
export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

// Auth response interface
export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}