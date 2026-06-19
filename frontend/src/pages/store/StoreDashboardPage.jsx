import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingState from "../../components/ui/LoadingState";
import { getProducts } from "../../services/productService";
import { getSentRequests } from "../../services/requestService";
import { getCurrentStoreProfile } from "../../services/storeService";
import { getSuppliers } from "../../services/supplierService";
import brewerySupplierImage from "../../assets/store-dashboard/store-supplier-brewery.webp";
import cheeseSupplierImage from "../../assets/store-dashboard/store-supplier-cheese.webp";
import farmSupplierImage from "../../assets/store-dashboard/store-supplier-farm.webp";
import provenceSupplierImage from "../../assets/store-dashboard/store-supplier-provence.webp";
import { getListResource, getResource } from "../../utils/responseUtils";
import { formatStatus, getStatusTone } from "../../utils/status";

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
    return 0;
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

function getProductSupplierId(product) {
  return product?.supplierId || product?.supplier?.id;
}

function getSupplierProductCount(supplier, productCounts, productsAreLoaded) {
  if (productsAreLoaded) {
    const idKey = supplier?.id ? `id:${supplier.id}` : "";
    const nameKey = supplier?.companyName
      ? `name:${supplier.companyName.toLocaleLowerCase("fr-FR")}`
      : "";

    if (idKey && productCounts.has(idKey)) {
      return productCounts.get(idKey);
    }

    if (nameKey && productCounts.has(nameKey)) {
      return productCounts.get(nameKey);
    }

    return null;
  }

  if (Array.isArray(supplier.products)) {
    return supplier.products.length;
  }

  const explicitCount = supplier.productCount ?? supplier.productsCount;

  if (Number.isFinite(Number(explicitCount)) && Number(explicitCount) > 0) {
    return Number(explicitCount);
  }

  return null;
}

function StoreDashboardPage() {
  const [storeProfile, setStoreProfile] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsAreLoaded, setProductsAreLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadDashboard() {
      setIsLoading(true);

      try {
        const [profileResult, requestsResult, suppliersResult, productsResult] =
          await Promise.allSettled([
            getCurrentStoreProfile(),
            getSentRequests(),
            getSuppliers(),
            getProducts(),
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
        const loadedProducts =
          productsResult.status === "fulfilled"
            ? getListResource(productsResult.value, ["products"])
            : [];

        setStoreProfile(profile);
        setSentRequests(loadedRequests);
        setSuppliers(loadedSuppliers);
        setProducts(loadedProducts);
        setProductsAreLoaded(productsResult.status === "fulfilled");
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        console.error("Store dashboard loading error:", error);

        setStoreProfile(null);
        setSentRequests([]);
        setSuppliers([]);
        setProducts([]);
        setProductsAreLoaded(false);
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

  const recentRequests = sentRequests.slice(0, 3);

  const productCountsBySupplier = useMemo(() => {
    const counts = new Map();

    products.forEach((product) => {
      const supplierId = getProductSupplierId(product);
      const supplierName =
        product?.supplier?.companyName || product?.supplierName;

      if (supplierId) {
        const key = `id:${supplierId}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }

      if (supplierName) {
        const key = `name:${supplierName.toLocaleLowerCase("fr-FR")}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    });

    return counts;
  }, [products]);

  const recommendedSuppliers = useMemo(
    () =>
      suppliers.slice(0, 4).map((supplier, index) => ({
        ...supplier,
        companyName: supplier.companyName || "Fournisseur",
        location: supplier.location || "France",
        businessType: supplier.businessType || "Fournisseur local",
        productCount: getSupplierProductCount(
          supplier,
          productCountsBySupplier,
          productsAreLoaded,
        ),
        visual: supplierVisuals[index % supplierVisuals.length],
      })),
    [productCountsBySupplier, productsAreLoaded, suppliers],
  );

  if (isLoading) {
    return <LoadingState message="Chargement du tableau de bord magasin..." />;
  }

  const storeDisplayName =
    storeProfile?.storeName ||
    storeProfile?.brandName ||
    "Profil à compléter";
  const completionPercent = getCompletionPercent(storeProfile);
  const sentRequestCount = sentRequests.length;
  const pendingRequestCount = pendingRequests.length;
  const recommendedSupplierCount = suppliers.length;
  const profileIsComplete = completionPercent === 100;

  const stats = [
    {
      icon: "building",
      value: recommendedSupplierCount,
      label: "Fournisseurs disponibles",
      helper: "Dans le catalogue",
    },
    {
      icon: "mail",
      value: sentRequestCount,
      label: "Demandes envoyées",
      helper: `${pendingRequestCount} en attente`,
    },
    {
      icon: "eye",
      value: pendingRequestCount,
      label: "Demandes en attente",
      helper: "À suivre",
    },
    {
      icon: "star",
      value: `${completionPercent}%`,
      label: "Profil complété",
      helper: profileIsComplete ? "Prêt à être utilisé" : "À finaliser",
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
            {recentRequests.length ? (
              recentRequests.map((request) => (
                <Link
                  className="store-dashboard__request-row"
                  key={request.id}
                  to={`/store/requests/${request.id}`}
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
                  {formatStatus(request.status)}
                </span>
                </Link>
              ))
            ) : (
              <div className="store-dashboard__request-empty">
                <span className="store-dashboard__request-icon">
                  <DashboardIcon name="mail" />
                </span>
                <div>
                  <strong>Aucune demande récente</strong>
                  <p>Créez une demande pour commencer un échange fournisseur.</p>
                </div>
              </div>
            )}
          </div>

        </article>

        <aside className="store-dashboard__side-stack" aria-label="Actions du magasin">
          <article className="store-dashboard__panel store-dashboard__actions">
            <h2>Actions rapides</h2>

            <div className="store-dashboard__quick-actions">
              <Link className="store-dashboard__quick-action" to="/store/profile">
                <DashboardIcon name="user" />
                <span>Modifier mon profil</span>
              </Link>

              <Link className="store-dashboard__quick-action" to="/store/requests">
                <DashboardIcon name="mail" />
                <span>Voir mes demandes</span>
                <strong>{pendingRequestCount}</strong>
              </Link>
            </div>
          </article>

          <article className="store-dashboard__profile-card">
            <div className="store-dashboard__profile-content">
              <div className="store-dashboard__profile-copy">
                <h2>{profileIsComplete ? "Profil complet" : "Complétez votre profil"}</h2>
                <p>
                  {profileIsComplete
                    ? "Gérez les informations visibles par les fournisseurs lorsqu’ils consultent vos demandes."
                    : "Ajoutez les informations manquantes pour renforcer votre crédibilité."}
                </p>
              </div>

              <div
                className="store-dashboard__profile-gauge"
                style={{ "--progress": completionPercent }}
                aria-label={`Profil complété à ${completionPercent}%`}
              >
                <strong>{completionPercent}%</strong>
              </div>
            </div>

            <Link to="/store/profile">
              {profileIsComplete ? "Modifier le profil" : "Compléter maintenant"}
            </Link>
          </article>
        </aside>
      </section>

      <section className="store-dashboard__recommended" aria-labelledby="recommended-suppliers-title">
        <div className="store-dashboard__section-header">
          <h2 id="recommended-suppliers-title">Fournisseurs recommandés</h2>
          <Link to="/catalog">Découvrir les fournisseurs</Link>
        </div>

        <div className="store-dashboard__supplier-grid">
          {recommendedSuppliers.length ? (
            recommendedSuppliers.map((supplier) => {
              const supplierPath = `/suppliers/${supplier.id}`;
              const supplierImage =
                supplierImages[supplier.visual] || supplierImages.farm;

              return (
                <article
                  className="store-dashboard__supplier-card"
                  key={supplier.id}
                >
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
                        {supplier.location}
                      </span>

                      <span>
                        <DashboardIcon name="tag" />
                        {supplier.businessType}
                      </span>
                    </div>

                    {(supplier.productCount !== null || supplier.rating) && (
                      <div className="store-dashboard__supplier-footer">
                        {supplier.productCount !== null && (
                          <span>
                            <DashboardIcon name="package" />
                            {supplier.productCount} produit
                            {supplier.productCount > 1 ? "s" : ""}
                          </span>
                        )}

                        {supplier.rating && (
                          <span>
                            <DashboardIcon name="star" />
                            {supplier.rating}
                          </span>
                        )}
                      </div>
                    )}

                    <Link to={supplierPath}>Voir le fournisseur</Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="store-dashboard__recommended-empty">
              <DashboardIcon name="building" />
              <div>
                <strong>Aucun fournisseur recommandé</strong>
                <p>
                  Les fournisseurs correspondant à votre profil apparaîtront
                  ici.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StoreDashboardPage;
