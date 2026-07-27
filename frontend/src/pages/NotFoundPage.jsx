import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="not-found-page page-shell">
      <section className="not-found-card page-card">
        <div className="not-found-page__badge">404</div>
        <h1>Oups… cette page n’existe pas</h1>
        <p>
          Nous n’avons pas trouvé la page que vous recherchez. Vérifiez
          l’adresse ou revenez à l’accueil pour continuer.
        </p>

        <div className="not-found-page__actions">
          <Link className="not-found-page__link" to="/">
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;
