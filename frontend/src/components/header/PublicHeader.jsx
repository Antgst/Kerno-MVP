import PublicBrandLink from "./PublicBrandLink";
import PublicHeaderActions from "./PublicHeaderActions";

function PublicHeader({ isScrolled, pathname }) {
  return (
    <header
      className={[
        "site-header",
        "site-header--public",
        "public-header--glass",
        "site-header--public-no-nav",
        isScrolled ? "public-header--scrolled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PublicBrandLink />

      <PublicHeaderActions pathname={pathname} />
    </header>
  );
}

export default PublicHeader;
