import SupplierProductsIcon from "./SupplierProductsIcon";
import { formatMinimumOrder } from "../../utils/productPrice";

function SupplierProductMeta({ product }) {
  const minimumOrderLabel = formatMinimumOrder(product);

  return (
    <dl className="supplier-product-card__meta">
      {product.origin && (
        <div>
          <dt>
            <SupplierProductsIcon name="map" />
            Origine
          </dt>
          <dd>{product.origin}</dd>
        </div>
      )}

      {product.minimumOrderQuantity && (
        <div>
          <dt>
            <SupplierProductsIcon name="box" />
            Minimum
          </dt>
          <dd>{minimumOrderLabel}</dd>
        </div>
      )}
    </dl>
  );
}

export default SupplierProductMeta;
