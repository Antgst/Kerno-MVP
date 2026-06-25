import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { featuredSuppliers } from "../../data/homeData";
import ArrowIcon from "./ArrowIcon";
import LandingIcon from "./LandingIcon";
import SectionHeading from "./SectionHeading";

function FeaturedSuppliersCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleSuppliers = useMemo(
    () =>
      featuredSuppliers.map((_, index) => {
        const supplierIndex = (activeIndex + index) % featuredSuppliers.length;
        return featuredSuppliers[supplierIndex];
      }),
    [activeIndex],
  );

  function showPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? featuredSuppliers.length - 1 : currentIndex - 1,
    );
  }

  function showNext() {
    setActiveIndex((currentIndex) =>
      currentIndex === featuredSuppliers.length - 1 ? 0 : currentIndex + 1,
    );
  }

  return (
    <section className="landing-section landing-section--featured">
      <div className="landing-section__split-heading">
        <SectionHeading
        title="Fournisseurs à découvrir"
        subtitle="Une vitrine pour identifier des partenaires fiables — et gagner en visibilité auprès des magasins."
      />

        <div className="carousel-controls" aria-label="Navigation fournisseurs">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Afficher les fournisseurs précédents"
          >
            <ArrowIcon direction="previous" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Afficher les fournisseurs suivants"
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      </div>

      <div className="supplier-carousel" aria-live="polite">
        {visibleSuppliers.map((supplier) => (
          <article
            className="landing-card supplier-card"
            key={supplier.id}
          >
            <div
              className="supplier-card__visual"
              aria-label={`Aperçu du fournisseur ${supplier.name}`}
              role="img"
            >
              <img
                src={supplier.image}
                alt=""
                loading="lazy"
              />
            </div>

            <div className="supplier-card__body">
              <h3>{supplier.name}</h3>
              <p className="supplier-card__meta-line">
                <LandingIcon name="pin" />
                <span>{supplier.location}</span>
              </p>
              <p className="supplier-card__category">{supplier.category}</p>

              <div className="supplier-card__footer">
                <Link
                  className="landing-card-button"
                  to="/suppliers/demo-supplier"
                >
                  Voir le fournisseur
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedSuppliersCarousel;
