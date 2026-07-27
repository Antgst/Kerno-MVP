import { useEffect, useRef } from "react";
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
  const accountMenuRef = useRef(null);
  const onMenuCloseRef = useRef(onMenuClose);

  useEffect(() => {
    onMenuCloseRef.current = onMenuClose;
  }, [onMenuClose]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    function handleDocumentPointerDown(event) {
      if (accountMenuRef.current?.contains(event.target)) {
        return;
      }

      onMenuCloseRef.current();
    }

    function handleDocumentKeyDown(event) {
      if (event.key === "Escape") {
        onMenuCloseRef.current();
      }
    }

    const outsideEventName = window.PointerEvent ? "pointerdown" : "mousedown";

    document.addEventListener(outsideEventName, handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener(outsideEventName, handleDocumentPointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="kerno-app-header__account" ref={accountMenuRef}>
      <button
        type="button"
        className="kerno-app-header__account-trigger"
        aria-label={
          isMenuOpen ? "Fermer le menu du compte" : "Ouvrir le menu du compte"
        }
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        onClick={onMenuToggle}
      >
        <span className="kerno-app-header__avatar">{accountInitials}</span>

        <span className="kerno-app-header__account-copy">
          <strong>{accountName}</strong>
          <small>{accountRoleLabel}</small>
        </span>

        <span
          className={[
            "kerno-app-header__more",
            isMenuOpen ? "kerno-app-header__more--open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <HeaderIcon name="chevron" />
        </span>
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
  );
}

export default AppHeaderAccount;
