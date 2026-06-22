import { Link } from "react-router-dom";
import { products } from "../../data/homeData";
import LandingIcon from "./LandingIcon";
import SectionHeading from "./SectionHeading";

function HomeProductPreview() {
  return (
    <section className="landing-section">
      <SectionHeading
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
  );
}

export default HomeProductPreview;
