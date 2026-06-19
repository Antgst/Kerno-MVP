import { Link } from "react-router-dom";

function HomeFinalCta() {
  return (
    <section className="landing-final-cta">
      <div>
        <p className="landing-eyebrow">Démarrer</p>
        <h2>Prêt à structurer votre sourcing local ?</h2>
        <p>
          KERNO rapproche fournisseurs et magasins dans un parcours simple,
          lisible et professionnel.
        </p>
      </div>

      <div className="landing-actions">
        <Link className="landing-button landing-button--light" to="/register">
          Créer un compte
        </Link>
        <Link
          className="landing-button landing-button--outline-light"
          to="/login"
        >
          Se connecter
        </Link>
      </div>
    </section>
  );
}

export default HomeFinalCta;
