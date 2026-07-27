import { Navigate } from "react-router-dom";
import { getCurrentAuthRole } from "../../services/authService";
import { getDashboardPathByRole } from "../../utils/authNavigation";

function RoleRoute({ allowedRoles = [], children }) {
  const role = getCurrentAuthRole();
  const normalizedRole = String(role || "").toUpperCase();

  const normalizedAllowedRoles = allowedRoles.map((allowedRole) =>
    String(allowedRole).toUpperCase(),
  );

  if (!normalizedRole) {
    return <Navigate to="/login" replace />;
  }

  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    return <Navigate to={getDashboardPathByRole(normalizedRole)} replace />;
  }

  return children;
}

export default RoleRoute;
