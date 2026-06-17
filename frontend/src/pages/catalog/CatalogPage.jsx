import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/marketplace/ProductCard";
import SupplierCard from "../../components/marketplace/SupplierCard";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getProducts } from "../../services/productService";
import { getSuppliers } from "../../services/supplierService";

const initialFilters = {
  search: "",
  category: "",
  location: "",
  businessType: "",
};

function getProductsFromResponse(response) {
  return response?.products || [];
}

function getSuppliersFromResponse(response) {
  return response?.suppliers || [];
}

function getSupplierFromProduct(product) {
  return product.supplier || null;
}

function normalizeValue(value) {
  return String(value || "").toLowerCase();
}

function getUniqueOptions(values) {
  return [...new Set(values.filter(Boolean))].sort().map((value) => ({
    value,
    label: value,
  }));
}

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadCatalogData() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [productsResponse, suppliersResponse] = await Promise.all([
          getProducts(),
          getSuppliers(),
        ]);

        if (!shouldUpdateState) {
          return;
        }

        setProducts(getProductsFromResponse(productsResponse));
        setSuppliers(getSuppliersFromResponse(suppliersResponse));
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        setErrorMessage(error.message || "Unable to load catalog.");
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
  }, []);

  const supplierCards = useMemo(() => {
    const supplierMap = new Map();

    suppliers.forEach((supplier) => {
      supplierMap.set(supplier.id, supplier);
    });

    products.forEach((product) => {
      const productSupplier = getSupplierFromProduct(product);

      if (productSupplier?.id && !supplierMap.has(productSupplier.id)) {
        supplierMap.set(productSupplier.id, productSupplier);
      }
    });

    return [...supplierMap.values()];
  }, [products, suppliers]);

  const categoryOptions = useMemo(
    () =>
      getUniqueOptions(
        products.map((product) => product.category?.name),
      ),
    [products],
  );

  const locationOptions = useMemo(
    () =>
      getUniqueOptions([
        ...products.map((product) => product.supplier?.location),
        ...supplierCards.map((supplier) => supplier.location),
      ]),
    [products, supplierCards],
  );

  const businessTypeOptions = useMemo(
    () =>
      getUniqueOptions([
        ...products.map((product) => product.supplier?.businessType),
        ...supplierCards.map((supplier) => supplier.businessType),
      ]),
    [products, supplierCards],
  );

  const filteredProducts = useMemo(() => {
    const search = normalizeValue(filters.search);

    return products.filter((product) => {
      const supplier = getSupplierFromProduct(product);

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
        !filters.location || supplier?.location === filters.location;

      const matchesBusinessType =
        !filters.businessType ||
        supplier?.businessType === filters.businessType;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesBusinessType
      );
    });
  }, [products, filters]);

  const filteredSuppliers = useMemo(() => {
    const search = normalizeValue(filters.search);

    return supplierCards.filter((supplier) => {
      const searchableContent = normalizeValue(
        [
          supplier.companyName,
          supplier.description,
          supplier.location,
          supplier.businessType,
        ].join(" "),
      );

      const matchesSearch = !search || searchableContent.includes(search);

      const matchesLocation =
        !filters.location || supplier.location === filters.location;

      const matchesBusinessType =
        !filters.businessType ||
        supplier.businessType === filters.businessType;

      return matchesSearch && matchesLocation && matchesBusinessType;
    });
  }, [supplierCards, filters]);

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

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const hasNoResults =
    filteredProducts.length === 0 && filteredSuppliers.length === 0;
  const categoryPills = ["Tous", ...categoryOptions.slice(0, 5).map((option) => option.label)];

  return (
    <div className="kerno-page catalog-page">
      <header className="catalog-hero">
        <div>
          <h1>Catalogue</h1>
          <p>Découvrez des produits locaux de qualité</p>
        </div>
        <strong>▣ {products.length || 248} produits disponibles</strong>
      </header>

      {isLoading && <LoadingState message="Chargement du catalogue..." />}

      {errorMessage && (
        <ErrorState
          title="Catalogue indisponible"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && (
        <>
          <section className="catalog-filters" aria-label="Filtres catalogue">
            <label className="catalog-search">
              <span>⌕</span>
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher un produit, fournisseur, catégorie..."
              />
            </label>

            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">◇ Catégorie</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select name="location" value={filters.location} onChange={handleFilterChange}>
              <option value="">◉ Région</option>
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select name="businessType" value={filters.businessType} onChange={handleFilterChange}>
              <option value="">⊙ Disponibilité</option>
              {businessTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <Button onClick={resetFilters} disabled={!hasActiveFilters}>
              ☷ Filtrer
            </Button>
          </section>

          <div className="category-pills">
            {categoryPills.map((category) => (
              <button
                className={[
                  "category-pill",
                  (category === "Tous" && !filters.category) || filters.category === category
                    ? "category-pill--active"
                    : "",
                ].join(" ")}
                key={category}
                type="button"
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    category: category === "Tous" ? "" : category,
                  }))
                }
              >
                {category}
              </button>
            ))}
          </div>

          <div className="catalog-tabs">
            <a className="catalog-tab catalog-tab--active" href="#produits">▣ Produits</a>
            <a className="catalog-tab" href="#fournisseurs">▤ Fournisseurs</a>
          </div>

          {hasNoResults ? (
            <EmptyState
              className="mt-6"
              title="Aucun résultat"
              message="Essayez de modifier votre recherche ou de réinitialiser les filtres."
              action={
                <Button variant="secondary" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              }
            />
          ) : (
            <>
              <section id="produits">
                {filteredProducts.length === 0 ? (
                  <EmptyState
                    title="Aucun produit"
                    message="Des fournisseurs peuvent encore correspondre à votre recherche."
                  />
                ) : (
                  <div className="market-grid market-grid--products">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}
              </section>

              <nav className="catalog-pagination" aria-label="Pagination">
                <button type="button">‹</button>
                <button className="is-active" type="button">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button">4</button>
                <button type="button">5</button>
                <button type="button">›</button>
              </nav>

              <section className="catalog-suppliers" id="fournisseurs">
                <div className="section-heading">
                  <h2>Fournisseurs</h2>
                  <span>{filteredSuppliers.length} disponibles</span>
                </div>
                <div className="market-grid market-grid--suppliers">
                  {filteredSuppliers.slice(0, 4).map((supplier, index) => (
                    <SupplierCard key={supplier.id} supplier={supplier} index={index} />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CatalogPage;
