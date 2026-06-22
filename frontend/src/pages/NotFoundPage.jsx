import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="page-card">
        <p className="eyebrow">404</p>
        <h1>Page introuvable</h1>
        <p>La page demandée n’existe pas dans l’application KERNO.</p>

        <Link className="text-link" to="/">
          Retour à l’accueil
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
