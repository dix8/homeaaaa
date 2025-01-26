import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import projectRouter from './routes/projects';
import skillRouter from './routes/skills';
import uploadRouter from './routes/upload';
import settingsRouter from './routes/settings';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/skills', skillRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);

export default app; 