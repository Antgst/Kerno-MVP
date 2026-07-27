import { Link } from "react-router-dom";

function HomeFinalCta() {
  return (
    <section className="landing-final-cta">
      <div>
        <h2>Prêt à rejoindre l’écosystème KERNO ?</h2>
        <p>
          Que vous cherchiez des fournisseurs ou que vous vouliez rendre vos
          produits visibles, KERNO structure vos premiers contacts B2B dans un
          espace simple et professionnel.
        </p>
      </div>

      <div className="landing-actions">
        <Link
          className="landing-button landing-button--outline-light"
          to="/register"
        >
          Créer un compte
        </Link>
        <Link className="landing-button landing-button--light" to="/login">
          Se connecter
        </Link>
      </div>
    </section>
  );
}

export default HomeFinalCta;
