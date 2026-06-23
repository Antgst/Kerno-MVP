import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "./header/AppHeader";
import PublicHeader from "./header/PublicHeader";
import {
  publicNavLinks,
  storeNavigation,
  supplierNavigation,
} from "./header/headerNavigation";
import {
  getAccountDetails,
  getDashboardPath,
  getIsStoreSpace,
  getProfilePath,
} from "./header/headerAccount";
import { getCurrentAuthRole, isAuthenticated, logoutUser } from "../services/authService";
import { getCurrentUser } from "../services/userService";
import { getAuthToken } from "../services/tokenStorage";
import { getUserFromToken } from "../utils/jwt";
import { getResource } from "../utils/responseUtils";

function Header({ variant = "public", onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPublicHeaderScrolled, setIsPublicHeaderScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 12,
  );
  const isUserAuthenticated = isAuthenticated();
  const [accountIdentity, setAccountIdentity] = useState({
    user: getUserFromToken(getAuthToken()),
  });
  const role = getCurrentAuthRole();

  const isStoreSpace = getIsStoreSpace(role, location.pathname);
  const dashboardPath = getDashboardPath(isStoreSpace);
  const profilePath = getProfilePath(isStoreSpace);
  const navigationItems = isStoreSpace ? storeNavigation : supplierNavigation;
  const { accountInitials, accountName, accountRoleLabel } = getAccountDetails(
    accountIdentity,
    role,
    isStoreSpace,
  );

  function closeAccountMenu() {
    setIsMenuOpen(false);
  }

  function toggleAccountMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function handleLogout() {
    logoutUser();
    closeAccountMenu();
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
    if (variant !== "app" && !isUserAuthenticated) {
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
  }, [isStoreSpace, variant, isUserAuthenticated]);

  const shouldRenderAppHeader =
    variant === "app" || (variant === "public" && isUserAuthenticated);

  if (shouldRenderAppHeader) {
    return (
      <AppHeader
        accountInitials={accountInitials}
        accountName={accountName}
        accountRoleLabel={accountRoleLabel}
        dashboardPath={dashboardPath}
        isMenuOpen={isMenuOpen}
        navigationItems={navigationItems}
        onLogout={handleLogout}
        onMenuClick={onMenuClick}
        onMenuClose={closeAccountMenu}
        onMenuToggle={toggleAccountMenu}
        profilePath={profilePath}
      />
    );
  }

  return (
    <PublicHeader
      isScrolled={isPublicHeaderScrolled}
      pathname={location.pathname}
      publicNavLinks={publicNavLinks}
    />
  );
}

export default Header;
