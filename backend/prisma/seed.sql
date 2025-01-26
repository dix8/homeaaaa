-- 使用数据库
USE personal_website;

-- 创建管理员用户
INSERT INTO `User` (email, password, createdAt, updatedAt)
VALUES (
  'admin@example.com',
  -- 密码是 'admin123' 的 bcrypt hash
  '$2a$10$zGqFWxpqyoK3RxKYR8FhR.dY7kHQXZ8F1yKr0zg3Xs4UVxGWLKp1y',
  NOW(),
  NOW()
);

-- 创建默认个人信息
INSERT INTO `Profile` (name, title, bio, email, createdAt, updatedAt)
VALUES (
  '张三',
  '全栈开发工程师',
  '热爱编程，专注于Web开发，擅长使用React和Node.js构建现代化应用。',
  'admin@example.com',
  NOW(),
  NOW()
);

-- 创建示例技能
INSERT INTO `Skill` (name, category, proficiency, createdAt, updatedAt)
VALUES 
  ('JavaScript', '前端开发', 90, NOW(), NOW()),
  ('React', '前端开发', 85, NOW(), NOW()),
  ('Node.js', '后端开发', 80, NOW(), NOW()),
  ('TypeScript', '前端开发', 85, NOW(), NOW()),
  ('MySQL', '数据库', 75, NOW(), NOW()),
  ('Git', '开发工具', 85, NOW(), NOW());

-- 创建示例项目
INSERT INTO `Project` (title, description, imageUrl, technologies, createdAt, updatedAt)
VALUES (
  '个人主页项目',
  '一个使用React和Node.js开发的个人作品集网站，支持个人信息展示、技能展示、项目展示等功能。采用了现代化的技术栈，包括TypeScript、Next.js、Prisma等。',
  'https://placehold.co/800x400/e2e8f0/64748b?text=Portfolio',
  '["React","Node.js","TypeScript","MySQL"]',
  NOW(),
  NOW()
),
(
  '在线商城系统',
  '基于微服务架构的电商平台，实现了商品管理、购物车、订单处理等核心功能。使用Docker容器化部署，采用Redis进行缓存优化。',
  'https://placehold.co/800x400/e2e8f0/64748b?text=E-commerce',
  '["React","Node.js","Redis","Docker"]',
  NOW(),
  NOW()
); 