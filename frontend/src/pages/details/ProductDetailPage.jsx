import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getCurrentAuthRole } from "../../services/authService";
import { getProductById } from "../../services/productService";
import { getResource } from "../../utils/responseUtils";

function getProductFromResponse(response) {
  return getResource(response, ["product"]);
}

function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadProduct() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getProductById(id);

        if (shouldUpdateState) {
          setProduct(getProductFromResponse(response));
        }
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(error.message || "Unable to load product details.");
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      shouldUpdateState = false;
    };
  }, [id]);

  const supplier = product?.supplier;
  const category = product?.category;
  const canContactSupplier =
    String(getCurrentAuthRole() || "").toUpperCase() === "STORE";

  const requestPath = supplier?.id
    ? `/requests/new?supplierId=${supplier.id}&productId=${product.id}`
    : "/requests/new";

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Product detail"
        title={product?.name || "Product details"}
        description="Review the product information before contacting the supplier."
      >
        <Link to="/catalog">
          <Button variant="secondary">Back to catalog</Button>
        </Link>

        {product && canContactSupplier && (
          <Link to={requestPath}>
            <Button>Contact supplier</Button>
          </Link>
        )}
      </PageHeader>

      {isLoading && <LoadingState message="Loading product details..." />}

      {errorMessage && (
        <ErrorState title="Product unavailable" message={errorMessage} />
      )}

      {!isLoading && !errorMessage && !product && (
        <EmptyState
          title="Product not found"
          message="The product may have been removed or is no longer active."
          action={
            <Link to="/catalog">
              <Button variant="secondary">Back to catalog</Button>
            </Link>
          }
        />
      )}

      {!isLoading && !errorMessage && product && (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
          <div className="grid gap-6">
            <Card>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Product
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    {product.name}
                  </h2>
                </div>

                <StatusBadge
                  status={product.isActive ? "ACTIVE" : "INACTIVE"}
                  label={product.isActive ? "Active product" : "Inactive"}
                />
              </div>

              {product.imageUrl && (
                <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  <img
                    className="h-72 w-full object-cover"
                    src={product.imageUrl}
                    alt={product.name}
                  />
                </div>
              )}

              <p className="text-base leading-8 text-slate-600">
                {product.description || "No description provided."}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Category
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {category?.name || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Origin
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {product.origin || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Price information
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {product.priceInfo || "On request"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Minimum order
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {product.minimumOrder || "Not provided"}
                  </p>
                </div>
              </div>
            </Card>

            {canContactSupplier && (
              <Card>
                <h2 className="m-0 text-xl font-black">Next step</h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Kerno focuses on the first business contact. No cart, payment,
                  order or review logic is included in the MVP detail page.
                </p>

                <div className="mt-5 rounded-3xl bg-emerald-950 p-6 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
                    Contact request
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    Interested in this product?
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-emerald-50">
                    Send a structured request to the supplier to ask for details,
                    lead time, quantity or quote information.
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

          <div className="grid gap-6">
            <Card>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="m-0 text-xl font-black">Supplier</h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Supplier identity linked to this product.
                  </p>
                </div>

                <StatusBadge status="ACTIVE" label="Supplier" />
              </div>

              {supplier ? (
                <div>
                  <h3 className="text-2xl font-black text-slate-950">
                    {supplier.companyName}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {supplier.description || "No supplier description provided."}
                  </p>

                  <div className="mt-5 grid gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Location
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {supplier.location || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Business type
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {supplier.businessType || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Contact email
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        {supplier.contactEmail || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Website
                      </p>
                      <p className="mt-1 break-all font-bold text-slate-800">
                        {supplier.website || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <Link
                    className="mt-6 inline-flex"
                    to={`/suppliers/${supplier.id}`}
                  >
                    <Button variant="secondary">View supplier page</Button>
                  </Link>
                </div>
              ) : (
                <EmptyState
                  title="No supplier information"
                  message="This product does not currently expose supplier details."
                />
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
