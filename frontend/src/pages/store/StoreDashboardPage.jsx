import { useEffect, useMemo, useState } from "react";
import DashboardIntro from "../../components/dashboard/DashboardIntro";
import DashboardProfileCard from "../../components/dashboard/DashboardProfileCard";
import DashboardRequestsPanel from "../../components/dashboard/DashboardRequestsPanel";
import DashboardStats from "../../components/dashboard/DashboardStats";
import StoreRecommendedSuppliers from "../../components/dashboard/StoreRecommendedSuppliers";
import LoadingState from "../../components/ui/LoadingState";
import { getProducts } from "../../services/productService";
import { getSentRequests } from "../../services/requestService";
import { getCurrentStoreProfile } from "../../services/storeService";
import { getSuppliers } from "../../services/supplierService";
import { getListResource, getResource } from "../../utils/responseUtils";
import { getCanonicalRequestStatus } from "../../utils/status";

const supplierVisuals = ["farm", "brewery", "cheese", "provence"];
const shortFrenchDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

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

function getRequestProduct(request) {
  return (
    request?.product?.name ||
    request?.productName ||
    request?.requestedQuantity ||
    "Demande générale"
  );
}

function getRequestTimestamp(request) {
  const dateValue = request?.updatedAt || request?.createdAt;
  const timestamp = dateValue ? new Date(dateValue).getTime() : Number.NaN;

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatFrenchDate(value) {
  if (!value) {
    return "";
  }

  return shortFrenchDateFormatter.format(new Date(value));
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

    return 0;
  }

  if (Array.isArray(supplier.products)) {
    return supplier.products.length;
  }

  const explicitCount = supplier.productCount ?? supplier.productsCount;

  if (Number.isFinite(Number(explicitCount)) && Number(explicitCount) >= 0) {
    return Number(explicitCount);
  }

  return 0;
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
        (request) => getCanonicalRequestStatus(request.status) === "PENDING",
      ),
    [sentRequests],
  );

  const recentRequests = useMemo(
    () =>
      sentRequests
        .toSorted(
          (currentRequest, nextRequest) =>
            getRequestTimestamp(nextRequest) - getRequestTimestamp(currentRequest),
        )
        .slice(0, 3),
    [sentRequests],
  );

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
      helper: "Total de vos demandes",
    },
    {
      icon: "eye",
      value: pendingRequestCount,
      label: "Réponses en attente",
      helper: "En attente de réponse",
    },
    {
      icon: "star",
      value: `${completionPercent}%`,
      label: "Profil magasin complet",
      helper: profileIsComplete ? "Visible par les fournisseurs contactés" : "À finaliser",
      featured: true,
    },
  ];
  return (
    <div className="store-dashboard" data-testid="store-dashboard">
      <DashboardIntro
        prefix="store-dashboard"
        titleId="store-dashboard-title"
        displayName={storeDisplayName}
        subtitle="Suivez vos demandes et découvrez les fournisseurs pertinents pour votre magasin."
        ctaTo="/catalog"
        ctaLabel="Trouver des fournisseurs"
        ctaIcon="search"
      />

      <DashboardStats
        prefix="store-dashboard"
        stats={stats}
        ariaLabel="Indicateurs magasin"
      />

      <section className="store-dashboard__work-grid">
        <DashboardRequestsPanel
          prefix="store-dashboard"
          title="Demandes récentes"
          linkTo="/store/requests"
          linkPlacement="footer"
          linkLabel="Voir toutes mes demandes"
          requests={recentRequests}
          emptyTitle="Aucune demande récente"
          emptyMessage="Créez une demande pour commencer un échange fournisseur."
          getPrimary={getSupplierName}
          getSecondary={getRequestTitle}
          getTertiary={getRequestProduct}
          getRequestPath={(request) => `/store/requests/${request.id}`}
          formatDate={formatFrenchDate}
        />

        <DashboardProfileCard
          prefix="store-dashboard"
          completionPercent={completionPercent}
          profileIsComplete={profileIsComplete}
          profileTo="/store/profile"
          completeTitle="Profil magasin complet"
          completeMessage="Vos informations sont visibles par les fournisseurs contactés."
          ariaLabel={`Profil complété à ${completionPercent}%`}
        />
      </section>

      <StoreRecommendedSuppliers suppliers={recommendedSuppliers} />
    </div>
  );
}

export default StoreDashboardPage;
