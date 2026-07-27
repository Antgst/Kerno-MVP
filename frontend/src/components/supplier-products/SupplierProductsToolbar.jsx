import SupplierProductsIcon from "./SupplierProductsIcon";

function SupplierProductsToolbar({
  categoryOptions,
  filters,
  onFilterChange,
  onViewModeChange,
  originOptions,
  viewMode,
}) {
  return (
    <section
      className="supplier-products-toolbar"
      aria-label="Recherche et filtres produits"
    >
      <label className="supplier-products-search">
        <span className="sr-only">Rechercher un produit</span>
        <SupplierProductsIcon name="search" />
        <input
          name="search"
          value={filters.search}
          onChange={onFilterChange}
          placeholder="Rechercher un produit..."
        />
      </label>

      <select
        name="category"
        value={filters.category}
        onChange={onFilterChange}
        aria-label="Filtrer par catégorie"
      >
        <option value="">Toutes les catégories</option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        name="availability"
        value={filters.availability}
        onChange={onFilterChange}
        aria-label="Filtrer par disponibilité"
      >
        <option value="">Toutes les disponibilités</option>
        <option value="active">Disponible</option>
        <option value="inactive">Indisponible</option>
      </select>

      <select
        name="origin"
        value={filters.origin}
        onChange={onFilterChange}
        aria-label="Filtrer par origine"
      >
        <option value="">Toutes les origines</option>
        {originOptions.map((origin) => (
          <option key={origin} value={origin}>
            {origin}
          </option>
        ))}
      </select>

      <div
        className="supplier-products-view-toggle"
        role="group"
        aria-label="Mode d’affichage"
      >
        <button
          type="button"
          className={viewMode === "grid" ? "is-active" : ""}
          onClick={() => onViewModeChange("grid")}
          aria-label="Afficher en grille"
          aria-pressed={viewMode === "grid"}
          title="Afficher en grille"
        >
          <SupplierProductsIcon name="grid" />
        </button>
        <button
          type="button"
          className={viewMode === "list" ? "is-active" : ""}
          onClick={() => onViewModeChange("list")}
          aria-label="Afficher en liste"
          aria-pressed={viewMode === "list"}
          title="Afficher en liste"
        >
          <SupplierProductsIcon name="list" />
        </button>
      </div>
    </section>
  );
}

export default SupplierProductsToolbar;
