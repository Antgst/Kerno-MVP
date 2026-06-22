import PublicBrandLink from "./PublicBrandLink";
import PublicHeaderActions from "./PublicHeaderActions";
import PublicNavigation from "./PublicNavigation";

function PublicHeader({ isScrolled, pathname, publicNavLinks }) {
  return (
    <header
      className={[
        "site-header",
        "site-header--public",
        "public-header--glass",
        isScrolled ? "public-header--scrolled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PublicBrandLink />

      <PublicNavigation links={publicNavLinks} />

      <PublicHeaderActions pathname={pathname} />
    </header>
  );
}

export default PublicHeader;
