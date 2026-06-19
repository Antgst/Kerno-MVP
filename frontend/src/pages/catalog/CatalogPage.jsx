import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import ProductImage from "../../components/ui/ProductImage";
import { getProducts } from "../../services/productService";
import { getSuppliers } from "../../services/supplierService";
import { getListResource } from "../../utils/responseUtils";

const initialFilters = {
  search: "",
  category: "",
  location: "",
  availability: "",
  businessType: "",
};

function getProductsFromResponse(response) {
  return getListResource(response, ["products"]);
}

function getSuppliersFromResponse(response) {
  return getListResource(response, ["suppliers"]);
}

function getSupplierFromProduct(product, suppliersById) {
  const supplierId = product.supplierId || product.supplier?.id;
  const supplierFromList = suppliersById.get(supplierId);

  if (supplierFromList || product.supplier) {
    return {
      ...supplierFromList,
      ...product.supplier,
    };
  }

  return null;
}

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("fr-FR");
}

function getUniqueOptions(values) {
  return [...new Set(values.filter(Boolean))].sort((first, second) =>
    first.localeCompare(second, "fr-FR"),
  );
}

function CatalogIcon({ name }) {
  const commonProps = {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    box: (
      <svg {...commonProps}>
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M3 8v8l9 5 9-5V8M12 13v8" />
      </svg>
    ),
    grid: (
      <svg {...commonProps}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    image: (
      <svg {...commonProps}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 15-5-5L5 20" />
      </svg>
    ),
    list: (
      <svg {...commonProps}>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
    map: (
      <svg {...commonProps}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    search: (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  };

  return icons[name] || null;
}

function ProductVisual({ product }) {
  return (
    <div className="catalog-product-visual">
      <ProductImage
        product={product}
        alt={`Aperçu du produit ${product.name || "KERNO"}`}
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

function ProductInformation({ product, supplier }) {
  return (
    <>
      <div className="catalog-product-heading">
        <h2>{product.name || "Produit sans nom"}</h2>
      </div>

      {supplier?.companyName && (
        <p className="catalog-product-supplier">{supplier.companyName}</p>
      )}

      <dl className="catalog-product-meta">
        {product.origin && (
          <div>
            <dt>
              <CatalogIcon name="map" />
              Origine
            </dt>
            <dd>{product.origin}</dd>
          </div>
        )}

        {product.minimumOrder && (
          <div>
            <dt>
              <CatalogIcon name="box" />
              Colisage
            </dt>
            <dd>{product.minimumOrder}</dd>
          </div>
        )}
      </dl>
    </>
  );
}

function ProductCard({ product, supplier, viewMode }) {
  const productName = product.name || "Produit sans nom";

  function handleKeyDown(event) {
    if (event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  const cardContent = (
    <>
      <ProductVisual product={product} />
      <div className="catalog-product-body">
        <div className="catalog-product-content">
          <ProductInformation product={product} supplier={supplier} />
        </div>

        <div className="catalog-product-footer">
          <p className="catalog-product-price">
            {product.priceInfo || "Tarif sur demande"}
          </p>
          <span className="catalog-product-action">Voir le produit</span>
        </div>
      </div>
    </>
  );

  if (!product.id) {
    return (
      <article
        className={`catalog-product-card catalog-product-card--${viewMode}`}
      >
        {cardContent}
      </article>
    );
  }

  return (
    <Link
      className={`catalog-product-card catalog-product-card--${viewMode}`}
      to={`/products/${product.id}`}
      aria-label={`Voir le produit ${productName}`}
      onKeyDown={handleKeyDown}
    >
      {cardContent}
    </Link>
  );
}

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadCatalogData() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [productsResult, suppliersResult] = await Promise.allSettled([
          getProducts(),
          getSuppliers(),
        ]);

        if (!shouldUpdateState) {
          return;
        }

        if (productsResult.status === "rejected") {
          throw productsResult.reason;
        }

        setProducts(getProductsFromResponse(productsResult.value));
        setSuppliers(
          suppliersResult.status === "fulfilled"
            ? getSuppliersFromResponse(suppliersResult.value)
            : [],
        );
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(
            error.message || "Impossible de charger le catalogue.",
          );
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadCatalogData();

    return () => {
      shouldUpdateState = false;
    };
  }, [reloadKey]);

  const suppliersById = useMemo(
    () => new Map(suppliers.map((supplier) => [supplier.id, supplier])),
    [suppliers],
  );

  const categoryOptions = useMemo(
    () => getUniqueOptions(products.map((product) => product.category?.name)),
    [products],
  );

  const locationOptions = useMemo(
    () =>
      getUniqueOptions(
        products.flatMap((product) => {
          const supplier = getSupplierFromProduct(product, suppliersById);
          return [product.origin, supplier?.location];
        }),
      ),
    [products, suppliersById],
  );

  const businessTypeOptions = useMemo(
    () =>
      getUniqueOptions(
        products.map(
          (product) =>
            getSupplierFromProduct(product, suppliersById)?.businessType,
        ),
      ),
    [products, suppliersById],
  );

  const filteredProducts = useMemo(() => {
    const search = normalizeValue(filters.search);

    return products.filter((product) => {
      const supplier = getSupplierFromProduct(product, suppliersById);
      const searchableContent = normalizeValue(
        [
          product.name,
          product.description,
          product.origin,
          product.priceInfo,
          product.minimumOrder,
          product.category?.name,
          supplier?.companyName,
          supplier?.location,
          supplier?.businessType,
        ].join(" "),
      );

      const matchesSearch = !search || searchableContent.includes(search);
      const matchesCategory =
        !filters.category || product.category?.name === filters.category;
      const matchesLocation =
        !filters.location ||
        product.origin === filters.location ||
        supplier?.location === filters.location;
      const matchesAvailability =
        !filters.availability ||
        (filters.availability === "active"
          ? product.isActive !== false
          : product.isActive === false);
      const matchesBusinessType =
        !filters.businessType ||
        supplier?.businessType === filters.businessType;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesAvailability &&
        matchesBusinessType
      );
    });
  }, [filters, products, suppliersById]);

  const visibleSupplierCount = useMemo(
    () =>
      new Set(
        filteredProducts
          .map((product) => {
            const supplier = getSupplierFromProduct(product, suppliersById);
            return supplier?.id || supplier?.companyName;
          })
          .filter(Boolean),
      ).size,
    [filteredProducts, suppliersById],
  );

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  function changeViewMode(nextViewMode) {
    setViewMode(nextViewMode);
  }

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <p className="catalog-header__eyebrow">Catalogue</p>
        <h1>Catalogue</h1>
        <p>Découvrez les produits proposés par les fournisseurs.</p>
      </header>

      {isLoading && (
        <LoadingState
          className="catalog-page__feedback"
          message="Chargement du catalogue..."
        />
      )}

      {errorMessage && (
        <div className="catalog-page__error">
          <ErrorState
            className="catalog-page__feedback"
            title="Catalogue indisponible"
            message={errorMessage}
          />
          <button
            className="catalog-empty-action"
            type="button"
            onClick={() => setReloadKey((currentKey) => currentKey + 1)}
          >
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && (
        <>
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
                onChange={handleFilterChange}
                placeholder="Rechercher un produit, fournisseur, lieu..."
              />
            </label>

            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
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
              onChange={handleFilterChange}
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
              onChange={handleFilterChange}
              aria-label="Filtrer par disponibilité"
            >
              <option value="">Toutes les disponibilités</option>
              <option value="active">Disponible</option>
              <option value="inactive">Indisponible</option>
            </select>

            <select
              name="businessType"
              value={filters.businessType}
              onChange={handleFilterChange}
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
                onClick={() => changeViewMode("grid")}
                aria-label="Afficher en grille"
                aria-pressed={viewMode === "grid"}
                title="Afficher en grille"
              >
                <CatalogIcon name="grid" />
              </button>
              <button
                type="button"
                className={viewMode === "list" ? "is-active" : ""}
                onClick={() => changeViewMode("list")}
                aria-label="Afficher en liste"
                aria-pressed={viewMode === "list"}
                title="Afficher en liste"
              >
                <CatalogIcon name="list" />
              </button>
            </div>
          </section>

          <div className="catalog-summary">
            <p>
              <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length !== 1
                ? "produits affichés"
                : "produit affiché"}
              <span>
                {visibleSupplierCount}{" "}
                {visibleSupplierCount !== 1
                  ? "fournisseurs"
                  : "fournisseur"}
              </span>
              <span>
                {hasActiveFilters
                  ? `${activeFilterCount} filtre${activeFilterCount > 1 ? "s" : ""} actif${activeFilterCount > 1 ? "s" : ""}`
                  : "Catalogue complet"}
              </span>
            </p>

            {hasActiveFilters && (
              <button type="button" onClick={resetFilters}>
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <EmptyState
              className="catalog-page__empty"
              title="Aucun produit disponible pour le moment."
              message="Les produits publiés par les fournisseurs apparaîtront ici."
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              className="catalog-page__empty"
              title="Aucun produit ne correspond à votre recherche."
              message="Modifiez votre recherche ou réinitialisez les filtres."
              action={
                <button
                  className="catalog-empty-action"
                  type="button"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </button>
              }
            />
          ) : (
            <section
              className={`catalog-products catalog-products--${viewMode}`}
              aria-live="polite"
              aria-label="Produits du catalogue"
            >
              {filteredProducts.map((product, index) => {
                const supplier = getSupplierFromProduct(
                  product,
                  suppliersById,
                );
                const productKey = product.id || `product-${index}`;

                return (
                  <ProductCard
                    key={productKey}
                    product={product}
                    supplier={supplier}
                    viewMode={viewMode}
                  />
                );
              })}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default CatalogPage;
