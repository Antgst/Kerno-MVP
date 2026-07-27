function CatalogSummary({
  activeFilterCount,
  filteredProductCount,
  hasActiveFilters,
  onResetFilters,
  visibleSupplierCount,
}) {
  return (
    <div className="catalog-summary">
      <p>
        <strong>{filteredProductCount}</strong>{" "}
        {filteredProductCount !== 1 ? "produits affichés" : "produit affiché"}
        <span>
          {visibleSupplierCount}{" "}
          {visibleSupplierCount !== 1 ? "fournisseurs" : "fournisseur"}
        </span>
        <span>
          {hasActiveFilters
            ? `${activeFilterCount} filtre${activeFilterCount > 1 ? "s" : ""} actif${activeFilterCount > 1 ? "s" : ""}`
            : "Catalogue complet"}
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

export default CatalogSummary;
