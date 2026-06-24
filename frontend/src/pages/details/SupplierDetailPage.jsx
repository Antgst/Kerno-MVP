import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CatalogIcon from "../../components/catalog/CatalogIcon";
import CatalogProducts from "../../components/catalog/CatalogProducts";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getCurrentAuthRole } from "../../services/authService";
import { getProducts } from "../../services/productService";
import { getSupplierById } from "../../services/supplierService";
import { getListResource, getResource } from "../../utils/responseUtils";

function getSupplierFromResponse(response) {
  return getResource(response, ["supplier"]);
}

function getProductsFromResponse(response) {
  return getListResource(response, ["products"]);
}

function getProductSupplierId(product) {
  return product.supplierId || product.supplier?.id;
}

function getProductCategoryName(product) {
  return product.category?.name || product.categoryName || "";
}

function getCatalogSupplier() {
  return null;
}

function getWebsiteHref(website) {
  if (!website) {
    return "";
  }

  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

function getInitials(companyName) {
  return String(companyName || "K")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("fr-FR");
}

function getProductTimestamp(product) {
  const dateValue = product.createdAt || product.updatedAt;
  const timestamp = dateValue ? new Date(dateValue).getTime() : Number.NaN;

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getUniqueOptions(values) {
  return Array.from(new Set(values.filter(Boolean))).toSorted((first, second) =>
    first.localeCompare(second, "fr-FR"),
  );
}

const initialProductFilters = {
  search: "",
  category: "",
  availability: "",
  sort: "recent",
};

function SupplierProductsToolbar({
  categoryOptions,
  filters,
  onFilterChange,
  onResetFilters,
}) {
  return (
    <section
      className="supplier-detail-products-toolbar"
      aria-label="Filtres des produits du fournisseur"
    >
      <div className="supplier-detail-products-toolbar__filters">
        <label className="catalog-search">
          <span className="sr-only">Rechercher dans les produits</span>
          <CatalogIcon name="search" />
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
          <option value="">Catégorie</option>
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
          <option value="">Disponibilité</option>
          <option value="active">Disponible</option>
          <option value="inactive">Indisponible</option>
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={onFilterChange}
          aria-label="Trier les produits"
        >
          <option value="recent">Plus récents</option>
          <option value="name">Nom A-Z</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>

        <button type="button" onClick={onResetFilters}>
          Réinitialiser
        </button>
      </div>
    </section>
  );
}

function SupplierProductsActions({
  isOpen,
  onToggleFilters,
  onViewModeChange,
  viewMode,
}) {
  return (
    <div className="supplier-detail-products-toolbar__actions">
      <button
        className={isOpen ? "is-active" : ""}
        type="button"
        onClick={onToggleFilters}
        aria-expanded={isOpen}
      >
        <CatalogIcon name="search" />
        Filtrer
      </button>

      <div
        className="catalog-view-toggle"
        role="group"
        aria-label="Mode d’affichage des produits"
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
    </div>
  );
}

const supplierIconProps = {
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

const supplierIcons = {
    arrow: <path d="m15 18-6-6 6-6" />,
    building: (
      <>
        <path d="M3 21h18" />
        <path d="M6 21V7l6-4v18" />
        <path d="M18 21V11l-6-4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    map: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.6.6a2 2 0 0 1 2 2.3Z" />
    ),
    request: (
      <>
        <path d="M4 4h16v12H7l-3 3V4Z" />
        <path d="M8 8h8M8 12h5" />
      </>
    ),
  };

function SupplierIcon({ name }) {
  return <svg {...supplierIconProps}>{supplierIcons[name]}</svg>;
}

function getSortablePrice(product) {
  const price = Number(product?.priceCents);

  return Number.isFinite(price) ? price : null;
}

function SupplierDetailPage() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [productFilters, setProductFilters] = useState(initialProductFilters);
  const [productViewMode, setProductViewMode] = useState("grid");
  const [areProductFiltersOpen, setAreProductFiltersOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadSupplierDetails() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [supplierResponse, productsResponse] = await Promise.all([
          getSupplierById(id),
          getProducts(),
        ]);

        if (!shouldUpdateState) {
          return;
        }

        setSupplier(getSupplierFromResponse(supplierResponse));
        setProducts(getProductsFromResponse(productsResponse));
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(
            error.message || "Impossible de charger le fournisseur.",
          );
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadSupplierDetails();

    return () => {
      shouldUpdateState = false;
    };
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!supplier) {
      return [];
    }

    if (Array.isArray(supplier.products)) {
      return supplier.products;
    }

    return products.filter(
      (product) => getProductSupplierId(product) === supplier.id,
    );
  }, [products, supplier]);

  const productCategoryOptions = useMemo(
    () => getUniqueOptions(relatedProducts.map(getProductCategoryName)),
    [relatedProducts],
  );

  const filteredSupplierProducts = useMemo(() => {
    const search = normalizeValue(productFilters.search);

    return relatedProducts
      .filter((product) => {
        const searchableContent = normalizeValue(
          [
            product.name,
            product.description,
            product.origin,
            getProductCategoryName(product),
          ].join(" "),
        );
        const matchesSearch =
          !search || searchableContent.includes(search);
        const matchesCategory =
          !productFilters.category ||
          getProductCategoryName(product) === productFilters.category;
        const matchesAvailability =
          !productFilters.availability ||
          (productFilters.availability === "active"
            ? product.isActive !== false
            : product.isActive === false);

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((firstProduct, secondProduct) => {
        if (productFilters.sort === "name") {
          return String(firstProduct.name || "").localeCompare(
            String(secondProduct.name || ""),
            "fr-FR",
          );
        }

        if (productFilters.sort === "price-asc") {
          const firstPrice = getSortablePrice(firstProduct);
          const secondPrice = getSortablePrice(secondProduct);

          if (firstPrice === null && secondPrice === null) {
            return 0;
          }

          if (firstPrice === null) {
            return 1;
          }

          if (secondPrice === null) {
            return -1;
          }

          return firstPrice - secondPrice;
        }

        if (productFilters.sort === "price-desc") {
          const firstPrice = getSortablePrice(firstProduct);
          const secondPrice = getSortablePrice(secondProduct);

          if (firstPrice === null && secondPrice === null) {
            return 0;
          }

          if (firstPrice === null) {
            return 1;
          }

          if (secondPrice === null) {
            return -1;
          }

          return secondPrice - firstPrice;
        }

        return (
          getProductTimestamp(secondProduct) - getProductTimestamp(firstProduct)
        );
      });
  }, [productFilters, relatedProducts]);

  const supplierCatalogMap = useMemo(() => new Map(), []);
  const requestPath = supplier
    ? `/requests/new?supplierId=${supplier.id}`
    : "/requests/new";
  const canContactSupplier =
    String(getCurrentAuthRole() || "").toUpperCase() === "STORE";
  const websiteHref = getWebsiteHref(supplier?.website);
  const hasActiveProductFilters =
    Boolean(productFilters.search) ||
    Boolean(productFilters.category) ||
    Boolean(productFilters.availability) ||
    productFilters.sort !== initialProductFilters.sort;

  function handleProductFilterChange(event) {
    const { name, value } = event.target;

    setProductFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function resetProductFilters() {
    setProductFilters(initialProductFilters);
  }

  return (
    <div className="supplier-detail-page">
      <header className="supplier-detail-page__intro">
        <div>
          <Link className="supplier-detail-page__back" to="/catalog">
            <SupplierIcon name="arrow" />
            Retour au catalogue
          </Link>
          <h1>{supplier?.companyName || "Détail du fournisseur"}</h1>
          <p className="supplier-detail-page__subtitle">
            Découvrez son activité, ses coordonnées professionnelles et les
            produits proposés sur KERNO.
          </p>
        </div>

        {supplier && canContactSupplier && (
          <Link className="supplier-detail-page__primary-action" to={requestPath}>
            <SupplierIcon name="request" />
            Contacter le fournisseur
          </Link>
        )}
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-detail-page__feedback"
          message="Chargement du fournisseur..."
        />
      )}

      {errorMessage && (
        <ErrorState
          className="supplier-detail-page__feedback"
          title="Fournisseur indisponible"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && !supplier && (
        <EmptyState
          className="supplier-detail-page__feedback"
          title="Fournisseur introuvable"
          message="Ce fournisseur n’existe peut-être plus ou n’est plus disponible."
          action={
            <Link className="supplier-detail-page__secondary-action" to="/catalog">
              Retour au catalogue
            </Link>
          }
        />
      )}

      {!isLoading && !errorMessage && supplier && (
        <>
          <div className="supplier-detail-page__layout">
            <section className="supplier-detail-card supplier-detail-profile">
              <div className="supplier-detail-profile__identity">
                <div className="supplier-detail-identity__heading">
                  <span className="supplier-detail-identity__mark">
                    {getInitials(supplier.companyName)}
                  </span>
                  <div>
                    <h2>{supplier.companyName}</h2>
                    <p>
                      {supplier.businessType ||
                        "Activité professionnelle à préciser"}
                    </p>
                  </div>
                  <StatusBadge status="ACTIVE" label="Actif" />
                </div>

                <p className="supplier-detail-identity__description">
                  {supplier.description ||
                    "Ce fournisseur n’a pas encore ajouté de présentation détaillée."}
                </p>
              </div>

              <div className="supplier-detail-profile__details">
                <section>
                  <div className="supplier-detail-section-heading">
                    <div>
                      <h2>Informations fournisseur</h2>
                      <p>Les informations principales de ce fournisseur.</p>
                    </div>
                  </div>

                  <dl className="supplier-detail-facts">
                    <div>
                      <dt>
                        <SupplierIcon name="map" />
                        Localisation
                      </dt>
                      <dd>{supplier.location || "À préciser"}</dd>
                    </div>
                    <div>
                      <dt>
                        <SupplierIcon name="building" />
                        Type d’activité
                      </dt>
                      <dd>{supplier.businessType || "À préciser"}</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <div className="supplier-detail-section-heading">
                    <div>
                      <h2>Coordonnées professionnelles</h2>
                      <p>
                        Les coordonnées communiquées pour les échanges B2B.
                      </p>
                    </div>
                  </div>

                  <dl className="supplier-detail-contact__list">
                    <div>
                      <dt>
                        <SupplierIcon name="mail" />
                        Email
                      </dt>
                      <dd>
                        {supplier.contactEmail ? (
                          <a href={`mailto:${supplier.contactEmail}`}>
                            {supplier.contactEmail}
                          </a>
                        ) : (
                          "À préciser"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <SupplierIcon name="phone" />
                        Téléphone
                      </dt>
                      <dd>
                        {supplier.phone ? (
                          <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
                        ) : (
                          "À préciser"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <SupplierIcon name="globe" />
                        Site internet
                      </dt>
                      <dd>
                        {websiteHref ? (
                          <a href={websiteHref} target="_blank" rel="noreferrer">
                            {supplier.website}
                          </a>
                        ) : (
                          "À préciser"
                        )}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </section>

            <section className="supplier-detail-products">
              <div className="supplier-detail-section-heading supplier-detail-products__heading">
                <div>
                  <div className="supplier-detail-products__title">
                    <h2>Produits proposés</h2>
                    <StatusBadge
                      status={relatedProducts.length > 0 ? "ACTIVE" : "DRAFT"}
                      label={`${relatedProducts.length} produit${
                        relatedProducts.length > 1 ? "s" : ""
                      }`}
                    />
                  </div>
                </div>
                {relatedProducts.length > 0 && (
                  <SupplierProductsActions
                    isOpen={areProductFiltersOpen}
                    onToggleFilters={() =>
                      setAreProductFiltersOpen((currentValue) => !currentValue)
                    }
                    onViewModeChange={setProductViewMode}
                    viewMode={productViewMode}
                  />
                )}
              </div>

              {relatedProducts.length > 0 && areProductFiltersOpen && (
                <SupplierProductsToolbar
                  categoryOptions={productCategoryOptions}
                  filters={productFilters}
                  onFilterChange={handleProductFilterChange}
                  onResetFilters={resetProductFilters}
                />
              )}

              {relatedProducts.length === 0 ? (
                <EmptyState
                  className="supplier-detail-products__empty"
                  title="Aucun produit visible"
                  message="Ce fournisseur n’a pas encore publié de produit."
                />
              ) : filteredSupplierProducts.length === 0 ? (
                <EmptyState
                  className="supplier-detail-products__empty"
                  title="Aucun produit ne correspond à ces filtres"
                  message="Modifiez la catégorie, la disponibilité ou réinitialisez les filtres."
                  action={
                    hasActiveProductFilters ? (
                      <button
                        className="supplier-detail-products__reset"
                        type="button"
                        onClick={resetProductFilters}
                      >
                        Réinitialiser les filtres
                      </button>
                    ) : null
                  }
                />
              ) : (
                <CatalogProducts
                  products={filteredSupplierProducts}
                  suppliersById={supplierCatalogMap}
                  getSupplierFromProduct={getCatalogSupplier}
                  viewMode={productViewMode}
                />
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default SupplierDetailPage;
