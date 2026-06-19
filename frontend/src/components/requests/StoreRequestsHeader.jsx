import { Link } from "react-router-dom";

function StoreRequestsHeader() {
  return (
    <header className="supplier-requests-header">
      <div>
        <p className="supplier-requests-header__eyebrow">Espace magasin</p>
        <h1>Demandes envoyées</h1>
        <p>
          Suivez les demandes de contact et de devis envoyées aux fournisseurs.
        </p>
      </div>

      <Link className="store-requests-header__action" to="/catalog">
        Explorer le catalogue
      </Link>
    </header>
  );
}

export default StoreRequestsHeader;
