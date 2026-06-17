import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import NavigationLink from "./NavigationLink";

const publicNavLinks = [
  { label: "Accueil", to: "/", isPrimaryRoute: true },
  { label: "Catalogue", to: "/catalog", isPrimaryRoute: true },
  { label: "Fournisseurs", to: "/catalog" },
  { label: "Magasins", to: "/register" },
];

function Header({ variant = "public" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (variant === "app") {
    const appNavLinks = [
      { label: "Tableau de bord", to: "/store/dashboard", icon: "▦" },
      { label: "Catalogue", to: "/catalog", icon: "⌕" },
      { label: "Mes demandes", to: "/store/requests", icon: "✉" },
      { label: "Fournisseurs", to: "/catalog?tab=suppliers", icon: "▤" },
    ];

    function handleLogout() {
      logoutUser();
      navigate("/login");
    }

    return (
      <header className="kerno-navbar">
        <div className="kerno-navbar__inner">
          <Link to="/store/dashboard" className="kerno-brand" aria-label="KERNO">
            <span className="kerno-brand__mark">⌁</span>
            <span>KERNO</span>
          </Link>

          <nav className="kerno-navbar__links" aria-label="Navigation principale">
            {appNavLinks.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  [
                    "kerno-navlink",
                    isActive ? "kerno-navlink--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
                key={link.label}
                to={link.to}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="kerno-navbar__meta">
            <button className="kerno-notification" type="button" aria-label="Notifications">
              <span aria-hidden="true">♧</span>
              <strong>3</strong>
            </button>

            <Link to="/store/profile" className="kerno-user">
              <span className="kerno-user__avatar">EM</span>
              <span className="kerno-user__copy">
                <strong>Épicerie Martin</strong>
                <small>Magasin</small>
              </span>
              <span aria-hidden="true">⌄</span>
            </Link>

            <button
              className="kerno-menu-button"
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="kerno-mobile-menu"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div
          className={[
            "kerno-mobile-menu",
            isMenuOpen ? "kerno-mobile-menu--open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          id="kerno-mobile-menu"
        >
          {appNavLinks.map((link) => (
            <NavLink
              className="kerno-mobile-menu__link"
              key={`mobile-${link.label}`}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
          <Link
            className="kerno-mobile-menu__link"
            to="/store/profile"
            onClick={() => setIsMenuOpen(false)}
          >
            <span aria-hidden="true">☻</span>
            Profil
          </Link>
          <button className="kerno-mobile-menu__link" type="button" onClick={handleLogout}>
            <span aria-hidden="true">↩</span>
            Déconnexion
          </button>
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
