import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/ui/LoadingState";
import { getProducts } from "../../services/productService";
import { getReceivedRequests } from "../../services/requestService";
import { getCurrentSupplierProfile } from "../../services/supplierService";
import { getListResource, getResource } from "../../utils/responseUtils";
import appleJuiceImage from "../../assets/supplier-dashboard/supplier-product-apple-juice.webp";
import buckwheatBiscuitsImage from "../../assets/supplier-dashboard/supplier-product-buckwheat-biscuits.webp";
import honeyImage from "../../assets/supplier-dashboard/supplier-product-honey.webp";
import jamImage from "../../assets/supplier-dashboard/supplier-product-jam.webp";

const productImages = {
  honey: honeyImage,
  jam: jamImage,
  appleJuice: appleJuiceImage,
  buckwheatBiscuits: buckwheatBiscuitsImage,
};

const SUPPLIER_DASHBOARD_FALLBACK = {
  supplierName: "Ferme des Trois Vallées",
  profileCompletion: 64,
  stats: {
    publishedProducts: 18,
    receivedRequests: 12,
    pendingRequests: 4,
    catalogViews: 148,
  },
};

const RECEIVED_REQUESTS_FALLBACK = [
  {
    id: "fallback-request-honey",
    storeName: "Épicerie Martin",
    subject: "Réassort miel de printemps",
    productName: "Miel de fleurs sauvages",
    status: "PENDING",
    createdAt: "2026-06-12T10:00:00.000Z",
  },
  {
    id: "fallback-request-jam",
    storeName: "Maison Locale",
    subject: "Tarif confitures artisanales",
    productName: "Confiture fraise rhubarbe",
    status: "ANSWERED",
    createdAt: "2026-06-10T10:00:00.000Z",
  },
  {
    id: "fallback-request-cider",
    storeName: "Comptoir Bio Rennes",
    subject: "Disponibilité boisson fermière",
    productName: "Jus de pomme fermier",
    status: "READ",
    createdAt: "2026-06-08T10:00:00.000Z",
  },
];

const FEATURED_PRODUCTS_FALLBACK = [
  {
    id: "fallback-product-honey",
    name: "Miel de fleurs sauvages",
    categoryName: "Épicerie sucrée",
    priceInfo: "8,90 €",
    availability: "Disponible",
    views: 42,
    visualKey: "honey",
    imageUrl: productImages.honey,
    isFallback: true,
  },
  {
    id: "fallback-product-jam",
    name: "Confiture fraise rhubarbe",
    categoryName: "Confitures",
    priceInfo: "5,40 €",
    availability: "Disponible",
    views: 36,
    visualKey: "jam",
    imageUrl: productImages.jam,
    isFallback: true,
  },
  {
    id: "fallback-product-cider",
    name: "Jus de pomme fermier",
    categoryName: "Boissons",
    priceInfo: "3,80 €",
    availability: "Stock limité",
    views: 31,
    visualKey: "appleJuice",
    imageUrl: productImages.appleJuice,
    isFallback: true,
  },
  {
    id: "fallback-product-biscuits",
    name: "Biscuits au sarrasin",
    categoryName: "Biscuits",
    priceInfo: "4,20 €",
    availability: "Disponible",
    views: 26,
    visualKey: "buckwheatBiscuits",
    imageUrl: productImages.buckwheatBiscuits,
    isFallback: true,
  },
];

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
    return SUPPLIER_DASHBOARD_FALLBACK.profileCompletion;
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

function getProductViews(product) {
  const views = product?.catalogViews ?? product?.viewCount ?? product?.views;
  return Number.isFinite(Number(views)) ? Number(views) : null;
}

function getProductPrice(product) {
  if (product?.priceInfo) {
    return product.priceInfo;
  }

  if (Number.isFinite(Number(product?.price))) {
    return `${Number(product.price).toLocaleString("fr-FR")} €`;
  }

  return "Prix sur demande";
}

function getCatalogViewCount(products) {
  const knownViews = products
    .map((product) => getProductViews(product))
    .filter((views) => views !== null);

  if (knownViews.length) {
    return knownViews.reduce((total, views) => total + views, 0);
  }

  return SUPPLIER_DASHBOARD_FALLBACK.stats.catalogViews;
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

function getStatusLabel(status) {
  const normalizedStatus = String(status || "").toUpperCase();

  if (normalizedStatus === "PENDING") {
    return "En attente";
  }

  if (["ANSWERED", "ACCEPTED", "REPLIED"].includes(normalizedStatus)) {
    return "Répondu";
  }

  if (normalizedStatus === "READ") {
    return "Lu";
  }

  if (normalizedStatus === "CLOSED") {
    return "Clôturé";
  }

  if (normalizedStatus === "REJECTED") {
    return "Refusé";
  }

  return normalizedStatus || "Nouveau";
}

function getStatusTone(status) {
  const normalizedStatus = String(status || "").toUpperCase();

  if (normalizedStatus === "PENDING") {
    return "pending";
  }

  if (normalizedStatus === "REJECTED") {
    return "rejected";
  }

  return "answered";
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

function getProductCard(product, index) {
  const fallbackProduct = FEATURED_PRODUCTS_FALLBACK[index];

  return {
    ...product,
    categoryName: getProductCategory(product),
    priceInfo: getProductPrice(product),
    availability:
      product.availability ||
      product.minimumOrder ||
      (isProductPublished(product) ? "Disponible" : "Masqué"),
    views: getProductViews(product) ?? fallbackProduct?.views,
    visualKey: fallbackProduct?.visualKey,
    imageUrl: product.imageUrl || fallbackProduct?.imageUrl,
    isFallback: false,
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
          loadedProducts.filter(
            (product) =>
              !profile?.id || getProductSupplierId(product) === profile.id,
          ),
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

  const recentRequests = requests.length
    ? requests.slice(0, 3)
    : RECEIVED_REQUESTS_FALLBACK;

  const featuredProducts = useMemo(() => {
    const connectedProducts = publishedProducts.slice(0, 4).map(getProductCard);

    return [
      ...connectedProducts,
      ...FEATURED_PRODUCTS_FALLBACK.slice(connectedProducts.length),
    ].slice(0, 4);
  }, [publishedProducts]);

  if (isLoading) {
    return <LoadingState message="Chargement du tableau de bord fournisseur..." />;
  }

  const supplierDisplayName =
    supplierProfile?.companyName ||
    supplierProfile?.supplierName ||
    SUPPLIER_DASHBOARD_FALLBACK.supplierName;
  const completionPercent = getCompletionPercent(supplierProfile);
  const publishedProductCount =
    products.length
      ? publishedProducts.length
      : SUPPLIER_DASHBOARD_FALLBACK.stats.publishedProducts;
  const receivedRequestCount =
    requests.length || SUPPLIER_DASHBOARD_FALLBACK.stats.receivedRequests;
  const pendingRequestCount =
    requests.length
      ? pendingRequests.length
      : SUPPLIER_DASHBOARD_FALLBACK.stats.pendingRequests;
  const catalogViewCount = products.length
    ? getCatalogViewCount(products)
    : SUPPLIER_DASHBOARD_FALLBACK.stats.catalogViews;

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
      icon: "eye",
      value: catalogViewCount,
      label: "Vues catalogue",
      helper: "Activité produit",
      featured: true,
    },
  ];

  const quickActions = [
    {
      icon: "plus",
      label: "Ajouter un produit",
      to: "/supplier/products/new",
      variant: "primary",
    },
    {
      icon: "stack",
      label: "Gérer mes produits",
      to: "/supplier/products",
      variant: "soft",
    },
    { icon: "user", label: "Mon profil", to: "/supplier/profile" },
    {
      icon: "mail",
      label: "Demandes reçues",
      to: "/supplier/requests",
      count: pendingRequestCount,
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
            {recentRequests.map((request) => {
              const isFallback = String(request.id).startsWith("fallback");

              return (
                <Link
                  className="supplier-dashboard__request-row"
                  key={request.id}
                  to={
                    isFallback
                      ? "/supplier/requests"
                      : `/supplier/requests/${request.id}`
                  }
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
                    {getStatusLabel(request.status)}
                  </span>
                </Link>
              );
            })}
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
                <h2>Complétez votre profil fournisseur</h2>
                <p>
                  Un profil complet améliore votre visibilité auprès des magasins.
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

            <Link to="/supplier/profile">Compléter maintenant</Link>
          </article>
        </aside>
      </section>

      <section
        className="supplier-dashboard__featured"
        aria-labelledby="featured-products-title"
      >
        <div className="supplier-dashboard__section-header">
          <h2 id="featured-products-title">Produits les plus consultés</h2>
          <Link to="/supplier/products">Voir tous les produits</Link>
        </div>

        <div className="supplier-dashboard__product-grid">
          {featuredProducts.map((product) => {
            const productPath = product.isFallback
              ? "/supplier/products"
              : `/supplier/products/${product.id}/edit`;

            return (
              <article className="supplier-dashboard__product-card" key={product.id}>
                <div className="supplier-dashboard__product-visual">
                  <img
                    className="supplier-dashboard__product-image"
                    src={product.imageUrl}
                    alt={`Aperçu du produit ${product.name}`}
                    loading="lazy"
                  />
                </div>

                <div className="supplier-dashboard__product-body">
                  <p>{product.categoryName}</p>
                  <h3>{product.name}</h3>

                  <div className="supplier-dashboard__product-meta">
                    <span>{product.priceInfo}</span>
                    <span>{product.availability}</span>
                  </div>

                  <div className="supplier-dashboard__product-footer">
                    <span>
                      <DashboardIcon name="eye" />
                      {product.views} vues
                    </span>

                    <Link to={productPath}>
                      {product.isFallback ? "Voir le produit" : "Gérer"}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default SupplierDashboardPage;
