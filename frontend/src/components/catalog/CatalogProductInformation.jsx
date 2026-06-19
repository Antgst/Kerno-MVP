import CatalogIcon from "./CatalogIcon";

function CatalogProductInformation({ product, supplier }) {
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

        {product.minimumOrder && (
          <div>
            <dt>
              <CatalogIcon name="box" />
              Colisage
            </dt>
            <dd>{product.minimumOrder}</dd>
          </div>
        )}
      </dl>
    </>
  );
}

export default CatalogProductInformation;
