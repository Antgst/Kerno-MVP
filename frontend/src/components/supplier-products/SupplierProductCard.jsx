import SupplierProductActions from "./SupplierProductActions";
import SupplierProductMeta from "./SupplierProductMeta";
import SupplierProductVisual from "./SupplierProductVisual";
import { formatProductPrice } from "../../utils/productPrice";

function SupplierProductCard({
  deletingProductId,
  onDelete,
  product,
  supplierName,
  viewMode,
}) {
  const categoryName = product.category?.name || "Sans catégorie";

  return (
    <article
      className={`supplier-product-card supplier-product-card--${viewMode}`}
    >
      <SupplierProductVisual product={product} />

      <div className="supplier-product-card__body">
        <div className="supplier-product-card__heading">
          <div>
            <p className="supplier-product-card__category">{categoryName}</p>
            <h2>{product.name || "Produit sans nom"}</h2>
          </div>

          <span className="supplier-product-card__reference">
            Réf. {String(product.id || "").slice(0, 8).toUpperCase()}
          </span>
        </div>

        <p className="supplier-product-card__supplier">
          {product.supplier?.companyName || supplierName || "Votre entreprise"}
        </p>

        <p className="supplier-product-card__description">
          {product.description ||
            "Aucune description n’a encore été renseignée pour ce produit."}
        </p>

        <SupplierProductMeta product={product} />

        <div className="supplier-product-card__footer">
          <div className="supplier-product-card__price">
            <small>Information tarifaire</small>
            <strong>{formatProductPrice(product)}</strong>
          </div>

          <SupplierProductActions
            deletingProductId={deletingProductId}
            onDelete={onDelete}
            product={product}
          />
        </div>
      </div>
    </article>
  );
}

export default SupplierProductCard;
