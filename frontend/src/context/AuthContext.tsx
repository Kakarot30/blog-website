/**
 * AuthContext
 * Manages global authentication state throughout the application
 * Features:
 * - User authentication state management
 * - Token persistence
 * - Authentication status checks
 * - User data management
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types/auth';

// Define the shape of our context
interface AuthContextType {
  user: User | null;          // Current user data
  setUser: (user: User | null) => void;  // Function to update user
  isAuthenticated: boolean;   // Whether user is logged in
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

/**
 * AuthProvider Component
 * Wraps the application to provide authentication context
 * - Initializes auth state from localStorage
 * - Provides methods to update auth state
 * - Persists auth state changes
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Computed authentication status
  const isAuthenticated = Boolean(user);

  // Persist user data changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Provide context value to children
  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy context usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
