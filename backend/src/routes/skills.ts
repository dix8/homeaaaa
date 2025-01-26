import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { category: 'asc' }
    });
    res.json({ data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: '获取技能列表失败' });
  }
});

// Create a new skill
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;
    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        proficiency
      }
    });
    res.json({ data: skill });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: '创建技能失败' });
  }
});

// Update a skill
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency } = req.body;
    const skill = await prisma.skill.update({
      where: { id: parseInt(id) },
      data: {
        name,
        category,
        proficiency,
        updatedAt: new Date()
      }
    });
    res.json({ data: skill });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: '更新技能失败' });
  }
});

// Delete a skill
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({
      where: { id: parseInt(id) }
    });
    res.json({ data: null });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: '删除技能失败' });
  }
});

export default router; 