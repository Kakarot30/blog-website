// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BlogData, getBlogById, publishBlog } from '../services/api';
import useAutoSave from '../hooks/useAutoSave';
import { useNavigate } from 'react-router-dom';

// TinyMCE editor API key from environment variables
const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY || '';

// Props interface for the BlogEditor component
interface BlogEditorProps {
  blogId?: string;  // Optional blogId for editing existing blogs
}

/**
 * BlogEditor Component
 * Handles both creating new blogs and editing existing ones
 * Features:
 * - Auto-saving drafts every 5 seconds
 * - Rich text editing with TinyMCE
 * - Tag management
 * - Draft saving and publishing
 */
const BlogEditor: React.FC<BlogEditorProps> = ({ blogId }) => {
  const navigate = useNavigate();
  // State for loading indicators and blog data
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<BlogData>({
    title: '',
    content: '',
    tags: [],
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Effect hook to fetch existing blog data when editing
  useEffect(() => {
    const fetchBlog = async () => {
      console.log("BlogEditor component - Fetching blog with ID:", blogId);
      if (blogId) {
        setIsLoading(true);
        try {
          const blog = await getBlogById(blogId);
          console.log("Fetched blog data:", blog);
          if (blog) {
            const updatedData = {
              id: blog._id,
              title: blog.title || '',
              content: blog.content || '',
              tags: blog.tags || [],
              status: blog.status,
            };
            console.log("Setting initial data:", updatedData);
            setInitialData(updatedData);
            setIsDataLoaded(true);
          } else {
            console.error("No blog data returned for ID:", blogId);
            toast.error('Failed to load blog - no data found');
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
          toast.error('Failed to load blog');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No blog ID provided, creating new blog");
        setIsDataLoaded(true);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Initialize auto-save hook with configuration
  const { data, updateData, isSaving, lastSaved, save } = useAutoSave({
    initialData,
    delay: 5000, // Auto-save every 5 seconds
    onSave: (savedData) => {
      // Update URL with new blog ID for new blogs
      if (!blogId && savedData && savedData._id) {
        navigate(`/edit/${savedData._id}`, { replace: true });
      }
      // Show auto-save notification
      toast.success('Draft saved automatically', {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
    },
  });

  // Debug logging for data changes
  useEffect(() => {
    console.log("Initial data changed:", initialData);
  }, [initialData]);

  useEffect(() => {
    console.log("Current data:", data);
  }, [data]);

  // Handle changes to tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    // Split tags by comma, trim whitespace, and filter empty tags
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    updateData({ tags: tagsArray });
  };

  // Handle rich text editor content changes
  const handleEditorChange = (content: string) => {
    updateData({ content });
  };

  // Handle blog publishing
  const handlePublish = async () => {
    // Validate required fields
    if (!data.title || !data.content) {
      toast.warning('Please add a title and content before publishing');
      return;
    }

    try {
      const publishedBlog = await publishBlog(data);
      toast.success('Blog published successfully!');
      navigate(`/view/${publishedBlog._id}`);
    } catch (error) {
      console.error('Error publishing blog:', error);
      toast.error('Failed to publish blog');
    }
  };

  // Show loading state while fetching blog data
  if (isLoading || !isDataLoaded) {
    return <div className="loading">Loading...</div>;
  }

  // Main editor interface
  return (
    <div className="blog-editor">
      {/* Toast notification container */}
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="colored"
      />
      
      {/* Editor header with title and last saved time */}
      <div className="editor-header">
        <h1>{blogId ? 'Edit Blog' : 'Create New Blog'}</h1>
        {lastSaved && (
          <div className="last-saved">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {/* Blog title input */}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          placeholder="Enter blog title"
          className="form-control"
        />
      </div>
      
      {/* Rich text editor for blog content */}
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <Editor
          apiKey={TINYMCE_API_KEY}
          value={data.content}
          onEditorChange={handleEditorChange}
          init={{
            height: 400,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
              'preview', 'anchor', 'searchreplace', 'visualblocks', 
              'code', 'fullscreen', 'insertdatetime', 'media', 'table', 
              'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
                     'bold italic backcolor | alignleft aligncenter ' +
                     'alignright alignjustify | bullist numlist outdent indent | ' +
                     'removeformat | help',
          }}
        />
      </div>
      
      {/* Tags input */}
      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          value={data.tags.join(', ')}
          onChange={handleTagsChange}
          placeholder="tag1, tag2, tag3"
          className="form-control"
        />
      </div>
      
      {/* Action buttons */}
      <div className="editor-actions">
        <button 
          className="btn save-btn"
          onClick={async () => {
            try {
              const savedBlog = await save();
              console.log('Draft saved:', savedBlog);
              // Short delay before navigation
              setTimeout(() => {
                navigate('/');
              }, 500);
            } catch (error) {
              console.error('Error saving draft:', error);
              toast.error('Failed to save draft');
            }
          }}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
        <button 
          className="btn publish-btn"
          onClick={handlePublish}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;