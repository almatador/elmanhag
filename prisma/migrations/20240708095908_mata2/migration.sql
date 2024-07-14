/*
  Warnings:

  - Added the required column `phoneNumber` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `phoneNumber` INTEGER NOT NULL;
