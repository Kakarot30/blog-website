import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { isAuthenticated, logout } from '../services/auth';
import HomePage from '../pages/HomePage';
import EditorPage from '../pages/EditorPage';
import ViewPage from '../pages/ViewPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const Layout = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        closeButton={true}
        theme="colored"
      />
      
      {isAuthenticated && (
        <nav className="sidebar">
          <div className="sidebar-logo">
            Blog App
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </Link>
            <Link to="/edit" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              New Blog
            </Link>
            {user && (
              <div className="user-info">
                Welcome, {user.username}
              </div>
            )}
            <button onClick={handleLogout} className="nav-link logout-btn" style={{ border: 'none', width: '100%', textAlign: 'left' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </nav>
      )}
      
      <main className={isAuthenticated ? 'main-content' : ''}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/edit" 
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/view/:id" 
            element={
              <ProtectedRoute>
                <ViewPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
