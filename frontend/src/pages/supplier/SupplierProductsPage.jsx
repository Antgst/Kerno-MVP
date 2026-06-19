import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SupplierProductsCollection from "../../components/supplier-products/SupplierProductsCollection";
import SupplierProductsHeader from "../../components/supplier-products/SupplierProductsHeader";
import SupplierProductsSummary from "../../components/supplier-products/SupplierProductsSummary";
import SupplierProductsToolbar from "../../components/supplier-products/SupplierProductsToolbar";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
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

  function changeViewMode(nextViewMode) {
    setViewMode(nextViewMode);
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
      <SupplierProductsHeader />

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
          <SupplierProductsToolbar
            categoryOptions={categoryOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onViewModeChange={changeViewMode}
            originOptions={originOptions}
            viewMode={viewMode}
          />

          <SupplierProductsSummary
            activeProductsCount={activeProductsCount}
            filteredProductsCount={filteredProducts.length}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
          />

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
            <SupplierProductsCollection
              products={filteredProducts}
              viewMode={viewMode}
              supplierName={supplierProfile.companyName}
              deletingProductId={deletingProductId}
              onDelete={handleDeleteProduct}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SupplierProductsPage;
