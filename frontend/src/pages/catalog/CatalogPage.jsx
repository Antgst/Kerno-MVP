import { useEffect, useMemo, useState } from "react";
import CatalogProducts from "../../components/catalog/CatalogProducts";
import CatalogSummary from "../../components/catalog/CatalogSummary";
import CatalogToolbar from "../../components/catalog/CatalogToolbar";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getProducts } from "../../services/productService";
import { getSuppliers } from "../../services/supplierService";
import { formatProductPrice } from "../../utils/productPrice";
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
          formatProductPrice(product),
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
            <CatalogProducts
              products={filteredProducts}
              suppliersById={suppliersById}
              getSupplierFromProduct={getSupplierFromProduct}
              viewMode={viewMode}
            />
          )}
        </>
      )}
    </div>
  );
}

export default CatalogPage;
