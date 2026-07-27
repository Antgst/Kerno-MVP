import { Link } from "react-router-dom";
import CatalogProductInformation from "./CatalogProductInformation";
import CatalogProductVisual from "./CatalogProductVisual";
import { formatProductPrice } from "../../utils/productPrice";

function handleKeyDown(event) {
  if (event.key === " ") {
    event.preventDefault();
    event.currentTarget.click();
  }
}

function CatalogProductCard({ product, supplier, viewMode, priority = false }) {
  const productName = product.name || "Produit sans nom";

  const cardContent = (
    <>
      <CatalogProductVisual product={product} priority={priority} />
      <div className="catalog-product-body">
        <div className="catalog-product-content">
          <CatalogProductInformation product={product} supplier={supplier} />
        </div>

        <div className="catalog-product-footer">
          <p className="catalog-product-price">
            {formatProductPrice(product)}
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
        data-testid="catalog-product-card"
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
      data-testid="catalog-product-card"
      onKeyDown={handleKeyDown}
    >
      {cardContent}
    </Link>
  );
}

export default CatalogProductCard;
