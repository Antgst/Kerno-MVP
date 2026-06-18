import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getRequestById } from "../../services/requestService";
import { getResource } from "../../utils/responseUtils";
import { formatStatus, getStatusTone } from "../../utils/status";

function formatDate(value) {
  if (!value) return "Date non renseignée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date non renseignée";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function DetailIcon({ name }) {
  const props = {
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
    arrow: <path d="m15 18-6-6 6-6" />,
    box: (
      <>
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M3 8v8l9 5 9-5V8M12 13v8" />
      </>
    ),
    building: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    map: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    message: (
      <>
        <path d="M4 4h16v12H7l-3 3V4Z" />
        <path d="M8 8h8M8 12h5" />
      </>
    ),
    phone: <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2 4 1.3v3a2 2 0 0 1-2 2A15.4 15.4 0 0 1 2.5 6.6a2 2 0 0 1 2-2h3l1.3 4-2.2 2.2Z" />,
  };
  return <svg {...props}>{icons[name] || null}</svg>;
}

function DetailField({ icon, label, value }) {
  return (
    <div>
      <dt><DetailIcon name={icon} />{label}</dt>
      <dd>{value || "Non renseigné"}</dd>
    </div>
  );
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

  const supplier = request?.supplier;
  const product = request?.product;
  const backAction = (
    <Link className="supplier-request-detail-back" to="/store/requests">
      <DetailIcon name="arrow" />
      Retour aux demandes envoyées
    </Link>
  );

  return (
    <div className="supplier-request-detail-page store-request-detail-page">
      <header className="supplier-request-detail-header">
        <div>
          <p className="supplier-request-detail-header__eyebrow">Demande envoyée</p>
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
        <div className="supplier-request-detail-layout">
          <main className="supplier-request-detail-main">
            <article className="supplier-request-detail-card supplier-request-detail-card--message">
              <div className="supplier-request-detail-card__heading">
                <div>
                  <p className="supplier-request-detail-card__eyebrow">Objet</p>
                  <h2>{request.subject || "Demande sans objet"}</h2>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>

              <div className="supplier-request-detail-message">
                <span><DetailIcon name="message" /></span>
                <p>{request.message || "Aucun message n’a été renseigné."}</p>
              </div>

              <dl className="supplier-request-meta-grid">
                <DetailField
                  icon="message"
                  label="Quantité / besoin"
                  value={request.requestedQuantity}
                />
                <DetailField
                  icon="calendar"
                  label="Envoyée le"
                  value={formatDate(request.createdAt)}
                />
                <DetailField
                  icon="calendar"
                  label="Mise à jour le"
                  value={formatDate(request.updatedAt)}
                />
              </dl>
            </article>

            <article className="supplier-request-detail-card supplier-request-product-card">
              <div className="supplier-request-detail-section-heading">
                <span><DetailIcon name="box" /></span>
                <div>
                  <p>Produit associé</p>
                  <h2>{product?.name || "Aucun produit spécifique"}</h2>
                </div>
              </div>
              <dl className="supplier-request-product-grid">
                <DetailField
                  icon="box"
                  label="Catégorie"
                  value={product?.category?.name || product?.categoryName}
                />
                <DetailField icon="map" label="Origine" value={product?.origin} />
                <DetailField
                  icon="box"
                  label="Commande minimale"
                  value={product?.minimumOrder}
                />
                <DetailField
                  icon="box"
                  label="Prix indicatif"
                  value={product?.priceInfo}
                />
              </dl>
            </article>
          </main>

          <aside className="supplier-request-detail-sidebar">
            <article className="supplier-request-detail-card">
              <div className="supplier-request-detail-section-heading">
                <span><DetailIcon name="building" /></span>
                <div>
                  <p>Fournisseur associé</p>
                  <h2>{supplier?.companyName || "Fournisseur non renseigné"}</h2>
                </div>
              </div>
              <dl className="supplier-request-store-grid">
                <DetailField icon="map" label="Localisation" value={supplier?.location} />
                <DetailField
                  icon="mail"
                  label="Email"
                  value={supplier?.contactEmail || supplier?.email}
                />
                <DetailField icon="phone" label="Téléphone" value={supplier?.phone} />
                <DetailField
                  icon="building"
                  label="Activité"
                  value={supplier?.businessType}
                />
              </dl>
            </article>

            <article className="supplier-request-detail-card supplier-request-status-card">
              <div className="supplier-request-status-card__top">
                <div>
                  <p className="supplier-request-detail-card__eyebrow">Suivi</p>
                  <h2>Statut de la demande</h2>
                </div>
                <RequestStatusBadge status={request.status} />
              </div>
              <p className="supplier-request-status-card__copy">
                Le fournisseur peut faire évoluer ce statut lorsqu’il traite
                votre demande.
              </p>
            </article>
          </aside>
        </div>
      )}
    </div>
  );
}

export default StoreRequestDetailPage;
