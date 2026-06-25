import { howItWorksSteps } from "../../data/homeData";
import SectionHeading from "./SectionHeading";

function HomeHowItWorks() {
  return (
    <section className="landing-section landing-section--how">
      <SectionHeading
        title="Comment ça marche"
        subtitle="Un parcours simple pour passer d’un profil fournisseur à une demande magasin exploitable."
      />

      <div className="landing-card-grid landing-card-grid--three how-steps">
        {howItWorksSteps.map((step) => (
          <article className="landing-card how-step-card" key={step.step}>
            <span className="how-step-card__number">{step.step}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeHowItWorks;
