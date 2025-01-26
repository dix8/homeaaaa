-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '个人资料ID，主键',
    `name` VARCHAR(191) NOT NULL COMMENT '姓名',
    `title` VARCHAR(191) NOT NULL COMMENT '职位头衔',
    `bio` TEXT NOT NULL COMMENT '个人简介',
    `avatar` VARCHAR(191) NULL COMMENT '当前头像URL',
    `email` VARCHAR(191) NOT NULL COMMENT '联系邮箱',
    `github` VARCHAR(191) NULL COMMENT 'GitHub主页链接',
    `linkedin` VARCHAR(191) NULL COMMENT 'LinkedIn主页链接',
    `twitter` VARCHAR(191) NULL COMMENT 'Twitter主页链接',
    `telegram` VARCHAR(191) NULL COMMENT 'Telegram链接',
    `youtube` VARCHAR(191) NULL COMMENT 'YouTube频道链接',
    `bilibili` VARCHAR(191) NULL COMMENT 'Bilibili主页链接',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updatedAt` DATETIME(3) NOT NULL COMMENT '更新时间',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='个人资料表，存储个人信息和社交媒体链接';

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '技能ID，主键',
    `name` VARCHAR(191) NOT NULL COMMENT '技能名称',
    `category` VARCHAR(191) NOT NULL COMMENT '技能分类，如：前端、后端、数据库等',
    `proficiency` INTEGER NOT NULL COMMENT '熟练度(0-100)',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updatedAt` DATETIME(3) NOT NULL COMMENT '更新时间',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='技能表，存储专业技能信息';

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '项目ID，主键',
    `title` VARCHAR(191) NOT NULL COMMENT '项目标题',
    `description` TEXT NOT NULL COMMENT '项目描述',
    `imageUrl` VARCHAR(191) NULL COMMENT '项目预览图URL',
    `projectUrl` VARCHAR(191) NULL COMMENT '项目链接',
    `technologies` TEXT NOT NULL COMMENT '使用的技术栈，JSON格式存储',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updatedAt` DATETIME(3) NOT NULL COMMENT '更新时间',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='项目表，存储项目展示信息';

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
    `email` VARCHAR(191) NOT NULL COMMENT '用户邮箱，用于登录',
    `password` VARCHAR(191) NOT NULL COMMENT '用户密码，经过哈希处理',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updatedAt` DATETIME(3) NOT NULL COMMENT '更新时间',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='用户表，存储后台管理用户信息';
