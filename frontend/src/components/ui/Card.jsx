const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

function Card({ children, className = "", padding = "md" }) {
  return (
    <section
      className={[
        "rounded-3xl border border-slate-200 bg-white shadow-sm",
        paddingClasses[padding] ?? paddingClasses.md,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}

export default Card;
