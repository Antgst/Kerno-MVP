import appleJuiceImage from "../assets/supplier-dashboard/supplier-product-apple-juice.webp";
import biscuitsImage from "../assets/supplier-dashboard/supplier-product-buckwheat-biscuits.webp";
import honeyImage from "../assets/supplier-dashboard/supplier-product-honey.webp";
import jamImage from "../assets/supplier-dashboard/supplier-product-jam.webp";
import dairyImage from "../assets/store-dashboard/store-supplier-cheese.webp";
import appleJuiceCardImage from "../assets/catalog-cards/supplier-product-apple-juice-card.webp";
import biscuitsCardImage from "../assets/catalog-cards/supplier-product-buckwheat-biscuits-card.webp";
import honeyCardImage from "../assets/catalog-cards/supplier-product-honey-card.webp";
import jamCardImage from "../assets/catalog-cards/supplier-product-jam-card.webp";
import dairyCardImage from "../assets/catalog-cards/store-supplier-cheese-card.webp";

const IMAGE_RULES = [
  {
    keywords: ["savon", "baume", "calendula", "cosmétique", "soin"],
    kind: "neutral",
  },
  {
    keywords: ["jus", "pomme", "cidre", "boisson"],
    kind: "image",
    source: appleJuiceImage,
    cardSource: appleJuiceCardImage,
  },
  {
    keywords: ["miel"],
    kind: "image",
    source: honeyImage,
    cardSource: honeyCardImage,
  },
  {
    keywords: ["confiture", "fruit", "fraise", "rhubarbe"],
    kind: "image",
    source: jamImage,
    cardSource: jamCardImage,
  },
  {
    keywords: ["biscuit", "sarrasin", "palet", "galette"],
    kind: "image",
    source: biscuitsImage,
    cardSource: biscuitsCardImage,
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
    cardSource: dairyCardImage,
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

export function getProductFallback(product, variant = "default") {
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

  if (!matchingRule) {
    return { kind: "neutral" };
  }

  if (variant === "card" && matchingRule.cardSource) {
    return {
      ...matchingRule,
      source: matchingRule.cardSource,
    };
  }

  return matchingRule;
}

export function getProductImageSource(product) {
  return String(product?.imageUrl || "").trim();
}
