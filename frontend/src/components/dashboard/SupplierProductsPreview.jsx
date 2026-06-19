import { Link } from "react-router-dom";
import ProductImage from "../ui/ProductImage";
import DashboardIcon from "./DashboardIcon";

function SupplierProductsPreview({ products }) {
  return (
    <section
      className="supplier-dashboard__featured"
      aria-labelledby="featured-products-title"
    >
      <div className="supplier-dashboard__section-header">
        <h2 id="featured-products-title">Produits publiés</h2>
        <Link to="/supplier/products">Voir tous les produits</Link>
      </div>

      <div className="supplier-dashboard__product-grid">
        {products.length ? (
          products.map((product) => (
            <article className="supplier-dashboard__product-card" key={product.id}>
              <div className="supplier-dashboard__product-visual">
                <ProductImage
                  className="supplier-dashboard__product-image"
                  product={product}
                  alt={`Aperçu du produit ${product.name}`}
                />
              </div>

              <div className="supplier-dashboard__product-body">
                <p>{product.categoryName}</p>
                <h3>{product.name}</h3>

                <div className="supplier-dashboard__product-meta">
                  <span>{product.priceInfo}</span>
                  <span>{product.availability}</span>
                </div>

                <div className="supplier-dashboard__product-footer">
                  <Link to={`/supplier/products/${product.id}/edit`}>Gérer</Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="supplier-dashboard__featured-empty">
            <DashboardIcon name="products" />
            <div>
              <strong>Aucun produit publié</strong>
              <p>Ajoutez un produit pour le voir apparaître dans cet aperçu.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SupplierProductsPreview;
