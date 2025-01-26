import express from 'express';
import { auth } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get profile
router.get('/', async (req, res) => {
  try {
    let profile = await prisma.profile.findFirst();
    
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          name: 'Default Name',
          title: 'Default Title',
          bio: 'Default Bio',
          email: 'default@example.com',
          avatar: null,
          github: null,
          linkedin: null,
          twitter: null,
          telegram: null,
          youtube: null,
          bilibili: null,
          avatarSource: 'upload',
          avatarQQNumber: null,
          avatarGravatarEmail: null,
          avatarGravatarServer: 'https://www.gravatar.com/avatar/',
          avatarCustomUrl: null
        }
      });
    }
    
    res.json({ data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: '获取个人信息失败' });
  }
});

// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      title,
      bio,
      email,
      github,
      linkedin,
      twitter,
      telegram,
      youtube,
      bilibili,
      avatar,
      avatarSource,
      avatarQQNumber,
      avatarGravatarEmail,
      avatarGravatarServer,
      avatarCustomUrl
    } = req.body;

    let profile = await prisma.profile.findFirst();

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          name,
          title,
          bio,
          email,
          github,
          linkedin,
          twitter,
          telegram,
          youtube,
          bilibili,
          avatar,
          avatarSource,
          avatarQQNumber,
          avatarGravatarEmail,
          avatarGravatarServer,
          avatarCustomUrl,
          updatedAt: new Date()
        }
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          name,
          title,
          bio,
          email,
          github,
          linkedin,
          twitter,
          telegram,
          youtube,
          bilibili,
          avatar,
          avatarSource,
          avatarQQNumber,
          avatarGravatarEmail,
          avatarGravatarServer,
          avatarCustomUrl
        }
      });
    }

    res.json({ data: profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: '更新个人信息失败' });
  }
});

export default router; 