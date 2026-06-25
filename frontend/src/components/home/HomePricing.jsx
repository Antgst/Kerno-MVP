import { pricingPlans } from "../../data/homeData";
import SectionHeading from "./SectionHeading";

function HomePricing() {
  return (
    <section className="landing-section">
      <SectionHeading
        title="Des offres adaptées à la visibilité fournisseur"
        subtitle="Choisissez le rythme qui correspond à votre besoin de visibilité."
      />

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
              Meilleure valeur
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
