/**
 * BlogView Component
 * Displays a single blog post with full content
 * Features:
 * - Rich text content rendering
 * - Edit and delete options for authenticated users
 * - Loading and error states
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, BlogData, deleteBlog } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const BlogView: React.FC = () => {
  // URL parameter for blog ID
  const { id } = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // State management
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Fetch blog data on mount or ID change
  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          throw new Error('Blog ID is required');
        }
        const data = await getBlogById(id);
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load the blog. It might have been deleted or does not exist.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);
  
  /**
   * Handle blog deletion
   * Confirms with user before deleting
   */
  const handleDelete = async () => {
    if (!blog || !id) return;
    
    // Confirm deletion
    const confirmDelete = window.confirm(`Are you sure you want to delete "${blog.title}"?`);
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteBlog(id);
      toast.success('Blog deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
      setIsDeleting(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Error state
  if (error || !blog) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-view">
      {/* Blog header */}
      <div className="blog-header">
        <h1>{blog.title}</h1>
        <div className="blog-meta">
          <span className="status">Status: {blog.status}</span>
        </div>
      </div>

      {/* Blog content */}
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags display */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="blog-tags">
          <h3>Tags:</h3>
          <div className="tags-list">
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons for authenticated users */}
      {isAuthenticated && (
        <div className="blog-actions">
          <Link to={`/edit/${blog._id}`} className="btn edit-btn">
            Edit
          </Link>
          <button 
            className="btn delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogView;