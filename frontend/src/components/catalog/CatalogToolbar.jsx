import CatalogIcon from "./CatalogIcon";

function CatalogToolbar({
  businessTypeOptions,
  categoryOptions,
  filters,
  locationOptions,
  onFilterChange,
  onViewModeChange,
  viewMode,
}) {
  return (
    <section
      className="catalog-toolbar"
      aria-label="Recherche et filtres du catalogue"
    >
      <label className="catalog-search">
        <span className="sr-only">Rechercher dans le catalogue</span>
        <CatalogIcon name="search" />
        <input
          name="search"
          value={filters.search}
          onChange={onFilterChange}
          placeholder="Rechercher un produit, fournisseur, lieu..."
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
        name="location"
        value={filters.location}
        onChange={onFilterChange}
        aria-label="Filtrer par origine ou localisation"
      >
        <option value="">Toutes les localisations</option>
        {locationOptions.map((location) => (
          <option key={location} value={location}>
            {location}
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
        name="businessType"
        value={filters.businessType}
        onChange={onFilterChange}
        aria-label="Filtrer par type de fournisseur"
      >
        <option value="">Tous les types de fournisseurs</option>
        {businessTypeOptions.map((businessType) => (
          <option key={businessType} value={businessType}>
            {businessType}
          </option>
        ))}
      </select>

      <div
        className="catalog-view-toggle"
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
          <CatalogIcon name="grid" />
        </button>
        <button
          type="button"
          className={viewMode === "list" ? "is-active" : ""}
          onClick={() => onViewModeChange("list")}
          aria-label="Afficher en liste"
          aria-pressed={viewMode === "list"}
          title="Afficher en liste"
        >
          <CatalogIcon name="list" />
        </button>
      </div>
    </section>
  );
}

export default CatalogToolbar;
