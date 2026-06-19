import { Link } from "react-router-dom";
import RequestIcon from "./RequestIcon";
import RequestStatusBadge from "./RequestStatusBadge";

function SupplierRequestCard({ formatRequestDate, getStoreName, request }) {
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
                <RequestIcon name="store" />
                Magasin
              </dt>
              <dd>{storeName}</dd>
            </div>
          )}

          {productName && (
            <div>
              <dt>
                <RequestIcon name="box" />
                Produit
              </dt>
              <dd>{productName}</dd>
            </div>
          )}

          {request.requestedQuantity && (
            <div>
              <dt>
                <RequestIcon name="message" />
                Volume / besoin
              </dt>
              <dd>{request.requestedQuantity}</dd>
            </div>
          )}

          {requestDate && (
            <div>
              <dt>
                <RequestIcon name="calendar" />
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
            Consulter
            <RequestIcon name="arrow" />
          </Link>
        </div>
      )}
    </article>
  );
}

export default SupplierRequestCard;
