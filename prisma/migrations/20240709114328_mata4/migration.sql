/*
  Warnings:

  - You are about to drop the column `cityName` on the `city` table. All the data in the column will be lost.
  - You are about to drop the column `countryName` on the `country` table. All the data in the column will be lost.
  - Added the required column `city_name` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_name` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `city` DROP COLUMN `cityName`,
    ADD COLUMN `city_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `countryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `country` DROP COLUMN `countryName`,
    ADD COLUMN `country_name` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
