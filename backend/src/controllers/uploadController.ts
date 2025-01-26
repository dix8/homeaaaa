import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { upload } from '../middleware/upload';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadController = {
  uploadFile: (req: Request, res: Response) => {
    console.log('开始处理文件上传请求');
    console.log('请求头:', req.headers);
    console.log('上传类型:', req.params.type);
    
    // 始终使用 'avatar' 作为字段名
    const uploadSingle = upload.single('avatar');

    uploadSingle(req, res, async function (err) {
      if (err) {
        console.error('文件上传错误:', err);
        return res.status(400).json({ error: '文件上传失败: ' + err.message });
      }

      console.log('req.file:', req.file);

      if (!req.file) {
        console.error('没有文件被上传');
        return res.status(400).json({ error: '没有选择文件' });
      }

      try {
        // 根据上传类型构建URL路径
        const uploadType = req.params.type;
        const urlPath = uploadType === 'project' ? 'projects' : 'avatars';
        const fileUrl = `${BACKEND_URL}/uploads/${urlPath}/${req.file.filename}`;
        console.log('生成的文件URL:', fileUrl);
        
        // 如果是头像上传，更新用户头像
        if (uploadType === 'avatar') {
          await prisma.profile.update({
            where: { id: 1 },
            data: {
              avatar: fileUrl
            }
          });
        }

        console.log('文件上传成功');
        return res.json({ url: fileUrl });
      } catch (error) {
        console.error('文件处理失败:', error);
        // 如果数据库更新失败，删除已上传的文件
        if (req.file) {
          const filePath = req.file.path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(500).json({ error: '文件处理失败' });
      }
    });
  }
}; 