import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/ui/LoadingState";
import { getProducts } from "../../services/productService";
import { getReceivedRequests } from "../../services/requestService";
import { getCurrentSupplierProfile } from "../../services/supplierService";
import { getListResource, getResource } from "../../utils/responseUtils";
import ProductImage from "../../components/ui/ProductImage";
import { formatStatus, getStatusTone } from "../../utils/status";
import { formatMinimumOrder, formatProductPrice } from "../../utils/productPrice";

function DashboardIcon({ name }) {
  const commonProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    check: (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.5 12 2.3 2.3 4.8-5" />
      </svg>
    ),
    clock: (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v5l3.5 2" />
      </svg>
    ),
    eye: (
      <svg {...commonProps}>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    mail: (
      <svg {...commonProps}>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    package: (
      <svg {...commonProps}>
        <path d="m21 16-9 5-9-5" />
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M12 13v8" />
      </svg>
    ),
    products: (
      <svg {...commonProps}>
        <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="4" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="14" width="7" height="6" rx="1.5" />
        <rect x="13.5" y="14" width="7" height="6" rx="1.5" />
      </svg>
    ),
    stack: (
      <svg {...commonProps}>
        <rect x="4" y="5" width="16" height="5" rx="1.6" />
        <rect x="4" y="12" width="16" height="7" rx="1.6" />
        <path d="M8 7.5h.01" />
        <path d="M8 15.5h.01" />
        <path d="M11 7.5h5" />
        <path d="M11 15.5h5" />
      </svg>
    ),
    plus: (
      <svg {...commonProps}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
    user: (
      <svg {...commonProps}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  return icons[name] ?? null;
}

function getCompletionPercent(profile) {
  if (!profile) {
    return 0;
  }

  const fields = [
    profile.companyName,
    profile.location,
    profile.businessType,
    profile.contactEmail,
    profile.phone,
    profile.website,
    profile.description,
  ];

  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
}

function getProductSupplierId(product) {
  return product?.supplierId || product?.supplier?.id;
}

function isProductPublished(product) {
  return (
    product?.isActive !== false &&
    String(product?.status || "ACTIVE").toUpperCase() !== "INACTIVE"
  );
}

function getProductCategory(product) {
  return (
    product?.category?.name ||
    product?.categoryName ||
    product?.category ||
    "Catégorie libre"
  );
}

function getStoreName(request) {
  return request?.store?.storeName || request?.storeName || "Magasin";
}

function getRequestTitle(request) {
  return (
    request?.subject ||
    request?.product?.name ||
    request?.productName ||
    "Demande produit"
  );
}

function getRequestProduct(request) {
  return request?.product?.name || request?.productName || "Demande générale";
}

function formatFrenchDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getProductCard(product) {
  return {
    ...product,
    categoryName: getProductCategory(product),
    priceLabel: formatProductPrice(product),
    availability:
      product.availability ||
      (product.minimumOrderQuantity ? formatMinimumOrder(product) : "") ||
      (isProductPublished(product) ? "Disponible" : "Masqué"),
  };
}

function SupplierDashboardPage() {
  const [supplierProfile, setSupplierProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadDashboard() {
      setIsLoading(true);

      try {
        const [profileResult, productsResult, requestsResult] =
          await Promise.allSettled([
            getCurrentSupplierProfile(),
            getProducts(),
            getReceivedRequests(),
          ]);

        if (!shouldUpdateState) {
          return;
        }

        const profile =
          profileResult.status === "fulfilled"
            ? getResource(profileResult.value, ["supplier"])
            : null;

        const loadedProducts =
          productsResult.status === "fulfilled"
            ? getListResource(productsResult.value, ["products"])
            : [];

        const loadedRequests =
          requestsResult.status === "fulfilled"
            ? getListResource(requestsResult.value, ["requests"])
            : [];

        setSupplierProfile(profile);
        setProducts(
          profile?.id
            ? loadedProducts.filter(
                (product) => getProductSupplierId(product) === profile.id,
              )
            : [],
        );
        setRequests(loadedRequests);
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        console.error("Supplier dashboard loading error:", error);

        setSupplierProfile(null);
        setProducts([]);
        setRequests([]);
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

  const publishedProducts = useMemo(
    () => products.filter((product) => isProductPublished(product)),
    [products],
  );

  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (request) => String(request.status || "").toUpperCase() === "PENDING",
      ),
    [requests],
  );

  const recentRequests = requests.slice(0, 3);

  const featuredProducts = useMemo(
    () => publishedProducts.slice(0, 4).map(getProductCard),
    [publishedProducts],
  );

  if (isLoading) {
    return <LoadingState message="Chargement du tableau de bord fournisseur..." />;
  }

  const supplierDisplayName =
    supplierProfile?.companyName ||
    supplierProfile?.supplierName ||
    "Profil à compléter";
  const completionPercent = getCompletionPercent(supplierProfile);
  const publishedProductCount = publishedProducts.length;
  const receivedRequestCount = requests.length;
  const pendingRequestCount = pendingRequests.length;
  const processedRequestCount = requests.filter((request) =>
    ["ANSWERED", "ACCEPTED", "REJECTED", "COMPLETED", "DONE", "RESOLVED", "CLOSED"].includes(
      String(request.status || "").toUpperCase(),
    ),
  ).length;
  const profileIsComplete = completionPercent === 100;

  const stats = [
    {
      icon: "products",
      value: publishedProductCount,
      label: "Produits publiés",
      helper: "Visibles au catalogue",
    },
    {
      icon: "mail",
      value: receivedRequestCount,
      label: "Demandes reçues",
      helper: "Depuis vos magasins",
    },
    {
      icon: "clock",
      value: pendingRequestCount,
      label: "En attente",
      helper: "À traiter",
    },
    {
      icon: "check",
      value: processedRequestCount,
      label: "Demandes traitées",
      helper: "Suivi commercial",
      featured: true,
    },
  ];

  const quickActions = [
    {
      icon: "stack",
      label: "Gérer mes produits",
      to: "/supplier/products",
      variant: "primary",
    },
    {
      icon: "mail",
      label: "Voir les demandes reçues",
      to: "/supplier/requests",
      count: pendingRequestCount,
    },
    {
      icon: "user",
      label: "Modifier mon profil",
      to: "/supplier/profile",
      variant: "soft",
    },
  ];

  return (
    <div className="supplier-dashboard">
      <section
        className="supplier-dashboard__intro"
        aria-labelledby="supplier-dashboard-title"
      >
        <div>
          <p className="supplier-dashboard__hello">Bonjour,</p>
          <h1 id="supplier-dashboard-title">{supplierDisplayName}</h1>
          <p className="supplier-dashboard__subtitle">
            Voici un aperçu de votre activité.
          </p>
        </div>

        <Link className="supplier-dashboard__primary-cta" to="/supplier/products/new">
          <DashboardIcon name="plus" />
          <span>Ajouter un produit</span>
        </Link>
      </section>

      <section className="supplier-dashboard__stats" aria-label="Indicateurs fournisseur">
        {stats.map((stat) => (
          <article className="supplier-dashboard__stat-card" key={stat.label}>
            <span
              className={[
                "supplier-dashboard__stat-icon",
                stat.featured ? "supplier-dashboard__stat-icon--featured" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <DashboardIcon name={stat.icon} />
            </span>

            <div>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
              <small>{stat.helper}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="supplier-dashboard__work-grid">
        <article className="supplier-dashboard__panel supplier-dashboard__requests">
          <div className="supplier-dashboard__panel-header supplier-dashboard__panel-header--inline">
            <h2>Demandes reçues</h2>
            <Link to="/supplier/requests">Voir tout</Link>
          </div>

          <div className="supplier-dashboard__request-list">
            {recentRequests.length ? (
              recentRequests.map((request) => (
                <Link
                  className="supplier-dashboard__request-row"
                  key={request.id}
                  to={`/supplier/requests/${request.id}`}
                >
                  <span className="supplier-dashboard__request-icon">
                    <DashboardIcon name="mail" />
                  </span>

                  <span className="supplier-dashboard__request-copy">
                    <strong>{getStoreName(request)}</strong>
                    <small>{getRequestTitle(request)}</small>
                    <em>{getRequestProduct(request)}</em>
                  </span>

                  <span className="supplier-dashboard__request-date">
                    {formatFrenchDate(request.createdAt || request.updatedAt)}
                  </span>

                  <span
                    className={`supplier-dashboard__status supplier-dashboard__status--${getStatusTone(request.status)}`}
                  >
                    {formatStatus(request.status)}
                  </span>
                </Link>
              ))
            ) : (
              <div className="supplier-dashboard__request-empty">
                <span className="supplier-dashboard__request-icon">
                  <DashboardIcon name="mail" />
                </span>
                <div>
                  <strong>Aucune demande reçue</strong>
                  <p>Les nouvelles demandes des magasins apparaîtront ici.</p>
                </div>
              </div>
            )}
          </div>
        </article>

        <aside className="supplier-dashboard__side-stack" aria-label="Actions fournisseur">
          <article className="supplier-dashboard__panel supplier-dashboard__actions">
            <h2>Actions rapides</h2>

            <div className="supplier-dashboard__quick-actions">
              {quickActions.map((action) => (
                <Link
                  className={[
                    "supplier-dashboard__quick-action",
                    action.variant
                      ? `supplier-dashboard__quick-action--${action.variant}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={action.to}
                  to={action.to}
                >
                  <DashboardIcon name={action.icon} />
                  <span>{action.label}</span>
                  {action.count !== undefined && <strong>{action.count}</strong>}
                </Link>
              ))}
            </div>
          </article>

          <article className="supplier-dashboard__profile-card">
            <div className="supplier-dashboard__profile-content">
              <div className="supplier-dashboard__profile-copy">
                <h2>
                  {profileIsComplete
                    ? "Profil complet"
                    : "Complétez votre profil"}
                </h2>
                <p>
                  {profileIsComplete
                    ? "Gérez les informations visibles par les magasins lorsqu’ils découvrent votre activité ou vos produits."
                    : "Ajoutez les informations manquantes pour renforcer votre crédibilité."}
                </p>
              </div>

              <div
                className="supplier-dashboard__profile-gauge"
                style={{ "--progress": completionPercent }}
                aria-label={`Profil fournisseur complété à ${completionPercent}%`}
              >
                <strong>{completionPercent}%</strong>
              </div>
            </div>

            <Link to="/supplier/profile">
              {profileIsComplete ? "Modifier le profil" : "Compléter maintenant"}
            </Link>
          </article>
        </aside>
      </section>

      <section
        className="supplier-dashboard__featured"
        aria-labelledby="featured-products-title"
      >
        <div className="supplier-dashboard__section-header">
          <h2 id="featured-products-title">Produits publiés</h2>
          <Link to="/supplier/products">Voir tous les produits</Link>
        </div>

        <div className="supplier-dashboard__product-grid">
          {featuredProducts.length ? (
            featuredProducts.map((product) => (
              <article className="supplier-dashboard__product-card" key={product.id}>
                <div className="supplier-dashboard__product-visual">
                  <ProductImage
                    className="supplier-dashboard__product-image"
                    product={product}
                    alt={`Aperçu du produit ${product.name}`}
                  />
                </div>

                <div className="supplier-dashboard__product-body">
                  <p>{product.categoryName}</p>
                  <h3>{product.name}</h3>

                  <div className="supplier-dashboard__product-meta">
                    <span>{product.priceLabel}</span>
                    <span>{product.availability}</span>
                  </div>

                  <div className="supplier-dashboard__product-footer">
                    <Link to={`/supplier/products/${product.id}/edit`}>Gérer</Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="supplier-dashboard__featured-empty">
              <DashboardIcon name="products" />
              <div>
                <strong>Aucun produit publié</strong>
                <p>Ajoutez un produit pour le voir apparaître dans cet aperçu.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default SupplierDashboardPage;
