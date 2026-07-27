import { Link } from "react-router-dom";
import SupplierProductsIcon from "./SupplierProductsIcon";

function SupplierProductActions({ deletingProductId, onDelete, product }) {
  return (
    <div className="supplier-product-card__actions">
      <Link
        className="supplier-product-card__action supplier-product-card__action--primary"
        to={`/products/${product.id}`}
      >
        <SupplierProductsIcon name="eye" />
        Voir le produit
      </Link>

      <Link
        className="supplier-product-card__action"
        to={`/supplier/products/${product.id}/edit`}
      >
        <SupplierProductsIcon name="edit" />
        Modifier
      </Link>

      <button
        className="supplier-product-card__delete"
        type="button"
        disabled={deletingProductId === product.id}
        onClick={() => onDelete(product.id)}
        aria-label={`Retirer ${product.name}`}
        title="Retirer le produit"
      >
        <SupplierProductsIcon name="trash" />
      </button>
    </div>
  );
}

export default SupplierProductActions;
