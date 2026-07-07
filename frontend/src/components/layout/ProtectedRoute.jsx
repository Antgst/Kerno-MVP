import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentSessionUser } from "../../services/authService";
import LoadingState from "../ui/LoadingState";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [sessionState, setSessionState] = useState({
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let shouldUpdateState = true;

    async function verifySession() {
      try {
        await getCurrentSessionUser({ forceRefresh: true });

        if (shouldUpdateState) {
          setSessionState({
            isLoading: false,
            isAuthenticated: true,
          });
        }
      } catch {
        if (shouldUpdateState) {
          setSessionState({
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    }

    verifySession();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

  if (sessionState.isLoading) {
    return (
      <LoadingState
        message="Vérification de la session..."
        className="mx-auto mt-10 max-w-md"
      />
    );
  }

  if (!sessionState.isAuthenticated) {
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
