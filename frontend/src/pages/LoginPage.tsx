/**
 * LoginPage Component
 * Handles user authentication with email and password
 * Features:
 * - Login form with validation
 * - Success/error notifications
 * - Loading state management
 * - Navigation after successful login
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();  // Access auth context for user management
  
  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Attempt login
      const response = await login(formData);
      
      // Update auth context with user data
      setUser(response.user);
      
      // Show success notification
      toast.success(`Welcome back, ${response.user.username}!`, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored"
      });
      
      // Navigate to home page after short delay
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      // Show error notification
      const message = error.response?.data?.message || 'Error during login';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        {/* Login form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          {/* Password input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {/* Submit button with loading state */}
          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        {/* Link to signup page */}
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
