function EmptyState({
  title = "Aucun élément à afficher",
  message = "Les informations apparaîtront ici dès qu’elles seront disponibles.",
  action,
  className = "",
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-dashed border-slate-300 bg-slate-50",
        "px-6 py-8 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl shadow-sm">
        ⌀
      </div>

      <h3 className="m-0 text-lg font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {message}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
