import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SupplierCard from "../../components/marketplace/SupplierCard";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getSentRequests } from "../../services/requestService";
import { getCurrentStoreProfile } from "../../services/storeService";
import { getSuppliers } from "../../services/supplierService";

function getRequestsFromResponse(response) {
  return response?.requests || response?.contactRequests || [];
}

const demoSuppliers = [
  { id: "demo-farm", companyName: "Ferme des Trois Vallées", location: "Normandie", businessType: "Produits fermiers" },
  { id: "demo-brewery", companyName: "Brasserie du Nord", location: "Hauts-de-France", businessType: "Boissons artisanales" },
  { id: "demo-cheese", companyName: "Maison Dupont", location: "Normandie", businessType: "Fromages & Laitages" },
  { id: "demo-provence", companyName: "Jardins de Provence", location: "Provence", businessType: "Herbes & Épices" },
];

function StoreDashboardPage() {
  const [storeProfile, setStoreProfile] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadStoreDashboard() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const storeResponse = await getCurrentStoreProfile();

        if (!shouldUpdateState) return;

        setStoreProfile(storeResponse.store);

        try {
          const [requestsResponse, suppliersResponse] = await Promise.all([
            getSentRequests(),
            getSuppliers(),
          ]);

          if (shouldUpdateState) {
            setSentRequests(getRequestsFromResponse(requestsResponse));
            setSuppliers(suppliersResponse?.suppliers || []);
          }
        } catch {
          if (shouldUpdateState) {
            setSentRequests([]);
            setSuppliers([]);
          }
        }
      } catch (error) {
        if (!shouldUpdateState) return;

        if (error.status === 404) {
          setStoreProfile(null);
          setSentRequests([]);
          setSuppliers([]);
          return;
        }

        setErrorMessage(error.message || "Impossible de charger le tableau de bord.");
      } finally {
        if (shouldUpdateState) setIsLoading(false);
      }
    }

    loadStoreDashboard();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

  const pendingRequests = sentRequests.filter((request) => request.status === "PENDING");
  const profileCompletion = storeProfile ? 60 : 20;
  const storeName = storeProfile?.storeName || "Épicerie Martin";
  const recommendedSuppliers = suppliers.length ? suppliers : demoSuppliers;

  return (
    <div className="kerno-page dashboard-page">
      <header className="dashboard-hero">
        <div>
          <p>Bonjour,</p>
          <h1>{storeName}</h1>
          <span>Voici un aperçu de votre activité sur KERNO.</span>
        </div>
        <Link to="/catalog">
          <Button>⌕ Explorer le catalogue</Button>
        </Link>
      </header>

      {isLoading && <LoadingState message="Chargement du tableau de bord..." />}

      {errorMessage && (
        <ErrorState
          className="mb-6"
          title="Tableau de bord indisponible"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && (
        <>
          <section className="stats-grid">
            {[
              ["▤", "8", "Fournisseurs sauvegardés", "+2 ce mois-ci"],
              ["✉", sentRequests.length || 12, "Demandes envoyées", `${pendingRequests.length || 3} en attente`],
              ["▣", "47", "Produits consultés", "Cette semaine"],
              ["☆", recommendedSuppliers.length || 5, "Fournisseurs recommandés", "Pour votre profil"],
            ].map(([icon, value, label, helper]) => (
              <article className="stat-card" key={label}>
                <span>{icon}</span>
                <div>
                  <strong>{value}</strong>
                  <p>{label}</p>
                  <small>{helper}</small>
                </div>
              </article>
            ))}
          </section>

          <section className="dashboard-main">
            <article className="kerno-panel recent-requests">
              <header>
                <h2>Demandes récentes</h2>
                <Link to="/store/requests">Voir tout</Link>
              </header>

              {sentRequests.length === 0 ? (
                <EmptyState
                  title="Aucune demande envoyée"
                  message="Parcourez le catalogue pour contacter un premier fournisseur."
                  action={<Link to="/catalog"><Button variant="secondary">Parcourir</Button></Link>}
                />
              ) : (
                sentRequests.slice(0, 3).map((request) => (
                  <div className="request-row" key={request.id}>
                    <span>✉</span>
                    <div>
                      <strong>{request.subject || "Demande fournisseur"}</strong>
                      <p>{request.supplier?.companyName || request.message || "Fournisseur local"}</p>
                    </div>
                    <small>
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString("fr-FR")
                        : "12 juin 2025"}
                    </small>
                    <StatusBadge
                      status={request.status}
                      label={request.status === "PENDING" ? "En attente" : "Répondu"}
                    />
                  </div>
                ))
              )}

              <Link className="new-request-link" to="/requests/new">+ Nouvelle demande</Link>
            </article>

            <aside className="dashboard-side">
              <article className="kerno-panel quick-actions">
                <h2>Actions rapides</h2>
                <Link className="quick-action quick-action--primary" to="/catalog">⌕ Parcourir le catalogue</Link>
                <Link className="quick-action quick-action--mint" to="/catalog?tab=suppliers">▤ Trouver un fournisseur</Link>
                <Link className="quick-action" to="/store/profile">☻ Mon profil</Link>
                <Link className="quick-action" to="/store/requests">
                  ✉ Mes demandes <span>{pendingRequests.length || 3}</span>
                </Link>
              </article>

              <article className="profile-card">
                <h2>Complétez votre profil</h2>
                <p>Un profil complet améliore vos échanges avec les fournisseurs.</p>
                <div className="profile-progress"><span style={{ width: `${profileCompletion}%` }} /></div>
                <small>{profileCompletion}% complété</small>
                <Link to="/store/profile">Compléter maintenant</Link>
              </article>
            </aside>
          </section>

          <section className="dashboard-suppliers">
            <div className="section-heading">
              <h2>Fournisseurs recommandés</h2>
              <Link to="/catalog?tab=suppliers">Voir tous les fournisseurs</Link>
            </div>
            <div className="market-grid market-grid--suppliers">
              {recommendedSuppliers.slice(0, 4).map((supplier, index) => (
                <SupplierCard key={supplier.id} supplier={supplier} index={index} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default StoreDashboardPage;
