-- DropForeignKey
ALTER TABLE `secretkey` DROP FOREIGN KEY `secretKey_studentId_fkey`;

-- AlterTable
ALTER TABLE `student` MODIFY `phoneNumber` VARCHAR(191) NOT NULL,
    MODIFY `academicYear` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `SecretKey` ADD CONSTRAINT `SecretKey_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
