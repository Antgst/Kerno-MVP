import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import ProductImage from "../../components/ui/ProductImage";
import { deleteProduct, getProducts } from "../../services/productService";
import { getCurrentSupplierProfile } from "../../services/supplierService";
import { getListResource, getResource } from "../../utils/responseUtils";

const initialFilters = {
  search: "",
  category: "",
  availability: "",
  origin: "",
};

function getProductSupplierId(product) {
  return product.supplierId || product.supplier?.id;
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

function SupplierProductsIcon({ name }) {
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
    edit: (
      <svg {...commonProps}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    ),
    eye: (
      <svg {...commonProps}>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="3" />
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
    plus: (
      <svg {...commonProps}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    search: (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    trash: (
      <svg {...commonProps}>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </svg>
    ),
  };

  return icons[name] || null;
}

function ProductVisual({ product }) {
  return (
    <div className="supplier-product-card__visual">
      <ProductImage
        product={product}
        alt={`Aperçu du produit ${product.name || "KERNO"}`}
      />

      <span
        className={[
          "supplier-product-card__status",
          product.isActive === false
            ? "supplier-product-card__status--inactive"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {product.isActive === false ? "Indisponible" : "Disponible"}
      </span>
    </div>
  );
}

function ProductCard({
  product,
  viewMode,
  supplierName,
  deletingProductId,
  onDelete,
}) {
  const categoryName = product.category?.name || "Sans catégorie";

  return (
    <article
      className={`supplier-product-card supplier-product-card--${viewMode}`}
    >
      <ProductVisual product={product} />

      <div className="supplier-product-card__body">
        <div className="supplier-product-card__heading">
          <div>
            <p className="supplier-product-card__category">{categoryName}</p>
            <h2>{product.name || "Produit sans nom"}</h2>
          </div>

          <span className="supplier-product-card__reference">
            Réf. {String(product.id || "").slice(0, 8).toUpperCase()}
          </span>
        </div>

        <p className="supplier-product-card__supplier">
          {product.supplier?.companyName || supplierName || "Votre entreprise"}
        </p>

        <p className="supplier-product-card__description">
          {product.description ||
            "Aucune description n’a encore été renseignée pour ce produit."}
        </p>

        <dl className="supplier-product-card__meta">
          {product.origin && (
            <div>
              <dt>
                <SupplierProductsIcon name="map" />
                Origine
              </dt>
              <dd>{product.origin}</dd>
            </div>
          )}

          {product.minimumOrder && (
            <div>
              <dt>
                <SupplierProductsIcon name="box" />
                Minimum
              </dt>
              <dd>{product.minimumOrder}</dd>
            </div>
          )}
        </dl>

        <div className="supplier-product-card__footer">
          <div className="supplier-product-card__price">
            <small>Information tarifaire</small>
            <strong>{product.priceInfo || "Tarif sur demande"}</strong>
          </div>

          <div className="supplier-product-card__actions">
            <Link
              className="supplier-product-card__action supplier-product-card__action--primary"
              to={`/products/${product.id}`}
            >
              <SupplierProductsIcon name="eye" />
              Voir le produit
            </Link>

            <Link
              className="supplier-product-card__action"
              to={`/supplier/products/${product.id}/edit`}
            >
              <SupplierProductsIcon name="edit" />
              Modifier
            </Link>

            <button
              className="supplier-product-card__delete"
              type="button"
              disabled={deletingProductId === product.id}
              onClick={() => onDelete(product.id)}
              aria-label={`Retirer ${product.name}`}
              title="Retirer le produit"
            >
              <SupplierProductsIcon name="trash" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SupplierProductsPage() {
  const [supplierProfile, setSupplierProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [actionErrorMessage, setActionErrorMessage] = useState("");
  const [deletingProductId, setDeletingProductId] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadProducts() {
      setIsLoading(true);
      setLoadErrorMessage("");

      try {
        const [supplierResult, productsResult] = await Promise.allSettled([
          getCurrentSupplierProfile(),
          getProducts(),
        ]);

        if (!shouldUpdateState) {
          return;
        }

        if (productsResult.status === "rejected") {
          throw productsResult.reason;
        }

        if (
          supplierResult.status === "rejected" &&
          supplierResult.reason?.status !== 404
        ) {
          throw supplierResult.reason;
        }

        setSupplierProfile(
          supplierResult.status === "fulfilled"
            ? getResource(supplierResult.value, ["supplier"])
            : null,
        );
        setProducts(getListResource(productsResult.value, ["products"]));
      } catch (error) {
        if (shouldUpdateState) {
          setLoadErrorMessage(
            error.message || "Impossible de charger vos produits.",
          );
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      shouldUpdateState = false;
    };
  }, [reloadKey]);

  const supplierProducts = useMemo(() => {
    if (!supplierProfile) {
      return [];
    }

    return products.filter(
      (product) => getProductSupplierId(product) === supplierProfile.id,
    );
  }, [products, supplierProfile]);

  const categoryOptions = useMemo(
    () =>
      getUniqueOptions(
        supplierProducts.map((product) => product.category?.name),
      ),
    [supplierProducts],
  );

  const originOptions = useMemo(
    () => getUniqueOptions(supplierProducts.map((product) => product.origin)),
    [supplierProducts],
  );

  const filteredProducts = useMemo(() => {
    const search = normalizeValue(filters.search);

    return supplierProducts.filter((product) => {
      const searchableContent = normalizeValue(
        [
          product.name,
          product.description,
          product.priceInfo,
          product.minimumOrder,
          product.origin,
          product.category?.name,
        ].join(" "),
      );

      const matchesSearch = !search || searchableContent.includes(search);
      const matchesCategory =
        !filters.category || product.category?.name === filters.category;
      const matchesOrigin =
        !filters.origin || product.origin === filters.origin;
      const matchesAvailability =
        !filters.availability ||
        (filters.availability === "active"
          ? product.isActive !== false
          : product.isActive === false);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesOrigin &&
        matchesAvailability
      );
    });
  }, [filters, supplierProducts]);

  const activeProductsCount = supplierProducts.filter(
    (product) => product.isActive !== false,
  ).length;
  const hasActiveFilters = Object.values(filters).some(Boolean);

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

  async function handleDeleteProduct(productId) {
    const confirmed = window.confirm(
      "Retirer définitivement ce produit de votre catalogue ?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingProductId(productId);
    setActionErrorMessage("");

    try {
      await deleteProduct(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );
    } catch (error) {
      setActionErrorMessage(
        error.message || "Impossible de retirer ce produit.",
      );
    } finally {
      setDeletingProductId("");
    }
  }

  return (
    <div className="supplier-products-page">
      <header className="supplier-products-header">
        <div>
          <p className="supplier-products-header__eyebrow">
            Espace fournisseur
          </p>
          <h1>Mes produits</h1>
          <p>Gérez les produits visibles par les magasins.</p>
        </div>

        <Link
          className="supplier-products-header__action"
          to="/supplier/products/new"
        >
          <SupplierProductsIcon name="plus" />
          Ajouter un produit
        </Link>
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-products-page__feedback"
          message="Chargement de vos produits..."
        />
      )}

      {loadErrorMessage && (
        <div className="supplier-products-error">
          <ErrorState
            className="supplier-products-page__feedback"
            title="Produits indisponibles"
            message={loadErrorMessage}
          />
          <button
            className="supplier-products-empty__action"
            type="button"
            onClick={() => setReloadKey((currentKey) => currentKey + 1)}
          >
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && !loadErrorMessage && !supplierProfile && (
        <EmptyState
          className="supplier-products-page__empty"
          title="Profil fournisseur requis"
          message="Créez votre profil fournisseur avant d’ajouter des produits."
          action={
            <Link
              className="supplier-products-empty__action"
              to="/supplier/profile"
            >
              Créer mon profil fournisseur
            </Link>
          }
        />
      )}

      {!isLoading && !loadErrorMessage && supplierProfile && (
        <>
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
                onChange={handleFilterChange}
                placeholder="Rechercher un produit..."
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
              name="origin"
              value={filters.origin}
              onChange={handleFilterChange}
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
                onClick={() => setViewMode("grid")}
                aria-label="Afficher en grille"
                aria-pressed={viewMode === "grid"}
                title="Afficher en grille"
              >
                <SupplierProductsIcon name="grid" />
              </button>
              <button
                type="button"
                className={viewMode === "list" ? "is-active" : ""}
                onClick={() => setViewMode("list")}
                aria-label="Afficher en liste"
                aria-pressed={viewMode === "list"}
                title="Afficher en liste"
              >
                <SupplierProductsIcon name="list" />
              </button>
            </div>
          </section>

          <div className="supplier-products-summary">
            <p>
              <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length !== 1
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
              <button type="button" onClick={resetFilters}>
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {actionErrorMessage && (
            <ErrorState
              className="supplier-products-page__feedback"
              title="Action impossible"
              message={actionErrorMessage}
            />
          )}

          {supplierProducts.length === 0 ? (
            <EmptyState
              className="supplier-products-page__empty"
              title="Aucun produit publié pour le moment."
              message="Ajoutez votre premier produit pour le rendre visible auprès des magasins."
              action={
                <Link
                  className="supplier-products-empty__action"
                  to="/supplier/products/new"
                >
                  Ajouter un produit
                </Link>
              }
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              className="supplier-products-page__empty"
              title="Aucun produit ne correspond à ces filtres."
              message="Modifiez votre recherche ou réinitialisez les filtres."
              action={
                <button
                  className="supplier-products-empty__action"
                  type="button"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </button>
              }
            />
          ) : (
            <section
              className={`supplier-products-collection supplier-products-collection--${viewMode}`}
              aria-live="polite"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  supplierName={supplierProfile.companyName}
                  deletingProductId={deletingProductId}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default SupplierProductsPage;
