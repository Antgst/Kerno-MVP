import { Link } from "react-router-dom";
import NavigationLink from "./NavigationLink";

const publicNavLinks = [
  { label: "Accueil", to: "/", isPrimaryRoute: true },
  { label: "Catalogue", to: "/catalog", isPrimaryRoute: true },
  { label: "Fournisseurs", to: "/catalog" },
  { label: "Magasins", to: "/register" },
];

function Header({ variant = "public" }) {
  if (variant === "app") {
    return (
      <header className="site-header site-header--app">
        <div>
          <p className="app-header__eyebrow">KERNO MVP</p>
          <strong>Frontend navigation shell</strong>
        </div>

        <div className="app-header__actions">
          <span>Stage 4</span>
          <NavigationLink to="/catalog" variant="header-cta">
            Open catalog
          </NavigationLink>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header site-header--public">
      <Link to="/" className="brand-link" aria-label="Retour à l'accueil KERNO">
        <span className="brand-mark">K</span>
        <span className="brand-copy">
          <strong>KERNO</strong>
        </span>
      </Link>

      <nav className="public-nav" aria-label="Navigation publique">
        {publicNavLinks.map((link) =>
          link.isPrimaryRoute ? (
            <NavigationLink
              key={`${link.label}-${link.to}`}
              to={link.to}
              variant="header"
            >
              {link.label}
            </NavigationLink>
          ) : (
            <Link
              className="navigation-link navigation-link--header"
              key={`${link.label}-${link.to}`}
              to={link.to}
            >
              {link.label}
            </Link>
          ),
        )}
      </nav>

      <div className="public-header-actions">
        <NavigationLink to="/login" variant="header">
          Se connecter
        </NavigationLink>
        <NavigationLink to="/register" variant="header-cta">
          Créer un compte
        </NavigationLink>
      </div>
    </header>
  );
}

export default Header;
