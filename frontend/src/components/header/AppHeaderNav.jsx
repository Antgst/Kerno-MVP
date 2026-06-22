import { useLocation } from "react-router-dom";
import NavigationLink from "../NavigationLink";
import HeaderIcon from "./HeaderIcon";

function AppHeaderNav({ navigationItems }) {
  const { pathname } = useLocation();
  const isStoreNavigation = navigationItems.some(
    (item) => item.to === "/store/dashboard",
  );

  function isContextuallyActive(item) {
    if (!isStoreNavigation || item.to !== "/catalog") {
      return false;
    }

    return (
      pathname.startsWith("/products/") ||
      pathname.startsWith("/suppliers/") ||
      pathname === "/requests/new"
    );
  }

  return (
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
          forceActive={isContextuallyActive(item)}
        >
          <HeaderIcon name={item.icon} />
          <span>{item.label}</span>
        </NavigationLink>
      ))}
    </nav>
  );
}

export default AppHeaderNav;
