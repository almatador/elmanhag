/*
  Warnings:

  - You are about to drop the column `secretKey` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `student` DROP COLUMN `secretKey`;

-- CreateTable
CREATE TABLE `secretKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `secretKey` ADD CONSTRAINT `secretKey_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
