import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import RequestDetailBackLink from "../../components/requests/RequestDetailBackLink";
import SupplierRequestDetailLayout from "../../components/requests/SupplierRequestDetailLayout";
import {
  getRequestById,
  updateRequestStatus,
} from "../../services/requestService";
import { getResource } from "../../utils/responseUtils";
import { formatStatus, normalizeStatus } from "../../utils/status";

const editableStatusOptions = [
  "PENDING",
  "READ",
  "ANSWERED",
  "CLOSED",
].map((status) => ({
  value: status,
  label: formatStatus(status),
}));

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStoreName(store) {
  return store?.storeName || store?.name || "";
}

function SupplierRequestDetailPage() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [actionErrorMessage, setActionErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadRequest() {
      setIsLoading(true);
      setLoadErrorMessage("");

      try {
        const response = await getRequestById(id);

        if (shouldUpdateState) {
          const loadedRequest = getResource(response, ["request"]);

          setRequest(loadedRequest);
          setSelectedStatus(normalizeStatus(loadedRequest?.status || ""));
        }
      } catch {
        if (shouldUpdateState) {
          setLoadErrorMessage("Impossible de charger la demande.");
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

  const currentStatus = normalizeStatus(request?.status);
  const statusOptions = useMemo(() => {
    if (
      !selectedStatus ||
      editableStatusOptions.some((option) => option.value === selectedStatus)
    ) {
      return editableStatusOptions;
    }

    return [
      {
        value: selectedStatus,
        label: formatStatus(selectedStatus, "Statut actuel"),
      },
      ...editableStatusOptions,
    ];
  }, [selectedStatus]);

  const store = request?.store;
  const product = request?.product;
  const storeName = getStoreName(store);
  const createdAt = formatDate(request?.createdAt);
  const updatedAt = formatDate(request?.updatedAt);
  const hasStoreDetails = Boolean(
    storeName ||
      store?.brandName ||
      store?.location ||
      store?.contactEmail ||
      store?.email ||
      store?.phone ||
      store?.businessType ||
      store?.storeType,
  );
  const hasProductDetails = Boolean(
    product?.name ||
      (product?.priceCents !== null && product?.priceCents !== undefined) ||
      (product?.minimumOrderQuantity !== null &&
        product?.minimumOrderQuantity !== undefined) ||
      product?.origin,
  );

  async function handleStatusUpdate() {
    if (!selectedStatus || selectedStatus === currentStatus || !request?.id) {
      return;
    }

    setIsUpdatingStatus(true);
    setStatusMessage("");
    setActionErrorMessage("");

    try {
      const response = await updateRequestStatus(request.id, {
        status: selectedStatus,
      });

      const updatedRequest = getResource(response, ["request"]) || {
        ...request,
        status: selectedStatus,
      };

      setRequest(updatedRequest);
      setSelectedStatus(normalizeStatus(updatedRequest.status));
      setStatusMessage("Le statut de la demande a bien été mis à jour.");
    } catch {
      setActionErrorMessage(
        "Impossible de mettre à jour le statut de la demande.",
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  function clearStatusMessages() {
    setStatusMessage("");
    setActionErrorMessage("");
  }

  const backAction = (
    <RequestDetailBackLink to="/supplier/requests">
      Retour aux demandes
    </RequestDetailBackLink>
  );

  return (
    <div className="supplier-request-detail-page">
      <header className="supplier-request-detail-header">
        <div>
          <h1>{request?.subject || "Détail de la demande"}</h1>
          <p>Consultez le détail de la demande reçue d’un magasin.</p>
        </div>
        {backAction}
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-request-detail-page__feedback"
          message="Chargement de la demande..."
        />
      )}

      {loadErrorMessage && (
        <ErrorState
          className="supplier-request-detail-page__feedback"
          title="Demande indisponible"
          message={loadErrorMessage}
        />
      )}

      {!isLoading && !loadErrorMessage && !request && (
        <EmptyState
          className="supplier-request-detail-page__feedback"
          title="Demande introuvable"
          message="Cette demande a peut-être été supprimée ou n’est plus disponible."
          action={backAction}
        />
      )}

      {!isLoading && !loadErrorMessage && request && (
        <SupplierRequestDetailLayout
          actionErrorMessage={actionErrorMessage}
          createdAt={createdAt}
          currentStatus={currentStatus}
          hasProductDetails={hasProductDetails}
          hasStoreDetails={hasStoreDetails}
          isUpdatingStatus={isUpdatingStatus}
          onClearStatusMessages={clearStatusMessages}
          onSelectedStatusChange={setSelectedStatus}
          onStatusUpdate={handleStatusUpdate}
          product={product}
          request={request}
          selectedStatus={selectedStatus}
          statusMessage={statusMessage}
          statusOptions={statusOptions}
          store={store}
          storeName={storeName}
          updatedAt={updatedAt}
        />
      )}
    </div>
  );
}

export default SupplierRequestDetailPage;
