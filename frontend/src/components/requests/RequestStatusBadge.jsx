import { formatStatus, getStatusTone, normalizeStatus } from "../../utils/status";

function RequestStatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status);
  const statusClass = normalizedStatus.toLocaleLowerCase("fr-FR");

  return (
    <span
      className={[
        "supplier-request-status",
        `supplier-request-status--${getStatusTone(normalizedStatus)}`,
        `supplier-request-status--value-${statusClass}`,
      ].join(" ")}
    >
      {formatStatus(normalizedStatus)}
    </span>
  );
}

export default RequestStatusBadge;
