import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const playerLinks = (
    <>
      <li>
        <Link to="/dashboard" className="font-semibold">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/boards" className="font-semibold">
          Plader
        </Link>
      </li>
      <li>
        <Link to="/games" className="font-semibold">
          Spil
        </Link>
      </li>
      <li>
        <Link to="/transactions" className="font-semibold">
          Transaktioner
        </Link>
      </li>
    </>
  );

  const adminLinks = (
    <>
      <li>
        <Link to="/admin" className="font-semibold">
          Admin
        </Link>
      </li>
      <li>
        <Link to="/games" className="font-semibold">
          Spil
        </Link>
      </li>
    </>
  );

  return (
    <div className="min-h-screen bg-base-200 overflow-x-hidden">
      <nav className="navbar bg-primary text-primary-content shadow-lg px-4 sm:px-6">
        <div className="navbar-start min-w-0">
          {isAuthenticated && user && (
            <div className="dropdown lg:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Open navigation">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[5] p-2 shadow rounded-box w-56 right-0 border bg-base-100 text-base-content"
                style={{ borderColor: "#d50000" }}
              >
                {user.role === "Admin" ? adminLinks : playerLinks}
                <li className="mt-1">
                  <button onClick={handleLogout} className="font-semibold">
                    Log ud
                  </button>
                </li>
              </ul>
            </div>
          )}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Jerne IF" className="w-10 h-10 flex-shrink-0" />
            <span
              role="heading"
              aria-level={1}
              className="text-lg sm:text-xl font-bold tracking-wide whitespace-nowrap drop-shadow-sm"
            >
              Dead Pigeons
            </span>
          </Link>
        </div>

        {isAuthenticated && user && (
          <div className="flex-none flex items-center gap-3">
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1 flex-wrap gap-1">
                {user.role === "Admin" ? adminLinks : playerLinks}
              </ul>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <span className="max-w-[220px] truncate text-sm font-semibold tracking-normal">
                {user.email}
              </span>
              <button onClick={handleLogout} className="btn btn-sm btn-ghost text-sm font-semibold">
                Log ud
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <Outlet />
      </main>
    </div>
  );
}
