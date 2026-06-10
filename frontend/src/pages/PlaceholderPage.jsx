import { Link, useParams } from "react-router-dom";

const accessMessages = {
  public: "Public page.",
  auth: "Protected page for authenticated users.",
  supplier: "Protected page for supplier users.",
  store: "Protected page for store users.",
};

function PlaceholderPage({ route }) {
  const params = useParams();

  return (
    <main className="page-shell">
      <section className="page-card">
        <p className="eyebrow">KERNO MVP route</p>
        <h1>{route.label}</h1>

        <dl className="route-details">
          <div>
            <dt>Path</dt>
            <dd>{route.path}</dd>
          </div>

          <div>
            <dt>Access</dt>
            <dd>{route.access}</dd>
          </div>

          <div>
            <dt>Status</dt>
            <dd>{accessMessages[route.access]}</dd>
          </div>
        </dl>

        {Object.keys(params).length > 0 && (
          <div className="route-params">
            <h2>Route parameters</h2>
            <pre>{JSON.stringify(params, null, 2)}</pre>
          </div>
        )}

        <Link className="text-link" to="/">
          Back to route map
        </Link>
      </section>
    </main>
  );
}

export default PlaceholderPage;
