import { pricingPlans } from "../../data/homeData";
import SectionHeading from "./SectionHeading";

function HomePricing() {
  return (
    <section className="landing-section">
      <SectionHeading
        title="Des offres adaptées à votre usage de KERNO"
        subtitle="Trouvez les bons partenaires, gagnez en visibilité et testez KERNO à votre rythme."
      />

      <div className="pricing-founder-banner">
        <strong>Phase de lancement :</strong> les premiers comptes validés
        bénéficient d’un accès gratuit à KERNO, avec un badge Founder visible
        sur leur profil.
      </div>

      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <article
            className={[
              "landing-card",
              "pricing-card",
              plan.featured ? "pricing-card--featured" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={plan.name}
          >
            <span
              className={[
                "pricing-card__badge",
                plan.featured ? "" : "pricing-card__badge--placeholder",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden={!plan.featured}
            >
              OFFRE PREMIUM
            </span>
            <div className="pricing-card__header">
              <h3>{plan.name}</h3>
            </div>
            <p className="pricing-card__price">
              <strong>{plan.price}</strong>
              {plan.period && <span>{plan.period}</span>}
            </p>
            <p>{plan.description}</p>
            {plan.details?.length > 0 && (
              <ul>
                {plan.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomePricing;
