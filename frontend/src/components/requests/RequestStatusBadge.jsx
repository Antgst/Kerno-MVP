import {
  formatStatus,
  getCanonicalRequestStatus,
  getStatusTone,
} from "../../utils/status";

function RequestStatusBadge({ status }) {
  const canonicalStatus = getCanonicalRequestStatus(status);
  const statusClass = canonicalStatus.toLocaleLowerCase("fr-FR");

  return (
    <span
      className={[
        "supplier-request-status",
        `supplier-request-status--${getStatusTone(canonicalStatus)}`,
        `supplier-request-status--value-${statusClass}`,
      ].join(" ")}
    >
      {formatStatus(canonicalStatus)}
    </span>
  );
}

export default RequestStatusBadge;
