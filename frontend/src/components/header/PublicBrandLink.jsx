import { Link } from "react-router-dom";
import kernoLogo from "../../assets/brand/kerno-logo.webp";

function PublicBrandLink() {
  return (
    <Link to="/" className="brand-link" aria-label="Retour à l'accueil KERNO">
      <img className="brand-logo" src={kernoLogo} alt="" />
      <span className="brand-copy">
        <strong>KERNO</strong>
      </span>
    </Link>
  );
}

export default PublicBrandLink;
