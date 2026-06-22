/*
  Warnings:

  - You are about to drop the column `price_info` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductPriceUnit" AS ENUM ('UNIT', 'KG', 'LOT', 'COLIS', 'PALETTE', 'OTHER');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "price_info",
ADD COLUMN     "price_cents" INTEGER,
ADD COLUMN     "price_unit" "ProductPriceUnit";
