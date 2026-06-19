import CatalogProductCard from "./CatalogProductCard";

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
            supplier={supplier}
            viewMode={viewMode}
          />
        );
      })}
    </section>
  );
}

export default CatalogProducts;
