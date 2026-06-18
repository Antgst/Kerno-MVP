import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import ProductImage from "../../components/ui/ProductImage";
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

    return products.filter((product) => getProductSupplierId(product) === supplier.id);
  }, [products, supplier]);

  const requestPath = supplier ? `/requests/new?supplierId=${supplier.id}` : "/requests/new";
  const canContactSupplier =
    String(getCurrentAuthRole() || "").toUpperCase() === "STORE";

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Fiche fournisseur"
        title={supplier?.companyName || "Détail du fournisseur"}
        description="Consultez le profil du fournisseur et ses produits avant d’envoyer une demande."
      >
        <Link to="/catalog">
          <Button variant="secondary">Retour au catalogue</Button>
        </Link>

        {supplier && canContactSupplier && (
          <Link to={requestPath}>
            <Button>Contacter le fournisseur</Button>
          </Link>
        )}
      </PageHeader>

      {isLoading && <LoadingState message="Chargement du fournisseur..." />}

      {errorMessage && (
        <ErrorState title="Fournisseur indisponible" message={errorMessage} />
      )}

      {!isLoading && !errorMessage && !supplier && (
        <EmptyState
          title="Fournisseur introuvable"
          message="Ce fournisseur n’existe peut-être plus ou n’est plus disponible."
          action={
            <Link to="/catalog">
              <Button variant="secondary">Retour au catalogue</Button>
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
                    Fournisseur
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    {supplier.companyName}
                  </h2>
                </div>

                <StatusBadge status="ACTIVE" label="Profil fournisseur" />
              </div>

              <p className="text-base leading-8 text-slate-600">
                {supplier.description ||
                  "Ce fournisseur n’a pas encore ajouté de description."}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Localisation
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {supplier.location || "Non renseignée"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Type d’activité
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {supplier.businessType || "Non renseigné"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Email professionnel
                  </p>
                  <p className="mt-1 break-all font-black text-slate-900">
                    {supplier.contactEmail || "Non renseigné"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Téléphone
                  </p>
                  <p className="mt-1 font-black text-slate-900">
                    {supplier.phone || "Non renseigné"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Site internet
                  </p>
                  <p className="mt-1 break-all font-black text-slate-900">
                    {supplier.website || "Non renseigné"}
                  </p>
                </div>
              </div>
            </Card>

            {canContactSupplier && (
              <Card>
                <h2 className="m-0 text-xl font-black">
                  Contacter ce fournisseur
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Envoyez une demande structurée pour préciser vos besoins,
                  quantités ou questions tarifaires.
                </p>

                <div className="mt-5 rounded-3xl bg-emerald-950 p-6 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
                    Premier contact
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    Démarrer un échange professionnel
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-emerald-50">
                    Votre demande sera transmise au fournisseur avec les
                    informations utiles pour engager l’échange.
                  </p>

                  <Link
                    className="mt-5 inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-950 transition hover:bg-stone-100"
                    to={requestPath}
                  >
                    Faire une demande
                  </Link>
                </div>
              </Card>
            )}
          </div>

          <section>
            <Card>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="m-0 text-xl font-black">Produits proposés</h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Produits publiés par ce fournisseur.
                  </p>
                </div>

                <StatusBadge
                  status={relatedProducts.length > 0 ? "ACTIVE" : "PENDING"}
                  label={`${relatedProducts.length} produit${
                    relatedProducts.length > 1 ? "s" : ""
                  }`}
                />
              </div>

              {relatedProducts.length === 0 ? (
                <EmptyState
                  title="Aucun produit visible"
                  message="Ce fournisseur n’a pas encore publié de produit."
                />
              ) : (
                <div className="grid gap-4">
                  {relatedProducts.map((product) => (
                    <article
                      key={product.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <ProductImage
                        className="mb-4 h-40 w-full rounded-2xl object-cover"
                        product={product}
                        alt={`Aperçu du produit ${product.name || "KERNO"}`}
                      />
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="m-0 text-xl font-black text-slate-950">
                          {product.name}
                        </h3>

                        <StatusBadge
                          status={product.isActive === false ? "INACTIVE" : "ACTIVE"}
                          label={
                            product.isActive === false
                              ? "Indisponible"
                              : "Disponible"
                          }
                        />
                      </div>

                      <p className="text-sm leading-6 text-slate-500">
                        {product.description || "Aucune description renseignée."}
                      </p>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                            Prix indicatif
                          </p>
                          <p className="mt-1 font-bold text-slate-800">
                            {product.priceInfo || "Tarif sur demande"}
                          </p>
                        </div>

                        <div>
                          <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                            Commande minimale
                          </p>
                          <p className="mt-1 font-bold text-slate-800">
                            {product.minimumOrder || "Non renseignée"}
                          </p>
                        </div>
                      </div>

                      <Link
                        className="mt-5 inline-flex"
                        to={`/products/${product.id}`}
                      >
                        <Button variant="secondary">Voir le produit</Button>
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
