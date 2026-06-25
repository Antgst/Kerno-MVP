import { useEffect, useMemo, useState } from "react";
import DashboardIntro from "../../components/dashboard/DashboardIntro";
import DashboardProfileCard from "../../components/dashboard/DashboardProfileCard";
import DashboardRequestsPanel from "../../components/dashboard/DashboardRequestsPanel";
import DashboardStats from "../../components/dashboard/DashboardStats";
import SupplierProductsPreview from "../../components/dashboard/SupplierProductsPreview";
import LoadingState from "../../components/ui/LoadingState";
import { getProducts } from "../../services/productService";
import { getReceivedRequests } from "../../services/requestService";
import { getCurrentSupplierProfile } from "../../services/supplierService";
import { getListResource, getResource } from "../../utils/responseUtils";
import { formatMinimumOrder, formatProductPrice } from "../../utils/productPrice";

const shortFrenchDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

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

  const recentRequests = useMemo(() => {
    return [...requests]
      .sort((currentRequest, nextRequest) => {
        return getRequestTimestamp(nextRequest) - getRequestTimestamp(currentRequest);
      })
      .slice(0, 3);
  }, [requests]);

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

  return (
    <div className="supplier-dashboard">
      <DashboardIntro
        prefix="supplier-dashboard"
        titleId="supplier-dashboard-title"
        displayName={supplierDisplayName}
        ctaTo="/supplier/products/new"
        ctaLabel="Ajouter un produit"
        ctaIcon="plus"
      />

      <DashboardStats
        prefix="supplier-dashboard"
        stats={stats}
        ariaLabel="Indicateurs fournisseur"
      />

      <section className="supplier-dashboard__work-grid">
        <DashboardRequestsPanel
          prefix="supplier-dashboard"
          title="Demandes reçues"
          linkTo="/supplier/requests"
          linkPlacement="footer"
          requests={recentRequests}
          emptyTitle="Aucune demande reçue"
          emptyMessage="Les nouvelles demandes des magasins apparaîtront ici."
          getPrimary={getStoreName}
          getSecondary={getRequestTitle}
          getTertiary={getRequestProduct}
          getRequestPath={(request) => `/supplier/requests/${request.id}`}
          formatDate={formatFrenchDate}
        />

        <DashboardProfileCard
          prefix="supplier-dashboard"
          completionPercent={completionPercent}
          profileIsComplete={profileIsComplete}
          profileTo="/supplier/profile"
          completeMessage="Gérez les informations visibles par les magasins lorsqu'ils découvrent votre activité ou vos produits."
          ariaLabel={`Profil fournisseur complété à ${completionPercent}%`}
        />
      </section>

      <SupplierProductsPreview products={featuredProducts} />
    </div>
  );
}

export default SupplierDashboardPage;
