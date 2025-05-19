/**
 * API Service
 * Handles all blog-related API calls to the backend
 */
import axios from 'axios';

// Blog data interface
export interface BlogData {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  tags: string[];
  status?: 'draft' | 'published';
}

// Base URL for API calls
const API_URL = 'http://localhost:5000/api';

/**
 * Get all blogs
 * @param status Optional status filter ('draft' or 'published')
 * @returns Promise with array of blogs
 */
export const getBlogs = async (status?: string): Promise<BlogData[]> => {
  try {
    const response = await axios.get(`${API_URL}/blogs${status ? `?status=${status}` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

/**
 * Get a single blog by ID
 * @param id Blog ID
 * @returns Promise with blog data
 */
export const getBlogById = async (id: string): Promise<BlogData> => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with id ${id}:`, error);
    throw error;
  }
};

/**
 * Save blog as draft
 * @param blogData Blog data to save
 * @returns Promise with saved blog data
 */
export const saveDraft = async (blogData: BlogData): Promise<BlogData> => {
  try {
    // Ensure consistent ID field usage
    const data = { 
      ...blogData,
      status: 'draft' // Explicitly set status to draft
    };
    
    // Use _id as id for backend if available
    if (data._id && !data.id) {
      data.id = data._id;
    }
    
    const response = await axios.post(`${API_URL}/blogs/save-draft`, data);
    return response.data;
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
};

/**
 * Publish a blog
 * @param blogData Blog data to publish
 * @returns Promise with published blog data
 */
export const publishBlog = async (blogData: BlogData): Promise<BlogData> => {
  try {
    // Ensure consistent ID field usage
    const data = { ...blogData };
    if (data._id && !data.id) {
      data.id = data._id;
    }
    
    const response = await axios.post(`${API_URL}/blogs/publish`, data);
    return response.data;
  } catch (error) {
    console.error('Error publishing blog:', error);
    throw error;
  }
};

/**
 * Delete a blog
 * @param id Blog ID to delete
 * @returns Promise with delete response
 */
export const deleteBlog = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/blogs/${id}`);
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

