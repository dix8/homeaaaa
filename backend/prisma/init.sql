-- 删除已存在的数据库(如果存在)
DROP DATABASE IF EXISTS personal_website;

-- 创建新数据库
CREATE DATABASE personal_website;

-- 使用新创建的数据库
USE personal_website;

-- 创建用户表
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
  `email` varchar(191) NOT NULL COMMENT '用户邮箱，用于登录',
  `password` varchar(191) NOT NULL COMMENT '用户密码，经过哈希处理',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`) COMMENT '邮箱唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表，存储后台管理用户信息';

-- 创建个人资料表
CREATE TABLE `Profile` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '个人资料ID，主键',
  `name` varchar(191) NOT NULL COMMENT '姓名',
  `title` varchar(191) NOT NULL COMMENT '职位头衔',
  `bio` text NOT NULL COMMENT '个人简介',
  `avatar` varchar(191) NOT NULL COMMENT '当前头像URL',
  `email` varchar(191) NOT NULL COMMENT '联系邮箱',
  `github` varchar(191) DEFAULT NULL COMMENT 'GitHub主页链接',
  `linkedin` varchar(191) DEFAULT NULL COMMENT 'LinkedIn主页链接',
  `twitter` varchar(191) DEFAULT NULL COMMENT 'Twitter主页链接',
  `telegram` varchar(191) DEFAULT NULL COMMENT 'Telegram链接',
  `youtube` varchar(191) DEFAULT NULL COMMENT 'YouTube频道链接',
  `bilibili` varchar(191) DEFAULT NULL COMMENT 'Bilibili主页链接',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  -- 头像相关字段
  `avatarSource` varchar(191) DEFAULT NULL COMMENT '头像来源：upload(上传), qq(QQ头像), gravatar(Gravatar), url(图片链接)',
  `avatarQQNumber` varchar(191) DEFAULT NULL COMMENT 'QQ号码，用于获取QQ头像',
  `avatarGravatarEmail` varchar(191) DEFAULT NULL COMMENT 'Gravatar邮箱',
  `avatarGravatarServer` varchar(191) DEFAULT NULL COMMENT 'Gravatar服务器地址',
  `avatarCustomUrl` varchar(191) DEFAULT NULL COMMENT '自定义头像URL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='个人资料表，存储个人信息和社交媒体链接';

-- 创建技能表
CREATE TABLE `Skill` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '技能ID，主键',
  `name` varchar(191) NOT NULL COMMENT '技能名称',
  `category` varchar(191) NOT NULL COMMENT '技能分类，如：前端、后端、数据库等',
  `proficiency` int NOT NULL COMMENT '熟练度(0-100)',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='技能表，存储专业技能信息';

-- 创建项目表
CREATE TABLE `Project` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '项目ID，主键',
  `title` varchar(191) NOT NULL COMMENT '项目标题',
  `description` text NOT NULL COMMENT '项目描述',
  `imageUrl` varchar(191) DEFAULT NULL COMMENT '项目预览图URL',
  `projectUrl` varchar(191) DEFAULT NULL COMMENT '项目链接',
  `technologies` text NOT NULL COMMENT '使用的技术栈，JSON格式存储',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='项目表，存储项目展示信息';

-- 插入默认管理员用户
-- 密码: admin123
INSERT INTO `User` (`email`, `password`, `updatedAt`) 
VALUES ('admin@example.com', '$2b$10$8n6HXBKlN0lKcIOvWB6kB.kMx9kUmB0c3F6YGtZRgR9J/Bk3TIXE.', NOW());

-- 插入默认个人资料
INSERT INTO `Profile` (
  `name`, `title`, `bio`, `avatar`, `email`, 
  `github`, `linkedin`, `twitter`, `telegram`, `youtube`, `bilibili`,
  `updatedAt`
) VALUES (
  '张三', '全栈工程师', '热爱编程，专注于Web开发', 
  'https://www.gravatar.com/avatar/default?s=200', 'contact@example.com',
  'https://github.com', 'https://linkedin.com', 'https://twitter.com',
  'https://telegram.org', 'https://youtube.com', 'https://bilibili.com',
  NOW()
);

-- 插入示例技能数据
INSERT INTO `Skill` (`name`, `category`, `proficiency`, `updatedAt`) VALUES 
('JavaScript', '前端开发', 90, NOW()),
('React', '前端开发', 85, NOW()),
('Node.js', '后端开发', 80, NOW()),
('Python', '后端开发', 75, NOW()),
('MySQL', '数据库', 85, NOW());

-- 插入示例项目数据
INSERT INTO `Project` (
  `title`, `description`, `imageUrl`, `projectUrl`, 
  `technologies`, `updatedAt`
) VALUES (
  '个人主页项目',
  '一个使用Next.js和Express开发的个人主页项目，包含个人介绍、技能展示、项目展示等功能。',
  'https://example.com/project1.jpg',
  'https://github.com/example/personal-website',
  '["Next.js", "React", "Express", "MySQL"]',
  NOW()
); 