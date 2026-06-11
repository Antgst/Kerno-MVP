import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import RegisterPage from "../pages/RegisterPage";
import SupplierDashboardPage from "../pages/supplier/SupplierDashboardPage";
import SupplierProductFormPage from "../pages/supplier/SupplierProductFormPage";
import SupplierProductsPage from "../pages/supplier/SupplierProductsPage";
import SupplierProfilePage from "../pages/supplier/SupplierProfilePage";
import StoreDashboardPage from "../pages/store/StoreDashboardPage";
import StoreProfilePage from "../pages/store/StoreProfilePage";
import CatalogPage from "../pages/catalog/CatalogPage";
import ProductDetailPage from "../pages/details/ProductDetailPage";
import SupplierDetailPage from "../pages/details/SupplierDetailPage";
import RequestFormPage from "../pages/requests/RequestFormPage";
import StoreRequestDetailPage from "../pages/requests/StoreRequestDetailPage";
import StoreRequestsPage from "../pages/requests/StoreRequestsPage";
import SupplierRequestDetailPage from "../pages/requests/SupplierRequestDetailPage";
import SupplierRequestsPage from "../pages/requests/SupplierRequestsPage";
import routeConfig from "./routeConfig";

function getRoutePage(route) {
  if (route.path === "/") {
    return <HomePage />;
  }

  if (route.path === "/login") {
    return <LoginPage />;
  }

  if (route.path === "/register") {
    return <RegisterPage />;
  }

  if (route.path === "/supplier/dashboard") {
    return <SupplierDashboardPage />;
  }

  if (route.path === "/supplier/profile") {
    return <SupplierProfilePage />;
  }

  if (route.path === "/supplier/products") {
    return <SupplierProductsPage />;
  }

  if (route.path === "/supplier/products/new") {
    return <SupplierProductFormPage />;
  }

  if (route.path === "/store/dashboard") {
    return <StoreDashboardPage />;
  }

  if (route.path === "/store/profile") {
    return <StoreProfilePage />;
  }

  if (route.path === "/catalog") {
    return <CatalogPage />;
  }

  if (route.path === "/products/:id") {
    return <ProductDetailPage />;
  }

  if (route.path === "/suppliers/:id") {
    return <SupplierDetailPage />;
  }

  if (route.path === "/requests/new") {
    return <RequestFormPage />;
  }

  if (route.path === "/store/requests") {
    return <StoreRequestsPage />;
  }

  if (route.path === "/store/requests/:id") {
    return <StoreRequestDetailPage />;
  }

  if (route.path === "/supplier/requests") {
    return <SupplierRequestsPage />;
  }

  if (route.path === "/supplier/requests/:id") {
    return <SupplierRequestDetailPage />;
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
