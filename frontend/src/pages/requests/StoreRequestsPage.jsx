import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import RequestSummary from "../../components/requests/RequestSummary";
import RequestToolbar from "../../components/requests/RequestToolbar";
import StoreRequestCard from "../../components/requests/StoreRequestCard";
import StoreRequestsHeader from "../../components/requests/StoreRequestsHeader";
import { getSentRequests } from "../../services/requestService";
import { normalizeStatus } from "../../utils/status";
import { getListResource } from "../../utils/responseUtils";

const initialFilters = {
  search: "",
  status: "",
  sort: "recent",
};
const REQUESTS_BATCH_SIZE = 8;

function formatRequestDate(request) {
  const dateValue = request.createdAt || request.updatedAt;
  const date = dateValue ? new Date(dateValue) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Date indisponible";
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

function StoreRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(REQUESTS_BATCH_SIZE);

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
  const visibleRequests = filteredRequests.slice(0, visibleCount);
  const hasMoreRequests = visibleCount < filteredRequests.length;

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setVisibleCount(REQUESTS_BATCH_SIZE);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setVisibleCount(REQUESTS_BATCH_SIZE);
  }

  return (
    <div className="supplier-requests-page store-requests-page">
      <StoreRequestsHeader />

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
          <RequestToolbar
            ariaLabel="Filtres"
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            searchPlaceholder="Rechercher un objet, fournisseur, produit..."
          />

          <RequestSummary statusCounts={statusCounts} />

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
              {visibleRequests.map((request) => (
                <StoreRequestCard
                  key={request.id}
                  request={request}
                  formatRequestDate={formatRequestDate}
                />
              ))}

              {filteredRequests.length > REQUESTS_BATCH_SIZE && (
                <div className="supplier-requests-list__footer">
                  <p>
                    {visibleRequests.length} demande
                    {visibleRequests.length > 1 ? "s" : ""} affichée
                    {visibleRequests.length > 1 ? "s" : ""} sur{" "}
                    {filteredRequests.length}
                  </p>
                  <div>
                    {visibleCount > REQUESTS_BATCH_SIZE && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount(REQUESTS_BATCH_SIZE)}
                      >
                        Afficher moins
                      </button>
                    )}
                    {hasMoreRequests && (
                      <button
                        className="supplier-requests-list__more"
                        type="button"
                        onClick={() =>
                          setVisibleCount((count) =>
                            Math.min(
                              count + REQUESTS_BATCH_SIZE,
                              filteredRequests.length,
                            ),
                          )
                        }
                      >
                        Afficher plus
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default StoreRequestsPage;
