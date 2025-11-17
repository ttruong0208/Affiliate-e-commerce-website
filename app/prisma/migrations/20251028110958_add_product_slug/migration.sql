/*
  Warnings:

  - You are about to drop the `cart_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_productId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_userId_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_productId_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `slug` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `cart_items`;

-- DropTable
DROP TABLE `order_items`;

-- DropTable
DROP TABLE `orders`;

-- CreateIndex
CREATE INDEX `offers_productId_idx` ON `offers`(`productId`);

-- CreateIndex
CREATE UNIQUE INDEX `products_slug_key` ON `products`(`slug`);

-- CreateIndex
CREATE INDEX `products_isActive_createdAt_idx` ON `products`(`isActive`, `createdAt`);

-- CreateIndex
CREATE INDEX `products_slug_idx` ON `products`(`slug`);

-- Create index for offers.merchantId (if not exists, this will create it)
CREATE INDEX `offers_merchantId_idx` ON `offers`(`merchantId`);

-- The following DROP is intentionally removed because the index/constraint does not exist:
-- DROP INDEX `offers_merchantId_fkey` ON `offers`;