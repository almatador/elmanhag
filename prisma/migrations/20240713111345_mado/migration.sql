/*
  Warnings:

  - You are about to drop the column `city_name` on the `city` table. All the data in the column will be lost.
  - You are about to drop the column `country_name` on the `country` table. All the data in the column will be lost.
  - You are about to drop the `parentis` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cityName` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryName` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `Curriculum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confPassword` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_parentId_fkey`;

-- AlterTable
ALTER TABLE `city` DROP COLUMN `city_name`,
    ADD COLUMN `cityName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `country` DROP COLUMN `country_name`,
    ADD COLUMN `countryName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `curriculum` ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `teacherId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `cityId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `confPassword` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` INTEGER NOT NULL;

-- DropTable
DROP TABLE `parentis`;

-- CreateTable
CREATE TABLE `Parent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `assignmentId` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveClass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `teacherId` INTEGER NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `cost` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_email_key` ON `Teacher`(`email`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Parent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curriculum` ADD CONSTRAINT `Curriculum_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAssignment` ADD CONSTRAINT `StudentAssignment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAssignment` ADD CONSTRAINT `StudentAssignment_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveClass` ADD CONSTRAINT `LiveClass_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
