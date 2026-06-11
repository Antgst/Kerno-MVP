import routeConfig from "../routes/routeConfig";
import NavigationLink from "./NavigationLink";

const navigationSections = [
  {
    title: "Supplier workspace",
    paths: [
      "/supplier/dashboard",
      "/supplier/profile",
      "/supplier/products",
      "/supplier/requests",
    ],
  },
  {
    title: "Store workspace",
    paths: [
      "/store/dashboard",
      "/store/profile",
      "/store/requests",
      "/requests/new",
    ],
  },
  {
    title: "Marketplace",
    paths: ["/catalog"],
  },
];

function getRouteByPath(path) {
  return routeConfig.find((route) => route.path === path);
}

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Authenticated navigation">
      <div className="sidebar__brand">
        <span className="brand-mark brand-mark--sidebar">K</span>
        <div>
          <strong>KERNO</strong>
          <small>Marketplace MVP</small>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navigationSections.map((section) => (
          <section className="sidebar__section" key={section.title}>
            <h2>{section.title}</h2>

            <ul>
              {section.paths.map((path) => {
                const route = getRouteByPath(path);

                if (!route) {
                  return null;
                }

                return (
                  <li key={route.path}>
                    <NavigationLink to={route.path} variant="sidebar">
                      {route.label}
                    </NavigationLink>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      <div className="sidebar__scope">
        <span>MVP scope</span>
        <p>Profiles, catalog, products and contact requests only.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
