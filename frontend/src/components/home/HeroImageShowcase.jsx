import { useEffect, useState } from "react";
import { heroImages } from "../../data/homeData";

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

export default HeroImageShowcase;
