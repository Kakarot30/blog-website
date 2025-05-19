/**
 * Blog Controller
 * Handles all blog-related operations in the backend
 * - CRUD operations for blogs
 * - Draft management
 * - Blog status management
 */
import { Request, Response, NextFunction, RequestHandler } from 'express';
import Blog from '../models/Blog';

/**
 * Get all blogs
 * Optional status filter for drafts/published
 */
export const getBlogs: RequestHandler = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    console.log('Backend: Getting all blogs');
    const blogs = await Blog.find(filter).sort({ updatedAt: -1 });
    console.log(`Backend: Found ${blogs.length} blogs`);
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Backend error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
};

/**
 * Get a single blog by ID
 */
export const getBlogById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Backend: Getting blog with ID: ${id}`);
    
    if (!id) {
      console.log('Backend: No ID provided');
      res.status(404).json({ message: 'Blog ID is required' });
      return;
    }
    
    const blog = await Blog.findById(id);
    console.log(`Backend: Blog found:`, blog);
    
    if (!blog) {
      console.log(`Backend: No blog found with ID ${id}`);
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    
    res.status(200).json(blog);
  } catch (error) {
    console.error(`Backend error fetching blog with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching blog', error });
  }
};

/**
 * Save or update a blog draft
 * Creates new draft or updates existing one
 */
export const saveDraft: RequestHandler = async (req, res, next) => {
  try {
    const { id, title, content, tags } = req.body;
    console.log(`Backend: Saving draft, ID: ${id || 'new'}`);
      if (id) {
      // Update existing draft
      console.log(`Backend: Updating existing draft with ID: ${id}`);
      console.log('Draft data received:', { title, content, tags, status: 'draft' });
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { title, content, tags, status: 'draft' },
        { new: true, runValidators: true }
      );
      console.log('Backend: Draft updated:', updatedBlog);
      res.status(200).json(updatedBlog);
    } else {
      // Create new draft
      console.log('Backend: Creating new draft');
      console.log('Draft data to save:', { title, content, tags, status: 'draft' });
      const newBlog = new Blog({
        title,
        content,
        tags,
        status: 'draft'
      });
      await newBlog.save();
      console.log('Backend: New draft created:', newBlog);
      res.status(201).json(newBlog);
    }
  } catch (error) {
    console.error('Backend error saving draft:', error);
    res.status(500).json({ message: 'Error saving draft', error });
  }
};

/**
 * Publish a blog
 * Updates blog status to published
 */
export const publishBlog: RequestHandler = async (req, res, next) => {
  try {
    const { id, title, content, tags } = req.body;
    console.log(`Backend: Publishing blog, ID: ${id || 'new'}`);
    
    if (id) {
      // Update existing blog and publish
      console.log(`Backend: Updating and publishing existing blog with ID: ${id}`);
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { title, content, tags, status: 'published' },
        { new: true }
      );
      console.log('Backend: Blog published:', updatedBlog);
      res.status(200).json(updatedBlog);
    } else {
      // Create new published blog
      console.log('Backend: Creating new published blog');
      const newBlog = new Blog({
        title,
        content,
        tags,
        status: 'published'
      });
      await newBlog.save();
      console.log('Backend: New blog published:', newBlog);
      res.status(201).json(newBlog);
    }
  } catch (error) {
    console.error('Backend error publishing blog:', error);
    res.status(500).json({ message: 'Error publishing blog', error });
  }
};

/**
 * Delete a blog
 * Removes blog from database
 */
export const deleteBlog: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Backend: Deleting blog with ID: ${id}`);
    
    if (!id) {
      console.log('Backend: No ID provided for deletion');
      res.status(400).json({ message: 'Blog ID is required' });
      return;
    }
    
    const blog = await Blog.findByIdAndDelete(id);
    
    if (!blog) {
      console.log(`Backend: No blog found with ID ${id} for deletion`);
      res.status(404).json({ message: 'Blog not found' });
      return;
    }
    
    console.log(`Backend: Blog deleted successfully, ID: ${id}`);
    res.status(200).json({ message: 'Blog deleted successfully', id });
  } catch (error) {
    console.error(`Backend error deleting blog with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting blog', error });
  }
};