import React from 'react';
import { Link } from 'react-router-dom';
import BlogList from '../components/BlogList';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="header">
        <h1>My Blog App</h1>
        <p>Write, save, and publish your thoughts</p>
        
        {!isAuthenticated && (
          <div className="header-auth">
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/signup" className="btn">
              Sign Up
            </Link>
          </div>
        )}
      </div>
      
      <div className="content">
        <BlogList />
      </div>
    </div>
  );
};

export default HomePage;