import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

interface RequirePlayerProps {
  children: ReactNode;
}

export function RequirePlayer({ children }: RequirePlayerProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-sm text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "Player") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
