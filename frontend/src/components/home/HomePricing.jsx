import { pricingPlans } from "../../data/homeData";
import SectionHeading from "./SectionHeading";

function HomePricing() {
  return (
    <section className="landing-section">
      <SectionHeading
        eyebrow="Offres"
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
            {plan.featured && (
              <span className="pricing-card__badge">Meilleure valeur</span>
            )}
            <div className="pricing-card__header">
              <h3>{plan.name}</h3>
            </div>
            <p className="pricing-card__price">
              <strong>{plan.price}</strong>
              {plan.period && <span>{plan.period}</span>}
            </p>
            <p>{plan.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomePricing;
