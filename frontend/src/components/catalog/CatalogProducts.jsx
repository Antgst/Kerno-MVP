import CatalogProductCard from "./CatalogProductCard";

const PRIORITY_IMAGE_COUNT = 4;

function CatalogProducts({ products, suppliersById, getSupplierFromProduct, viewMode }) {
  return (
    <section
      className={`catalog-products catalog-products--${viewMode}`}
      aria-live="polite"
      aria-label="Produits du catalogue"
    >
      {products.map((product, index) => {
        const supplier = getSupplierFromProduct(product, suppliersById);
        const productKey = product.id || `product-${index}`;

        return (
          <CatalogProductCard
            key={productKey}
            product={product}
            priority={index < PRIORITY_IMAGE_COUNT}
            supplier={supplier}
            viewMode={viewMode}
          />
        );
      })}
    </section>
  );
}

export default CatalogProducts;
