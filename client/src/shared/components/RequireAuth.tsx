import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: ("Admin" | "Player")[];
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === "Admin" ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
