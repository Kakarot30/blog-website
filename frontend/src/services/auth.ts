/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */
import axios from 'axios';
import { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:5000/api';

/**
 * Sign up a new user
 * @param credentials - User signup data (username, email, password)
 * @returns Promise with auth response containing token and user data
 */
export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, credentials);
    if (response.data.token) {
      // Store auth data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Log in an existing user
 * @param credentials - Login credentials (email, password)
 * @returns Promise with auth response containing token and user data
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      // Store auth data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Log out the current user
 * Removes all auth data from localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 * @returns boolean indicating if valid token exists
 */
export const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem('token'));
};
