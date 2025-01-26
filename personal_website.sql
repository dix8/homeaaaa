/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40)
 Source Host           : localhost:3306
 Source Schema         : personal_website

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40)
 File Encoding         : 65001

 Date: 26/01/2025 15:44:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) NULL DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `rolled_back_at` datetime(3) NULL DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of _prisma_migrations
-- ----------------------------
INSERT INTO `_prisma_migrations` VALUES ('14a80b02-8f9b-418d-b60a-ab7d52f6b831', 'bccb0973ecd542c490391e8f4403a647a80e6d02595907af67f0a8ce5c5b1f7d', '2025-01-26 03:26:41.693', '20250126032641_', NULL, NULL, '2025-01-26 03:26:41.579', 1);
INSERT INTO `_prisma_migrations` VALUES ('273967af-dc2f-4e8b-83e5-8c90a415b58d', '2fe19aab125c72ac3fa5d5b628b6ea04e05ccb0dbf7277ed8717856e525138db', '2025-01-26 03:26:34.350', '20250125144050_add_page_title', NULL, NULL, '2025-01-26 03:26:34.311', 1);
INSERT INTO `_prisma_migrations` VALUES ('508cdcc1-0d97-4548-9d8e-ddff306ea60f', 'efe1dbc9cfe61a75e75b97ece4758d60df2f88b637d073d4331ddd3502af18f2', '2025-01-25 16:05:49.025', '20250125070627_add_social_media_fields', NULL, NULL, '2025-01-25 16:05:48.894', 1);
INSERT INTO `_prisma_migrations` VALUES ('e3dcb9e6-7fc5-4de5-b957-cde53e987af7', '83acfe2f527ebdf639fa96b1af2be66784f81e8c7497bddbb1349b17173cef19', '2025-01-25 16:05:49.059', '20250125082555_add_avatar_settings', NULL, NULL, '2025-01-25 16:05:49.029', 1);
INSERT INTO `_prisma_migrations` VALUES ('eb3db2ce-c9a8-4d2e-a607-e9d785c63a9d', '4dafe019f95975f331b47da1a1b42293b11fcb5692d8834feab05c3f8caa078d', '2025-01-25 16:05:49.097', '20250125144049_add_site_settings', NULL, NULL, '2025-01-25 16:05:49.063', 1);

-- ----------------------------
-- Table structure for profile
-- ----------------------------
DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '个人资料ID，主键',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '姓名',
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '职位头衔',
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '个人简介',
  `avatar` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '当前头像URL',
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系邮箱',
  `github` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'GitHub主页链接',
  `linkedin` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'LinkedIn主页链接',
  `twitter` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Twitter主页链接',
  `telegram` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Telegram链接',
  `youtube` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'YouTube频道链接',
  `bilibili` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Bilibili主页链接',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  `avatarCustomUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '自定义头像URL',
  `avatarGravatarEmail` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Gravatar邮箱',
  `avatarGravatarServer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'https://www.gravatar.com/avatar/' COMMENT 'Gravatar服务器地址',
  `avatarQQNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'QQ号码，用于获取QQ头像',
  `avatarSource` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'upload' COMMENT '头像来源：upload(上传), url(图片链接), qq(QQ头像), gravatar(Gravatar)',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '个人资料表，存储个人信息和社交媒体链接' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of profile
-- ----------------------------
INSERT INTO `profile` VALUES (1, 'Ac11', '全栈开发工程师', '热爱编程，专注于Web开发，擅长使用React和Node.js构建现代化应用。5年+开发经验，参与过多个大型项目开发。', 'https://q1.qlogo.cn/g?b=qq&nk=10001&s=640', 'admin@example.com', 'https://github.com/yourusername', 'https://linkedin.com/in/yourusername', NULL, NULL, NULL, NULL, '2025-01-25 16:05:50.632', '2025-01-26 03:29:59.208', NULL, NULL, NULL, '10001', 'qq');

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '项目ID，主键',
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '项目标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '项目描述',
  `imageUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '项目预览图URL',
  `projectUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '项目链接',
  `technologies` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '使用的技术栈，JSON格式存储',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '项目表，存储项目展示信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project
-- ----------------------------
INSERT INTO `project` VALUES (1, '个人主页项目', '使用 React、Next.js 和 TypeScript 开发的个人主页，包含个人介绍、技能展示、项目展示等功能。采用响应式设计，支持深色模式。后端使用 Node.js 和 Express，数据库使用 MySQL。', 'http://localhost:3001/uploads/project/project-1737822229233.png', 'https://github.com/yourusername/personal-website', '[\"React\",\"Next.js\",\"TypeScript\",\"Node.js\",\"MySQL\"]', '2025-01-25 16:05:50.647', '2025-01-25 16:23:55.350');
INSERT INTO `project` VALUES (2, '在线商城系统', '基于微服务架构的在线商城系统，包含用户管理、商品管理、订单管理、支付系统等模块。前端使用 React 和 Ant Design，后端使用 Node.js 和 Express，数据库使用 MySQL 和 Redis。', '/images/projects/online-shop.png', 'https://github.com/yourusername/online-shop', '[\"React\",\"Node.js\",\"MySQL\",\"Redis\",\"Docker\"]', '2025-01-25 16:05:50.647', '2025-01-25 16:05:50.647');
INSERT INTO `project` VALUES (3, '任务管理系统', '团队协作的任务管理系统，支持任务创建、分配、追踪和统计。使用 React 和 Material-UI 构建用户界面，后端使用 Node.js 和 Express，数据库使用 MongoDB。', '/images/projects/task-management.png', 'https://github.com/yourusername/task-management', '[\"React\",\"Node.js\",\"MongoDB\",\"Socket.IO\"]', '2025-01-25 16:05:50.647', '2025-01-25 16:05:50.647');

-- ----------------------------
-- Table structure for sitesettings
-- ----------------------------
DROP TABLE IF EXISTS `sitesettings`;
CREATE TABLE `sitesettings`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '设置ID，主键',
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '网站标题',
  `favicon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '网站图标URL',
  `logo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '网站Logo URL',
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '网站描述',
  `keywords` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '网站关键词',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  `pageTitle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `copyright` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gongan` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `icp` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '网站设置表，存储网站基本信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sitesettings
-- ----------------------------
INSERT INTO `sitesettings` VALUES (1, 'Ac个人主页', '', '', '11', '11', '2025-01-25 16:26:05.097', '2025-01-26 04:09:16.945', '个人主页', '', '', '');

-- ----------------------------
-- Table structure for skill
-- ----------------------------
DROP TABLE IF EXISTS `skill`;
CREATE TABLE `skill`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '技能ID，主键',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '技能名称',
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '技能分类，如：前端、后端、数据库等',
  `proficiency` int NOT NULL COMMENT '熟练度(0-100)',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '技能表，存储专业技能信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of skill
-- ----------------------------
INSERT INTO `skill` VALUES (1, 'JavaScript', '前端开发', 90, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (2, 'TypeScript', '前端开发', 85, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (3, 'React', '前端开发', 90, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (4, 'Next.js', '前端开发', 85, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (5, 'Node.js', '后端开发', 85, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (6, 'Express', '后端开发', 80, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (7, 'MySQL', '数据库', 75, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (8, 'MongoDB', '数据库', 70, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (9, 'Docker', '开发工具', 65, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');
INSERT INTO `skill` VALUES (10, 'Git', '开发工具', 85, '2025-01-25 16:05:50.639', '2025-01-25 16:05:50.639');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户邮箱，用于登录',
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户密码，经过哈希处理',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
  `updatedAt` datetime(3) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `User_email_key`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户表，存储后台管理用户信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin@example.com', '$2a$10$AlTmBLO.uVG0ZfwSy8mEj.KoUeokgqiGNr5VQID/MQkTwsxjC8AHi', '2025-01-25 16:05:50.618', '2025-01-25 16:05:50.618');

SET FOREIGN_KEY_CHECKS = 1;
