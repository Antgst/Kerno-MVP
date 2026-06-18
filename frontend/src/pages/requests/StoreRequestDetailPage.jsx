import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getRequestById } from "../../services/requestService";
import { getResource } from "../../utils/responseUtils";

const statusLabels = {
  PENDING: "En attente",
  READ: "Lue",
  ANSWERED: "Répondue",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
  COMPLETED: "Terminée",
  CLOSED: "Clôturée",
  CANCELLED: "Annulée",
};

function normalizeStatus(status) {
  return String(status || "UNKNOWN").toUpperCase();
}

function formatRequestDate(dateValue) {
  const timestamp = dateValue ? new Date(dateValue).getTime() : Number.NaN;

  if (Number.isNaN(timestamp)) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(timestamp);
}

function StoreRequestDetailIcon({ name }) {
  const commonProps = {
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

  const icons = {
    arrow: (
      <svg {...commonProps}>
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
    ),
    box: (
      <svg {...commonProps}>
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M3 8v8l9 5 9-5V8M12 13v8" />
      </svg>
    ),
    calendar: (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </svg>
    ),
    message: (
      <svg {...commonProps}>
        <path d="M4 4h16v12H7l-3 3V4Z" />
        <path d="M8 8h8M8 12h5" />
      </svg>
    ),
    supplier: (
      <svg {...commonProps}>
        <path d="M3 9l2-5h14l2 5" />
        <path d="M5 13v8h14v-8M9 21v-6h6v6" />
        <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      </svg>
    ),
    tag: (
      <svg {...commonProps}>
        <path d="M20.6 13.1 13 20.7a2 2 0 0 1-2.8 0L3.3 13.8a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h7.4a2 2 0 0 1 1.4.6l7.1 7.1a2 2 0 0 1 0 2.8Z" />
        <path d="M7.5 7.5h.01" />
      </svg>
    ),
  };

  return icons[name] || null;
}

function RequestStatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status);

  return (
    <span
      className={`supplier-request-status supplier-request-status--${normalizedStatus.toLowerCase()}`}
    >
      {statusLabels[normalizedStatus] || "Statut inconnu"}
    </span>
  );
}

function DetailItem({ icon, label, value, helper }) {
  return (
    <div className="store-request-detail-item">
      <dt>
        <StoreRequestDetailIcon name={icon} />
        {label}
      </dt>
      <dd>{value}</dd>
      {helper && <p>{helper}</p>}
    </div>
  );
}

function StoreRequestDetailPage() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadRequest() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getRequestById(id);

        if (shouldUpdateState) {
          setRequest(getResource(response, ["request"]));
        }
      } catch {
        if (shouldUpdateState) {
          setErrorMessage("Impossible de charger le détail de la demande.");
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadRequest();

    return () => {
      shouldUpdateState = false;
    };
  }, [id]);

  const sentDate = formatRequestDate(request?.createdAt || request?.updatedAt);

  return (
    <div className="supplier-requests-page store-request-detail-page">
      <header className="supplier-requests-header store-request-detail-header">
        <div>
          <p className="supplier-requests-header__eyebrow">Espace magasin</p>
          <h1>{request?.subject || "Détail de la demande"}</h1>
          <p>
            Consultez le message, le fournisseur et les informations liées à
            cette demande envoyée.
          </p>
        </div>

        <Link className="supplier-requests-empty__action" to="/store/requests">
          <StoreRequestDetailIcon name="arrow" />
          Retour aux demandes
        </Link>
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-requests-page__feedback"
          message="Chargement du détail de la demande..."
        />
      )}

      {errorMessage && (
        <ErrorState
          className="supplier-requests-page__feedback"
          title="Demande indisponible"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && !request && (
        <EmptyState
          className="supplier-requests-page__empty"
          title="Demande introuvable"
          message="Cette demande n’existe plus ou n’est plus disponible."
        />
      )}

      {!isLoading && !errorMessage && request && (
        <div className="store-request-detail-layout">
          <article className="store-request-detail-card store-request-detail-card--main">
            <div className="store-request-detail-card__header">
              <div>
                <p className="supplier-request-card__eyebrow">Sujet</p>
                <h2>{request.subject || "Demande sans objet"}</h2>
              </div>
              <RequestStatusBadge status={request.status} />
            </div>

            <div className="store-request-detail-message">
              <StoreRequestDetailIcon name="message" />
              <p>{request.message || "Aucun message renseigné."}</p>
            </div>

            <dl className="store-request-detail-grid">
              <DetailItem
                icon="message"
                label="Quantité / besoin"
                value={request.requestedQuantity || "Non renseigné"}
              />
              <DetailItem
                icon="calendar"
                label="Envoyée le"
                value={sentDate || "Date non disponible"}
              />
              <DetailItem
                icon="tag"
                label="Statut"
                value={statusLabels[normalizeStatus(request.status)] || request.status}
              />
            </dl>
          </article>

          <aside className="store-request-detail-side">
            <section className="store-request-detail-card">
              <div className="store-request-detail-card__header">
                <div>
                  <p className="supplier-request-card__eyebrow">
                    Informations liées
                  </p>
                  <h2>Fournisseur</h2>
                </div>
              </div>

              <dl className="store-request-detail-stack">
                <DetailItem
                  icon="supplier"
                  label="Fournisseur"
                  value={request.supplier?.companyName || "Fournisseur inconnu"}
                  helper={request.supplier?.location || "Localisation non renseignée"}
                />
                <DetailItem
                  icon="box"
                  label="Produit"
                  value={request.product?.name || "Demande générale"}
                  helper={request.product?.priceInfo || "Prix non renseigné"}
                />
              </dl>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

export default StoreRequestDetailPage;
