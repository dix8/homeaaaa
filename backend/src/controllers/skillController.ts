import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const skillController = {
  // 获取所有技能
  getAllSkills: async (req: Request, res: Response) => {
    try {
      const skills = await prisma.skill.findMany({
        orderBy: {
          id: 'asc'
        }
      });
      res.json(skills);
    } catch (error) {
      console.error('获取技能列表失败:', error);
      res.status(500).json({ error: '获取技能列表失败' });
    }
  },

  // 创建技能
  createSkill: async (req: Request, res: Response) => {
    try {
      const skill = await prisma.skill.create({
        data: req.body
      });
      res.json(skill);
    } catch (error) {
      console.error('创建技能失败:', error);
      res.status(500).json({ error: '创建技能失败' });
    }
  },

  // 更新技能
  updateSkill: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const skill = await prisma.skill.update({
        where: { id: Number(id) },
        data: req.body
      });
      res.json(skill);
    } catch (error) {
      console.error('更新技能失败:', error);
      res.status(500).json({ error: '更新技能失败' });
    }
  },

  // 删除技能
  deleteSkill: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.skill.delete({
        where: { id: Number(id) }
      });
      res.json({ message: '技能删除成功' });
    } catch (error) {
      console.error('删除技能失败:', error);
      res.status(500).json({ error: '删除技能失败' });
    }
  },
}; 