/*
  Warnings:

  - You are about to alter the column `ipHash` on the `clicks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(64)`.
  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `merchants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,merchantId]` on the table `offers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `clicks_subid_key` ON `clicks`;

-- DropIndex
DROP INDEX `products_category_idx` ON `products`;

-- AlterTable
ALTER TABLE `clicks` ADD COLUMN `merchantId` VARCHAR(191) NULL,
    ADD COLUMN `productId` VARCHAR(191) NULL,
    MODIFY `ipHash` CHAR(64) NOT NULL,
    MODIFY `ua` VARCHAR(512) NULL,
    MODIFY `referer` VARCHAR(512) NULL;

-- AlterTable
ALTER TABLE `merchants` ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `offers` ADD COLUMN `currentPrice` DECIMAL(12, 2) NULL,
    ADD COLUMN `stockStatus` ENUM('IN_STOCK', 'OUT_OF_STOCK') NOT NULL DEFAULT 'IN_STOCK';

-- AlterTable
ALTER TABLE `products` DROP COLUMN `category`,
    ADD COLUMN `brand` VARCHAR(191) NULL,
    ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `images` JSON NULL,
    ADD COLUMN `specs` JSON NULL;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `clicks_subid_idx` ON `clicks`(`subid`);

-- CreateIndex
CREATE INDEX `clicks_productId_clickedAt_idx` ON `clicks`(`productId`, `clickedAt`);

-- CreateIndex
CREATE INDEX `clicks_merchantId_clickedAt_idx` ON `clicks`(`merchantId`, `clickedAt`);

-- CreateIndex
CREATE UNIQUE INDEX `merchants_slug_key` ON `merchants`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `offers_productId_merchantId_key` ON `offers`(`productId`, `merchantId`);

-- CreateIndex
CREATE INDEX `products_categoryId_idx` ON `products`(`categoryId`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
