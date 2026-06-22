/*
  Warnings:

  - You are about to drop the columns `price_info` and `minimum_order` on the `products` table. All the data in these columns will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductPriceUnit" AS ENUM ('UNIT', 'KG', 'LOT', 'COLIS', 'PALETTE', 'OTHER');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "price_info",
DROP COLUMN "minimum_order",
ADD COLUMN     "price_cents" INTEGER,
ADD COLUMN     "price_unit" "ProductPriceUnit",
ADD COLUMN     "minimum_order_quantity" INTEGER,
ADD COLUMN     "minimum_order_unit" "ProductPriceUnit";
