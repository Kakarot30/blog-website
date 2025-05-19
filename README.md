# Blog Application

A full-stack application for writing, editing, saving, and publishing blogs with an auto-save draft feature.

## Features

- Write and edit blog posts with a rich text editor
- Auto-save drafts every 5 seconds
- Publish blogs when ready
- View all published blogs and drafts separately
- Edit existing blogs and drafts

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- React Quill for rich text editing
- React Toastify for notifications
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB for database
- Mongoose for MongoDB interaction
- TypeScript for type safety

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone this repository
```
git clone https://github.com/Kakarot30/blog-website.git
```

2. Install dependencies for frontend and backend
```
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory with these variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogapp
```

4. Start the development servers

Backend:
```
cd backend
npm run dev
```

Frontend:
```
cd frontend
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/blogs` - Retrieve all blogs
- `GET /api/blogs/:id` - Retrieve a blog by ID
- `POST /api/blogs/save-draft` - Save or update a draft
- `POST /api/blogs/publish` - Save and publish a blog

## License

MIT 
