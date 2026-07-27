import ProductImage from "../ui/ProductImage";

function SupplierProductVisual({ product }) {
  return (
    <div className="supplier-product-card__visual">
      <ProductImage
        product={product}
        alt={`Aperçu du produit ${product.name || "KERNO"}`}
      />

      <span
        className={[
          "supplier-product-card__status",
          product.isActive === false
            ? "supplier-product-card__status--inactive"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {product.isActive === false ? "Indisponible" : "Disponible"}
      </span>
    </div>
  );
}

export default SupplierProductVisual;
