import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';

const EditorPage: React.FC = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  
  // Debug output
  useEffect(() => {
    console.log("EditorPage received ID:", id);
  }, [id]);
  
  return (
    <div className="editor-page">
      <div className="editor-nav">
        <Link to="/" className="btn back-btn">Back to Home</Link>
      </div>
      
      <div className="editor-container">
        <BlogEditor blogId={id} />
      </div>
    </div>
  );
};

export default EditorPage; 