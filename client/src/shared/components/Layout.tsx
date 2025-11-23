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
      <nav className="w-full h-[64px] bg-primary text-primary-content shadow-lg flex items-center px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Jerne IF" className="w-10 h-10" />
            <span className="text-[22px] font-bold tracking-wide">Dead Pigeons</span>
          </Link>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center gap-8 ml-auto">
            {user.role === "Admin" && (
              <Link
                to="/admin"
                className="px-4 py-3 text-[17px] font-semibold hover:opacity-90 transition"
              >
                Admin
              </Link>
            )}
            <Link
              to="/dashboard"
              className="px-4 py-3 text-[17px] font-semibold hover:opacity-90 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/boards"
              className="px-4 py-3 text-[17px] font-semibold hover:opacity-90 transition"
            >
              Plader
            </Link>
            <Link
              to="/games"
              className="px-4 py-3 text-[17px] font-semibold hover:opacity-90 transition"
            >
              Spil
            </Link>
            <Link
              to="/transactions"
              className="px-4 py-3 text-[17px] font-semibold hover:opacity-90 transition"
            >
              Transaktioner
            </Link>

            <div className="divider divider-horizontal mx-0"></div>

            <span className="text-[17px] font-medium">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-3 text-[17px] font-semibold hover:opacity-90 transition"
            >
              Log ud
            </button>
          </div>
        )}
      </nav>

      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
