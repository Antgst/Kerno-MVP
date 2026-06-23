import PublicBrandLink from "./PublicBrandLink";
import PublicHeaderActions from "./PublicHeaderActions";
import PublicNavigation from "./PublicNavigation";

const routesWithoutPublicNavigation = ["/", "/login", "/register"];

function PublicHeader({ isScrolled, pathname, publicNavLinks }) {
  const shouldShowPublicNavigation =
    !routesWithoutPublicNavigation.includes(pathname);

  return (
    <header
      className={[
        "site-header",
        "site-header--public",
        "public-header--glass",
        !shouldShowPublicNavigation ? "site-header--public-no-nav" : "",
        isScrolled ? "public-header--scrolled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PublicBrandLink />

      {shouldShowPublicNavigation && (
        <PublicNavigation links={publicNavLinks} />
      )}

      <PublicHeaderActions pathname={pathname} />
    </header>
  );
}

export default PublicHeader;