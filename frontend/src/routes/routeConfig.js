export const routeConfig = [
  { path: "/", label: "Home", access: "public" },
  { path: "/login", label: "Login", access: "public" },
  { path: "/register", label: "Register", access: "public" },

  { path: "/supplier/dashboard", label: "Supplier dashboard", access: "supplier" },
  { path: "/supplier/profile", label: "Supplier profile", access: "supplier" },
  { path: "/supplier/products", label: "Supplier products", access: "supplier" },
  { path: "/supplier/products/new", label: "Add product", access: "supplier" },
  { path: "/supplier/requests", label: "Received requests", access: "supplier" },
  { path: "/supplier/requests/:id", label: "Received request details", access: "supplier" },

  { path: "/store/dashboard", label: "Store dashboard", access: "store" },
  { path: "/store/profile", label: "Store profile", access: "store" },
  { path: "/store/requests", label: "Sent requests", access: "store" },
  { path: "/store/requests/:id", label: "Sent request details", access: "store" },

  { path: "/catalog", label: "Catalog", access: "auth" },
  { path: "/suppliers/:id", label: "Supplier details", access: "auth" },
  { path: "/products/:id", label: "Product details", access: "auth" },

  { path: "/requests/new", label: "New request", access: "store" },

  { path: "*", label: "Not found", access: "public" },
];

export default routeConfig;
