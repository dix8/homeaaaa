import express from 'express';
import authRouter from './auth';
import projectRouter from './projects';
import skillRouter from './skills';
import uploadRouter from './upload';
import settingsRouter from './settings';
import profileRouter from './profile';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/skills', skillRouter);
router.use('/upload', uploadRouter);
router.use('/settings', settingsRouter);
router.use('/profile', profileRouter);

export default router; 