function SupplierProductsSummary({
  activeProductsCount,
  filteredProductsCount,
  hasActiveFilters,
  onResetFilters,
}) {
  return (
    <div className="supplier-products-summary">
      <p>
        <strong>{filteredProductsCount}</strong>{" "}
        {filteredProductsCount !== 1
          ? "produits affichés"
          : "produit affiché"}
        <span>
          {activeProductsCount}{" "}
          {activeProductsCount !== 1
            ? "produits actifs"
            : "produit actif"}
        </span>
      </p>

      {hasActiveFilters && (
        <button type="button" onClick={onResetFilters}>
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

export default SupplierProductsSummary;
