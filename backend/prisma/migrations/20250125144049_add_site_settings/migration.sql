-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT COMMENT '设置ID，主键',
    `title` VARCHAR(191) NOT NULL COMMENT '网站标题',
    `favicon` VARCHAR(191) NULL COMMENT '网站图标URL',
    `logo` VARCHAR(191) NULL COMMENT '网站Logo URL',
    `description` VARCHAR(191) NULL COMMENT '网站描述',
    `keywords` VARCHAR(191) NULL COMMENT '网站关键词',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '创建时间',
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) COMMENT '更新时间',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT='网站设置表，存储网站基本信息';
