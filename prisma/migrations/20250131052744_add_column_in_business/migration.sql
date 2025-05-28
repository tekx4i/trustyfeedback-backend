-- AlterTable
ALTER TABLE `business` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `lat_long` VARCHAR(191) NULL,
    ADD COLUMN `postal_code` VARCHAR(191) NULL;
