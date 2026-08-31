import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!token) {
        if (!cancelled) {
          setAuthenticated(false);
          setChecking(false);
        }
        return;
      }

      if (user) {
        if (!cancelled) {
          setAuthenticated(true);
          setChecking(false);
        }
        return;
      }

      const valid = await checkAuth();

      if (!cancelled) {
        setAuthenticated(valid);
        setChecking(false);
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [token, user, checkAuth]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-8 w-8 animate-spin text-primary"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M4 12a8 8 0 018-8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>

          <p className="text-[13px] font-medium text-muted">
            Verifying session…
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
