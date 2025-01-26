-- 添加底部信息相关字段
ALTER TABLE "SiteSettings" 
ADD COLUMN "copyright" TEXT,
ADD COLUMN "icp" TEXT,
ADD COLUMN "gongan" TEXT; 