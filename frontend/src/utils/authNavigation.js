export function getDashboardPathByRole(role) {
  const normalizedRole = String(role || "").toUpperCase();

  if (normalizedRole === "SUPPLIER") {
    return "/supplier/dashboard";
  }

  if (normalizedRole === "STORE") {
    return "/store/dashboard";
  }

  return "/catalog";
}
