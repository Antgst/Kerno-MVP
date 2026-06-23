import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import RoleRoute from "../components/layout/RoleRoute";
import LoadingState from "../components/ui/LoadingState";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import routeConfig from "./routeConfig";

function getRoutePage(route) {
  const RoutePage = route.component;
  return <RoutePage />;
}

function getRoleProtectedElement(route, element) {
  if (route.access === "supplier") {
    return <RoleRoute allowedRoles={["SUPPLIER"]}>{element}</RoleRoute>;
  }

  if (route.access === "store") {
    return <RoleRoute allowedRoles={["STORE"]}>{element}</RoleRoute>;
  }

  return element;
}

function getRouteElement(route) {
  const page = getRoutePage(route);

  if (route.access === "public" || route.path === "*") {
    return <PublicLayout>{page}</PublicLayout>;
  }

  const appPage = <AppLayout>{page}</AppLayout>;

  return (
    <ProtectedRoute>
      {getRoleProtectedElement(route, appPage)}
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState message="Chargement de la page..." />}>
        <Routes>
          {routeConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={getRouteElement(route)}
            />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
