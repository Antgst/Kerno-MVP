import { Link } from "react-router-dom";
import { heroTrustBar } from "../../data/homeData";
import HeroImageShowcase from "./HeroImageShowcase";

function HomeHero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero__content">
        <p className="landing-hero__label">
          Marketplace B2B pour fournisseurs et magasins
        </p>
        <h1>Le sourcing local, enfin structuré.</h1>
        <p>
          KERNO aide les magasins à identifier des fournisseurs référencés et
          permet aux fournisseurs de présenter leurs produits dans un cadre
          professionnel, clair et exploitable.
        </p>

        <div className="landing-actions" aria-label="Actions principales">
          <Link
            className="landing-button landing-button--primary"
            to="/register"
          >
            Trouver des fournisseurs
          </Link>
          <Link
            className="landing-button landing-button--secondary"
            to="/register"
          >
            Publier mes produits
          </Link>
        </div>

        <div className="landing-trust-bar" aria-label="Signaux de confiance">
          {heroTrustBar.label && <span>{heroTrustBar.label}</span>}
          <p>
            {heroTrustBar.primary.map((signal, index) => (
              <span className="landing-trust-bar__signal" key={signal}>
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="landing-trust-bar__separator"
                  >
                    ·
                  </span>
                )}
                {signal}
              </span>
            ))}
          </p>
          {heroTrustBar.secondary.length > 0 && (
            <small>
              {heroTrustBar.secondary.map((signal, index) => (
                <span className="landing-trust-bar__signal" key={signal}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="landing-trust-bar__separator"
                    >
                      ·
                    </span>
                  )}
                  {signal}
                </span>
              ))}
            </small>
          )}
        </div>
      </div>

      <HeroImageShowcase />
    </section>
  );
}

export default HomeHero;
