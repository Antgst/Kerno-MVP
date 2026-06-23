import ProductImage from "../ui/ProductImage";
import { hasKnownProductImageSource } from "../../utils/productImages";

function CatalogProductVisual({ product, priority = false }) {
  const imageProduct = hasKnownProductImageSource(product)
    ? product
    : { ...product, imageUrl: "" };

  return (
    <div className="catalog-product-visual">
      <ProductImage
        product={imageProduct}
        alt={`Aperçu du produit ${product.name || "KERNO"}`}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        useFallback={false}
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
