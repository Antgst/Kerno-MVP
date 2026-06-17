import heroImage from "../assets/hero.png";
import appleJuiceImage from "../assets/landing/supplier-product-apple-juice.png";
import biscuitsImage from "../assets/landing/supplier-product-buckwheat-biscuits.png";
import honeyImage from "../assets/landing/supplier-product-honey.png";
import jamImage from "../assets/landing/supplier-product-jam.png";
import breweryImage from "../assets/landing/store-supplier-brewery.png";
import cheeseImage from "../assets/landing/store-supplier-cheese.png";
import farmImage from "../assets/landing/store-supplier-farm.png";
import provenceImage from "../assets/landing/store-supplier-provence.png";

const productImages = [
  honeyImage,
  breweryImage,
  cheeseImage,
  farmImage,
  provenceImage,
  appleJuiceImage,
  jamImage,
  biscuitsImage,
];

const supplierImages = [farmImage, breweryImage, cheeseImage, provenceImage];

export function getProductImage(product, index = 0) {
  if (product?.imageUrl) {
    return product.imageUrl;
  }

  const content = [
    product?.name,
    product?.category?.name,
    product?.description,
  ]
    .join(" ")
    .toLowerCase();

  if (content.includes("miel")) return honeyImage;
  if (content.includes("bière") || content.includes("boisson")) return breweryImage;
  if (content.includes("fromage") || content.includes("lait")) return cheeseImage;
  if (content.includes("confiture")) return jamImage;
  if (content.includes("cidre") || content.includes("pomme")) return appleJuiceImage;
  if (content.includes("herbe") || content.includes("épice") || content.includes("lavande")) return provenceImage;

  return productImages[index % productImages.length];
}

export function getSupplierImage(supplier, index = 0) {
  if (supplier?.imageUrl || supplier?.coverImageUrl) {
    return supplier.imageUrl || supplier.coverImageUrl;
  }

  const content = [
    supplier?.companyName,
    supplier?.businessType,
    supplier?.description,
  ]
    .join(" ")
    .toLowerCase();

  if (content.includes("brasserie") || content.includes("boisson")) return breweryImage;
  if (content.includes("fromage") || content.includes("lait")) return cheeseImage;
  if (content.includes("provence") || content.includes("épice")) return provenceImage;

  return supplierImages[index % supplierImages.length];
}

export const supplierHeroImage = heroImage;
