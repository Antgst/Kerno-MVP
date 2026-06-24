import { useEffect, useMemo, useState } from "react";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import RequestSummary from "../../components/requests/RequestSummary";
import RequestToolbar from "../../components/requests/RequestToolbar";
import RequestsPagination from "../../components/requests/RequestsPagination";
import SupplierRequestCard from "../../components/requests/SupplierRequestCard";
import SupplierRequestsHeader from "../../components/requests/SupplierRequestsHeader";
import { getReceivedRequests } from "../../services/requestService";
import { getListResource } from "../../utils/responseUtils";
import { normalizeStatus } from "../../utils/status";

const initialFilters = {
  search: "",
  status: "",
  sort: "recent",
};
const REQUESTS_PER_PAGE = 8;
const requestDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

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

  return requestDateFormatter.format(timestamp);
}

function SupplierRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / REQUESTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const firstItemIndex = (safeCurrentPage - 1) * REQUESTS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(
    firstItemIndex,
    firstItemIndex + REQUESTS_PER_PAGE,
  );
  const lastItemIndex = Math.min(
    firstItemIndex + paginatedRequests.length,
    filteredRequests.length,
  );

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setCurrentPage(1);
  }

  function changePage(nextPage) {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return (
    <div className="supplier-requests-page">
      <SupplierRequestsHeader
        errorMessage={errorMessage}
        isLoading={isLoading}
        pendingCount={statusCounts.pending}
        requestCount={requests.length}
      />

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
              <RequestToolbar
                ariaLabel="Recherche et filtres des demandes"
                filters={filters}
                hasActiveFilters={hasActiveFilters}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                searchPlaceholder="Rechercher un sujet, magasin, produit..."
              />

              <RequestSummary
                ariaLabel="Résumé des demandes"
                statusCounts={statusCounts}
              />
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
              {paginatedRequests.map((request, index) => (
                <SupplierRequestCard
                  key={request.id || `request-${index}`}
                  request={request}
                  getStoreName={getStoreName}
                  formatRequestDate={formatRequestDate}
                />
              ))}

              <RequestsPagination
                currentPage={safeCurrentPage}
                firstItemIndex={firstItemIndex}
                lastItemIndex={lastItemIndex}
                onPageChange={changePage}
                totalItems={filteredRequests.length}
                totalPages={totalPages}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default SupplierRequestsPage;
