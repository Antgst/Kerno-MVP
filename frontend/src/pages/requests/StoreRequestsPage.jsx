import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getSentRequests } from "../../services/requestService";
import {
  formatStatus,
  getStatusTone,
  normalizeStatus,
  requestStatusOptions,
} from "../../utils/status";
import { getListResource } from "../../utils/responseUtils";

const initialFilters = {
  search: "",
  status: "",
  sort: "recent",
};

function formatRequestDate(request) {
  const dateValue = request.createdAt || request.updatedAt;
  const date = dateValue ? new Date(dateValue) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Date non renseignée";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("fr-FR");
}

function RequestIcon({ name }) {
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
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    box: (
      <>
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M3 8v8l9 5 9-5V8M12 13v8" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    message: (
      <>
        <path d="M4 4h16v12H7l-3 3V4Z" />
        <path d="M8 8h8M8 12h5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    supplier: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
      </>
    ),
  };

  return <svg {...commonProps}>{icons[name] || null}</svg>;
}

function RequestStatusBadge({ status }) {
  return (
    <span
      className={`supplier-request-status supplier-request-status--${getStatusTone(status)}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function StoreRequestCard({ request }) {
  return (
    <article className="supplier-request-card">
      <div className="supplier-request-card__content">
        <div className="supplier-request-card__header">
          <div>
            <h2>{request.subject || "Demande sans objet"}</h2>
          </div>
          <RequestStatusBadge status={request.status} />
        </div>

        <p className="supplier-request-card__message">
          {request.message || "Aucun message n’a été renseigné."}
        </p>

        <dl className="supplier-request-meta">
          <div>
            <dt>
              <RequestIcon name="supplier" />
              Fournisseur
            </dt>
            <dd>
              {request.supplier?.companyName || "Fournisseur non renseigné"}
            </dd>
          </div>
          <div>
            <dt>
              <RequestIcon name="box" />
              Produit
            </dt>
            <dd>{request.product?.name || "Demande générale"}</dd>
          </div>
          <div>
            <dt>
              <RequestIcon name="message" />
              Quantité / besoin
            </dt>
            <dd>{request.requestedQuantity || "Non renseigné"}</dd>
          </div>
          <div>
            <dt>
              <RequestIcon name="calendar" />
              Envoyée le
            </dt>
            <dd>{formatRequestDate(request)}</dd>
          </div>
        </dl>
      </div>

      {request.id && (
        <div className="supplier-request-actions">
          <Link to={`/store/requests/${request.id}`}>
            Voir le détail
            <RequestIcon name="arrow" />
          </Link>
        </div>
      )}
    </article>
  );
}

function StoreRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadRequests() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getSentRequests();
        if (shouldUpdateState) {
          setRequests(getListResource(response, ["requests"]));
        }
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(
            error.message || "Impossible de charger les demandes envoyées.",
          );
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadRequests();
    return () => {
      shouldUpdateState = false;
    };
  }, [reloadKey]);

  const statusCounts = useMemo(() => {
    const counts = { total: requests.length, pending: 0, accepted: 0, processed: 0 };

    requests.forEach((request) => {
      const status = normalizeStatus(request.status);
      if (status === "PENDING") counts.pending += 1;
      if (status === "ACCEPTED") counts.accepted += 1;
      if (
        ["ANSWERED", "REPLIED", "COMPLETED", "DONE", "RESOLVED", "CLOSED"].includes(
          status,
        )
      ) {
        counts.processed += 1;
      }
    });

    return counts;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const search = normalizeValue(filters.search);

    return requests
      .filter((request) => {
        const matchesStatus =
          !filters.status || normalizeStatus(request.status) === filters.status;
        const searchableContent = normalizeValue(
          [
            request.subject,
            request.message,
            request.requestedQuantity,
            request.supplier?.companyName,
            request.product?.name,
          ].join(" "),
        );
        return matchesStatus && (!search || searchableContent.includes(search));
      })
      .sort((first, second) => {
        const firstTime = new Date(first.createdAt || first.updatedAt || 0).getTime();
        const secondTime = new Date(second.createdAt || second.updatedAt || 0).getTime();
        return filters.sort === "oldest"
          ? firstTime - secondTime
          : secondTime - firstTime;
      });
  }, [filters, requests]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    filters.sort !== initialFilters.sort;

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="supplier-requests-page store-requests-page">
      <header className="supplier-requests-header">
        <div>
          <p className="supplier-requests-header__eyebrow">Espace magasin</p>
          <h1>Demandes envoyées</h1>
          <p>
            Suivez les demandes de contact et de devis envoyées aux fournisseurs.
          </p>
        </div>
        <Link className="store-requests-header__action" to="/catalog">
          Explorer le catalogue
        </Link>
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-requests-page__feedback"
          message="Chargement des demandes envoyées..."
        />
      )}

      {errorMessage && (
        <div className="supplier-requests-error">
          <ErrorState title="Demandes indisponibles" message={errorMessage} />
          <button
            className="supplier-requests-empty__action"
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
          >
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && (
        <>
          <section className="supplier-requests-toolbar" aria-label="Filtres">
            <label className="supplier-requests-search">
              <span className="sr-only">Rechercher une demande</span>
              <RequestIcon name="search" />
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher un objet, fournisseur, produit..."
              />
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              aria-label="Filtrer par statut"
            >
              <option value="">Tous les statuts</option>
              {requestStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              aria-label="Trier les demandes"
            >
              <option value="recent">Plus récentes d’abord</option>
              <option value="oldest">Plus anciennes d’abord</option>
            </select>
            <button
              className="supplier-requests-toolbar__reset"
              type="button"
              disabled={!hasActiveFilters}
              onClick={() => setFilters(initialFilters)}
            >
              Réinitialiser
            </button>
          </section>

          <section className="supplier-requests-summary" aria-label="Résumé">
            <div><span>Total</span><strong>{statusCounts.total}</strong></div>
            <div><span>En attente</span><strong>{statusCounts.pending}</strong></div>
            <div><span>Acceptées</span><strong>{statusCounts.accepted}</strong></div>
            <div><span>Traitées</span><strong>{statusCounts.processed}</strong></div>
          </section>

          {requests.length === 0 ? (
            <EmptyState
              className="supplier-requests-page__empty"
              title="Aucune demande envoyée"
              message="Explorez le catalogue pour contacter un fournisseur ou demander un devis."
              action={
                <Link className="supplier-requests-empty__action" to="/catalog">
                  Explorer le catalogue
                </Link>
              }
            />
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              className="supplier-requests-page__empty"
              title="Aucune demande ne correspond à ces filtres"
              message="Modifiez votre recherche ou réinitialisez les filtres."
            />
          ) : (
            <section className="supplier-requests-list" aria-live="polite">
              {filteredRequests.map((request) => (
                <StoreRequestCard key={request.id} request={request} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default StoreRequestsPage;
