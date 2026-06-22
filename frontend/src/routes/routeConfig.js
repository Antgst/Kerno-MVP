export const routeConfig = [
  { path: "/", label: "Accueil", access: "public" },
  { path: "/login", label: "Connexion", access: "public" },
  { path: "/register", label: "Inscription", access: "public" },

  { path: "/supplier/dashboard", label: "Tableau de bord fournisseur", access: "supplier" },
  { path: "/supplier/profile", label: "Profil fournisseur", access: "supplier" },
  { path: "/supplier/products", label: "Produits fournisseur", access: "supplier" },
  { path: "/supplier/products/new", label: "Ajouter un produit", access: "supplier", hidden: true },
  { path: "/supplier/products/:id/edit", label: "Modifier le produit", access: "supplier", hidden: true },
  { path: "/supplier/requests", label: "Demandes reçues", access: "supplier" },
  { path: "/supplier/requests/:id", label: "Détail de la demande reçue", access: "supplier" },

  { path: "/store/dashboard", label: "Tableau de bord magasin", access: "store" },
  { path: "/store/profile", label: "Profil magasin", access: "store" },
  { path: "/store/requests", label: "Demandes envoyées", access: "store" },
  { path: "/store/requests/:id", label: "Détail de la demande envoyée", access: "store" },

  { path: "/catalog", label: "Catalogue", access: "auth" },
  { path: "/suppliers/:id", label: "Détail du fournisseur", access: "auth" },
  { path: "/products/:id", label: "Détail du produit", access: "auth" },

  { path: "/requests/new", label: "Nouvelle demande", access: "store" },

  { path: "*", label: "Page introuvable", access: "public" },
];

export default routeConfig;
