import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavigationLink from "./NavigationLink";
import { getCurrentAuthRole, logoutUser } from "../services/authService";
import { getCurrentUser } from "../services/userService";
import { getAuthToken } from "../services/tokenStorage";
import { getUserFromToken } from "../utils/jwt";
import { getResource } from "../utils/responseUtils";
import kernoLogo from "../assets/brand/kerno-logo.webp";

const storeNavigation = [
  { to: "/store/dashboard", label: "Tableau de bord", icon: "grid", end: true },
  { to: "/catalog", label: "Catalogue", icon: "search" },
  { to: "/store/requests", label: "Mes demandes", icon: "mail" },
  { to: "/store/profile", label: "Mon profil", icon: "user" },
];

const supplierNavigation = [
  { to: "/supplier/dashboard", label: "Tableau de bord", icon: "grid", end: true },
  { to: "/supplier/products", label: "Produits", icon: "box" },
  { to: "/supplier/requests", label: "Demandes", icon: "mail" },
  { to: "/supplier/profile", label: "Mon profil", icon: "user" },
  { to: "/catalog", label: "Catalogue", icon: "search" },
];

const publicNavLinks = [
  { label: "Accueil", to: "/", isPrimaryRoute: true },
  { label: "Catalogue", to: "/catalog", isPrimaryRoute: true },
  { label: "Fournisseurs", to: "/catalog" },
  { label: "Magasins", to: "/register" },
];

function HeaderIcon({ name }) {
  const commonProps = {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    bell: (
      <svg {...commonProps}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    box: (
      <svg {...commonProps}>
        <path d="m21 16-9 5-9-5" />
        <path d="m21 12-9 5-9-5" />
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      </svg>
    ),
    chevron: (
      <svg {...commonProps}>
        <path d="m6 9 6 6 6-6" />
      </svg>
    ),
    grid: (
      <svg {...commonProps}>
        <rect width="7" height="7" x="3" y="3" rx="1.5" />
        <rect width="7" height="7" x="14" y="3" rx="1.5" />
        <rect width="7" height="7" x="3" y="14" rx="1.5" />
        <rect width="7" height="7" x="14" y="14" rx="1.5" />
      </svg>
    ),
    leaf: (
      <svg {...commonProps}>
        <path d="M20 4c-6.6.4-11.4 3.1-14.2 8.2-1.7 3.1-.2 6.9 3.2 7.8 3.8 1 7.2-1.5 8.5-5.3C18.4 12 18.8 8.1 20 4Z" />
        <path d="M8 16c2.2-2.9 5-5.1 8.5-6.6" />
      </svg>
    ),
    mail: (
      <svg {...commonProps}>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    search: (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    user: (
      <svg {...commonProps}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  return icons[name] ?? null;
}

function Header({ variant = "public", onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPublicHeaderScrolled, setIsPublicHeaderScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 12,
  );
  const [accountIdentity, setAccountIdentity] = useState({
    user: getUserFromToken(getAuthToken()),
  });
  const role = getCurrentAuthRole();

  const isStoreSpace =
    String(role || "").toUpperCase() === "STORE" ||
    location.pathname.startsWith("/store") ||
    location.pathname.startsWith("/requests/new");

  const dashboardPath = isStoreSpace
    ? "/store/dashboard"
    : "/supplier/dashboard";

  const profilePath = isStoreSpace ? "/store/profile" : "/supplier/profile";
  const navigationItems = isStoreSpace ? storeNavigation : supplierNavigation;
  const userDisplayName =
    accountIdentity.user?.displayName || accountIdentity.user?.name;
  const userFullName = [
    accountIdentity.user?.firstName,
    accountIdentity.user?.lastName,
  ]
    .filter(Boolean)
    .join(" ");
  const accountName =
    userDisplayName ||
    userFullName ||
    accountIdentity.user?.email ||
    "Profil à compléter";
  const accountRoleLabel = role
    ? isStoreSpace
      ? "Magasin"
      : "Fournisseur"
    : "Profil à compléter";
  const accountInitials =
    accountName === "Profil à compléter"
      ? "K"
      : accountName
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

  function handleLogout() {
    logoutUser();
    setIsMenuOpen(false);
    navigate("/");
  }

  useEffect(() => {
    if (variant !== "public") {
      return undefined;
    }

    function updateHeaderState() {
      setIsPublicHeaderScrolled(window.scrollY > 12);
    }

    window.addEventListener("scroll", updateHeaderState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
    };
  }, [variant]);

  useEffect(() => {
    if (variant !== "app") {
      return undefined;
    }

    let shouldUpdateState = true;

    async function loadAccountIdentity() {
      const userResult = await getCurrentUser().catch(() => null);

      if (!shouldUpdateState) {
        return;
      }

      const user =
        getResource(userResult, ["user"]) || getUserFromToken(getAuthToken());

      setAccountIdentity({ user });
    }

    loadAccountIdentity();

    return () => {
      shouldUpdateState = false;
    };
  }, [isStoreSpace, variant]);

  if (variant === "app") {
    return (
      <header className="kerno-app-header">
        <div className="kerno-app-header__brand-row">
          <button
            type="button"
            className="kerno-app-header__menu"
            onClick={onMenuClick}
            aria-label="Ouvrir la navigation"
          >
            <span />
            <span />
            <span />
          </button>

          <Link to={dashboardPath} className="kerno-app-header__brand">
            <span className="kerno-app-header__brand-mark">
              <img src={kernoLogo} alt="" />
            </span>
            <span className="kerno-app-header__brand-name">KERNO</span>
          </Link>

          <nav
            className="kerno-app-header__nav"
            aria-label="Navigation principale"
          >
            {navigationItems.map((item) => (
              <NavigationLink
                key={item.to}
                to={item.to}
                end={item.end}
                variant="app-nav"
              >
                <HeaderIcon name={item.icon} />
                <span>{item.label}</span>
              </NavigationLink>
            ))}
          </nav>
        </div>

        <div className="kerno-app-header__account">
          <button
            type="button"
            className="kerno-app-header__notification"
            aria-label="Notifications"
          >
            <HeaderIcon name="bell" />
          </button>

          <div className="kerno-app-header__avatar">{accountInitials}</div>

          <div className="kerno-app-header__account-copy">
            <strong>{accountName}</strong>
            <small>{accountRoleLabel}</small>
          </div>

          <div className="kerno-app-header__menu-wrapper">
            <button
              type="button"
              className="kerno-app-header__more"
              aria-label="Ouvrir le menu du compte"
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            >
              <HeaderIcon name="chevron" />
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
    <header
      className={[
        "site-header",
        "site-header--public",
        "public-header--glass",
        isPublicHeaderScrolled ? "public-header--scrolled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link to="/" className="brand-link" aria-label="Retour à l'accueil KERNO">
        <img className="brand-logo" src={kernoLogo} alt="" />
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
        <NavigationLink to="/login" variant="header-ghost">
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
