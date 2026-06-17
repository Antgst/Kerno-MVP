import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import appleJuiceImage from "../assets/landing/supplier-product-apple-juice.webp";
import biscuitsImage from "../assets/landing/supplier-product-buckwheat-biscuits.webp";
import honeyImage from "../assets/landing/supplier-product-honey.webp";
import jamImage from "../assets/landing/supplier-product-jam.webp";
import breweryImage from "../assets/landing/store-supplier-brewery.webp";
import cheeseImage from "../assets/landing/store-supplier-cheese.webp";
import farmImage from "../assets/landing/store-supplier-farm.webp";
import provenceImage from "../assets/landing/store-supplier-provence.webp";

const heroImages = [
  {
    id: "farm",
    image: farmImage,
    alt: "Fournisseur local présenté sur KERNO",
  },
  {
    id: "brewery",
    image: breweryImage,
    alt: "Brasserie artisanale locale présentée sur KERNO",
  },
  {
    id: "cheese",
    image: cheeseImage,
    alt: "Fromages et produits laitiers présentés sur KERNO",
  },
  {
    id: "provence",
    image: provenceImage,
    alt: "Producteur provençal présenté sur KERNO",
  },
];

const benefits = [
  {
    title: "Sourcing plus rapide",
    text: "Les magasins trouvent des offres locales lisibles, comparables dans un même espace professionnel.",
    icon: "search",
  },
  {
    title: "Visibilité fournisseur",
    text: "Les producteurs présentent leur activité, leurs produits et leurs informations utiles avec clarté.",
    icon: "storefront",
  },
  {
    title: "Demandes structurées",
    text: "Chaque premier contact contient le contexte nécessaire pour engager une discussion commerciale utile.",
    icon: "form",
  },
];

const featuredSuppliers = [
  {
    id: "farm",
    name: "Ferme des Trois Vallées",
    location: "Normandie",
    category: "Produits fermiers",
    image: farmImage,
  },
  {
    id: "brewery",
    name: "Brasserie du Nord",
    location: "Hauts-de-France",
    category: "Boissons artisanales",
    image: breweryImage,
  },
  {
    id: "cheese",
    name: "Maison Dupont",
    location: "Normandie",
    category: "Fromages & Laitages",
    image: cheeseImage,
  },
  {
    id: "provence",
    name: "Jardins de Provence",
    location: "Provence",
    category: "Herbes & Épices",
    image: provenceImage,
  },
  {
    id: "vergers",
    name: "Vergers du Littoral",
    location: "Bretagne",
    category: "Boissons fermières",
    image: farmImage,
  },
  {
    id: "atelier",
    name: "Atelier Saint-Malo",
    location: "Bretagne",
    category: "Biscuits & Épicerie",
    image: cheeseImage,
  },
];

const products = [
  {
    id: "honey",
    name: "Miel de fleurs sauvages",
    category: "Épicerie sucrée",
    price: "8,90 €",
    availability: "Disponible",
    views: 42,
    visualKey: "honey",
    image: honeyImage,
  },
  {
    id: "jam",
    name: "Confiture fraise rhubarbe",
    category: "Confitures",
    price: "5,40 €",
    availability: "Disponible",
    views: 36,
    visualKey: "jam",
    image: jamImage,
  },
  {
    id: "apple-juice",
    name: "Jus de pomme fermier",
    category: "Boissons",
    price: "3,80 €",
    availability: "Stock limité",
    views: 31,
    visualKey: "appleJuice",
    image: appleJuiceImage,
  },
  {
    id: "biscuits",
    name: "Biscuits au sarrasin",
    category: "Biscuits",
    price: "4,20 €",
    availability: "Disponible",
    views: 26,
    visualKey: "buckwheatBiscuits",
    image: biscuitsImage,
  },
];

const pricingPlans = [
  {
    name: "Freemium",
    description: "Un premier niveau pour présenter son activité et tester la plateforme.",
    bullets: [
      "Profil fournisseur public",
      "Catalogue essentiel",
      "Demandes structurées",
    ],
  },
  {
    name: "Découverte",
    description: "Une présence simple pour rendre les produits plus lisibles auprès des magasins.",
    bullets: [
      "Présentation enrichie",
      "Produits mis en forme",
      "Contact facilité",
    ],
  },
  {
    name: "Visibilité",
    description: "Une mise en avant plus forte dans le catalogue professionnel KERNO.",
    bullets: [
      "Mise en avant dans le catalogue",
      "Présentation fournisseur enrichie",
      "Sélections éditoriales",
    ],
  },
  {
    name: "Partenaire",
    description: "Un accompagnement plus complet pour structurer une présence commerciale locale.",
    bullets: [
      "Accompagnement de lancement",
      "Valorisation multi-produits",
      "Suivi commercial préparé",
    ],
  },
];

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="landing-section__heading">
      {eyebrow && <p className="landing-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function ArrowIcon({ direction }) {
  return (
    <span aria-hidden="true" className="carousel-arrow">
      {direction === "previous" ? "<" : ">"}
    </span>
  );
}

function LandingIcon({ name }) {
  const commonProps = {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    eye: (
      <svg {...commonProps}>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    search: (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    storefront: (
      <svg {...commonProps}>
        <path d="M4 10h16" />
        <path d="M5 10l1.2-5h11.6L19 10" />
        <path d="M6 10v9h12v-9" />
        <path d="M9 19v-5h6v5" />
      </svg>
    ),
    form: (
      <svg {...commonProps}>
        <rect width="14" height="16" x="5" y="4" rx="2" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    ),
    pin: (
      <svg {...commonProps}>
        <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  };

  return icons[name] ?? null;
}

function HeroImageShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
    }, 4200);

    return () => window.clearInterval(rotation);
  }, []);

  return (
    <aside className="hero-showcase" aria-label="Sélection visuelle KERNO">
      <div className="hero-showcase__frame">
        {heroImages.map((item, index) => (
          <img
            className={index === activeIndex ? "is-active" : undefined}
            key={item.id}
            src={item.image}
            alt={item.alt}
          />
        ))}
      </div>

      <div className="hero-showcase__dots" aria-label="Images de présentation">
        {heroImages.map((item, index) => (
          <button
            aria-label={`Afficher l'image ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            className={index === activeIndex ? "is-active" : undefined}
            key={item.id}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </aside>
  );
}

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
          eyebrow="Sélection"
          title="Fournisseurs à la une"
          subtitle="Une sélection de fournisseurs mis en avant pour renforcer leur visibilité auprès des magasins."
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

function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__background" aria-hidden="true">
          <img src={farmImage} alt="" />
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

      <section className="landing-section">
        <SectionHeading
          eyebrow="Valeur"
          title="Pourquoi KERNO crée de la valeur"
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

      <FeaturedSuppliersCarousel />

      <section className="landing-section">
        <SectionHeading
          eyebrow="Catalogue"
          title="Un catalogue pensé pour l'action"
        />

        <div className="product-preview-grid">
          {products.map((product) => (
            <article
              className="landing-card product-preview-card"
              key={product.id}
            >
              <div className="product-preview-card__image">
                <img
                  src={product.image}
                  alt={`Aperçu du produit ${product.name}`}
                  loading="lazy"
                />
              </div>
              <div className="product-preview-card__body">
                <p>{product.category}</p>
                <h3>{product.name}</h3>
                <div className="product-preview-card__meta">
                  <span>{product.price}</span>
                  <span>{product.availability}</span>
                </div>
                <div className="product-preview-card__footer">
                  <span>
                    <LandingIcon name="eye" />
                    {product.views} vues
                  </span>
                  <Link to="/products/demo-product">Voir le produit</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <SectionHeading
          eyebrow="Offres"
          title="Des offres adaptées aux fournisseurs"
          subtitle="Les plans seront précisés après validation du modèle commercial."
        />

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <article className="landing-card pricing-card" key={plan.name}>
              <div className="pricing-card__header">
                <h3>{plan.name}</h3>
                <strong>À définir</strong>
              </div>
              <p>{plan.description}</p>
              <ul>
                {plan.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-final-cta">
        <div>
          <p className="landing-eyebrow">Démarrer</p>
          <h2>Prêt à structurer votre sourcing local ?</h2>
          <p>
            KERNO rapproche fournisseurs et magasins dans un parcours simple,
            lisible et professionnel.
          </p>
        </div>

        <div className="landing-actions">
          <Link className="landing-button landing-button--light" to="/register">
            Créer un compte
          </Link>
          <Link
            className="landing-button landing-button--outline-light"
            to="/login"
          >
            Se connecter
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
