const PRICE_UNIT_LABELS = {
  UNIT: "unité",
  KG: "kg",
  LOT: "lot",
  COLIS: "colis",
  PALETTE: "palette",
  OTHER: "unité",
};

export const PRODUCT_PRICE_UNIT_OPTIONS = [
  { value: "UNIT", label: "Unité" },
  { value: "KG", label: "Kg" },
  { value: "LOT", label: "Lot" },
  { value: "COLIS", label: "Colis" },
  { value: "PALETTE", label: "Palette" },
  { value: "OTHER", label: "Autre" },
];

export function formatProductPrice(product) {
  if (!Number.isFinite(Number(product?.priceCents))) {
    return "Tarif sur demande";
  }

  const euros = Number(product.priceCents) / 100;
  const unit = PRICE_UNIT_LABELS[product.priceUnit] || "unité";

  return `${euros.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  })} / ${unit}`;
}
