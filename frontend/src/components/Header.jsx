import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavigationLink from "./NavigationLink";
import { logoutUser } from "../services/authService";

function Header({ variant = "public", onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isStoreSpace =
    location.pathname.startsWith("/store") ||
    location.pathname.startsWith("/requests/new");

  const dashboardPath = isStoreSpace
    ? "/store/dashboard"
    : "/supplier/dashboard";

  const profilePath = isStoreSpace
    ? "/store/profile"
    : "/supplier/profile";

  function handleLogout() {
    logoutUser();
    setIsMenuOpen(false);
    navigate("/login");
  }

  if (variant === "app") {
    return (
      <header className="kerno-app-header">
        <div className="kerno-app-header__left">
          <button
            type="button"
            className="kerno-app-header__menu"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <span />
            <span />
            <span />
          </button>

          <div className="kerno-app-header__search">
            <span className="kerno-app-header__search-icon">⌕</span>
            <input
              type="text"
              placeholder={
                isStoreSpace
                  ? "Rechercher un fournisseur ou un produit"
                  : "Rechercher un produit, une demande ou un magasin"
              }
            />
          </div>
        </div>

        <div className="kerno-app-header__account">
          <div className="kerno-app-header__avatar">
            {isStoreSpace ? "M" : "F"}
          </div>

          <div className="kerno-app-header__account-copy">
            <strong>Compte connecté</strong>
            <small>{isStoreSpace ? "Espace magasin" : "Espace fournisseur"}</small>
          </div>

          <div className="kerno-app-header__menu-wrapper">
            <button
              type="button"
              className="kerno-app-header__more"
              aria-label="Open account menu"
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            >
              •••
            </button>

            {isMenuOpen && (
              <div className="kerno-app-header__dropdown">
                <Link to={dashboardPath} onClick={() => setIsMenuOpen(false)}>
                  Tableau de bord
                </Link>

                <Link to={profilePath} onClick={() => setIsMenuOpen(false)}>
                  Modifier le profil
                </Link>

                <Link to="/catalog" onClick={() => setIsMenuOpen(false)}>
                  Catalogue
                </Link>

                <button
                  type="button"
                  className="kerno-app-header__logout"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header site-header--public">
      <Link to="/" className="brand-link" aria-label="Go to Kerno home">
        <span className="brand-mark">K</span>
        <span className="brand-copy">
          <strong>KERNO</strong>
          <small>B2B supplier network</small>
        </span>
      </Link>

      <nav className="public-nav" aria-label="Public navigation">
        <NavigationLink to="/" variant="header">
          Home
        </NavigationLink>

        <NavigationLink to="/login" variant="header">
          Login
        </NavigationLink>

        <NavigationLink to="/register" variant="header-cta">
          Get started
        </NavigationLink>
      </nav>
    </header>
  );
}

export default Header;
