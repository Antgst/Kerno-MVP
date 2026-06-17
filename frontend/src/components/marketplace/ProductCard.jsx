import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { getProductImage } from "../../data/marketplaceVisuals";

function ProductCard({ product, index = 0 }) {
  const supplier = product.supplier;

  return (
    <article className="market-card product-card">
      <div className="market-card__media">
        <img src={getProductImage(product, index)} alt={product.name} />
        <span className="kerno-badge kerno-badge--soft">
          {product.isActive ? "Disponible" : "Indisponible"}
        </span>
      </div>

      <div className="market-card__body">
        <p className="market-card__meta">{product.category?.name || "Épicerie fine"}</p>
        <h3>{product.name}</h3>
        <p className="market-card__supplier">▣ {supplier?.companyName || "Fournisseur local"}</p>

        <p className="market-card__price">{product.priceInfo || "Prix sur demande"}</p>

        <div className="market-card__actions">
          <Link to={`/products/${product.id}`}>
            <Button>Voir le produit</Button>
          </Link>
          <Link to={`/requests/new?supplierId=${supplier?.id || ""}&productId=${product.id}`}>
            <Button variant="secondary">✉ Contacter</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
