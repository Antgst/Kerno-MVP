import { Link } from "react-router-dom";
import kernoLogo from "../../assets/brand/kerno-logo.webp";

function AppHeaderBrand({ dashboardPath, onMenuClick }) {
  return (
    <>
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
    </>
  );
}

export default AppHeaderBrand;
