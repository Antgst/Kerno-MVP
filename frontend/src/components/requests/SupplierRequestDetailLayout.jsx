import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import RequestDetailField from "./RequestDetailField";
import RequestIcon from "./RequestIcon";
import RequestStatusBadge from "./RequestStatusBadge";

function SupplierRequestDetailLayout({
  actionErrorMessage,
  createdAt,
  currentStatus,
  hasProductDetails,
  hasStoreDetails,
  isUpdatingStatus,
  onClearStatusMessages,
  onSelectedStatusChange,
  onStatusUpdate,
  product,
  request,
  selectedStatus,
  statusMessage,
  statusOptions,
  store,
  storeName,
  updatedAt,
}) {
  return (
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
                <RequestIcon name="message" />
              </span>
              <p>{request.message}</p>
            </div>
          )}

          <dl className="supplier-request-meta-grid">
            <RequestDetailField
              hideWhenEmpty
              icon="message"
              label="Volume / besoin"
              value={request.requestedQuantity}
            />
            <RequestDetailField
              hideWhenEmpty
              icon="calendar"
                label="Reçue le"
              value={createdAt}
            />
            {updatedAt && updatedAt !== createdAt && (
              <RequestDetailField
                hideWhenEmpty
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
                <RequestIcon name="box" />
              </span>
              <div>
                <p>Produit concerné</p>
                <h2>{product?.name || "Produit"}</h2>
              </div>
            </div>

            <dl className="supplier-request-product-grid">
              <RequestDetailField
                hideWhenEmpty
                icon="box"
                label="Information tarifaire"
                value={product?.priceInfo}
              />
              <RequestDetailField
                hideWhenEmpty
                icon="box"
                label="Volume minimum"
                value={product?.minimumOrder}
              />
              <RequestDetailField
                hideWhenEmpty
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
              <RequestIcon name="store" />
            </span>
            <div>
              <p>Magasin demandeur</p>
              <h2>Informations magasin</h2>
            </div>
          </div>

          {hasStoreDetails ? (
            <dl className="supplier-request-store-grid">
              <RequestDetailField
                hideWhenEmpty
                icon="store"
                label="Magasin"
                value={storeName}
              />
              <RequestDetailField
                hideWhenEmpty
                icon="store"
                label="Enseigne"
                value={store?.brandName}
              />
              <RequestDetailField
                hideWhenEmpty
                icon="map"
                label="Localisation"
                value={store?.location}
              />
              <RequestDetailField
                hideWhenEmpty
                icon="mail"
                label="Email"
                value={store?.contactEmail || store?.email}
              />
              <RequestDetailField
                hideWhenEmpty
                icon="phone"
                label="Téléphone"
                value={store?.phone}
              />
              <RequestDetailField
                hideWhenEmpty
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
              <p className="supplier-request-detail-card__eyebrow">Suivi</p>
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
              <RequestIcon name="check" />
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
                onSelectedStatusChange(event.target.value);
                onClearStatusMessages();
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
              onClick={onStatusUpdate}
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
  );
}

export default SupplierRequestDetailLayout;
