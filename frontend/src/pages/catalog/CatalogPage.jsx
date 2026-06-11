import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Input from "../../components/ui/Input";
import LoadingState from "../../components/ui/LoadingState";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
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

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Marketplace"
        title="Catalog"
        description="Browse supplier products, discover companies and prepare your next sourcing request."
      >
        <Button
          variant="secondary"
          onClick={resetFilters}
          disabled={!hasActiveFilters}
        >
          Reset filters
        </Button>
      </PageHeader>

      {isLoading && <LoadingState message="Loading catalog..." />}

      {errorMessage && (
        <ErrorState
          title="Catalog unavailable"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && (
        <>
          <Card>
            <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
              <Input
                label="Search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products, suppliers, origin..."
              />

              <Select
                label="Category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                options={categoryOptions}
                placeholder="All categories"
              />

              <Select
                label="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                options={locationOptions}
                placeholder="All locations"
              />

              <Select
                label="Supplier type"
                name="businessType"
                value={filters.businessType}
                onChange={handleFilterChange}
                options={businessTypeOptions}
                placeholder="All supplier types"
              />
            </div>
          </Card>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Products found
              </p>
              <p className="mt-2 text-3xl font-black">
                {filteredProducts.length}
              </p>
            </Card>

            <Card>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Suppliers found
              </p>
              <p className="mt-2 text-3xl font-black">
                {filteredSuppliers.length}
              </p>
            </Card>

            <Card>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Discovery status
              </p>
              <div className="mt-3">
                <StatusBadge
                  status={hasActiveFilters ? "PENDING" : "ACTIVE"}
                  label={hasActiveFilters ? "Filtered" : "All catalog"}
                />
              </div>
            </Card>
          </div>

          {hasNoResults ? (
            <EmptyState
              className="mt-6"
              title="No catalog result"
              message="Try changing your search terms or clearing the filters."
              action={
                <Button variant="secondary" onClick={resetFilters}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
              <section>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="m-0 text-2xl font-black">Products</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Product cards link to product detail pages prepared for the
                      next discovery steps.
                    </p>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <EmptyState
                    title="No products match your filters"
                    message="Supplier cards may still match your search."
                  />
                ) : (
                  <div className="grid gap-4">
                    {filteredProducts.map((product) => (
                      <Card key={product.id}>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <h3 className="m-0 text-2xl font-black text-slate-950">
                                {product.name}
                              </h3>

                              <StatusBadge
                                status={product.isActive ? "ACTIVE" : "INACTIVE"}
                                label={product.isActive ? "Active" : "Inactive"}
                              />
                            </div>

                            <p className="max-w-3xl text-sm leading-6 text-slate-500">
                              {product.description || "No description provided."}
                            </p>

                            <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                              <div>
                                <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                                  Supplier
                                </p>
                                <p className="mt-1 font-bold text-slate-800">
                                  {product.supplier?.companyName ||
                                    "Unknown supplier"}
                                </p>
                              </div>

                              <div>
                                <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                                  Category
                                </p>
                                <p className="mt-1 font-bold text-slate-800">
                                  {product.category?.name || "Not provided"}
                                </p>
                              </div>

                              <div>
                                <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                                  Price
                                </p>
                                <p className="mt-1 font-bold text-slate-800">
                                  {product.priceInfo || "On request"}
                                </p>
                              </div>

                              <div>
                                <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                                  Origin
                                </p>
                                <p className="mt-1 font-bold text-slate-800">
                                  {product.origin || "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 lg:justify-end">
                            <Link to={`/products/${product.id}`}>
                              <Button variant="secondary">View product</Button>
                            </Link>

                            {product.supplier?.id && (
                              <Link to={`/suppliers/${product.supplier.id}`}>
                                <Button variant="ghost">View supplier</Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-4">
                  <h2 className="m-0 text-2xl font-black">Suppliers</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Supplier references help stores discover who is behind each
                    product.
                  </p>
                </div>

                {filteredSuppliers.length === 0 ? (
                  <EmptyState
                    title="No suppliers match your filters"
                    message="Try searching by company, location or supplier type."
                  />
                ) : (
                  <div className="grid gap-4">
                    {filteredSuppliers.map((supplier) => (
                      <Card key={supplier.id}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <h3 className="m-0 text-xl font-black text-slate-950">
                            {supplier.companyName}
                          </h3>

                          <StatusBadge status="ACTIVE" label="Supplier" />
                        </div>

                        <p className="text-sm leading-6 text-slate-500">
                          {supplier.description || "No description provided."}
                        </p>

                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                              Location
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                              {supplier.location || "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                              Type
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                              {supplier.businessType || "Not provided"}
                            </p>
                          </div>
                        </div>

                        <Link
                          className="mt-5 inline-flex"
                          to={`/suppliers/${supplier.id}`}
                        >
                          <Button variant="secondary">View supplier</Button>
                        </Link>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CatalogPage;
