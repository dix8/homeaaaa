-- AlterTable
ALTER TABLE `Profile` 
ADD COLUMN `avatarCustomUrl` VARCHAR(191) NULL COMMENT '自定义头像URL',
ADD COLUMN `avatarGravatarEmail` VARCHAR(191) NULL COMMENT 'Gravatar邮箱',
ADD COLUMN `avatarGravatarServer` VARCHAR(191) NULL DEFAULT 'https://www.gravatar.com/avatar/' COMMENT 'Gravatar服务器地址',
ADD COLUMN `avatarQQNumber` VARCHAR(191) NULL COMMENT 'QQ号码，用于获取QQ头像',
ADD COLUMN `avatarSource` VARCHAR(191) NULL DEFAULT 'upload' COMMENT '头像来源：upload(上传), url(图片链接), qq(QQ头像), gravatar(Gravatar)';
