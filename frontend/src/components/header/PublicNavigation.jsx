import { Link } from "react-router-dom";
import NavigationLink from "../NavigationLink";

function PublicNavigation({ links }) {
  return (
    <nav className="public-nav" aria-label="Navigation publique">
      {links.map((link) =>
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
  );
}

export default PublicNavigation;
