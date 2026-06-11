function DashboardStatCard({ label, value, helperText, trend, className = "" }) {
  return (
    <article
      className={[
        "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="m-0 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between gap-4">
        <strong className="text-3xl font-black text-slate-950">
          {value}
        </strong>

        {trend && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800">
            {trend}
          </span>
        )}
      </div>

      {helperText && (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {helperText}
        </p>
      )}
    </article>
  );
}

export default DashboardStatCard;
