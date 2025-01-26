import express from 'express';
import { auth } from '../middleware/auth';
import { projectController } from '../controllers/projectController';

const router = express.Router();

// Get all projects
router.get('/', projectController.getAllProjects);

// Create a new project
router.post('/', auth, projectController.createProject);

// Update a project
router.put('/:id', auth, projectController.updateProject);

// Delete a project
router.delete('/:id', auth, projectController.deleteProject);

export default router; 