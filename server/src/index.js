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

app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'Smart Student Solution API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/complaints', complaintRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
