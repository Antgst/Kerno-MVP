import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import {
  getRequestById,
  updateRequestStatus,
} from "../../services/requestService";
import { getResource } from "../../utils/responseUtils";
import { formatStatus, getStatusTone, normalizeStatus } from "../../utils/status";

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

function SupplierRequestDetailIcon({ name }) {
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
        <path d="m15 18-6-6 6-6" />
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
    check: (
      <svg {...commonProps}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    ),
    mail: (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    map: (
      <svg {...commonProps}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    message: (
      <svg {...commonProps}>
        <path d="M4 4h16v12H7l-3 3V4Z" />
        <path d="M8 8h8M8 12h5" />
      </svg>
    ),
    phone: (
      <svg {...commonProps}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
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

function DetailField({ icon, label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt>
        <SupplierRequestDetailIcon name={icon} />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
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
      product?.priceInfo ||
      product?.minimumOrder ||
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

  const backAction = (
    <Link
      className="supplier-request-detail-back"
      to="/supplier/requests"
    >
      <SupplierRequestDetailIcon name="arrow" />
      Retour aux demandes
    </Link>
  );

  return (
    <div className="supplier-request-detail-page">
      <header className="supplier-request-detail-header">
        <div>
          <p className="supplier-request-detail-header__eyebrow">
            Demande reçue
          </p>
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
          title="Demande introuvable."
          message="Cette demande a peut-être été supprimée ou n’est plus disponible."
          action={backAction}
        />
      )}

      {!isLoading && !loadErrorMessage && request && (
        <div className="supplier-request-detail-layout">
          <main className="supplier-request-detail-main">
            <article className="supplier-request-detail-card supplier-request-detail-card--message">
              <div className="supplier-request-detail-card__heading">
                <div>
                  <p className="supplier-request-detail-card__eyebrow">
                    Détail de la demande
                  </p>
                  <h2>{request.subject || "Demande sans objet"}</h2>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>

              {request.message && (
                <div className="supplier-request-detail-message">
                  <span>
                    <SupplierRequestDetailIcon name="message" />
                  </span>
                  <p>{request.message}</p>
                </div>
              )}

              <dl className="supplier-request-meta-grid">
                <DetailField
                  icon="message"
                  label="Quantité / besoin"
                  value={request.requestedQuantity}
                />
                <DetailField
                  icon="calendar"
                  label="Créée le"
                  value={createdAt}
                />
                {updatedAt && updatedAt !== createdAt && (
                  <DetailField
                    icon="calendar"
                    label="Mise à jour le"
                    value={updatedAt}
                  />
                )}
              </dl>
            </article>

            {hasProductDetails && (
              <article className="supplier-request-detail-card supplier-request-product-card">
                <div className="supplier-request-detail-section-heading">
                  <span>
                    <SupplierRequestDetailIcon name="box" />
                  </span>
                  <div>
                    <p>Produit concerné</p>
                    <h2>{product?.name || "Produit"}</h2>
                  </div>
                </div>

                <dl className="supplier-request-product-grid">
                  <DetailField
                    icon="box"
                    label="Information tarifaire"
                    value={product?.priceInfo}
                  />
                  <DetailField
                    icon="box"
                    label="Commande minimale"
                    value={product?.minimumOrder}
                  />
                  <DetailField
                    icon="map"
                    label="Origine"
                    value={product?.origin}
                  />
                </dl>
              </article>
            )}
          </main>

          <aside className="supplier-request-detail-sidebar">
            <article className="supplier-request-detail-card supplier-request-store-card">
              <div className="supplier-request-detail-section-heading">
                <span>
                  <SupplierRequestDetailIcon name="store" />
                </span>
                <div>
                  <p>Magasin demandeur</p>
                  <h2>Informations magasin</h2>
                </div>
              </div>

              {hasStoreDetails ? (
                <dl className="supplier-request-store-grid">
                  <DetailField
                    icon="store"
                    label="Magasin"
                    value={storeName}
                  />
                  <DetailField
                    icon="store"
                    label="Enseigne"
                    value={store?.brandName}
                  />
                  <DetailField
                    icon="map"
                    label="Localisation"
                    value={store?.location}
                  />
                  <DetailField
                    icon="mail"
                    label="Email"
                    value={store?.contactEmail || store?.email}
                  />
                  <DetailField
                    icon="phone"
                    label="Téléphone"
                    value={store?.phone}
                  />
                  <DetailField
                    icon="store"
                    label="Type de magasin"
                    value={store?.businessType || store?.storeType}
                  />
                </dl>
              ) : (
                <p className="supplier-request-detail-empty-copy">
                  Les informations du magasin ne sont pas renseignées.
                </p>
              )}
            </article>

            <article className="supplier-request-detail-card supplier-request-status-card">
              <div className="supplier-request-status-card__top">
                <div>
                  <p className="supplier-request-detail-card__eyebrow">
                    Suivi
                  </p>
                  <h2>Statut de la demande</h2>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>

              <p className="supplier-request-status-card__copy">
                Actualisez le statut pour garder un suivi clair de la demande
                reçue.
              </p>

              {statusMessage && (
                <div
                  className="supplier-request-status-card__success"
                  role="status"
                >
                  <SupplierRequestDetailIcon name="check" />
                  {statusMessage}
                </div>
              )}

              {actionErrorMessage && (
                <ErrorState
                  className="supplier-request-status-card__error"
                  title="Mise à jour impossible"
                  message={actionErrorMessage}
                />
              )}

              {isUpdatingStatus && (
                <LoadingState
                  className="supplier-request-status-card__loading"
                  message="Mise à jour du statut..."
                />
              )}

              <div className="supplier-request-status-form">
                <label htmlFor="request-status">Statut</label>
                <select
                  id="request-status"
                  name="status"
                  value={selectedStatus}
                  onChange={(event) => {
                    setSelectedStatus(event.target.value);
                    setStatusMessage("");
                    setActionErrorMessage("");
                  }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={
                    isUpdatingStatus ||
                    !selectedStatus ||
                    selectedStatus === currentStatus
                  }
                  onClick={handleStatusUpdate}
                >
                  Mettre à jour le statut
                </button>
                {selectedStatus === currentStatus && (
                  <small className="supplier-request-status-form__helper">
                    Choisissez un nouveau statut pour activer la mise à jour.
                  </small>
                )}
              </div>
            </article>
          </aside>
        </div>
      )}
    </div>
  );
}

export default SupplierRequestDetailPage;
