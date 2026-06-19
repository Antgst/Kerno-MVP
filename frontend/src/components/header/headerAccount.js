export function getIsStoreSpace(role, pathname) {
  return (
    String(role || "").toUpperCase() === "STORE" ||
    pathname.startsWith("/store") ||
    pathname.startsWith("/requests/new")
  );
}

export function getDashboardPath(isStoreSpace) {
  return isStoreSpace ? "/store/dashboard" : "/supplier/dashboard";
}

export function getProfilePath(isStoreSpace) {
  return isStoreSpace ? "/store/profile" : "/supplier/profile";
}

export function getAccountDetails(accountIdentity, role, isStoreSpace) {
  const userDisplayName =
    accountIdentity.user?.displayName || accountIdentity.user?.name;
  const userFullName = [
    accountIdentity.user?.firstName,
    accountIdentity.user?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const accountName =
    userDisplayName ||
    userFullName ||
    accountIdentity.user?.email ||
    "Profil à compléter";

  const accountRoleLabel = role
    ? isStoreSpace
      ? "Magasin"
      : "Fournisseur"
    : "Profil à compléter";

  const accountInitials =
    accountName === "Profil à compléter"
      ? "K"
      : accountName
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();

  return {
    accountInitials,
    accountName,
    accountRoleLabel,
  };
}
