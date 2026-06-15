import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
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

function SupplierDetailPage() {
  const { id } = useParams();

  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
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

        const loadedSupplier = getSupplierFromResponse(supplierResponse);

        setSupplier(loadedSupplier);
        setProducts(getProductsFromResponse(productsResponse));
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(error.message || "Unable to load supplier details.");
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

    return products.filter((product) => getProductSupplierId(product) === supplier.id);
  }, [products, supplier]);

  const requestPath = supplier ? `/requests/new?supplierId=${supplier.id}` : "/requests/new";
  const canContactSupplier =
    String(getCurrentAuthRole() || "").toUpperCase() === "STORE";

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Supplier detail"
        title={supplier?.companyName || "Supplier details"}
        description="Review supplier information and related products before starting a contact request."
      >
        <Link to="/catalog">
          <Button variant="secondary">Back to catalog</Button>
        </Link>

        {supplier && canContactSupplier && (
          <Link to={requestPath}>
            <Button>Contact supplier</Button>
          </Link>
        )}
      </PageHeader>

      {isLoading && <LoadingState message="Loading supplier details..." />}

      {errorMessage && (
        <ErrorState title="Supplier unavailable" message={errorMessage} />
      )}

      {!isLoading && !errorMessage && !supplier && (
        <EmptyState
          title="Supplier not found"
          message="The supplier may not exist or may no longer be available."
          action={
            <Link to="/catalog">
              <Button variant="secondary">Back to catalog</Button>
            </Link>
          }
        />
      )}

      {!isLoading && !errorMessage && supplier && (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <Card>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Supplier
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    {supplier.companyName}
                  </h2>
                </div>

                <StatusBadge status="ACTIVE" label="Supplier profile" />
              </div>

              <p className="text-base leading-8 text-slate-600">
                {supplier.description || "No supplier description provided."}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {supplier.location || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Business type
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {supplier.businessType || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Contact email
                  </p>
                  <p className="mt-1 break-all font-black text-slate-900">
                    {supplier.contactEmail || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Phone
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {supplier.phone || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Website
                  </p>
                  <p className="mt-1 break-all font-black text-slate-900">
                    {supplier.website || "Not provided"}
                  </p>
                </div>
              </div>
            </Card>

            {canContactSupplier && (
              <Card>
                <h2 className="m-0 text-xl font-black">Contact this supplier</h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Send a structured request to ask for availability, quote
                  information, quantities or next steps.
                </p>

                <div className="mt-5 rounded-3xl bg-emerald-950 p-6 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
                    Request flow
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    Start a first business contact
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-emerald-50">
                    This CTA prepares the transition toward the contact request
                    page. Payment, ordering and messaging are intentionally out
                    of scope.
                  </p>

                  <Link
                    className="mt-5 inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-950 transition hover:bg-stone-100"
                    to={requestPath}
                  >
                    Create request
                  </Link>
                </div>
              </Card>
            )}
          </div>

          <section>
            <Card>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="m-0 text-xl font-black">Related products</h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Products linked to this supplier.
                  </p>
                </div>

                <StatusBadge
                  status={relatedProducts.length > 0 ? "ACTIVE" : "PENDING"}
                  label={`${relatedProducts.length} product${
                    relatedProducts.length > 1 ? "s" : ""
                  }`}
                />
              </div>

              {relatedProducts.length === 0 ? (
                <EmptyState
                  title="No related products"
                  message="This supplier does not have visible products yet."
                />
              ) : (
                <div className="grid gap-4">
                  {relatedProducts.map((product) => (
                    <article
                      key={product.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="m-0 text-xl font-black text-slate-950">
                          {product.name}
                        </h3>

                        <StatusBadge
                          status={product.isActive ? "ACTIVE" : "INACTIVE"}
                          label={product.isActive ? "Active" : "Inactive"}
                        />
                      </div>

                      <p className="text-sm leading-6 text-slate-500">
                        {product.description || "No description provided."}
                      </p>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
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

                      <Link
                        className="mt-5 inline-flex"
                        to={`/products/${product.id}`}
                      >
                        <Button variant="secondary">View product</Button>
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}

export default SupplierDetailPage;
