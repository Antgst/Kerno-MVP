import { Link } from "react-router-dom";
import CatalogProductInformation from "./CatalogProductInformation";
import CatalogProductVisual from "./CatalogProductVisual";

function CatalogProductCard({ product, supplier, viewMode }) {
  const productName = product.name || "Produit sans nom";

  function handleKeyDown(event) {
    if (event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  const cardContent = (
    <>
      <CatalogProductVisual product={product} />
      <div className="catalog-product-body">
        <div className="catalog-product-content">
          <CatalogProductInformation product={product} supplier={supplier} />
        </div>

        <div className="catalog-product-footer">
          <p className="catalog-product-price">
            {product.priceInfo || "Tarif sur demande"}
          </p>
          <span className="catalog-product-action">Voir le produit</span>
        </div>
      </div>
    </>
  );

  if (!product.id) {
    return (
      <article
        className={`catalog-product-card catalog-product-card--${viewMode}`}
      >
        {cardContent}
      </article>
    );
  }

  return (
    <Link
      className={`catalog-product-card catalog-product-card--${viewMode}`}
      to={`/products/${product.id}`}
      aria-label={`Voir le produit ${productName}`}
      onKeyDown={handleKeyDown}
    >
      {cardContent}
    </Link>
  );
}

export default CatalogProductCard;
