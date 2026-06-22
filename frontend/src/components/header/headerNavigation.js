export const storeNavigation = [
  { to: "/store/dashboard", label: "Tableau de bord", icon: "grid", end: true },
  { to: "/catalog", label: "Catalogue", icon: "search" },
  { to: "/store/requests", label: "Mes demandes", icon: "mail" },
  { to: "/store/profile", label: "Mon profil", icon: "user" },
];

export const supplierNavigation = [
  { to: "/supplier/dashboard", label: "Tableau de bord", icon: "grid", end: true },
  { to: "/supplier/products", label: "Produits", icon: "box" },
  { to: "/supplier/requests", label: "Demandes", icon: "mail" },
  { to: "/supplier/profile", label: "Mon profil", icon: "user" },
  { to: "/catalog", label: "Catalogue", icon: "search" },
];

export const publicNavLinks = [
  { label: "Accueil", to: "/", isPrimaryRoute: true },
  { label: "Catalogue", to: "/catalog", isPrimaryRoute: true },
  { label: "Fournisseurs", to: "/catalog" },
  { label: "Magasins", to: "/register" },
];
