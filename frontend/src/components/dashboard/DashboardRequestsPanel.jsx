import { Link } from "react-router-dom";
import { formatStatus, getStatusTone } from "../../utils/status";
import DashboardIcon from "./DashboardIcon";

function DashboardRequestsPanel({
  prefix,
  title,
  linkTo,
  requests,
  emptyTitle,
  emptyMessage,
  getPrimary,
  getSecondary,
  getTertiary,
  getRequestPath,
  formatDate,
}) {
  return (
    <article className={`${prefix}__panel ${prefix}__requests ${prefix}__recent`}>
      <div className={`${prefix}__panel-header ${prefix}__panel-header--inline`}>
        <h2>{title}</h2>
        <Link to={linkTo}>Voir tout</Link>
      </div>

      <div className={`${prefix}__request-list`}>
        {requests.length ? (
          requests.map((request) => (
            <Link
              className={`${prefix}__request-row`}
              key={request.id}
              to={getRequestPath(request)}
            >
              <span className={`${prefix}__request-icon`}>
                <DashboardIcon name="mail" />
              </span>

              <span className={`${prefix}__request-copy`}>
                <strong>{getPrimary(request)}</strong>
                <small>{getSecondary(request)}</small>
                {getTertiary && <em>{getTertiary(request)}</em>}
              </span>

              <span className={`${prefix}__request-date`}>
                {formatDate(request.createdAt || request.updatedAt)}
              </span>

              <span
                className={`${prefix}__status ${prefix}__status--${getStatusTone(request.status)}`}
              >
                {formatStatus(request.status)}
              </span>
            </Link>
          ))
        ) : (
          <div className={`${prefix}__request-empty`}>
            <span className={`${prefix}__request-icon`}>
              <DashboardIcon name="mail" />
            </span>
            <div>
              <strong>{emptyTitle}</strong>
              <p>{emptyMessage}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default DashboardRequestsPanel;
