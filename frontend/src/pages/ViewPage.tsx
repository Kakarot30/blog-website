import React from 'react';
import BlogView from '../components/BlogView';

const ViewPage: React.FC = () => {
  return (
    <div className="view-page">
      <div className="view-container">
        <BlogView />
      </div>
    </div>
  );
};

export default ViewPage; 