/*
  Warnings:

  - You are about to drop the column `mete_description` on the `page` table. All the data in the column will be lost.
  - You are about to drop the column `mete_title` on the `page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `page` DROP COLUMN `mete_description`,
    DROP COLUMN `mete_title`,
    ADD COLUMN `meta_description` VARCHAR(191) NULL,
    ADD COLUMN `meta_title` VARCHAR(191) NULL;
