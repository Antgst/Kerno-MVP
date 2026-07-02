import { lazy } from "react";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const CatalogPage = lazy(() => import("../pages/catalog/CatalogPage"));
const ProductDetailPage = lazy(() => import("../pages/details/ProductDetailPage"));
const SupplierDetailPage = lazy(() => import("../pages/details/SupplierDetailPage"));
const RequestFormPage = lazy(() => import("../pages/requests/RequestFormPage"));
const StoreRequestDetailPage = lazy(() => import("../pages/requests/StoreRequestDetailPage"));
const StoreRequestsPage = lazy(() => import("../pages/requests/StoreRequestsPage"));
const SupplierRequestDetailPage = lazy(() => import("../pages/requests/SupplierRequestDetailPage"));
const SupplierRequestsPage = lazy(() => import("../pages/requests/SupplierRequestsPage"));
const StoreDashboardPage = lazy(() => import("../pages/store/StoreDashboardPage"));
const StoreProfilePage = lazy(() => import("../pages/store/StoreProfilePage"));
const SupplierDashboardPage = lazy(() => import("../pages/supplier/SupplierDashboardPage"));
const SupplierProductFormPage = lazy(() => import("../pages/supplier/SupplierProductFormPage"));
const SupplierProductsPage = lazy(() => import("../pages/supplier/SupplierProductsPage"));
const SupplierProfilePage = lazy(() => import("../pages/supplier/SupplierProfilePage"));

const routeConfig = [
  { path: "/", label: "Accueil", access: "public", component: HomePage },
  { path: "/login", label: "Connexion", access: "public", component: LoginPage },
  { path: "/register", label: "Inscription", access: "public", component: RegisterPage },

  { path: "/supplier/dashboard", label: "Tableau de bord fournisseur", access: "supplier", component: SupplierDashboardPage },
  { path: "/supplier/profile", label: "Profil fournisseur", access: "supplier", component: SupplierProfilePage },
  { path: "/supplier/products", label: "Produits fournisseur", access: "supplier", component: SupplierProductsPage },
  { path: "/supplier/products/new", label: "Ajouter un produit", access: "supplier", component: SupplierProductFormPage, hidden: true },
  { path: "/supplier/products/:id/edit", label: "Modifier le produit", access: "supplier", component: SupplierProductFormPage, hidden: true },
  { path: "/supplier/requests", label: "Demandes reçues", access: "supplier", component: SupplierRequestsPage },
  { path: "/supplier/requests/:id", label: "Détail de la demande reçue", access: "supplier", component: SupplierRequestDetailPage },

  { path: "/store/dashboard", label: "Tableau de bord magasin", access: "store", component: StoreDashboardPage },
  { path: "/store/profile", label: "Profil magasin", access: "store", component: StoreProfilePage },
  { path: "/store/requests", label: "Demandes envoyées", access: "store", component: StoreRequestsPage },
  { path: "/store/requests/:id", label: "Détail de la demande envoyée", access: "store", component: StoreRequestDetailPage },

  { path: "/catalog", label: "Catalogue", access: "auth", component: CatalogPage },
  { path: "/suppliers/:id", label: "Détail du fournisseur", access: "auth", component: SupplierDetailPage },
  { path: "/products/:id", label: "Détail du produit", access: "auth", component: ProductDetailPage },

  { path: "/requests/new", label: "Nouvelle demande", access: "store", component: RequestFormPage },

  { path: "*", label: "Page introuvable", access: "public", component: NotFoundPage },
];

export default routeConfig;
