-- 为 Profile 表添加注释
ALTER TABLE `Profile` COMMENT '个人资料表，存储个人信息和社交媒体链接';

-- 为 Profile 表的字段添加注释
ALTER TABLE `Profile` MODIFY COLUMN `id` int NOT NULL AUTO_INCREMENT COMMENT '个人资料ID，主键';
ALTER TABLE `Profile` MODIFY COLUMN `name` varchar(191) NOT NULL COMMENT '姓名';
ALTER TABLE `Profile` MODIFY COLUMN `title` varchar(191) NOT NULL COMMENT '职位头衔';
ALTER TABLE `Profile` MODIFY COLUMN `bio` text NOT NULL COMMENT '个人简介';
ALTER TABLE `Profile` MODIFY COLUMN `avatar` varchar(191) NULL COMMENT '当前头像URL';
ALTER TABLE `Profile` MODIFY COLUMN `email` varchar(191) NOT NULL COMMENT '联系邮箱';
ALTER TABLE `Profile` MODIFY COLUMN `github` varchar(191) NULL COMMENT 'GitHub主页链接';
ALTER TABLE `Profile` MODIFY COLUMN `linkedin` varchar(191) NULL COMMENT 'LinkedIn主页链接';
ALTER TABLE `Profile` MODIFY COLUMN `twitter` varchar(191) NULL COMMENT 'Twitter主页链接';
ALTER TABLE `Profile` MODIFY COLUMN `telegram` varchar(191) NULL COMMENT 'Telegram链接';
ALTER TABLE `Profile` MODIFY COLUMN `youtube` varchar(191) NULL COMMENT 'YouTube频道链接';
ALTER TABLE `Profile` MODIFY COLUMN `bilibili` varchar(191) NULL COMMENT 'Bilibili主页链接';
ALTER TABLE `Profile` MODIFY COLUMN `avatarSource` varchar(191) NULL COMMENT '头像来源：upload(上传), url(图片链接), qq(QQ头像), gravatar(Gravatar)';
ALTER TABLE `Profile` MODIFY COLUMN `avatarQQNumber` varchar(191) NULL COMMENT 'QQ号码，用于获取QQ头像';
ALTER TABLE `Profile` MODIFY COLUMN `avatarGravatarEmail` varchar(191) NULL COMMENT 'Gravatar邮箱';
ALTER TABLE `Profile` MODIFY COLUMN `avatarGravatarServer` varchar(191) NULL COMMENT 'Gravatar服务器地址';
ALTER TABLE `Profile` MODIFY COLUMN `avatarCustomUrl` varchar(191) NULL COMMENT '自定义头像URL';
ALTER TABLE `Profile` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';
ALTER TABLE `Profile` MODIFY COLUMN `updatedAt` datetime(3) NOT NULL COMMENT '更新时间';

-- 为 Skill 表添加注释
ALTER TABLE `Skill` COMMENT '技能表，存储专业技能信息';

-- 为 Skill 表的字段添加注释
ALTER TABLE `Skill` MODIFY COLUMN `id` int NOT NULL AUTO_INCREMENT COMMENT '技能ID，主键';
ALTER TABLE `Skill` MODIFY COLUMN `name` varchar(191) NOT NULL COMMENT '技能名称';
ALTER TABLE `Skill` MODIFY COLUMN `category` varchar(191) NOT NULL COMMENT '技能分类，如：前端、后端、数据库等';
ALTER TABLE `Skill` MODIFY COLUMN `proficiency` int NOT NULL COMMENT '熟练度(0-100)';
ALTER TABLE `Skill` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';
ALTER TABLE `Skill` MODIFY COLUMN `updatedAt` datetime(3) NOT NULL COMMENT '更新时间';

-- 为 Project 表添加注释
ALTER TABLE `Project` COMMENT '项目表，存储项目展示信息';

-- 为 Project 表的字段添加注释
ALTER TABLE `Project` MODIFY COLUMN `id` int NOT NULL AUTO_INCREMENT COMMENT '项目ID，主键';
ALTER TABLE `Project` MODIFY COLUMN `title` varchar(191) NOT NULL COMMENT '项目标题';
ALTER TABLE `Project` MODIFY COLUMN `description` text NOT NULL COMMENT '项目描述';
ALTER TABLE `Project` MODIFY COLUMN `imageUrl` varchar(191) NULL COMMENT '项目预览图URL';
ALTER TABLE `Project` MODIFY COLUMN `projectUrl` varchar(191) NULL COMMENT '项目链接';
ALTER TABLE `Project` MODIFY COLUMN `technologies` text NOT NULL COMMENT '使用的技术栈，JSON格式存储';
ALTER TABLE `Project` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';
ALTER TABLE `Project` MODIFY COLUMN `updatedAt` datetime(3) NOT NULL COMMENT '更新时间';

-- 为 User 表添加注释
ALTER TABLE `User` COMMENT '用户表，存储后台管理用户信息';

-- 为 User 表的字段添加注释
ALTER TABLE `User` MODIFY COLUMN `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键';
ALTER TABLE `User` MODIFY COLUMN `email` varchar(191) NOT NULL COMMENT '用户邮箱，用于登录';
ALTER TABLE `User` MODIFY COLUMN `password` varchar(191) NOT NULL COMMENT '用户密码，经过哈希处理';
ALTER TABLE `User` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';
ALTER TABLE `User` MODIFY COLUMN `updatedAt` datetime(3) NOT NULL COMMENT '更新时间';

-- 为 SiteSettings 表添加注释
ALTER TABLE `SiteSettings` COMMENT '网站设置表，存储网站基本信息';

-- 为 SiteSettings 表的字段添加注释
ALTER TABLE `SiteSettings` MODIFY COLUMN `id` int NOT NULL AUTO_INCREMENT COMMENT '设置ID，主键';
ALTER TABLE `SiteSettings` MODIFY COLUMN `title` varchar(191) NOT NULL COMMENT '网站标题';
ALTER TABLE `SiteSettings` MODIFY COLUMN `favicon` varchar(191) NULL COMMENT '网站图标URL';
ALTER TABLE `SiteSettings` MODIFY COLUMN `logo` varchar(191) NULL COMMENT '网站Logo URL';
ALTER TABLE `SiteSettings` MODIFY COLUMN `description` varchar(191) NULL COMMENT '网站描述';
ALTER TABLE `SiteSettings` MODIFY COLUMN `keywords` varchar(191) NULL COMMENT '网站关键词';
ALTER TABLE `SiteSettings` MODIFY COLUMN `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间';
ALTER TABLE `SiteSettings` MODIFY COLUMN `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '更新时间'; 