import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardStatCard from "../../components/shared/DashboardStatCard";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { deleteProduct, getProducts } from "../../services/productService";
import { getCurrentSupplierProfile } from "../../services/supplierService";

function getProductSupplierId(product) {
  return product.supplierId || product.supplier?.id;
}

function SupplierProductsPage() {
  const [supplierProfile, setSupplierProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingProductId, setDeletingProductId] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadProducts() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const supplierResponse = await getCurrentSupplierProfile();
        const productsResponse = await getProducts();

        if (!shouldUpdateState) {
          return;
        }

        const profile = supplierResponse.supplier;
        const allProducts = productsResponse.products || [];

        setSupplierProfile(profile);
        setProducts(allProducts);
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        setErrorMessage(error.message || "Unable to load supplier products.");
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
  }, []);

  const supplierProducts = useMemo(() => {
    if (!supplierProfile) {
      return [];
    }

    return products.filter(
      (product) => getProductSupplierId(product) === supplierProfile.id,
    );
  }, [products, supplierProfile]);

  const activeProducts = supplierProducts.filter((product) => product.isActive);
  const categoryCount = new Set(
    supplierProducts
      .map((product) => product.category?.name)
      .filter(Boolean),
  ).size;

  async function handleDeactivateProduct(productId) {
    const confirmed = window.confirm(
      "Do you want to deactivate this product?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingProductId(productId);
    setErrorMessage("");

    try {
      await deleteProduct(productId);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );
    } catch (error) {
      setErrorMessage(error.message || "Unable to deactivate product.");
    } finally {
      setDeletingProductId("");
    }
  }

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Supplier products"
        title="Manage your products"
        description="Create and manage the product offers that will appear in the Kerno catalog."
      >
        <Link to="/supplier/products/new">
          <Button>Add product</Button>
        </Link>
      </PageHeader>

      {isLoading && <LoadingState message="Loading supplier products..." />}

      {errorMessage && (
        <ErrorState
          className="mb-6"
          title="Products unavailable"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardStatCard
              label="Products"
              value={supplierProducts.length}
              helperText="Products linked to your supplier profile."
            />

            <DashboardStatCard
              label="Active"
              value={activeProducts.length}
              trend="Visible"
              helperText="Active products can appear in the catalog."
            />

            <DashboardStatCard
              label="Categories"
              value={categoryCount}
              helperText="Distinct categories used by your products."
            />
          </div>

          <Card className="mt-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-xl font-black">Product list</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Keep this page focused on supplier product management. Orders,
                  carts and invoices are out of scope for the MVP.
                </p>
              </div>

              <StatusBadge
                status={supplierProducts.length > 0 ? "ACTIVE" : "PENDING"}
                label={
                  supplierProducts.length > 0
                    ? "Products ready"
                    : "No products yet"
                }
              />
            </div>

            {!supplierProfile && (
              <EmptyState
                title="Supplier profile required"
                message="Create your supplier profile before adding products."
                action={
                  <Link to="/supplier/profile">
                    <Button>Create supplier profile</Button>
                  </Link>
                }
              />
            )}

            {supplierProfile && supplierProducts.length === 0 && (
              <EmptyState
                title="No products yet"
                message="Add your first product so stores can discover your offer."
                action={
                  <Link to="/supplier/products/new">
                    <Button>Add first product</Button>
                  </Link>
                }
              />
            )}

            {supplierProfile && supplierProducts.length > 0 && (
              <div className="grid gap-4">
                {supplierProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
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
                              Category
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                              {product.category?.name || "Not provided"}
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
                              Minimum order
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                              {product.minimumOrder || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 lg:justify-end">
                        <Button variant="ghost" disabled>
                          Edit later
                        </Button>

                        <Button
                          variant="secondary"
                          disabled={deletingProductId === product.id}
                          onClick={() => handleDeactivateProduct(product.id)}
                        >
                          {deletingProductId === product.id
                            ? "Deactivating..."
                            : "Deactivate"}
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

export default SupplierProductsPage;
