import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getSentRequests } from "../../services/requestService";
import { getCurrentStoreProfile } from "../../services/storeService";
import { getListResource, getResource } from "../../utils/responseUtils";

const demoProfile = {
  storeName: "Maison Briva Rennes",
  brandName: "Maison Briva",
  location: "Rennes",
  storeType: "Épicerie fine",
  sourcingNeeds:
    "Jus artisanaux, boissons fraîches et produits fermiers à forte identité locale.",
  contactEmail: "contact@maisonbriva.fr",
  phone: "02 99 00 00 00",
};

const demoRequests = [
  {
    id: "req-1",
    subject: "Miel de fleurs breton",
    message: "À relancer cette semaine",
    status: "PENDING",
    supplier: { companyName: "Maison Briva Rennes" },
  },
  {
    id: "req-2",
    subject: "Beurre fermier demi-sel",
    message: "À relancer cette semaine",
    status: "PENDING",
    supplier: { companyName: "Laiterie des Portes de Rennes" },
  },
  {
    id: "req-3",
    subject: "Jus de pomme artisanal",
    message: "Réponse reçue",
    status: "ACCEPTED",
    supplier: { companyName: "Maison Briva Rennes" },
  },
];

function getRequestsFromResponse(response) {
  return getListResource(response, ["requests", "contactRequests"]);
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

function getInitials(label) {
  return String(label || "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
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

function StoreDashboardPage() {
  const [storeProfile, setStoreProfile] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadDashboard() {
      setIsLoading(true);

      try {
        const profileResponse = await getCurrentStoreProfile();
        const requestsResponse = await getSentRequests();

        if (!shouldUpdateState) {
          return;
        }

        setStoreProfile(getResource(profileResponse, ["store"]));
        setSentRequests(getRequestsFromResponse(requestsResponse));
        setIsDemoMode(false);
      } catch {
        if (!shouldUpdateState) {
          return;
        }

        setStoreProfile(demoProfile);
        setSentRequests(demoRequests);
        setIsDemoMode(true);
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

  const completionPercent = getCompletionPercent(storeProfile);

  const pendingRequests = useMemo(
    () =>
      sentRequests.filter(
        (request) => String(request.status || "").toUpperCase() === "PENDING",
      ),
    [sentRequests],
  );

  const latestExchanges = sentRequests.slice(0, 3);
  const followUps = pendingRequests.slice(0, 2);

  if (isLoading) {
    return <LoadingState message="Chargement du tableau de bord magasin..." />;
  }

  return (
    <div className="dashboard-page dashboard-page--store">
      {isDemoMode && (
        <div className="dashboard-demo-note">
          Mode démo : le backend n’est pas joignable, des données de démonstration sont affichées.
        </div>
      )}

      <section className="dashboard-hero dashboard-hero--store dashboard-hero--clean">
        <div className="dashboard-hero__content">

          <h1>Tableau de bord</h1>

          <p>
            Pilotez votre activité, suivez vos demandes fournisseurs et gardez
            une vision claire des prochaines actions à mener.
          </p>
        </div>

        <div className="dashboard-hero__actions">
          <Link to="/catalog">
            <Button className="dashboard-hero__button dashboard-hero__button--orange">
              Explorer le catalogue
            </Button>
          </Link>
        </div>
      </section>

      <div className="dashboard-grid dashboard-grid--store-layout">
        <article className="dashboard-card dashboard-card--exchanges">
          <div className="dashboard-card__header">
            <div>
              <h2>Derniers échanges fournisseurs</h2>
            </div>

            <Link className="dashboard-card__link" to="/store/requests">
              Voir tout
            </Link>
          </div>

          <div className="dashboard-exchanges">
            {latestExchanges.length === 0 ? (
              <p className="dashboard-empty-copy">
                Aucun échange pour le moment. Explorez le catalogue pour envoyer
                votre première demande.
              </p>
            ) : (
              latestExchanges.map((request) => (
                <div className="dashboard-exchange" key={request.id}>
                  <div className="dashboard-exchange__left">
                    <div className="dashboard-list-item__avatar">
                      {getInitials(getSupplierName(request))}
                    </div>

                    <div>
                      <strong>{getSupplierName(request)}</strong>
                      <small>{request.subject}</small>
                      <p>{request.message}</p>
                    </div>
                  </div>

                  <StatusBadge
                    status={request.status}
                    label={getStatusLabel(request.status)}
                  />
                </div>
              ))
            )}
          </div>
        </article>

        <article className="dashboard-card dashboard-card--profile-score">
          <div className="dashboard-card__header">
            <div>
              <h2>Profil magasin</h2>
            </div>
          </div>

          <div className="dashboard-profile-score">
            <div
              className="dashboard-ring dashboard-ring--large"
              style={{ "--progress": completionPercent }}
            >
              <div className="dashboard-ring__inner">
                <strong>{completionPercent}%</strong>
                <span>complété</span>
              </div>
            </div>

            <div>
              <h3>
                {completionPercent >= 80
                  ? "Profil solide"
                  : "Profil à compléter"}
              </h3>

              <p>
                {completionPercent >= 80
                  ? "Votre profil magasin est prêt pour démarrer des échanges crédibles."
                  : "Ajoutez quelques informations pour renforcer votre crédibilité."}
              </p>

              <Link to="/store/profile" className="dashboard-text-link">
                Modifier le profil
              </Link>
            </div>
          </div>
        </article>

        <article className="dashboard-card dashboard-card--reminders">
          <div className="dashboard-card__header">
            <div>
              <h2>Demandes à relancer</h2>
            </div>
          </div>

          <div className="dashboard-reminders">
            {followUps.length === 0 ? (
              <p className="dashboard-empty-copy">
                Aucune relance urgente pour le moment.
              </p>
            ) : (
              followUps.map((request, index) => (
                <div className="dashboard-reminder" key={request.id}>
                  <div className="dashboard-reminder__count">{index + 1}</div>

                  <div className="dashboard-reminder__copy">
                    <strong>{request.subject}</strong>
                    <small>{getSupplierName(request)}</small>
                    <p>{request.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="dashboard-card__footer">
            <Link to="/store/requests">
              <Button className="w-full dashboard-footer-button">
                Voir les relances
              </Button>
            </Link>
          </div>
        </article>

        <article className="dashboard-card dashboard-card--discover">
          <div className="dashboard-card__header dashboard-card__header--centered">
            <h2>Fournisseurs à découvrir</h2>
          </div>

          <div className="featured-supplier">
            <div className="featured-supplier__visual">
              <div className="featured-supplier__glass featured-supplier__glass--1" />
              <div className="featured-supplier__glass featured-supplier__glass--2" />
              <div className="featured-supplier__glass featured-supplier__glass--3" />
            </div>

            <div className="featured-supplier__content">
              <div className="featured-supplier__identity">
                <div className="featured-supplier__initials">NB</div>

                <div>
                  <h3>Northern Beverages</h3>
                  <small>Nantes, France · Boissons</small>
                </div>
              </div>

              <p>
                Un profil fournisseur complet pour passer de la simple découverte
                à une première demande de contact qualifiée.
              </p>

              <Link to="/catalog">
                <Button variant="primary">Voir fournisseur à découvrir</Button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default StoreDashboardPage;
