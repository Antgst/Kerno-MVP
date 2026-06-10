import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import routeConfig from "./routeConfig";

function getRouteElement(route) {
  if (route.path === "/") {
    return <HomePage />;
  }

  if (route.path === "*") {
    return <NotFoundPage />;
  }

  return <PlaceholderPage route={route} />;
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
