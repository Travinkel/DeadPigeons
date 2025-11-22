import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-primary text-primary-content shadow-lg">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl font-bold gap-2">
            <img src="/logo.png" alt="Jerne IF" className="h-8 w-8" />
            Dead Pigeons
          </Link>
        </div>

        {isAuthenticated && user && (
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <div className="flex items-center gap-4">
                {user.role === "Admin" && (
                  <Link to="/admin" className="btn btn-ghost btn-sm">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="btn btn-ghost btn-sm">
                  Dashboard
                </Link>
                <Link to="/boards" className="btn btn-ghost btn-sm">
                  Plader
                </Link>
                <Link to="/games" className="btn btn-ghost btn-sm">
                  Spil
                </Link>
                <Link to="/transactions" className="btn btn-ghost btn-sm">
                  Transaktioner
                </Link>

                <div className="divider divider-horizontal mx-0"></div>

                <span className="text-sm opacity-80">{user.email}</span>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Log ud
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
