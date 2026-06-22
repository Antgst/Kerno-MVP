import RequestDetailField from "./RequestDetailField";
import RequestIcon from "./RequestIcon";
import RequestStatusBadge from "./RequestStatusBadge";
import { formatProductPrice } from "../../utils/productPrice";

function StoreRequestDetailLayout({ formatDate, request }) {
  const supplier = request?.supplier;
  const product = request?.product;

  return (
    <div className="supplier-request-detail-layout">
      <main className="supplier-request-detail-main">
        <article className="supplier-request-detail-card supplier-request-detail-card--message">
          <div className="supplier-request-detail-card__heading">
            <div>
              <h2>{request.subject || "Demande sans objet"}</h2>
            </div>
            <RequestStatusBadge status={request.status} />
          </div>

          <div className="supplier-request-detail-message">
            <span>
              <RequestIcon name="message" />
            </span>
            <p>{request.message || "Aucun message n’a été renseigné."}</p>
          </div>

          <dl className="supplier-request-meta-grid">
            <RequestDetailField
              icon="message"
              label="Volume / besoin"
              value={request.requestedQuantity}
            />
            <RequestDetailField
              icon="calendar"
              label="Envoyée le"
              value={formatDate(request.createdAt)}
            />
            <RequestDetailField
              icon="calendar"
              label="Mise à jour le"
              value={formatDate(request.updatedAt)}
            />
          </dl>
        </article>

        <article className="supplier-request-detail-card supplier-request-product-card">
          <div className="supplier-request-detail-section-heading">
            <span>
              <RequestIcon name="box" />
            </span>
            <div>
              <p>Produit associé</p>
              <h2>{product?.name || "Demande générale"}</h2>
            </div>
          </div>
          <dl className="supplier-request-product-grid">
            <RequestDetailField
              icon="box"
              label="Catégorie"
              value={product?.category?.name || product?.categoryName}
            />
            <RequestDetailField
              icon="map"
              label="Origine"
              value={product?.origin}
            />
            <RequestDetailField
              icon="box"
              label="Volume minimum"
              value={product?.minimumOrder}
            />
            <RequestDetailField
              icon="box"
              label="Prix indicatif"
              value={product ? formatProductPrice(product) : null}
            />
          </dl>
        </article>
      </main>

      <aside className="supplier-request-detail-sidebar">
        <article className="supplier-request-detail-card">
          <div className="supplier-request-detail-section-heading">
            <span>
              <RequestIcon name="building" />
            </span>
            <div>
              <p>Fournisseur associé</p>
              <h2>{supplier?.companyName || "Fournisseur indisponible"}</h2>
            </div>
          </div>
          <dl className="supplier-request-store-grid">
            <RequestDetailField
              icon="map"
              label="Localisation"
              value={supplier?.location}
            />
            <RequestDetailField
              icon="mail"
              label="Email"
              value={supplier?.contactEmail || supplier?.email}
            />
            <RequestDetailField
              icon="phone"
              label="Téléphone"
              value={supplier?.phone}
            />
            <RequestDetailField
              icon="building"
              label="Activité"
              value={supplier?.businessType}
            />
          </dl>
        </article>

        <article className="supplier-request-detail-card supplier-request-status-card">
          <div className="supplier-request-status-card__top">
            <div>
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
  );
}

export default StoreRequestDetailLayout;
