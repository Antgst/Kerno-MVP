import { Link } from "react-router-dom";
import { formatStatus, getStatusTone } from "../../utils/status";
import DashboardIcon from "./DashboardIcon";

function DashboardRequestsPanel({
  prefix,
  title,
  linkTo,
  linkPlacement = "header",
  requests,
  emptyTitle,
  emptyMessage,
  getPrimary,
  getSecondary,
  getTertiary,
  getRequestPath,
  formatDate,
}) {
  const showHeaderLink = linkTo && linkPlacement !== "footer";
  const showFooterLink = linkTo && linkPlacement === "footer";

  return (
    <article className={`${prefix}__panel ${prefix}__requests ${prefix}__recent`}>
      <div className={`${prefix}__panel-header ${prefix}__panel-header--inline`}>
        <h2>{title}</h2>
        {showHeaderLink && <Link to={linkTo}>Voir tout</Link>}
      </div>

      <div className={`${prefix}__request-list`}>
        {requests.length ? (
          requests.map((request) => {
            const tertiaryContent = getTertiary?.(request);

            return (
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
                  {tertiaryContent && <em>{tertiaryContent}</em>}
                </span>

                <span className={`${prefix}__request-date`}>
                  {formatDate(request.updatedAt || request.createdAt)}
                </span>

                <span
                  className={`${prefix}__status ${prefix}__status--${getStatusTone(request.status)}`}
                >
                  {formatStatus(request.status)}
                </span>
              </Link>
            );
          })
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

      {showFooterLink && (
        <footer className={`${prefix}__request-footer`}>
          <Link className={`${prefix}__request-all`} to={linkTo}>
            Voir tout
          </Link>
        </footer>
      )}
    </article>
  );
}

export default DashboardRequestsPanel;
