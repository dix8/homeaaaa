-- AlterTable
ALTER TABLE `sitesettings` ADD COLUMN `copyright` VARCHAR(191) NULL,
    ADD COLUMN `gongan` VARCHAR(191) NULL,
    ADD COLUMN `icp` VARCHAR(191) NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT,
    MODIFY `pageTitle` VARCHAR(191) NULL;
