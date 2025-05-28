/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `business` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `business` ADD COLUMN `key` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `business_key_key` ON `business`(`key`);
