import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getReceivedRequests } from "../../services/requestService";
import { getListResource } from "../../utils/responseUtils";
import {
  formatStatus,
  getStatusTone,
  normalizeStatus,
  requestStatusOptions,
} from "../../utils/status";

const initialFilters = {
  search: "",
  status: "",
  sort: "recent",
};

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("fr-FR");
}

function getStoreName(request) {
  return request.store?.storeName || request.store?.name || "";
}

function getRequestTimestamp(request) {
  const dateValue = request.createdAt || request.updatedAt;
  const timestamp = dateValue ? new Date(dateValue).getTime() : Number.NaN;

  return Number.isNaN(timestamp) ? null : timestamp;
}

function formatRequestDate(request) {
  const timestamp = getRequestTimestamp(request);

  if (timestamp === null) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(timestamp);
}

function SupplierRequestsIcon({ name }) {
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
        <path d="M5 12h14M13 6l6 6-6 6" />
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
    search: (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    store: (
      <svg {...commonProps}>
        <path d="M3 9l2-5h14l2 5" />
        <path d="M5 13v8h14v-8M9 21v-6h6v6" />
        <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      </svg>
    ),
  };

  return icons[name] || null;
}

function RequestStatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status);

  return (
    <span
      className={`supplier-request-status supplier-request-status--${getStatusTone(normalizedStatus)}`}
    >
      {formatStatus(normalizedStatus)}
    </span>
  );
}

function SupplierRequestCard({ request }) {
  const storeName = getStoreName(request);
  const productName = request.product?.name || "";
  const requestDate = formatRequestDate(request);

  return (
    <article className="supplier-request-card">
      <div className="supplier-request-card__content">
        <div className="supplier-request-card__header">
          <div>
            <h2>{request.subject || "Demande sans objet"}</h2>
          </div>
          <RequestStatusBadge status={request.status} />
        </div>

        {request.message && (
          <p className="supplier-request-card__message">{request.message}</p>
        )}

        <dl className="supplier-request-meta">
          {storeName && (
            <div>
              <dt>
                <SupplierRequestsIcon name="store" />
                Magasin
              </dt>
              <dd>{storeName}</dd>
            </div>
          )}

          {productName && (
            <div>
              <dt>
                <SupplierRequestsIcon name="box" />
                Produit
              </dt>
              <dd>{productName}</dd>
            </div>
          )}

          {request.requestedQuantity && (
            <div>
              <dt>
                <SupplierRequestsIcon name="message" />
                Quantité / besoin
              </dt>
              <dd>{request.requestedQuantity}</dd>
            </div>
          )}

          {requestDate && (
            <div>
              <dt>
                <SupplierRequestsIcon name="calendar" />
                Reçue le
              </dt>
              <dd>{requestDate}</dd>
            </div>
          )}
        </dl>
      </div>

      {request.id && (
        <div className="supplier-request-actions">
          <Link to={`/supplier/requests/${request.id}`}>
            Voir le détail
            <SupplierRequestsIcon name="arrow" />
          </Link>
        </div>
      )}
    </article>
  );
}

function SupplierRequestsPage() {
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
        const response = await getReceivedRequests();

        if (shouldUpdateState) {
          setRequests(getListResource(response, ["requests"]));
        }
      } catch {
        if (shouldUpdateState) {
          setErrorMessage("Impossible de charger les demandes.");
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
    const counts = {
      total: requests.length,
      pending: 0,
      accepted: 0,
      processed: 0,
    };

    requests.forEach((request) => {
      const status = normalizeStatus(request.status);

      if (status === "PENDING") {
        counts.pending += 1;
      }

      if (status === "ACCEPTED") {
        counts.accepted += 1;
      }

      if (
        ["ANSWERED", "REJECTED", "COMPLETED", "CLOSED", "CANCELLED"].includes(
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
          !filters.status ||
          normalizeStatus(request.status) === filters.status;
        const searchableContent = normalizeValue(
          [
            request.subject,
            request.message,
            request.requestedQuantity,
            getStoreName(request),
            request.product?.name,
          ].join(" "),
        );
        const matchesSearch =
          !search || searchableContent.includes(search);

        return matchesStatus && matchesSearch;
      })
      .sort((firstRequest, secondRequest) => {
        const firstTimestamp = getRequestTimestamp(firstRequest);
        const secondTimestamp = getRequestTimestamp(secondRequest);

        if (firstTimestamp === null && secondTimestamp === null) {
          return 0;
        }

        if (firstTimestamp === null) {
          return 1;
        }

        if (secondTimestamp === null) {
          return -1;
        }

        return filters.sort === "oldest"
          ? firstTimestamp - secondTimestamp
          : secondTimestamp - firstTimestamp;
      });
  }, [filters, requests]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    filters.sort !== initialFilters.sort;

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function resetFilters() {
    setFilters(initialFilters);
  }

  return (
    <div className="supplier-requests-page">
      <header className="supplier-requests-header">
        <div>
          <p className="supplier-requests-header__eyebrow">
            Espace fournisseur
          </p>
          <h1>Demandes reçues</h1>
          <p>
            Suivez les demandes de contact et de devis reçues des magasins.
          </p>
        </div>

        {!isLoading && !errorMessage && requests.length > 0 && (
          <div className="supplier-requests-header__summary">
            <strong>{statusCounts.pending}</strong>
            <span>
              {statusCounts.pending > 1
                ? "demandes à examiner"
                : "demande à examiner"}
            </span>
          </div>
        )}
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-requests-page__feedback"
          message="Chargement des demandes reçues..."
        />
      )}

      {errorMessage && (
        <div className="supplier-requests-error">
          <ErrorState
            className="supplier-requests-page__feedback"
            title="Demandes indisponibles"
            message={errorMessage}
          />
          <button
            className="supplier-requests-empty__action"
            type="button"
            onClick={() => setReloadKey((currentKey) => currentKey + 1)}
          >
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && (
        <>
          {requests.length > 0 && (
            <>
              <section
                className="supplier-requests-toolbar"
                aria-label="Recherche et filtres des demandes"
              >
                <label className="supplier-requests-search">
                  <span className="sr-only">Rechercher une demande</span>
                  <SupplierRequestsIcon name="search" />
                  <input
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Rechercher un sujet, magasin, produit..."
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
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                >
                  Réinitialiser
                </button>
              </section>

              <section
                className="supplier-requests-summary"
                aria-label="Résumé des demandes"
              >
                <div>
                  <span>Total</span>
                  <strong>{statusCounts.total}</strong>
                </div>
                <div>
                  <span>En attente</span>
                  <strong>{statusCounts.pending}</strong>
                </div>
                <div>
                  <span>Acceptées</span>
                  <strong>{statusCounts.accepted}</strong>
                </div>
                <div>
                  <span>Traitées</span>
                  <strong>{statusCounts.processed}</strong>
                </div>
              </section>
            </>
          )}

          {requests.length === 0 ? (
            <EmptyState
              className="supplier-requests-page__empty"
              title="Aucune demande reçue pour le moment."
              message="Les demandes envoyées par les magasins apparaîtront ici."
            />
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              className="supplier-requests-page__empty"
              title="Aucune demande ne correspond à vos filtres."
              message="Modifiez votre recherche ou réinitialisez les filtres."
              action={
                <button
                  className="supplier-requests-empty__action"
                  type="button"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </button>
              }
            />
          ) : (
            <section
              className="supplier-requests-list"
              aria-live="polite"
              aria-label="Liste des demandes reçues"
            >
              {filteredRequests.map((request, index) => (
                <SupplierRequestCard
                  key={request.id || `request-${index}`}
                  request={request}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default SupplierRequestsPage;
