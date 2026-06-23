import ProductImage from "../ui/ProductImage";

function CatalogProductVisual({ product, priority = false }) {
  return (
    <div className="catalog-product-visual">
      <ProductImage
        product={product}
        alt={`Aperçu du produit ${product.name || "KERNO"}`}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        variant="card"
      />

      <span
        className={[
          "catalog-product-status",
          product.isActive === false ? "catalog-product-status--inactive" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {product.isActive === false ? "Indisponible" : "Disponible"}
      </span>
    </div>
  );
}

export default CatalogProductVisual;
