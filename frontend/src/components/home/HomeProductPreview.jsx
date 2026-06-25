import { Link } from "react-router-dom";
import { products } from "../../data/homeData";
import SectionHeading from "./SectionHeading";

function getProductSourceLine(product) {
  return [product.supplier, product.origin].filter(Boolean).join(" · ");
}

function HomeProductPreview() {
  return (
    <section className="landing-section">
      <SectionHeading
        title="Produits à découvrir"
        subtitle="Découvrez quelques produits proposés par les fournisseurs référencés sur KERNO."
      />

      <div className="product-preview-grid">
        {products.map((product) => {
          const sourceLine = getProductSourceLine(product);

          return (
            <Link
              aria-label={`Voir le produit ${product.name}`}
              className="landing-card product-preview-card product-preview-card--interactive"
              key={product.id}
              to={`/products/${product.id}`}
            >
              <div className="product-preview-card__image">
                <img
                  src={product.image}
                  alt={`Aperçu du produit ${product.name}`}
                  loading="lazy"
                />
              </div>
              <div className="product-preview-card__body">
                {product.category && <p>{product.category}</p>}
                <h3>{product.name}</h3>
                {product.price && (
                  <p className="product-preview-card__price">{product.price}</p>
                )}
                {(sourceLine || product.availability) && (
                  <div className="product-preview-card__meta">
                    {sourceLine && (
                      <span className="product-preview-card__source">
                        {sourceLine}
                      </span>
                    )}
                    {product.availability && (
                      <span className="product-preview-card__status">
                        {product.availability}
                      </span>
                    )}
                  </div>
                )}
                <div className="product-preview-card__footer">
                  <span>Voir le produit</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default HomeProductPreview;
