import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/marketplace/ProductCard";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getSupplierImage } from "../../data/marketplaceVisuals";
import { getProducts } from "../../services/productService";
import { getSupplierById } from "../../services/supplierService";

function getSupplierFromResponse(response) {
  return response?.supplier || null;
}

function getProductsFromResponse(response) {
  return response?.products || [];
}

function getProductSupplierId(product) {
  return product.supplierId || product.supplier?.id;
}

function SupplierDetailPage() {
  const { id } = useParams();

  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadSupplierDetails() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [supplierResponse, productsResponse] = await Promise.all([
          getSupplierById(id),
          getProducts(),
        ]);

        if (!shouldUpdateState) return;

        setSupplier(getSupplierFromResponse(supplierResponse));
        setProducts(getProductsFromResponse(productsResponse));
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(error.message || "Impossible de charger le fournisseur.");
        }
      } finally {
        if (shouldUpdateState) setIsLoading(false);
      }
    }

    loadSupplierDetails();

    return () => {
      shouldUpdateState = false;
    };
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!supplier) return [];
    if (Array.isArray(supplier.products)) return supplier.products;
    return products.filter((product) => getProductSupplierId(product) === supplier.id);
  }, [products, supplier]);

  const requestPath = supplier ? `/requests/new?supplierId=${supplier.id}` : "/requests/new";

  return (
    <div className="kerno-page supplier-detail-page">
      {isLoading && <LoadingState message="Chargement du fournisseur..." />}

      {errorMessage && <ErrorState title="Fournisseur indisponible" message={errorMessage} />}

      {!isLoading && !errorMessage && !supplier && (
        <EmptyState
          title="Fournisseur introuvable"
          message="Ce fournisseur n'est plus disponible."
          action={<Link to="/catalog"><Button variant="secondary">Retour au catalogue</Button></Link>}
        />
      )}

      {!isLoading && !errorMessage && supplier && (
        <>
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/catalog">Fournisseurs</Link>
            <span>›</span>
            <strong>{supplier.companyName}</strong>
          </nav>

          <section className="supplier-hero-card">
            <img src={getSupplierImage(supplier)} alt="" />
            <div className="supplier-identity">
              <span className="supplier-logo-large">⌁</span>
              <div>
                <h1>{supplier.companyName}</h1>
                <p>
                  ◉ {supplier.location || "Caen, Normandie"} · ◇ {supplier.businessType || "Produits fermiers"} · ▣ {relatedProducts.length || 14} produits
                </p>
              </div>
              <span className="kerno-badge kerno-badge--soft">☆ 4.8</span>
              <div className="supplier-hero-actions">
                <Button variant="secondary">▯ Sauvegarder</Button>
                <Link to={requestPath}><Button>✉ Contacter ce fournisseur</Button></Link>
              </div>
            </div>
          </section>

          <section className="supplier-content">
            <div>
              <article className="kerno-panel about-panel">
                <h2>À propos</h2>
                <p>
                  {supplier.description ||
                    "Exploitation familiale engagée dans le circuit court, avec des produits disponibles directement auprès des commerces et restaurants locaux."}
                </p>
                <div className="tag-row">
                  <span>Agriculture locale</span>
                  <span>Circuit court</span>
                  <span>Livraison possible</span>
                  <span>Depuis 1987</span>
                </div>
              </article>

              <section className="supplier-products">
                <div className="section-heading">
                  <h2>Produits proposés</h2>
                  <Link to="/catalog">Voir tous les produits</Link>
                </div>
                {relatedProducts.length === 0 ? (
                  <EmptyState
                    title="Aucun produit visible"
                    message="Ce fournisseur n'a pas encore de produits publiés."
                  />
                ) : (
                  <div className="market-grid market-grid--supplier-products">
                    {relatedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="supplier-sidebar">
              <article className="kerno-panel info-panel">
                <h2>Informations</h2>
                {[
                  ["◉", "Localisation", supplier.location || "Caen, Normandie"],
                  ["☎", "Téléphone", supplier.phone || "+33 2 31 45 67 89"],
                  ["✉", "Email", supplier.contactEmail || "contact@ferme3vallees.fr"],
                  ["◎", "Site web", supplier.website || "www.ferme3vallees.fr"],
                  ["◷", "Membre depuis", "Janvier 2024"],
                ].map(([icon, label, value]) => (
                  <div className="info-row" key={label}>
                    <span>{icon}</span>
                    <div>
                      <small>{label}</small>
                      <strong>{value}</strong>
                    </div>
                  </div>
                ))}
              </article>

              <article className="kerno-panel stat-panel">
                <h2>Statistiques</h2>
                <div>
                  <strong>{relatedProducts.length || 14}</strong><span>Produits</span>
                </div>
                <div>
                  <strong>38</strong><span>Avis</span>
                </div>
                <div>
                  <strong>4.8/5</strong><span>Note</span>
                </div>
                <div>
                  <strong>&lt; 24h</strong><span>Réponse</span>
                </div>
              </article>

              <Link to={requestPath}><Button>✉ Envoyer une demande</Button></Link>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}

export default SupplierDetailPage;
