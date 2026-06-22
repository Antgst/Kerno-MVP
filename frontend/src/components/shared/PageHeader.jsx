function PageHeader({ title, description, children, className = "" }) {
  return (
    <header
      className={[
        "mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <h1 className="m-0 max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </header>
  );
}

export default PageHeader;
