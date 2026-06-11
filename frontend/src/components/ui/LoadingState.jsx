function LoadingState({ message = "Loading...", className = "" }) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white",
        "px-4 py-3 text-sm font-semibold text-slate-600",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-700" />
      {message}
    </div>
  );
}

export default LoadingState;
