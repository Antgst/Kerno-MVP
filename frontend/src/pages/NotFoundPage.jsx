import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="page-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The requested route does not exist in the KERNO MVP routing map.</p>

        <Link className="text-link" to="/">
          Back to route map
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
