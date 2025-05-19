/**
 * BlogList Component
 * Displays a list of blogs with filtering and management options
 * Features:
 * - Filter between drafts and published blogs
 * - Blog CRUD operations for authenticated users
 * - Loading and error states
 * - Responsive grid layout
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, deleteBlog } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { BlogData } from '../services/api';

// Define blog status types
type BlogStatus = 'draft' | 'published' | 'all';

const BlogList: React.FC = () => {
  // State management
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<BlogStatus>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Get authentication status
  const { isAuthenticated } = useAuth();

  /**
   * Fetch blogs based on active filter
   * Handles loading, error states, and data validation
   */
  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get blogs with optional status filter
      const status = activeTab === 'all' ? undefined : activeTab;
      const data = await getBlogs(status);
      
      // Validate response data
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from server');
      }
      
      console.log('Raw blog data from server:', data);
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load blogs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blogs when filter changes
  useEffect(() => {
    fetchBlogs();
  }, [activeTab]);

  /**
   * Handle blog deletion
   * Confirms action with user before deleting
   */
  const handleDelete = async (blog: BlogData) => {    // Ensure blog has an _id before proceeding
    if (!blog._id) {
      toast.error('Cannot delete blog: Missing ID');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${blog.title}"?`);
    if (!confirmDelete) return;

    setDeletingId(blog._id);
    try {
      await deleteBlog(blog._id);
      toast.success('Blog deleted successfully');
      fetchBlogs(); // Refresh list after deletion
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="loading">Loading blogs...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchBlogs} className="btn retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="blog-list">      {/* Filter tabs */}
      <div className="blog-filters">
        <button 
          className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        {isAuthenticated && (
          <button 
            className={`filter-btn ${activeTab === 'draft' ? 'active' : ''}`}
            onClick={() => setActiveTab('draft')}
            data-status="draft"
          >
            Drafts
          </button>
        )}
        <button 
          className={`filter-btn ${activeTab === 'published' ? 'active' : ''}`}
          onClick={() => setActiveTab('published')}
          data-status="published"
        >
          Published
        </button>
      </div>

      {/* Blog grid */}
      <div className="blogs-container">
        {blogs.length === 0 ? (
          <div className="no-blogs">
            <p>No blogs found.</p>
            {isAuthenticated && (
              <Link to="/edit" className="btn create-btn">
                Create New Blog
              </Link>
            )}
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.map(blog => (
              <div key={blog._id} className="blog-card">                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-status" data-status={blog.status}>{blog.status}</p>
                
                {/* Action buttons */}
                <div className="blog-actions">
                  {isAuthenticated && (
                    <>
                      <Link to={`/edit/${blog._id}`} className="btn edit-btn">
                        Edit
                      </Link>
                      <Link to={`/view/${blog._id}`} className="btn view-btn">
                        View
                      </Link>
                      <button 
                        className="btn delete-btn"
                        onClick={() => handleDelete(blog)}
                        disabled={deletingId === blog._id}
                      >
                        {deletingId === blog._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  )}
                  {!isAuthenticated && (
                    <Link to={`/view/${blog._id}`} className="btn view-btn">
                      View
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;