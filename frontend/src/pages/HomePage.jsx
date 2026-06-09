import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import routeConfig from "../routes/routeConfig";

const routeSections = [
  { access: "public", title: "Public routes" },
  { access: "auth", title: "Authenticated routes" },
  { access: "supplier", title: "Supplier routes" },
  { access: "store", title: "Store routes" },
];

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
  const [apiStatus, setApiStatus] = useState(
    apiBaseUrl ? "Loading..." : "API base URL not configured",
  );

  useEffect(() => {
    if (!apiBaseUrl) {
      return;
    }

    fetch(`${apiBaseUrl.replace(/\/$/, "")}/health`)
      .then((response) => response.json())
      .then((data) => {
        setApiStatus(data.message);
      })
      .catch((error) => {
        console.error(error);
        setApiStatus("Backend not reachable");
      });
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">KERNO MVP</p>
        <h1>B2B marketplace for local suppliers and stores.</h1>
        <p>
          This sprint defines the frontend routing map for the main MVP journeys:
          public access, authentication, supplier workspace, store workspace, catalog,
          detail pages, requests, and fallback handling.
        </p>

        <div className="status-card">
          <span>API status</span>
          <strong>{apiStatus}</strong>
        </div>
      </section>

      <section className="routes-grid">
        {routeSections.map((section) => {
          const routes = routeConfig.filter(
            (route) => route.access === section.access && route.path !== "*",
          );

          return (
            <article className="route-section" key={section.access}>
              <h2>{section.title}</h2>

              <ul>
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link to={route.path.replace(":id", "demo-id")}>
                      <span>{route.label}</span>
                      <code>{route.path}</code>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default HomePage;
