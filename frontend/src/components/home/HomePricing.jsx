import { pricingPlans } from "../../data/homeData";
import SectionHeading from "./SectionHeading";

function HomePricing() {
  return (
    <section className="landing-section">
      <SectionHeading
        title="Des formules adaptées à votre usage de KERNO"
        subtitle="Testez KERNO gratuitement au lancement, puis choisissez le niveau de visibilité adapté à votre usage."
      />

      <div className="pricing-founder-banner">
        <strong>Phase de lancement :</strong> les premiers comptes validés
        testent gratuitement les fonctionnalités Pro pendant la période de
        validation, avec un badge Founder visible sur leur profil.
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
          <div className="pricing-card__badge-row" aria-hidden={!plan.featured}>
            {plan.featured && (
              <span className="pricing-card__badge">Offre premium</span>
            )}
          </div>
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
