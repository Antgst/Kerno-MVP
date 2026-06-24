import { useEffect, useMemo, useState } from "react";
import CatalogProducts from "../../components/catalog/CatalogProducts";
import CatalogSummary from "../../components/catalog/CatalogSummary";
import CatalogToolbar from "../../components/catalog/CatalogToolbar";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getProducts } from "../../services/productService";
import { getSuppliers } from "../../services/supplierService";
import { formatMinimumOrder, formatProductPrice } from "../../utils/productPrice";
import { getListResource } from "../../utils/responseUtils";

const initialFilters = {
  search: "",
  category: "",
  location: "",
  availability: "",
  businessType: "",
  sort: "recent",
};

const ITEMS_PER_PAGE = 24;

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
  return Array.from(new Set(values.filter(Boolean))).toSorted((first, second) =>
    first.localeCompare(second, "fr-FR"),
  );
}

function getProductTimestamp(product) {
  const dateValue = product.createdAt || product.updatedAt;
  const timestamp = dateValue ? new Date(dateValue).getTime() : Number.NaN;

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getSortablePrice(product) {
  const price = Number(product?.priceCents);

  return Number.isFinite(price) ? price : null;
}

function getPaginationPages(currentPage, totalPages) {
  const pages = new Set([1, totalPages]);
  const firstNearbyPage = Math.max(1, currentPage - 1);
  const lastNearbyPage = Math.min(totalPages, currentPage + 1);

  for (let page = firstNearbyPage; page <= lastNearbyPage; page += 1) {
    pages.add(page);
  }

  return Array.from(pages).toSorted(
    (firstPage, secondPage) => firstPage - secondPage,
  );
}

function CatalogPagination({
  currentPage,
  firstItemIndex,
  lastItemIndex,
  onPageChange,
  totalItems,
  totalPages,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPaginationPages(currentPage, totalPages);

  return (
    <nav
      className="catalog-pagination supplier-requests-list__footer"
      aria-label="Pagination du catalogue"
    >
      <p>
        Produits {firstItemIndex + 1}-{lastItemIndex} sur {totalItems}
      </p>

      <div>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>

        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const shouldShowGap = previousPage && page - previousPage > 1;

          return (
            <span
              className="catalog-pagination__page-group supplier-requests-list__page-group"
              key={page}
            >
              {shouldShowGap && (
                <span
                  className="catalog-pagination__gap supplier-requests-list__gap"
                  aria-hidden="true"
                >
                  ...
                </span>
              )}
              <button
                type="button"
                className={page === currentPage ? "is-active" : ""}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </nav>
  );
}

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
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

    return products
      .filter((product) => {
        const supplier = getSupplierFromProduct(product, suppliersById);
        const searchableContent = normalizeValue(
          [
            product.name,
            product.description,
            product.origin,
            formatProductPrice(product),
            formatMinimumOrder(product),
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
      })
      .sort((firstProduct, secondProduct) => {
        if (filters.sort === "name") {
          return String(firstProduct.name || "").localeCompare(
            String(secondProduct.name || ""),
            "fr-FR",
          );
        }

        if (filters.sort === "price-asc") {
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

        if (filters.sort === "price-desc") {
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
  }, [filters, products, suppliersById]);

  const visibleSupplierCount = useMemo(
    () =>
      new Set(
        filteredProducts.flatMap((product) => {
          const supplier = getSupplierFromProduct(product, suppliersById);
          const supplierKey = supplier?.id || supplier?.companyName;

          return supplierKey ? [supplierKey] : [];
        }),
      ).size,
    [filteredProducts, suppliersById],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const firstItemIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(firstItemIndex, firstItemIndex + ITEMS_PER_PAGE),
    [filteredProducts, firstItemIndex],
  );
  const lastItemIndex = Math.min(
    firstItemIndex + paginatedProducts.length,
    filteredProducts.length,
  );
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    Boolean(filters.location) ||
    Boolean(filters.availability) ||
    Boolean(filters.businessType) ||
    filters.sort !== initialFilters.sort;
  const activeFilterCount = [
    filters.search,
    filters.category,
    filters.location,
    filters.availability,
    filters.businessType,
    filters.sort !== initialFilters.sort ? filters.sort : "",
  ].filter(Boolean).length;

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setCurrentPage(1);
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function resetFilters() {
    setCurrentPage(1);
    setFilters(initialFilters);
  }

  function changeViewMode(nextViewMode) {
    setViewMode(nextViewMode);
  }

  function changePage(nextPage) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return (
    <div className="catalog-page">
      <header className="catalog-header">
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
          <CatalogToolbar
            businessTypeOptions={businessTypeOptions}
            categoryOptions={categoryOptions}
            filters={filters}
            locationOptions={locationOptions}
            onFilterChange={handleFilterChange}
            onViewModeChange={changeViewMode}
            viewMode={viewMode}
          />

          <CatalogSummary
            activeFilterCount={activeFilterCount}
            filteredProductCount={filteredProducts.length}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
            visibleSupplierCount={visibleSupplierCount}
          />

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
            <>
              <CatalogProducts
                products={paginatedProducts}
                suppliersById={suppliersById}
                getSupplierFromProduct={getSupplierFromProduct}
                viewMode={viewMode}
              />

              <CatalogPagination
                currentPage={safeCurrentPage}
                firstItemIndex={firstItemIndex}
                lastItemIndex={lastItemIndex}
                onPageChange={changePage}
                totalItems={filteredProducts.length}
                totalPages={totalPages}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CatalogPage;
