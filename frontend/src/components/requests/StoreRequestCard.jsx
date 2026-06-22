import { Link } from "react-router-dom";
import RequestIcon from "./RequestIcon";
import RequestStatusBadge from "./RequestStatusBadge";

function StoreRequestCard({ formatRequestDate, request }) {
  return (
    <article className="supplier-request-card">
      <div className="supplier-request-card__content">
        <div className="supplier-request-card__header">
          <div>
            <h2>{request.subject || "Demande sans objet"}</h2>
          </div>
          <RequestStatusBadge status={request.status} />
        </div>

        <p className="supplier-request-card__message">
          {request.message || "Aucun message n’a été renseigné."}
        </p>

        <dl className="supplier-request-meta">
          <div>
            <dt>
              <RequestIcon name="supplier" />
              Fournisseur
            </dt>
            <dd>
              {request.supplier?.companyName || "Fournisseur à préciser"}
            </dd>
          </div>
          <div>
            <dt>
              <RequestIcon name="box" />
              Produit
            </dt>
            <dd>{request.product?.name || "Demande générale"}</dd>
          </div>
          <div>
            <dt>
              <RequestIcon name="message" />
              Volume / besoin
            </dt>
            <dd>{request.requestedQuantity || "À préciser"}</dd>
          </div>
          <div>
            <dt>
              <RequestIcon name="calendar" />
              Envoyée le
            </dt>
            <dd>{formatRequestDate(request)}</dd>
          </div>
        </dl>
      </div>

      {request.id && (
        <div className="supplier-request-actions">
          <Link to={`/store/requests/${request.id}`}>
            Consulter
            <RequestIcon name="arrow" />
          </Link>
        </div>
      )}
    </article>
  );
}

export default StoreRequestCard;
