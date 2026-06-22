import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import ProductImage from "../../components/ui/ProductImage";
import StatusBadge from "../../components/ui/StatusBadge";
import { getCurrentAuthRole } from "../../services/authService";
import { getProducts } from "../../services/productService";
import { getSupplierById } from "../../services/supplierService";
import { formatProductPrice } from "../../utils/productPrice";
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

function getWebsiteHref(website) {
  if (!website) {
    return "";
  }

  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

function getInitials(companyName) {
  return String(companyName || "K")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function SupplierIcon({ name }) {
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
    arrow: <path d="m15 18-6-6 6-6" />,
    building: (
      <>
        <path d="M3 21h18" />
        <path d="M6 21V7l6-4v18" />
        <path d="M18 21V11l-6-4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    map: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.6.6a2 2 0 0 1 2 2.3Z" />
    ),
    request: (
      <>
        <path d="M4 4h16v12H7l-3 3V4Z" />
        <path d="M8 8h8M8 12h5" />
      </>
    ),
  };

  return <svg {...commonProps}>{icons[name]}</svg>;
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

        setSupplier(getSupplierFromResponse(supplierResponse));
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

    return products.filter(
      (product) => getProductSupplierId(product) === supplier.id,
    );
  }, [products, supplier]);

  const requestPath = supplier
    ? `/requests/new?supplierId=${supplier.id}`
    : "/requests/new";
  const canContactSupplier =
    String(getCurrentAuthRole() || "").toUpperCase() === "STORE";
  const websiteHref = getWebsiteHref(supplier?.website);

  return (
    <div className="supplier-detail-page">
      <header className="supplier-detail-page__intro">
        <div>
          <Link className="supplier-detail-page__back" to="/catalog">
            <SupplierIcon name="arrow" />
            Retour au catalogue
          </Link>
          <h1>{supplier?.companyName || "Détail du fournisseur"}</h1>
          <p className="supplier-detail-page__subtitle">
            Découvrez son activité, ses coordonnées professionnelles et les
            produits proposés sur KERNO.
          </p>
        </div>

        {supplier && canContactSupplier && (
          <Link className="supplier-detail-page__primary-action" to={requestPath}>
            <SupplierIcon name="request" />
            Contacter le fournisseur
          </Link>
        )}
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-detail-page__feedback"
          message="Chargement du fournisseur..."
        />
      )}

      {errorMessage && (
        <ErrorState
          className="supplier-detail-page__feedback"
          title="Fournisseur indisponible"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && !supplier && (
        <EmptyState
          className="supplier-detail-page__feedback"
          title="Fournisseur introuvable"
          message="Ce fournisseur n’existe peut-être plus ou n’est plus disponible."
          action={
            <Link className="supplier-detail-page__secondary-action" to="/catalog">
              Retour au catalogue
            </Link>
          }
        />
      )}

      {!isLoading && !errorMessage && supplier && (
        <>
          <div className="supplier-detail-page__layout">
            <main className="supplier-detail-page__main">
              <section className="supplier-detail-card supplier-detail-identity">
                <div className="supplier-detail-identity__heading">
                  <span className="supplier-detail-identity__mark">
                    {getInitials(supplier.companyName)}
                  </span>
                  <div>
                    <h2>{supplier.companyName}</h2>
                    <p>
                      {supplier.businessType ||
                        "Activité professionnelle à préciser"}
                    </p>
                  </div>
                  <StatusBadge status="ACTIVE" label="Actif" />
                </div>

                <p className="supplier-detail-identity__description">
                  {supplier.description ||
                    "Ce fournisseur n’a pas encore ajouté de présentation détaillée."}
                </p>

                <dl className="supplier-detail-facts">
                  <div>
                    <dt>
                      <SupplierIcon name="map" />
                      Localisation
                    </dt>
                    <dd>{supplier.location || "À préciser"}</dd>
                  </div>
                  <div>
                    <dt>
                      <SupplierIcon name="building" />
                      Type d’activité
                    </dt>
                    <dd>{supplier.businessType || "À préciser"}</dd>
                  </div>
                </dl>
              </section>

              <section className="supplier-detail-card supplier-detail-contact">
                <div className="supplier-detail-section-heading">
                  <div>
                    <h2>Informations professionnelles</h2>
                    <p>
                      Les coordonnées communiquées par le fournisseur pour les
                      échanges B2B.
                    </p>
                  </div>
                </div>

                <dl className="supplier-detail-contact__list">
                  <div>
                    <dt>
                      <SupplierIcon name="mail" />
                      Email
                    </dt>
                    <dd>
                      {supplier.contactEmail ? (
                        <a href={`mailto:${supplier.contactEmail}`}>
                          {supplier.contactEmail}
                        </a>
                      ) : (
                        "À préciser"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <SupplierIcon name="phone" />
                      Téléphone
                    </dt>
                    <dd>
                      {supplier.phone ? (
                        <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
                      ) : (
                        "À préciser"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>
                      <SupplierIcon name="globe" />
                      Site internet
                    </dt>
                    <dd>
                      {websiteHref ? (
                        <a href={websiteHref} target="_blank" rel="noreferrer">
                          {supplier.website}
                        </a>
                      ) : (
                        "À préciser"
                      )}
                    </dd>
                  </div>
                </dl>
              </section>
            </main>

            <aside className="supplier-detail-card supplier-detail-products">
              <div className="supplier-detail-section-heading supplier-detail-products__heading">
                <div>
                  <h2>Produits proposés</h2>
                  <p>Les produits actuellement publiés par ce fournisseur.</p>
                </div>
                <StatusBadge
                  status={relatedProducts.length > 0 ? "ACTIVE" : "DRAFT"}
                  label={`${relatedProducts.length} produit${
                    relatedProducts.length > 1 ? "s" : ""
                  }`}
                />
              </div>

              {relatedProducts.length === 0 ? (
                <EmptyState
                  className="supplier-detail-products__empty"
                  title="Aucun produit visible"
                  message="Ce fournisseur n’a pas encore publié de produit."
                />
              ) : (
                <div className="supplier-detail-products__list">
                  {relatedProducts.map((product) => (
                    <article
                      className="supplier-detail-product"
                      key={product.id}
                    >
                      <ProductImage
                        product={product}
                        alt={`Aperçu du produit ${product.name || "KERNO"}`}
                      />
                      <div className="supplier-detail-product__content">
                        <div>
                          <h3>{product.name}</h3>
                          <StatusBadge
                            status={
                              product.isActive === false ? "INACTIVE" : "ACTIVE"
                            }
                            label={
                              product.isActive === false
                                ? "Indisponible"
                                : "Disponible"
                            }
                          />
                        </div>
                        <p>
                          {product.description ||
                            "Aucune description renseignée."}
                        </p>
                        <dl>
                          <div>
                            <dt>Prix indicatif</dt>
                            <dd>{formatProductPrice(product)}</dd>
                          </div>
                          <div>
                            <dt>Volume minimum</dt>
                            <dd>{product.minimumOrder || "À convenir"}</dd>
                          </div>
                        </dl>
                        <Link to={`/products/${product.id}`}>
                          Voir le produit
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>

          {canContactSupplier && (
            <section className="supplier-detail-contact-cta">
              <span className="supplier-detail-contact-cta__icon">
                <SupplierIcon name="request" />
              </span>
              <div>
                <p>Premier contact professionnel</p>
                <h2>Présentez votre besoin au fournisseur</h2>
                <span>
                  Précisez le produit, la quantité ou les informations dont
                  votre magasin a besoin.
                </span>
              </div>
              <Link to={requestPath}>Envoyer une demande</Link>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default SupplierDetailPage;
