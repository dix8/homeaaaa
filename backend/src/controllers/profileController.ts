import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const profileController = {
  // Get profile data
  getProfile: async (req: Request, res: Response) => {
    try {
      let profile = await prisma.profile.findFirst();
      
      if (!profile) {
        // Create default profile if none exists
        profile = await prisma.profile.create({
          data: {
            name: 'Default Name',
            title: 'Default Title',
            bio: 'Default Bio',
            avatar: '',
            email: '',
            github: '',
            linkedin: '',
            twitter: '',
            telegram: '',
            youtube: '',
            bilibili: '',
            avatarSource: 'upload',
            avatarQQNumber: '',
            avatarGravatarEmail: '',
            avatarGravatarServer: 'https://www.gravatar.com/avatar/',
            avatarCustomUrl: ''
          }
        });
      }
      
      res.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  },

  // Update profile data
  updateProfile: async (req: Request, res: Response) => {
    try {
      const {
        name,
        title,
        bio,
        avatar,
        email,
        github,
        linkedin,
        twitter,
        telegram,
        youtube,
        bilibili,
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
            avatar,
            email,
            github,
            linkedin,
            twitter,
            telegram,
            youtube,
            bilibili,
            avatarSource,
            avatarQQNumber,
            avatarGravatarEmail,
            avatarGravatarServer,
            avatarCustomUrl
          }
        });
      } else {
        profile = await prisma.profile.create({
          data: {
            name,
            title,
            bio,
            avatar,
            email,
            github,
            linkedin,
            twitter,
            telegram,
            youtube,
            bilibili,
            avatarSource,
            avatarQQNumber,
            avatarGravatarEmail,
            avatarGravatarServer,
            avatarCustomUrl
          }
        });
      }

      res.json(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
}; 