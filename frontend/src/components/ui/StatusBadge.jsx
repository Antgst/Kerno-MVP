const statusClasses = {
  ACTIVE: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  ACCEPTED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  PENDING: "bg-amber-100 text-amber-800 ring-amber-200",
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-200",
  INACTIVE: "bg-slate-100 text-slate-700 ring-slate-200",
  REJECTED: "bg-red-100 text-red-700 ring-red-200",
  ERROR: "bg-red-100 text-red-700 ring-red-200",
};

const statusLabels = {
  ACTIVE: "Active",
  ACCEPTED: "Accepted",
  PENDING: "Pending",
  DRAFT: "Draft",
  INACTIVE: "Inactive",
  REJECTED: "Rejected",
  ERROR: "Error",
};

function StatusBadge({ status = "DRAFT", label, className = "" }) {
  const normalizedStatus = String(status).toUpperCase();

  return (
    <span
      className={[
        "inline-flex w-fit items-center rounded-full px-3 py-1",
        "text-xs font-black uppercase tracking-wide ring-1",
        statusClasses[normalizedStatus] ?? statusClasses.DRAFT,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label ?? statusLabels[normalizedStatus] ?? normalizedStatus}
    </span>
  );
}

export default StatusBadge;
