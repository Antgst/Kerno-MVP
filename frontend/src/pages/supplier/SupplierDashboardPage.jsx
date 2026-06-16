import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getProducts } from "../../services/productService";
import { getReceivedRequests } from "../../services/requestService";
import { getCurrentSupplierProfile } from "../../services/supplierService";
import { getListResource, getResource } from "../../utils/responseUtils";

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

function getCompletionLabel(percent) {
  if (percent >= 80) {
    return "Profil complété";
  }

  if (percent >= 50) {
    return "En bonne voie";
  }

  if (percent > 0) {
    return "À compléter";
  }

  return "Profil manquant";
}

function ProgressRow({ label, value }) {
  return (
    <div className="dashboard-progress">
      <div className="dashboard-progress__top">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="dashboard-progress__track">
        <div
          className="dashboard-progress__fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SupplierDashboardPage() {
  const [supplierProfile, setSupplierProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardWarning, setDashboardWarning] = useState("");

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
              !profile?.id ||
              product.supplierId === profile.id ||
              product.supplier?.id === profile.id,
          ),
        );

        setRequests(loadedRequests);

        const hasFailedRequest = [
          profileResult,
          productsResult,
          requestsResult,
        ].some((result) => result.status === "rejected");

        setDashboardWarning(
          hasFailedRequest
            ? "Certaines données n'ont pas pu être chargées. Vérifiez que le backend est lancé et que le compte possède bien le rôle fournisseur."
            : "",
        );
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        console.error("Supplier dashboard loading error:", error);

        setSupplierProfile(null);
        setProducts([]);
        setRequests([]);
        setDashboardWarning("Impossible de charger le tableau de bord fournisseur.");
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

  const completionPercent = getCompletionPercent(supplierProfile);
  const completionLabel = getCompletionLabel(completionPercent);

  const activeProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.isActive !== false &&
          String(product.status || "ACTIVE").toUpperCase() !== "INACTIVE",
      ),
    [products],
  );

  const pendingRequests = useMemo(
    () =>
      requests.filter(
        (request) => String(request.status || "").toUpperCase() === "PENDING",
      ),
    [requests],
  );

  const latestRequests = requests.slice(0, 3);

  if (isLoading) {
    return <LoadingState message="Chargement du tableau de bord fournisseur..." />;
  }

  return (
    <div className="dashboard-page dashboard-page--supplier">
      {dashboardWarning && (
        <div className="dashboard-demo-note">
          {dashboardWarning}
        </div>
      )}

      <section className="dashboard-hero dashboard-hero--supplier">
        <div className="dashboard-hero__content">
          <p className="dashboard-hero__eyebrow">ESPACE FOURNISSEUR</p>
          <h1>Tableau de bord</h1>
          <p>
            Suivez la visibilité de votre profil, pilotez vos produits et gardez
            un œil sur les demandes magasins.
          </p>
        </div>

        <div className="dashboard-hero__actions">
          <Link to="/supplier/products">
            <Button className="dashboard-hero__button dashboard-hero__button--orange">
              Voir les produits
            </Button>
          </Link>
        </div>
      </section>

      <div className="dashboard-grid">
        <article className="dashboard-card dashboard-card--wide">
          <div className="dashboard-card__header">
            <div>
              <p className="dashboard-card__eyebrow">ACTIVITÉ</p>
              <h2>Présence fournisseur</h2>
            </div>

            <span className="dashboard-chip">
              {supplierProfile?.location || "France"}
            </span>
          </div>

          <div className="dashboard-progress-list">
            <ProgressRow label="Profil complété" value={completionPercent} />
            <ProgressRow
              label="Produits publiés"
              value={Math.min(activeProducts.length * 30, 100)}
            />
            <ProgressRow
              label="Demandes en attente"
              value={Math.min(pendingRequests.length * 35, 100)}
            />
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <div>
              <p className="dashboard-card__eyebrow">PROFIL</p>
              <h2>Profil fournisseur</h2>
            </div>
          </div>

          <div className="dashboard-completion">
            <div
              className="dashboard-ring"
              style={{ "--progress": completionPercent }}
            >
              <div className="dashboard-ring__inner">
                <strong>{completionPercent}%</strong>
                <span>complété</span>
              </div>
            </div>

            <div className="dashboard-completion__copy">
              <h3>{supplierProfile?.companyName || "Profil fournisseur"}</h3>
              <p>
                {supplierProfile?.description ||
                  "Ajoutez davantage d’informations pour rassurer les magasins."}
              </p>

              <div className="dashboard-mini-progress">
                <div className="dashboard-mini-progress__track">
                  <div
                    className="dashboard-mini-progress__fill"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>

                <small>{completionLabel}</small>
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <div>
              <p className="dashboard-card__eyebrow">PRODUITS</p>
              <h2>Produits récents</h2>
            </div>

            <Link className="dashboard-card__link" to="/supplier/products">
              Voir tout
            </Link>
          </div>

          <div className="dashboard-list">
            {products.length === 0 ? (
              <p className="dashboard-empty-copy">
                Aucun produit pour le moment. Ajoutez votre première offre pour
                apparaître dans le catalogue.
              </p>
            ) : products.slice(0, 3).map((product) => (
              <div className="dashboard-list-item" key={product.id}>
                <div className="dashboard-list-item__identity">
                  <div className="dashboard-list-item__avatar">
                    {product.name.slice(0, 1)}
                  </div>

                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.category?.name || product.category || "Catégorie libre"}</small>
                  </div>
                </div>

                <StatusBadge
                  status={product.isActive === false ? "INACTIVE" : "ACTIVE"}
                />
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card__header">
            <div>
              <p className="dashboard-card__eyebrow">DEMANDES</p>
              <h2>Dernières sollicitations</h2>
            </div>
          </div>

          <div className="dashboard-list">
            {latestRequests.length === 0 ? (
              <p className="dashboard-empty-copy">
                Aucune demande reçue pour le moment.
              </p>
            ) : latestRequests.map((request) => (
              <div className="dashboard-list-item" key={request.id}>
                <div className="dashboard-list-item__identity">
                  <div className="dashboard-list-item__avatar">
                    {(request.storeName || request.store?.storeName || "M")
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {request.storeName || request.store?.storeName || "Magasin"}
                    </strong>
                    <small>
                      {request.product?.name || request.product || "Demande générale"}
                    </small>
                  </div>
                </div>

                <StatusBadge status={request.status} />
              </div>
            ))}
          </div>

          <div className="dashboard-card__footer">
            <Link to="/supplier/requests">
              <Button className="w-full dashboard-footer-button">
                Voir les demandes
              </Button>
            </Link>
          </div>
        </article>

        <article className="dashboard-card dashboard-card--featured">
          <div className="dashboard-card__header dashboard-card__header--centered">
            <h2>Mettre en avant vos produits</h2>
          </div>

          <div className="featured-supplier featured-supplier--supplier">
            <div className="featured-supplier__visual featured-supplier__visual--supplier">
              <div className="featured-supplier__box" />
              <div className="featured-supplier__box featured-supplier__box--small" />
              <div className="featured-supplier__box featured-supplier__box--accent" />
            </div>

            <div className="featured-supplier__content">
              <div className="featured-supplier__identity">
                <div className="featured-supplier__initials">KP</div>

                <div>
                  <h3>Catalogue fournisseur</h3>
                  <small>Mettez vos produits en avant</small>
                </div>
              </div>

              <p>
                Ajoutez des produits propres, avec une description claire et une
                catégorie visible, pour donner envie aux magasins de vous contacter.
              </p>

              <Link to="/supplier/products/new">
                <Button variant="primary">Ajouter un produit</Button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default SupplierDashboardPage;
