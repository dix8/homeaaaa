import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get site settings
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          title: '个人主页',
          pageTitle: '个人主页',
          favicon: null,
          logo: null,
          description: '',
          keywords: '',
          copyright: '',
          icp: '',
          gongan: ''
        }
      });
    }
    
    res.json({ data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: '获取设置失败' });
  }
});

// Update site settings
router.put('/', auth, async (req, res) => {
  try {
    const { 
      title, 
      pageTitle,
      favicon, 
      logo, 
      description, 
      keywords,
      copyright,
      icp,
      gongan 
    } = req.body;
    
    let settings = await prisma.siteSettings.findFirst();
    
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          title,
          pageTitle,
          favicon,
          logo,
          description,
          keywords,
          copyright,
          icp,
          gongan,
          updatedAt: new Date()
        }
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          title,
          pageTitle,
          favicon,
          logo,
          description,
          keywords,
          copyright,
          icp,
          gongan
        }
      });
    }
    
    res.json({ data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: '更新设置失败' });
  }
});

export default router; 