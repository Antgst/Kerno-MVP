import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import routeConfig from "./routeConfig";

function getRoutePage(route) {
  if (route.path === "/") {
    return <HomePage />;
  }

  if (route.path === "*") {
    return <NotFoundPage />;
  }

  return <PlaceholderPage route={route} />;
}

function getRouteElement(route) {
  const page = getRoutePage(route);

  if (route.access === "public" || route.path === "*") {
    return <PublicLayout>{page}</PublicLayout>;
  }

  return <AppLayout>{page}</AppLayout>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {routeConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={getRouteElement(route)}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
