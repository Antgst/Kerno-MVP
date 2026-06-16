import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/ui/LoadingState";
import { getSentRequests } from "../../services/requestService";
import { getCurrentStoreProfile } from "../../services/storeService";
import { getSuppliers } from "../../services/supplierService";
import brewerySupplierImage from "../../assets/store-dashboard/store-supplier-brewery.webp";
import cheeseSupplierImage from "../../assets/store-dashboard/store-supplier-cheese.webp";
import farmSupplierImage from "../../assets/store-dashboard/store-supplier-farm.webp";
import provenceSupplierImage from "../../assets/store-dashboard/store-supplier-provence.webp";
import { getListResource, getResource } from "../../utils/responseUtils";

const STORE_DASHBOARD_FALLBACK = {
  storeName: "Épicerie Martin",
  profileCompletion: 60,
  stats: {
    savedSuppliers: 8,
    savedSuppliersTrend: "+2 ce mois-ci",
    sentRequests: 12,
    pendingRequests: 3,
    viewedProducts: 47,
    recommendedSuppliers: 5,
  },
};

const RECENT_REQUESTS_FALLBACK = [
  {
    id: "fallback-honey",
    subject: "Miel artisanal",
    supplierName: "Ferme des Trois Vallées",
    status: "REPLIED",
    createdAt: "2025-06-12T10:00:00.000Z",
  },
  {
    id: "fallback-beer",
    subject: "Bière blonde locale",
    supplierName: "Brasserie du Nord",
    status: "PENDING",
    createdAt: "2025-06-10T10:00:00.000Z",
  },
  {
    id: "fallback-cheese",
    subject: "Fromage fermier",
    supplierName: "Maison Dupont",
    status: "PENDING",
    createdAt: "2025-06-08T10:00:00.000Z",
  },
];

const RECOMMENDED_SUPPLIERS_FALLBACK = [
  {
    id: "fallback-farm",
    companyName: "Ferme des Trois Vallées",
    location: "Normandie",
    businessType: "Produits fermiers",
    productCount: 14,
    rating: "4.8",
    visual: "farm",
  },
  {
    id: "fallback-brewery",
    companyName: "Brasserie du Nord",
    location: "Hauts-de-France",
    businessType: "Boissons artisanales",
    productCount: 8,
    rating: "4.6",
    visual: "brewery",
  },
  {
    id: "fallback-cheese",
    companyName: "Maison Dupont",
    location: "Normandie",
    businessType: "Fromages & Laitages",
    productCount: 22,
    rating: "4.9",
    visual: "cheese",
  },
  {
    id: "fallback-provence",
    companyName: "Jardins de Provence",
    location: "Provence",
    businessType: "Herbes & Épices",
    productCount: 17,
    rating: "4.7",
    visual: "provence",
  },
];

const supplierVisuals = ["farm", "brewery", "cheese", "provence"];

const supplierImages = {
  farm: farmSupplierImage,
  brewery: brewerySupplierImage,
  cheese: cheeseSupplierImage,
  provence: provenceSupplierImage,
};

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
    box: (
      <svg {...commonProps}>
        <path d="m21 16-9 5-9-5" />
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M12 13v8" />
      </svg>
    ),
    eye: (
      <svg {...commonProps}>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    building: (
      <svg {...commonProps}>
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9h1" />
        <path d="M9 13h1" />
        <path d="M9 17h1" />
        <path d="M16 15h1" />
        <path d="M16 18h1" />
      </svg>
    ),
    leaf: (
      <svg {...commonProps}>
        <path d="M20 4c-6.6.4-11.4 3.1-14.2 8.2-1.7 3.1-.2 6.9 3.2 7.8 3.8 1 7.2-1.5 8.5-5.3C18.4 12 18.8 8.1 20 4Z" />
        <path d="M8 16c2.2-2.9 5-5.1 8.5-6.6" />
      </svg>
    ),
    mail: (
      <svg {...commonProps}>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    map: (
      <svg {...commonProps}>
        <path d="M20 10c0 4.8-8 11-8 11s-8-6.2-8-11a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    package: (
      <svg {...commonProps}>
        <path d="m21 16-9 5-9-5" />
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      </svg>
    ),
    plus: (
      <svg {...commonProps}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
    search: (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    star: (
      <svg {...commonProps}>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </svg>
    ),
    tag: (
      <svg {...commonProps}>
        <path d="M20.6 13.2 13.2 20.6a2 2 0 0 1-2.8 0L3 13.2V3h10.2l7.4 7.4a2 2 0 0 1 0 2.8Z" />
        <circle cx="8" cy="8" r="1.3" />
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

function getRequestsFromResponse(response) {
  return getListResource(response, ["requests", "contactRequests"]);
}

function getSuppliersFromResponse(response) {
  return getListResource(response, ["suppliers"]);
}

function getCompletionPercent(profile) {
  if (!profile) {
    return STORE_DASHBOARD_FALLBACK.profileCompletion;
  }

  const fields = [
    profile.storeName,
    profile.brandName,
    profile.location,
    profile.storeType,
    profile.sourcingNeeds,
    profile.contactEmail,
    profile.phone,
  ];

  const completedFields = fields.filter(Boolean).length;

  return Math.round((completedFields / fields.length) * 100);
}

function getSupplierName(request) {
  return request?.supplier?.companyName || request?.supplierName || "Fournisseur";
}

function getRequestTitle(request) {
  return request?.subject || request?.product?.name || "Demande fournisseur";
}

function getStatusLabel(status) {
  const normalizedStatus = String(status || "").toUpperCase();

  if (normalizedStatus === "PENDING") {
    return "En attente";
  }

  if (normalizedStatus === "ACCEPTED" || normalizedStatus === "REPLIED") {
    return "Répondu";
  }

  if (normalizedStatus === "REJECTED") {
    return "Refusé";
  }

  return normalizedStatus || "Brouillon";
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

function getSupplierProductCount(supplier, fallback) {
  if (Array.isArray(supplier.products)) {
    return supplier.products.length;
  }

  if (supplier.productCount !== undefined) {
    return supplier.productCount;
  }

  return fallback.productCount;
}

function getLoadedSupplierProductCount(suppliers) {
  return suppliers.reduce((total, supplier) => {
    if (Array.isArray(supplier.products)) {
      return total + supplier.products.length;
    }

    if (Number.isFinite(Number(supplier.productCount))) {
      return total + Number(supplier.productCount);
    }

    return total;
  }, 0);
}

function StoreDashboardPage() {
  const [storeProfile, setStoreProfile] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadDashboard() {
      setIsLoading(true);

      try {
        const [profileResult, requestsResult, suppliersResult] =
          await Promise.allSettled([
            getCurrentStoreProfile(),
            getSentRequests(),
            getSuppliers(),
          ]);

        if (!shouldUpdateState) {
          return;
        }

        const profile =
          profileResult.status === "fulfilled"
            ? getResource(profileResult.value, ["store"])
            : null;

        const loadedRequests =
          requestsResult.status === "fulfilled"
            ? getRequestsFromResponse(requestsResult.value)
            : [];

        const loadedSuppliers =
          suppliersResult.status === "fulfilled"
            ? getSuppliersFromResponse(suppliersResult.value)
            : [];

        setStoreProfile(profile);
        setSentRequests(loadedRequests);
        setSuppliers(loadedSuppliers);
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        console.error("Store dashboard loading error:", error);

        setStoreProfile(null);
        setSentRequests([]);
        setSuppliers([]);
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

  const pendingRequests = useMemo(
    () =>
      sentRequests.filter(
        (request) => String(request.status || "").toUpperCase() === "PENDING",
      ),
    [sentRequests],
  );

  const recentRequests = sentRequests.length
    ? sentRequests.slice(0, 3)
    : RECENT_REQUESTS_FALLBACK;

  const recommendedSuppliers = useMemo(() => {
    const connectedSuppliers = suppliers.slice(0, 4).map((supplier, index) => {
      const fallback = RECOMMENDED_SUPPLIERS_FALLBACK[index];

      return {
        ...fallback,
        ...supplier,
        companyName: supplier.companyName || fallback.companyName,
        location: supplier.location || fallback.location,
        businessType: supplier.businessType || fallback.businessType,
        productCount: getSupplierProductCount(supplier, fallback),
        rating: supplier.rating || fallback.rating,
        visual: supplierVisuals[index % supplierVisuals.length],
      };
    });

    return [
      ...connectedSuppliers,
      ...RECOMMENDED_SUPPLIERS_FALLBACK.slice(connectedSuppliers.length),
    ].slice(0, 4);
  }, [suppliers]);

  if (isLoading) {
    return <LoadingState message="Chargement du tableau de bord magasin..." />;
  }

  const storeDisplayName =
    storeProfile?.storeName ||
    storeProfile?.brandName ||
    STORE_DASHBOARD_FALLBACK.storeName;
  const completionPercent = getCompletionPercent(storeProfile);
  const sentRequestCount =
    sentRequests.length || STORE_DASHBOARD_FALLBACK.stats.sentRequests;
  const pendingRequestCount = sentRequests.length
    ? pendingRequests.length
    : STORE_DASHBOARD_FALLBACK.stats.pendingRequests;
  const loadedSupplierProductCount = getLoadedSupplierProductCount(suppliers);
  const savedSupplierCount =
    suppliers.length || STORE_DASHBOARD_FALLBACK.stats.savedSuppliers;
  const viewedProductCount =
    loadedSupplierProductCount || STORE_DASHBOARD_FALLBACK.stats.viewedProducts;
  const recommendedSupplierCount =
    suppliers.length || STORE_DASHBOARD_FALLBACK.stats.recommendedSuppliers;

  const stats = [
    {
      icon: "building",
      value: savedSupplierCount,
      label: "Fournisseurs sauvegardés",
      helper: STORE_DASHBOARD_FALLBACK.stats.savedSuppliersTrend,
    },
    {
      icon: "mail",
      value: sentRequestCount,
      label: "Demandes envoyées",
      helper: `${pendingRequestCount} en attente`,
    },
    {
      icon: "eye",
      value: viewedProductCount,
      label: "Produits consultés",
      helper: "Cette semaine",
    },
    {
      icon: "star",
      value: recommendedSupplierCount,
      label: "Fournisseurs recommandés",
      helper: "Pour votre profil",
      featured: true,
    },
  ];

  return (
    <div className="store-dashboard">
      <section className="store-dashboard__intro" aria-labelledby="store-dashboard-title">
        <div>
          <p className="store-dashboard__hello">Bonjour,</p>
          <h1 id="store-dashboard-title">{storeDisplayName}</h1>
          <p className="store-dashboard__subtitle">
            Voici un aperçu de votre activité.
          </p>
        </div>

        <Link className="store-dashboard__primary-cta" to="/catalog">
          <DashboardIcon name="search" />
          <span>Explorer le catalogue</span>
        </Link>
      </section>

      <section className="store-dashboard__stats" aria-label="Indicateurs magasin">
        {stats.map((stat) => (
          <article className="store-dashboard__stat-card" key={stat.label}>
            <span
              className={[
                "store-dashboard__stat-icon",
                stat.featured ? "store-dashboard__stat-icon--featured" : "",
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

      <section className="store-dashboard__work-grid">
        <article className="store-dashboard__panel store-dashboard__recent">
          <div className="store-dashboard__panel-header store-dashboard__panel-header--inline">
            <h2>Demandes récentes</h2>
            <Link to="/store/requests">Voir tout</Link>
          </div>

          <div className="store-dashboard__request-list">
            {recentRequests.map((request) => (
              <Link
                className="store-dashboard__request-row"
                key={request.id}
                to={
                  request.id && !String(request.id).startsWith("fallback")
                    ? `/store/requests/${request.id}`
                    : "/store/requests"
                }
              >
                <span className="store-dashboard__request-icon">
                  <DashboardIcon name="mail" />
                </span>

                <span className="store-dashboard__request-copy">
                  <strong>{getRequestTitle(request)}</strong>
                  <small>{getSupplierName(request)}</small>
                </span>

                <span className="store-dashboard__request-date">
                  {formatFrenchDate(request.createdAt || request.updatedAt)}
                </span>

                <span
                  className={`store-dashboard__status store-dashboard__status--${getStatusTone(request.status)}`}
                >
                  {getStatusLabel(request.status)}
                </span>
              </Link>
            ))}
          </div>

          <Link className="store-dashboard__new-request" to="/requests/new">
            <DashboardIcon name="plus" />
            <span>Nouvelle demande</span>
          </Link>
        </article>

        <aside className="store-dashboard__side-stack" aria-label="Actions du magasin">
          <article className="store-dashboard__panel store-dashboard__actions">
            <h2>Actions rapides</h2>

            <div className="store-dashboard__quick-actions">
              <Link className="store-dashboard__quick-action store-dashboard__quick-action--primary" to="/catalog">
                <DashboardIcon name="search" />
                <span>Parcourir le catalogue</span>
              </Link>

              <Link className="store-dashboard__quick-action store-dashboard__quick-action--soft" to="/catalog">
                <DashboardIcon name="building" />
                <span>Trouver un fournisseur</span>
              </Link>

              <Link className="store-dashboard__quick-action" to="/store/profile">
                <DashboardIcon name="user" />
                <span>Mon profil</span>
              </Link>

              <Link className="store-dashboard__quick-action" to="/store/requests">
                <DashboardIcon name="mail" />
                <span>Mes demandes</span>
                <strong>{pendingRequestCount}</strong>
              </Link>
            </div>
          </article>

          <article className="store-dashboard__profile-card">
            <div className="store-dashboard__profile-content">
              <div className="store-dashboard__profile-copy">
                <h2>Complétez votre profil</h2>
                <p>Un profil complet améliore vos échanges avec les fournisseurs.</p>
              </div>

              <div
                className="store-dashboard__profile-gauge"
                style={{ "--progress": completionPercent }}
                aria-label={`Profil complété à ${completionPercent}%`}
              >
                <strong>{completionPercent}%</strong>
              </div>
            </div>

            <Link to="/store/profile">Compléter maintenant</Link>
          </article>
        </aside>
      </section>

      <section className="store-dashboard__recommended" aria-labelledby="recommended-suppliers-title">
        <div className="store-dashboard__section-header">
          <h2 id="recommended-suppliers-title">Fournisseurs recommandés</h2>
          <Link to="/catalog">Voir tous les fournisseurs</Link>
        </div>

        <div className="store-dashboard__supplier-grid">
          {recommendedSuppliers.map((supplier) => {
            const isFallback = String(supplier.id).startsWith("fallback");
            const supplierPath = isFallback ? "/catalog" : `/suppliers/${supplier.id}`;
            const supplierImage =
              supplierImages[supplier.visual] || supplierImages.farm;

            return (
              <article className="store-dashboard__supplier-card" key={supplier.id}>
                <div
                  className={`store-dashboard__supplier-visual store-dashboard__supplier-visual--${supplier.visual}`}
                >
                  <img
                    className="store-dashboard__supplier-image"
                    src={supplierImage}
                    alt={`Aperçu du fournisseur ${supplier.companyName}`}
                    loading="lazy"
                  />

                  <span>
                    <DashboardIcon name="leaf" />
                  </span>
                </div>

                <div className="store-dashboard__supplier-body">
                  <h3>{supplier.companyName}</h3>

                  <div className="store-dashboard__supplier-meta">
                    <span>
                      <DashboardIcon name="map" />
                      {supplier.location || "France"}
                    </span>

                    <span>
                      <DashboardIcon name="tag" />
                      {supplier.businessType || "Fournisseur local"}
                    </span>
                  </div>

                  <div className="store-dashboard__supplier-footer">
                    <span>
                      <DashboardIcon name="package" />
                      {supplier.productCount} produits
                    </span>

                    <span>
                      <DashboardIcon name="star" />
                      {supplier.rating}
                    </span>
                  </div>

                  <Link to={supplierPath}>Voir le fournisseur</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default StoreDashboardPage;
