import { Link } from "react-router-dom";
import DashboardIcon from "./DashboardIcon";

function DashboardQuickActions({ prefix, title = "Actions rapides", actions }) {
  return (
    <article className={`${prefix}__panel ${prefix}__actions`}>
      <h2>{title}</h2>

      <div className={`${prefix}__quick-actions`}>
        {actions.map((action) => (
          <Link
            className={[
              `${prefix}__quick-action`,
              action.variant ? `${prefix}__quick-action--${action.variant}` : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={action.to}
            to={action.to}
          >
            <DashboardIcon name={action.icon} />
            <span>{action.label}</span>
            {action.count !== undefined && <strong>{action.count}</strong>}
          </Link>
        ))}
      </div>
    </article>
  );
}

export default DashboardQuickActions;
