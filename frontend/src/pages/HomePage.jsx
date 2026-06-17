import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
  const [apiStatus, setApiStatus] = useState(
    apiBaseUrl ? "Vérification..." : "API non configurée",
  );

  useEffect(() => {
    if (!apiBaseUrl) {
      return;
    }

    fetch(`${apiBaseUrl.replace(/\/$/, "")}/health`)
      .then((response) => response.json())
      .then((data) => {
        setApiStatus(data.message || "API connectée");
      })
      .catch(() => {
        setApiStatus("Backend non joignable");
      });
  }, []);

  return (
    <main className="marketing-page">
      <section className="marketing-hero">
        <div className="marketing-hero__content">
          <p className="marketing-eyebrow">KERNO MVP</p>

          <h1>La passerelle B2B entre fournisseurs locaux et magasins.</h1>

          <p>
            Kerno aide les fournisseurs à présenter leurs produits et les
            magasins à découvrir, comparer et contacter les bons partenaires.
          </p>

          <div className="marketing-hero__actions">
            <Link className="marketing-button marketing-button--primary" to="/register">
              Créer un compte
            </Link>

            <Link className="marketing-button marketing-button--secondary" to="/login">
              Se connecter
            </Link>
          </div>

          <div className="marketing-status">
            <span>Statut API</span>
            <strong>{apiStatus}</strong>
          </div>
        </div>

        <div className="marketing-preview" aria-hidden="true">
          <div className="marketing-preview__top">
            <span />
            <span />
            <span />
          </div>

          <div className="marketing-preview__card marketing-preview__card--main">
            <div>
              <small>Marketplace</small>
              <strong>Fournisseurs à découvrir</strong>
            </div>

            <div className="marketing-preview__supplier">
              <div className="marketing-preview__avatar">NB</div>
              <div>
                <strong>Northern Beverages</strong>
                <small>Boissons · Nantes</small>
              </div>
            </div>
          </div>

          <div className="marketing-preview__grid">
            <div className="marketing-preview__mini-card">
              <small>Produits</small>
              <strong>24</strong>
            </div>

            <div className="marketing-preview__mini-card">
              <small>Demandes</small>
              <strong>8</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-section__header">
          <p className="marketing-eyebrow">Parcours MVP</p>
          <h2>Une chaîne simple, claire et réaliste.</h2>
          <p>
            Le MVP se concentre sur l’essentiel : compte, rôle, profil, produits,
            catalogue et demande de contact.
          </p>
        </div>

        <div className="marketing-steps">
          <article>
            <span>01</span>
            <h3>Créer son espace</h3>
            <p>
              Fournisseur ou magasin choisit son rôle dès l’inscription.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Compléter son profil</h3>
            <p>
              Les informations utiles sont centralisées pour inspirer confiance.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Publier ou rechercher</h3>
            <p>
              Les fournisseurs ajoutent leurs produits, les magasins explorent le catalogue.
            </p>
          </article>

          <article>
            <span>04</span>
            <h3>Contacter</h3>
            <p>
              Les magasins envoient une demande claire à un fournisseur.
            </p>
          </article>
        </div>
      </section>

      <section className="marketing-roles">
        <article className="marketing-role-card marketing-role-card--supplier">
          <p className="marketing-eyebrow">Fournisseurs</p>
          <h2>Présentez vos produits proprement.</h2>
          <p>
            Gérez votre profil fournisseur, ajoutez vos produits et suivez les
            demandes reçues depuis votre espace.
          </p>

          <Link className="marketing-button marketing-button--primary" to="/register">
            Commencer fournisseur
          </Link>
        </article>

        <article className="marketing-role-card marketing-role-card--store">
          <p className="marketing-eyebrow">Magasins</p>
          <h2>Trouvez les bons partenaires.</h2>
          <p>
            Explorez le catalogue, découvrez les fournisseurs et envoyez des
            demandes de contact qualifiées.
          </p>

          <Link className="marketing-button marketing-button--dark" to="/register">
            Commencer magasin
          </Link>
        </article>
      </section>
    </main>
  );
}

export default HomePage;
