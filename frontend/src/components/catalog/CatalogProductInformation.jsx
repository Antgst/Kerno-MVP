import CatalogIcon from "./CatalogIcon";
import { formatMinimumOrder } from "../../utils/productPrice";

function CatalogProductInformation({ product, supplier }) {
  const minimumOrderLabel = formatMinimumOrder(product);

  return (
    <>
      <div className="catalog-product-heading">
        <h2>{product.name || "Produit sans nom"}</h2>
      </div>

      {supplier?.companyName && (
        <p className="catalog-product-supplier">{supplier.companyName}</p>
      )}

      <dl className="catalog-product-meta">
        {product.origin && (
          <div>
            <dt>
              <CatalogIcon name="map" />
              Origine
            </dt>
            <dd>{product.origin}</dd>
          </div>
        )}

        {product.minimumOrderQuantity && (
          <div>
            <dt>
              <CatalogIcon name="box" />
              Colisage
            </dt>
            <dd>{minimumOrderLabel}</dd>
          </div>
        )}
      </dl>
    </>
  );
}

export default CatalogProductInformation;
