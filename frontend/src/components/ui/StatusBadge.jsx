import { formatStatus, getCanonicalRequestStatus } from "../../utils/status";

const statusClasses = {
  ACTIVE: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  ACCEPTED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  PENDING: "bg-amber-100 text-amber-800 ring-amber-200",
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  INACTIVE: "bg-slate-100 text-slate-700 ring-slate-200",
  REJECTED: "bg-red-100 text-red-700 ring-red-200",
  CANCELLED: "bg-red-50 text-red-800 ring-red-200",
  COMPLETED: "bg-slate-100 text-slate-700 ring-slate-200",
  ERROR: "bg-red-100 text-red-700 ring-red-200",
};

function StatusBadge({ status = "DRAFT", label, className = "" }) {
  const normalizedStatus = getCanonicalRequestStatus(status);

  return (
    <span
      className={[
        "inline-flex w-fit items-center rounded-full px-2.5 py-1",
        "text-[0.68rem] font-semibold uppercase tracking-[0.06em] ring-1",
        statusClasses[normalizedStatus] ?? statusClasses.DRAFT,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label ?? formatStatus(normalizedStatus)}
    </span>
  );
}

export default StatusBadge;
