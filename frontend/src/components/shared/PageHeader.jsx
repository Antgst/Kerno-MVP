function PageHeader({ title, description, children, className = "" }) {
  return (
    <header className={["page-header", className].filter(Boolean).join(" ")}>
      <div>
        <h1 className="page-header__title">{title}</h1>

        {description && (
          <p className="page-header__description">{description}</p>
        )}
      </div>

      {children && <div className="page-header__actions">{children}</div>}
    </header>
  );
}

export default PageHeader;
