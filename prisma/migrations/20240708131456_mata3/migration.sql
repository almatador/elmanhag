/*
  Warnings:

  - Added the required column `phoneNumper` to the `Parentis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parentis` ADD COLUMN `phoneNumper` INTEGER NOT NULL;
