import SupplierProductsIcon from "./SupplierProductsIcon";

function SupplierProductMeta({ product }) {
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

      {product.minimumOrder && (
        <div>
          <dt>
            <SupplierProductsIcon name="box" />
            Minimum
          </dt>
          <dd>{product.minimumOrder}</dd>
        </div>
      )}
    </dl>
  );
}

export default SupplierProductMeta;
