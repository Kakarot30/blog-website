/**
 * Blog Model
 * Mongoose schema and model for blog posts
 * Features:
 * - Title and content storage
 * - Tags support
 * - Draft/Published status
 * - Timestamps for creation and updates
 */
import mongoose, { Document, Schema } from 'mongoose';

// Blog document interface
export interface IBlog extends Document {
  title: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// Blog schema definition
const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [1, 'Content cannot be empty']
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags: string[]) {
        // Ensure all tags are non-empty strings
        return tags.every(tag => typeof tag === 'string' && tag.trim().length > 0);
      },
      message: 'Tags must be non-empty strings'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  // Enable timestamps for createdAt and updatedAt
  timestamps: true
});

// Create and export the model
const Blog = mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;