import multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: multer.Multer.File;
      files?: multer.Multer.File[];
      user?: {
        userId: number;
        email: string;
      };
      body: {
        name?: string;
        title?: string;
        bio?: string;
        avatar?: string;
        email?: string;
        github?: string;
        linkedin?: string;
        twitter?: string;
        telegram?: string;
        youtube?: string;
        bilibili?: string;
        avatarSource?: string;
        avatarQQNumber?: string;
        avatarGravatarEmail?: string;
        avatarGravatarServer?: string;
        avatarCustomUrl?: string;
      };
    }
  }
} 