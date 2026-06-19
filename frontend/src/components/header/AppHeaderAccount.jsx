import { Link } from "react-router-dom";
import HeaderIcon from "./HeaderIcon";

function AppHeaderAccount({
  accountInitials,
  accountName,
  accountRoleLabel,
  dashboardPath,
  isMenuOpen,
  onLogout,
  onMenuClose,
  onMenuToggle,
  profilePath,
}) {
  return (
    <div className="kerno-app-header__account">
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
          onClick={onMenuToggle}
        >
          <HeaderIcon name="chevron" />
        </button>

        {isMenuOpen && (
          <div className="kerno-app-header__dropdown">
            <Link to={dashboardPath} onClick={onMenuClose}>
              Tableau de bord
            </Link>

            <Link to={profilePath} onClick={onMenuClose}>
              Modifier le profil
            </Link>

            <Link to="/catalog" onClick={onMenuClose}>
              Catalogue
            </Link>

            <button
              type="button"
              className="kerno-app-header__logout"
              onClick={onLogout}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppHeaderAccount;
