import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/marketplace/ProductCard";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import { getProductImage } from "../../data/marketplaceVisuals";
import { getProducts, getProductById } from "../../services/productService";

function getProductFromResponse(response) {
  return response?.product || null;
}

function getProductsFromResponse(response) {
  return response?.products || [];
}

function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadProduct() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [productResponse, productsResponse] = await Promise.all([
          getProductById(id),
          getProducts(),
        ]);

        if (shouldUpdateState) {
          const loadedProduct = getProductFromResponse(productResponse);
          setProduct(loadedProduct);
          setRelatedProducts(
            getProductsFromResponse(productsResponse).filter(
              (item) =>
                item.id !== loadedProduct?.id &&
                item.supplier?.id === loadedProduct?.supplier?.id,
            ),
          );
        }
      } catch (error) {
        if (shouldUpdateState) {
          setErrorMessage(error.message || "Impossible de charger le produit.");
        }
      } finally {
        if (shouldUpdateState) setIsLoading(false);
      }
    }

    loadProduct();

    return () => {
      shouldUpdateState = false;
    };
  }, [id]);

  const supplier = product?.supplier;
  const category = product?.category;
  const requestPath = supplier?.id
    ? `/requests/new?supplierId=${supplier.id}&productId=${product.id}`
    : "/requests/new";

  return (
    <div className="kerno-page detail-page">
      {isLoading && <LoadingState message="Chargement du produit..." />}

      {errorMessage && <ErrorState title="Produit indisponible" message={errorMessage} />}

      {!isLoading && !errorMessage && !product && (
        <EmptyState
          title="Produit introuvable"
          message="Le produit a peut-être été retiré du catalogue."
          action={<Link to="/catalog"><Button variant="secondary">Retour au catalogue</Button></Link>}
        />
      )}

      {!isLoading && !errorMessage && product && (
        <>
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/catalog">Catalogue</Link>
            <span>›</span>
            <span>{category?.name || "Épicerie fine"}</span>
            <span>›</span>
            <strong>{product.name}</strong>
          </nav>

          <section className="product-detail-layout">
            <div className="product-gallery">
              <img className="product-gallery__main" src={getProductImage(product)} alt={product.name} />
              <div className="product-gallery__thumbs">
                {[0, 1, 2].map((offset) => (
                  <button className={offset === 0 ? "is-active" : ""} key={offset} type="button">
                    <img src={getProductImage(product, offset)} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <aside className="product-info">
              <div className="product-kicker">
                <span className="kerno-badge kerno-badge--soft">
                  {product.isActive ? "Disponible" : "Indisponible"}
                </span>
                <span>{category?.name || "Épicerie fine"}</span>
              </div>

              <h1>{product.name}</h1>
              <p className="product-subtitle">{product.origin || "Récolte printanière, fleurs sauvages de Normandie"}</p>
              <p className="product-price">{product.priceInfo || "12,50 € / pot 500g"}</p>

              <article className="kerno-panel product-description">
                <h2>Description</h2>
                <p>{product.description || "Produit local authentique, sélectionné pour les commerces cherchant des références artisanales et régulières."}</p>
                <dl>
                  <div><dt>Unité</dt><dd>{product.minimumOrder || "Pot 500g"}</dd></div>
                  <div><dt>Stock minimum</dt><dd>6 pots</dd></div>
                  <div><dt>Délai livraison</dt><dd>3-5 jours</dd></div>
                  <div><dt>Certification</dt><dd>Agriculture locale</dd></div>
                </dl>
              </article>

              <div className="quantity-row">
                <span>Quantité estimée :</span>
                <div className="quantity-stepper">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
                  <strong>{quantity}</strong>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button>
                </div>
                <small>pots</small>
              </div>

              <Link to={requestPath}><Button>✉ Envoyer une demande de contact</Button></Link>
              <Button variant="secondary">▯ Sauvegarder ce produit</Button>

              {supplier && (
                <Link className="supplier-mini-card" to={`/suppliers/${supplier.id}`}>
                  <span>⌁</span>
                  <div>
                    <strong>{supplier.companyName}</strong>
                    <small>◉ {supplier.location || "Normandie"} · ☆ 4.8</small>
                  </div>
                  <em>Voir profil →</em>
                </Link>
              )}
            </aside>
          </section>

          <section className="related-section">
            <h2>Autres produits de ce fournisseur</h2>
            <div className="market-grid market-grid--related">
              {(relatedProducts.length ? relatedProducts : [product]).slice(0, 3).map((item, index) => (
                <ProductCard key={`${item.id}-${index}`} product={item} index={index + 1} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default ProductDetailPage;
