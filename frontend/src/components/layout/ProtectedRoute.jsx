import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../../services/tokenStorage";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
