-- AlterTable
ALTER TABLE `packages` ADD COLUMN `role_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `latitude` FLOAT NULL,
    ADD COLUMN `longitude` FLOAT NULL;

-- AddForeignKey
ALTER TABLE `packages` ADD CONSTRAINT `packages_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
