import { Link } from "react-router-dom";
import { heroBackgroundImage } from "../../data/homeData";
import HeroImageShowcase from "./HeroImageShowcase";

function HomeHero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero__background" aria-hidden="true">
        <img src={heroBackgroundImage} alt="" />
      </div>

      <div className="landing-hero__content">
        <p className="landing-eyebrow">
          Marketplace B2B pour fournisseurs et magasins
        </p>
        <h1>Le sourcing local, enfin structuré.</h1>
        <p>
          KERNO aide les magasins à identifier les bons fournisseurs et permet
          aux fournisseurs de présenter leurs produits dans un cadre
          professionnel, clair et exploitable.
        </p>

        <div className="landing-actions" aria-label="Actions principales">
          <Link
            className="landing-button landing-button--primary"
            to="/catalog"
          >
            Explorer le catalogue
          </Link>
          <Link
            className="landing-button landing-button--secondary"
            to="/register"
          >
            Créer un compte
          </Link>
        </div>
      </div>

      <HeroImageShowcase />
    </section>
  );
}

export default HomeHero;
