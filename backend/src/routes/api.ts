import express from 'express';
import { authController } from '../controllers/authController';
import { profileController } from '../controllers/profileController';
import { skillController } from '../controllers/skillController';
import { projectController } from '../controllers/projectController';
import { uploadController } from '../controllers/uploadController';
import { auth } from '../middleware/auth';
import { errorHandler } from '../middleware/errorHandler';

const router = express.Router();

// Auth routes
router.post('/auth/login', authController.login);

// Protected routes
router.use(auth);

// Profile routes
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);

// Upload routes
router.post('/upload/:type', uploadController.uploadFile);

// Skills routes
router.get('/skills', skillController.getAllSkills);
router.post('/skills', skillController.createSkill);
router.put('/skills/:id', skillController.updateSkill);
router.delete('/skills/:id', skillController.deleteSkill);

// Projects routes
router.get('/projects', projectController.getAllProjects);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

// 错误处理
router.use(errorHandler);

export default router; 