import { Link } from "react-router-dom";
import brewerySupplierImage from "../../assets/store-dashboard/store-supplier-brewery.webp";
import cheeseSupplierImage from "../../assets/store-dashboard/store-supplier-cheese.webp";
import farmSupplierImage from "../../assets/store-dashboard/store-supplier-farm.webp";
import provenceSupplierImage from "../../assets/store-dashboard/store-supplier-provence.webp";
import DashboardIcon from "./DashboardIcon";

const supplierImages = {
  farm: farmSupplierImage,
  brewery: brewerySupplierImage,
  cheese: cheeseSupplierImage,
  provence: provenceSupplierImage,
};

function StoreRecommendedSuppliers({ suppliers }) {
  return (
    <section
      className="store-dashboard__recommended"
      aria-labelledby="recommended-suppliers-title"
    >
      <div className="store-dashboard__section-header">
        <h2 id="recommended-suppliers-title">Fournisseurs recommandés</h2>
        <Link to="/catalog">Explorer tous les fournisseurs</Link>
      </div>

      <div className="store-dashboard__supplier-grid">
        {suppliers.length ? (
          suppliers.map((supplier) => {
            const supplierPath = `/suppliers/${supplier.id}`;
            const supplierImage =
              supplierImages[supplier.visual] || supplierImages.farm;
            const productCount = Number.isFinite(Number(supplier.productCount))
              ? Number(supplier.productCount)
              : 0;

            return (
              <article
                className="store-dashboard__supplier-card"
                key={supplier.id}
              >
                <div
                  className={`store-dashboard__supplier-visual store-dashboard__supplier-visual--${supplier.visual}`}
                >
                  <img
                    className="store-dashboard__supplier-image"
                    src={supplierImage}
                    alt={`Aperçu du fournisseur ${supplier.companyName}`}
                    loading="lazy"
                  />

                  <span>
                    <DashboardIcon name="leaf" />
                  </span>
                </div>

                <div className="store-dashboard__supplier-body">
                  <h3>{supplier.companyName}</h3>

                  <div className="store-dashboard__supplier-meta">
                    <span>
                      <DashboardIcon name="map" />
                      {supplier.location}
                    </span>

                    <span>
                      <DashboardIcon name="tag" />
                      {supplier.businessType}
                    </span>
                  </div>

                  <div className="store-dashboard__supplier-footer">
                    {supplier.rating && (
                      <span>
                        <DashboardIcon name="star" />
                        {supplier.rating}
                      </span>
                    )}

                    <span className="store-dashboard__supplier-product-count">
                      <DashboardIcon name="package" />
                      {productCount} produit{productCount > 1 ? "s" : ""}
                    </span>
                  </div>

                  <Link className="store-dashboard__supplier-action" to={supplierPath}>
                    <DashboardIcon name="eye" />
                    <span>Voir le fournisseur</span>
                  </Link>
                </div>
              </article>
            );
          })
        ) : (
          <div className="store-dashboard__recommended-empty">
            <DashboardIcon name="building" />
            <div>
              <strong>Aucun fournisseur recommandé</strong>
              <p>
                Les fournisseurs correspondant à votre profil apparaîtront
                ici.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default StoreRecommendedSuppliers;
