import SupplierProductCard from "./SupplierProductCard";

function SupplierProductsCollection({
  deletingProductId,
  onDelete,
  products,
  supplierName,
  viewMode,
}) {
  return (
    <section
      className={`supplier-products-collection supplier-products-collection--${viewMode}`}
      aria-live="polite"
    >
      {products.map((product) => (
        <SupplierProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          supplierName={supplierName}
          deletingProductId={deletingProductId}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}

export default SupplierProductsCollection;
