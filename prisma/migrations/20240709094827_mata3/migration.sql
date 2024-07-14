/*
  Warnings:

  - You are about to drop the column `phoneNumper` on the `parentis` table. All the data in the column will be lost.
  - You are about to drop the column `academic_year` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `parentisId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `site` on the `student` table. All the data in the column will be lost.
  - Added the required column `phoneNumber` to the `Parentis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYear` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confPassword` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_parentisId_fkey`;

-- AlterTable
ALTER TABLE `parentis` DROP COLUMN `phoneNumper`,
    ADD COLUMN `phoneNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `academic_year`,
    DROP COLUMN `country`,
    DROP COLUMN `parentisId`,
    DROP COLUMN `phone_number`,
    DROP COLUMN `site`,
    ADD COLUMN `academicYear` INTEGER NOT NULL,
    ADD COLUMN `confPassword` VARCHAR(191) NOT NULL,
    ADD COLUMN `countryId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `parentId` INTEGER NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `countryName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cityName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToStudent` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryToStudent_AB_unique`(`A`, `B`),
    INDEX `_CategoryToStudent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Parentis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToStudent` ADD CONSTRAINT `_CategoryToStudent_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToStudent` ADD CONSTRAINT `_CategoryToStudent_B_fkey` FOREIGN KEY (`B`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
