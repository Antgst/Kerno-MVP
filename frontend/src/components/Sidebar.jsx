import { Link, useLocation } from "react-router-dom";
import NavigationLink from "./NavigationLink";
import kernoLogo from "../assets/brand/kerno-logo.webp";

const storeSections = [
  {
    title: "Espace magasin",
    links: [
      { to: "/store/dashboard", label: "Tableau de bord" },
      { to: "/store/profile", label: "Profil magasin" },
      { to: "/store/requests", label: "Demandes envoyées" },
      { to: "/requests/new", label: "Nouvelle demande" },
    ],
  },
  {
    title: "Marketplace",
    links: [{ to: "/catalog", label: "Catalogue" }],
  },
];

const supplierSections = [
  {
    title: "Espace fournisseur",
    links: [
      { to: "/supplier/dashboard", label: "Tableau de bord" },
      { to: "/supplier/profile", label: "Profil fournisseur" },
      { to: "/supplier/products", label: "Produits" },
      { to: "/supplier/requests", label: "Demandes reçues" },
    ],
  },
  {
    title: "Marketplace",
    links: [{ to: "/catalog", label: "Catalogue" }],
  },
];

function Sidebar({ onNavigate }) {
  const location = useLocation();

  const isStoreSpace =
    location.pathname.startsWith("/store") ||
    location.pathname.startsWith("/requests/new");

  const sections = isStoreSpace ? storeSections : supplierSections;
  const dashboardPath = isStoreSpace
    ? "/store/dashboard"
    : "/supplier/dashboard";

  return (
    <div className="kerno-sidebar">
      <Link to={dashboardPath} className="kerno-sidebar__brand" onClick={onNavigate}>
        <img className="kerno-sidebar__brand-logo" src={kernoLogo} alt="" />

        <div className="kerno-sidebar__brand-copy">
          <strong>KERNO</strong>
          <small>{isStoreSpace ? "ESPACE MAGASIN" : "ESPACE FOURNISSEUR"}</small>
        </div>
      </Link>

      <div className="kerno-sidebar__divider" />

      <nav className="kerno-sidebar__nav">
        {sections.map((section) => (
          <section className="kerno-sidebar__section" key={section.title}>
            <p className="kerno-sidebar__section-title">{section.title}</p>

            <ul className="kerno-sidebar__list">
              {section.links.map((link) => (
                <li key={link.to}>
                  <NavigationLink
                    to={link.to}
                    variant="sidebar"
                    onClick={onNavigate}
                  >
                    {link.label}
                  </NavigationLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
