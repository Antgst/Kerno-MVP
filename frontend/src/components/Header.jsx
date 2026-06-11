import { Link } from "react-router-dom";
import NavigationLink from "./NavigationLink";

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
