import { benefits } from "../../data/homeData";
import LandingIcon from "./LandingIcon";
import SectionHeading from "./SectionHeading";

function HomeBenefits() {
  return (
    <section className="landing-section">
      <SectionHeading
        title="Pourquoi KERNO crée de la valeur ?"
      />

      <div className="landing-card-grid landing-card-grid--three">
        {benefits.map((benefit) => (
          <article className="landing-card benefit-card" key={benefit.title}>
            <span className="benefit-card__icon">
              <LandingIcon name={benefit.icon} />
            </span>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeBenefits;
