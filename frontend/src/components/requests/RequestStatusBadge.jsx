import { formatStatus, getStatusTone, normalizeStatus } from "../../utils/status";

function RequestStatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status);

  return (
    <span
      className={`supplier-request-status supplier-request-status--${getStatusTone(normalizedStatus)}`}
    >
      {formatStatus(normalizedStatus)}
    </span>
  );
}

export default RequestStatusBadge;
