import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import postRoutes from './routes/postRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS to allow your Vercel URL
app.use(cors({ 
  origin: [
    "https://campushack-git-main-chandan-kumars-projects-c386896f.vercel.app",
    "https://campushack.vercel.app" // Add your main Vercel domain too
  ],
  credentials: true 
}));

app.use(express.json());

// API Routes
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'Smart Student Solution API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/complaints', complaintRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  try {
    // await connectDB(); // Keep commented if not using DB yet
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();