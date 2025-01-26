import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const projectController = {
  // Get all projects
  getAllProjects: async (req: Request, res: Response) => {
    try {
      const projects = await prisma.project.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json({ data: projects });
    } catch (error) {
      console.error('Error getting projects:', error);
      res.status(500).json({ error: 'Failed to get projects' });
    }
  },

  // Create project
  createProject: async (req: Request, res: Response) => {
    try {
      const { title, description, imageUrl, projectUrl, technologies } = req.body;
      const project = await prisma.project.create({
        data: {
          title,
          description,
          imageUrl: imageUrl || '',
          projectUrl: projectUrl || '',
          technologies: technologies || [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      res.json({ data: project });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  },

  // Update project
  updateProject: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { title, description, imageUrl, projectUrl, technologies } = req.body;
      const project = await prisma.project.update({
        where: { id },
        data: {
          title,
          description,
          imageUrl: imageUrl || '',
          projectUrl: projectUrl || '',
          technologies: technologies || [],
          updatedAt: new Date()
        }
      });
      res.json({ data: project });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  },

  // Delete project
  deleteProject: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.project.delete({
        where: { id }
      });
      res.json({ data: null });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
}; 