import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { getSupplierImage } from "../../data/marketplaceVisuals";

function SupplierCard({ supplier, index = 0 }) {
  const productCount = supplier.products?.length ?? supplier.productCount ?? 14;

  return (
    <article className="market-card supplier-card">
      <div className="market-card__media supplier-card__media">
        <img src={getSupplierImage(supplier, index)} alt={supplier.companyName} />
        <span className="supplier-card__logo">⌁</span>
      </div>

      <div className="market-card__body">
        <h3>{supplier.companyName}</h3>
        <p className="market-card__supplier">
          ◉ {supplier.location || "Normandie"} · ◇ {supplier.businessType || "Produits locaux"}
        </p>

        <div className="supplier-card__stats">
          <span>▣ {productCount} produits</span>
          <span>☆ 4.{8 - (index % 3)}</span>
        </div>

        <Link to={`/suppliers/${supplier.id}`}>
          <Button variant="mint">Voir le fournisseur</Button>
        </Link>
      </div>
    </article>
  );
}

export default SupplierCard;
