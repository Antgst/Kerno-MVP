import appleJuiceImage from "../assets/supplier-dashboard/supplier-product-apple-juice.webp";
import biscuitsImage from "../assets/supplier-dashboard/supplier-product-buckwheat-biscuits.webp";
import honeyImage from "../assets/supplier-dashboard/supplier-product-honey.webp";
import jamImage from "../assets/supplier-dashboard/supplier-product-jam.webp";
import dairyImage from "../assets/store-dashboard/store-supplier-cheese.webp";

const IMAGE_RULES = [
  {
    keywords: ["savon", "baume", "calendula", "cosmétique", "soin"],
    kind: "neutral",
  },
  {
    keywords: ["jus", "pomme", "cidre", "boisson"],
    kind: "image",
    source: appleJuiceImage,
  },
  {
    keywords: ["miel"],
    kind: "image",
    source: honeyImage,
  },
  {
    keywords: ["confiture", "fruit", "fraise", "rhubarbe"],
    kind: "image",
    source: jamImage,
  },
  {
    keywords: ["biscuit", "sarrasin", "palet", "galette"],
    kind: "image",
    source: biscuitsImage,
  },
  {
    keywords: [
      "fromage",
      "fromagerie",
      "tomme",
      "yaourt",
      "lait",
      "laitier",
      "fermier nature",
    ],
    kind: "image",
    source: dairyImage,
  },
];

function normalizeProductText(product) {
  return [
    product?.name,
    product?.description,
    product?.origin,
    product?.category?.name,
    product?.categoryName,
    product?.supplier?.companyName,
    product?.supplierName,
  ]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR");
}

export function getProductFallback(product) {
  const productText = normalizeProductText(product);
  const matchingRule = IMAGE_RULES.find((rule) =>
    rule.keywords.some((keyword) =>
      productText.includes(
        keyword
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLocaleLowerCase("fr-FR"),
      ),
    ),
  );

  return matchingRule || { kind: "neutral" };
}

export function getProductImageSource(product) {
  return String(product?.imageUrl || "").trim();
}
