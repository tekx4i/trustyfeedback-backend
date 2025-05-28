-- AlterTable
ALTER TABLE `badge` ADD COLUMN `max_points` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `min_points` INTEGER NOT NULL DEFAULT 0,
    MODIFY `success_percentage` INTEGER NULL DEFAULT 0,
    MODIFY `success_count` INTEGER NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `points` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `source` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `in` INTEGER NOT NULL DEFAULT 0,
    `out` INTEGER NOT NULL DEFAULT 0,
    `reference_id` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `points` ADD CONSTRAINT `points_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
