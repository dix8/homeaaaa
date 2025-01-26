import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export const authController = {
  // 用户登录
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: '用户不存在' });
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: '密码错误' });
      }

      // 生成 JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      console.error('登录错误:', error);
      res.status(500).json({ error: '登录失败' });
    }
  },

  // 注册管理员（仅在初始化时使用）
  register: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // 检查用户是否已存在
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      res.json({ message: "Admin user created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  },
}; 