import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import RequestDetailBackLink from "../../components/requests/RequestDetailBackLink";
import StoreRequestDetailLayout from "../../components/requests/StoreRequestDetailLayout";
import { getRequestById } from "../../services/requestService";
import { getResource } from "../../utils/responseUtils";

function formatDate(value) {
  if (!value) return "Date indisponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date indisponible";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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
        if (shouldUpdateState) setRequest(getResource(response, ["request"]));
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(
            error.message || "Impossible de charger le détail de la demande.",
          );
        }
      } finally {
        if (shouldUpdateState) setIsLoading(false);
      }
    }
    loadRequest();
    return () => {
      shouldUpdateState = false;
    };
  }, [id]);

  const backAction = (
    <RequestDetailBackLink to="/store/requests">
      Retour aux demandes envoyées
    </RequestDetailBackLink>
  );

  return (
    <div className="supplier-request-detail-page store-request-detail-page">
      <header className="supplier-request-detail-header">
        <div>
          <h1>Détail de la demande</h1>
          <p>Consultez la demande transmise au fournisseur.</p>
        </div>
        {backAction}
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-request-detail-page__feedback"
          message="Chargement de la demande..."
        />
      )}
      {errorMessage && (
        <ErrorState title="Demande indisponible" message={errorMessage} />
      )}
      {!isLoading && !errorMessage && !request && (
        <EmptyState
          title="Demande introuvable"
          message="Cette demande n’existe plus ou n’est plus disponible."
          action={backAction}
        />
      )}

      {!isLoading && !errorMessage && request && (
        <StoreRequestDetailLayout formatDate={formatDate} request={request} />
      )}
    </div>
  );
}

export default StoreRequestDetailPage;
