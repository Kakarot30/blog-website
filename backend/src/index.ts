import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import blogRoutes from './routes/blogRoutes';
import authRoutes from './routes/authRoutes';
import { Server } from 'http';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogapp';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to try different ports
const startServer = (port: number): Promise<Server> => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
      .once('listening', () => {
        console.log(`Server running on port ${port}`);
        resolve(server);
      })
      .once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}...`);
          server.close();
          startServer(port + 1).then(resolve).catch(reject);
        } else {
          reject(err);
        }
      });
  });
};

// Start server with port fallback
startServer(Number(PORT))
  .catch(err => console.error('Failed to start server:', err));