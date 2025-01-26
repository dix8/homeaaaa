import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
    },
  });

  console.log({ admin });

  // Create profile
  const profile = await prisma.profile.create({
    data: {
      name: 'Ac',
      title: '全栈开发工程师',
      bio: '热爱编程，专注于Web开发，擅长使用React和Node.js构建现代化应用。5年+开发经验，参与过多个大型项目开发。',
      email: 'admin@example.com',
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=2066308410&s=640',
      avatarSource: 'qq',
      avatarQQNumber: '2066308410',
      avatarGravatarServer: 'https://www.gravatar.com/avatar/',
    },
  });

  console.log({ profile });

  // Create skills
  const skills = await prisma.skill.createMany({
    data: [
      { name: 'JavaScript', category: '前端开发', proficiency: 90 },
      { name: 'TypeScript', category: '前端开发', proficiency: 85 },
      { name: 'React', category: '前端开发', proficiency: 90 },
      { name: 'Next.js', category: '前端开发', proficiency: 85 },
      { name: 'Node.js', category: '后端开发', proficiency: 85 },
      { name: 'Express', category: '后端开发', proficiency: 80 },
      { name: 'MySQL', category: '数据库', proficiency: 75 },
      { name: 'MongoDB', category: '数据库', proficiency: 70 },
      { name: 'Docker', category: '开发工具', proficiency: 65 },
      { name: 'Git', category: '开发工具', proficiency: 85 },
    ],
  });

  console.log({ skills });

  // Create projects
  const projects = await prisma.project.createMany({
    data: [
      {
        title: '个人主页项目',
        description: '使用 React、Next.js 和 TypeScript 开发的个人主页，包含个人介绍、技能展示、项目展示等功能。采用响应式设计，支持深色模式。后端使用 Node.js 和 Express，数据库使用 MySQL。',
        imageUrl: '/images/projects/personal-website.png',
        projectUrl: 'https://github.com/yourusername/personal-website',
        technologies: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js', 'MySQL']),
      },
      {
        title: '在线商城系统',
        description: '基于微服务架构的在线商城系统，包含用户管理、商品管理、订单管理、支付系统等模块。前端使用 React 和 Ant Design，后端使用 Node.js 和 Express，数据库使用 MySQL 和 Redis。',
        imageUrl: '/images/projects/online-shop.png',
        projectUrl: 'https://github.com/yourusername/online-shop',
        technologies: JSON.stringify(['React', 'Node.js', 'MySQL', 'Redis', 'Docker']),
      },
      {
        title: '任务管理系统',
        description: '团队协作的任务管理系统，支持任务创建、分配、追踪和统计。使用 React 和 Material-UI 构建用户界面，后端使用 Node.js 和 Express，数据库使用 MongoDB。',
        imageUrl: '/images/projects/task-management.png',
        projectUrl: 'https://github.com/yourusername/task-management',
        technologies: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Socket.IO']),
      },
    ],
  });

  console.log({ projects });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 