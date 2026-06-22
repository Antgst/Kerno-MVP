import { Link } from "react-router-dom";
import SupplierProductsIcon from "./SupplierProductsIcon";

function SupplierProductsHeader() {
  return (
    <header className="supplier-products-header">
      <div>
        <p className="supplier-products-header__eyebrow">
          Espace fournisseur
        </p>
        <h1>Mes produits</h1>
        <p>Gérez les produits visibles par les magasins.</p>
      </div>

      <Link
        className="supplier-products-header__action"
        to="/supplier/products/new"
      >
        <SupplierProductsIcon name="plus" />
        Ajouter un produit
      </Link>
    </header>
  );
}

export default SupplierProductsHeader;
