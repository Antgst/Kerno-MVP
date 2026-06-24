import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import ProductImage from "../../components/ui/ProductImage";
import { getCurrentAuthRole } from "../../services/authService";
import { getProductById } from "../../services/productService";
import { getSupplierById } from "../../services/supplierService";
import { getResource } from "../../utils/responseUtils";
import { formatMinimumOrder, formatProductPrice } from "../../utils/productPrice";

function getProductFromResponse(response) {
  return getResource(response, ["product"]);
}

function getSupplierFromResponse(response) {
  return getResource(response, ["supplier"]);
}

function getWebsiteHref(website) {
  if (!website) {
    return "";
  }

  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

const productIconProps = {
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

const productIcons = {
    arrow: (
      <svg {...productIconProps}>
        <path d="m15 18-6-6 6-6" />
      </svg>
    ),
    box: (
      <svg {...productIconProps}>
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="m3 8 9 5 9-5" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
    ),
    building: (
      <svg {...productIconProps}>
        <path d="M3 21h18" />
        <path d="M6 21V7l6-4v18" />
        <path d="M18 21V11l-6-4" />
        <path d="M9 9h.01M9 13h.01M9 17h.01M15 13h.01M15 17h.01" />
      </svg>
    ),
    check: (
      <svg {...productIconProps}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    ),
    globe: (
      <svg {...productIconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
    image: (
      <svg {...productIconProps}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 15-5-5L5 20" />
      </svg>
    ),
    mail: (
      <svg {...productIconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    map: (
      <svg {...productIconProps}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    phone: (
      <svg {...productIconProps}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
      </svg>
    ),
    request: (
      <svg {...productIconProps}>
        <path d="M4 4h16v12H7l-3 3V4Z" />
        <path d="M8 8h8M8 12h5" />
      </svg>
    ),
  };

function ProductIcon({ name }) {
  return productIcons[name] || null;
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
        const productResponse = await getProductById(id);
        const loadedProduct = getProductFromResponse(productResponse);

        if (!loadedProduct) {
          if (shouldUpdateState) {
            setProduct(null);
          }
          return;
        }

        let supplier = loadedProduct.supplier || null;

        if (supplier?.id) {
          const supplierResponse = await getSupplierById(supplier.id).catch(
            () => null,
          );
          supplier = getSupplierFromResponse(supplierResponse) || supplier;
        }

        if (shouldUpdateState) {
          setProduct({ ...loadedProduct, supplier });
        }
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(
            error.message || "Impossible de charger les détails du produit.",
          );
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
  const authRole = String(getCurrentAuthRole() || "").toUpperCase();
  const canContactSupplier = authRole === "STORE";
  const canManageProduct = authRole === "SUPPLIER";
  const requestPath = supplier?.id
    ? `/requests/new?supplierId=${supplier.id}&productId=${product.id}`
    : "/requests/new";
  const websiteHref = getWebsiteHref(supplier?.website);
  const productIsAvailable = product?.isActive !== false;

  return (
    <div className="product-detail-page">
      <header className="product-detail-page__intro">
        <div>
          <Link className="product-detail-page__back" to="/catalog">
            <ProductIcon name="arrow" />
            Retour au catalogue
          </Link>
          <h1>{product?.name || "Détails du produit"}</h1>
          <p className="product-detail-page__subtitle">
            Découvrez les informations essentielles avant de contacter le
            fournisseur.
          </p>
        </div>

        {product && canContactSupplier && (
          <Link
            className="product-detail-page__intro-action"
            to={requestPath}
          >
            <ProductIcon name="request" />
            Contacter le fournisseur
          </Link>
        )}

        {product && canManageProduct && (
          <Link
            className="product-detail-page__intro-action product-detail-page__intro-action--manage"
            to={`/supplier/products/${product.id}/edit`}
          >
            <ProductIcon name="box" />
            Modifier le produit
          </Link>
        )}
      </header>

      {isLoading && (
        <LoadingState
          className="product-detail-page__loading"
          message="Chargement du produit..."
        />
      )}

      {errorMessage && (
        <ErrorState
          className="product-detail-page__feedback"
          title="Produit indisponible"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && !product && (
        <EmptyState
          className="product-detail-page__feedback"
          title="Produit introuvable"
          message="Ce produit a peut-être été retiré ou n’est plus disponible."
          action={
            <Link className="product-detail-page__secondary-action" to="/catalog">
              Retour au catalogue
            </Link>
          }
        />
      )}

      {!isLoading && !errorMessage && product && (
        <div className="product-detail-page__layout">
          <main className="product-detail-page__main">
            <article className="product-detail-card product-detail-hero">
              <div className="product-detail-hero__media">
                <ProductImage
                  product={product}
                  alt={`Aperçu du produit ${product.name}`}
                  fetchPriority="high"
                  loading="eager"
                  priority
                />

                <span
                  className={[
                    "product-detail-hero__status",
                    productIsAvailable
                      ? ""
                      : "product-detail-hero__status--inactive",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <ProductIcon name={productIsAvailable ? "check" : "box"} />
                  {productIsAvailable
                    ? "Produit disponible"
                    : "Produit indisponible"}
                </span>
              </div>

              <div className="product-detail-hero__content">
                <div className="product-detail-hero__topline">
                  <span className="product-detail-hero__category">
                    {category?.name || "Produit fournisseur"}
                  </span>
                  <span className="product-detail-hero__reference">
                    Réf. {String(product.id).slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <h2>{product.name}</h2>

                <p className="product-detail-hero__supplier-name">
                  Proposé par{" "}
                  <strong>{supplier?.companyName || "un fournisseur KERNO"}</strong>
                </p>

                <p className="product-detail-hero__description">
                  {product.description ||
                    "Le fournisseur n’a pas encore ajouté de description détaillée pour ce produit."}
                </p>

                <div className="product-detail-hero__price">
                  <small>Information tarifaire</small>
                  <strong>{formatProductPrice(product)}</strong>
                  <span>Conditions professionnelles communiquées par le fournisseur</span>
                </div>

                <dl className="product-detail-hero__facts">
                  <div>
                    <dt>
                      <ProductIcon name="map" />
                      Provenance
                    </dt>
                    <dd>{product.origin || "À préciser"}</dd>
                  </div>
                  <div>
                    <dt>
                      <ProductIcon name="box" />
                      Volume minimum
                    </dt>
                    <dd>{formatMinimumOrder(product)}</dd>
                  </div>
                  <div>
                    <dt>
                      <ProductIcon
                        name={productIsAvailable ? "check" : "box"}
                      />
                      Disponibilité
                    </dt>
                    <dd>
                      {productIsAvailable ? "Disponible" : "Indisponible"}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          </main>

          <aside className="product-detail-page__side">
            <section className="product-detail-card product-detail-supplier">
              <div className="product-detail-section-heading">
                <div>
                  <h2>Qui propose ce produit ?</h2>
                </div>
              </div>

              {supplier ? (
                <>
                  <div className="product-detail-supplier__identity">
                    <span className="product-detail-supplier__mark">
                      <ProductIcon name="building" />
                    </span>
                    <div>
                      <small>Fournisseur KERNO</small>
                      <strong>{supplier.companyName}</strong>
                      <span>{supplier.businessType || "Activité à préciser"}</span>
                    </div>
                  </div>

                  {supplier.description && (
                    <p className="product-detail-supplier__description">
                      {supplier.description}
                    </p>
                  )}

                  <dl className="product-detail-supplier__details">
                    <div>
                      <dt>
                        <ProductIcon name="map" />
                        Localisation
                      </dt>
                      <dd>{supplier.location || "À préciser"}</dd>
                    </div>

                    {supplier.contactEmail && (
                      <div>
                        <dt>
                          <ProductIcon name="mail" />
                          Email
                        </dt>
                        <dd>
                          <a href={`mailto:${supplier.contactEmail}`}>
                            {supplier.contactEmail}
                          </a>
                        </dd>
                      </div>
                    )}

                    {supplier.phone && (
                      <div>
                        <dt>
                          <ProductIcon name="phone" />
                          Téléphone
                        </dt>
                        <dd>
                          <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
                        </dd>
                      </div>
                    )}

                    {websiteHref && (
                      <div>
                        <dt>
                          <ProductIcon name="globe" />
                          Site web
                        </dt>
                        <dd>
                          <a
                            href={websiteHref}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {supplier.website}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="product-detail-supplier__actions">
                    {canContactSupplier && (
                      <Link
                        className="product-detail-page__secondary-action"
                        to={`/suppliers/${supplier.id}`}
                      >
                        Voir le profil fournisseur
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <p className="product-detail-supplier__empty">
                  Les informations du fournisseur ne sont pas disponibles.
                </p>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
