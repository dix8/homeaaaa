import express from 'express';
import { Request, Response } from 'express';
const multer = require('multer');
import path from 'path';
import fs from 'fs';
import { auth } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const type = req.params.type;
    const uploadDir = path.join(__dirname, `../../uploads/${type}`);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const type = req.params.type;
    const prefix = type === 'avatar' ? 'avatar-' : 
                  type === 'project' ? 'project-' :
                  type === 'favicon' ? 'favicon-' : 'logo-';
    cb(null, `${prefix}${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (req.params.type === 'favicon') {
    allowedTypes.push('image/x-icon');
  }
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
});

// Handle file upload
const handleUpload = (req: any, res: Response) => {
  const { type } = req.params;
  
  if (!['avatar', 'project', 'favicon', 'logo'].includes(type)) {
    res.status(400).json({ error: '无效的上传类型' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: '没有文件被上传' });
    return;
  }

  const fileUrl = `${BACKEND_URL}/uploads/${type}/${req.file.filename}`;

  // If uploading an avatar, update the user's profile
  if (type === 'avatar') {
    prisma.profile.update({
      where: { id: 1 }, // Assuming there's only one profile
      data: { avatar: fileUrl }
    })
    .then(() => {
      res.json({ data: { url: fileUrl } });
    })
    .catch((error) => {
      console.error('Error updating profile:', error);
      // Still send the file URL even if profile update fails
      res.json({ data: { url: fileUrl } });
    });
  } else {
    res.json({ data: { url: fileUrl } });
  }
};

// File upload route
router.post('/:type', auth, upload.single('file'), handleUpload);

export default router; 