import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";

export function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    [
      "px-3 py-2 text-lg font-semibold transition-opacity duration-150 border-b-2",
      isActive
        ? "text-primary-content opacity-100 border-base-100"
        : "text-primary-content/90 opacity-80 border-transparent hover:opacity-100",
    ].join(" ");

  const playerLinks = (
    <>
      <li>
        <NavLink to="/dashboard" className={navItemClass}>
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink to="/boards" className={navItemClass}>
          Plader
        </NavLink>
      </li>
      <li>
        <NavLink to="/games" className={navItemClass}>
          Spil
        </NavLink>
      </li>
      <li>
        <NavLink to="/transactions" className={navItemClass}>
          Transaktioner
        </NavLink>
      </li>
    </>
  );

  const adminLinks = (
    <>
      <li>
        <NavLink to="/admin" end className={navItemClass}>
          Admin
        </NavLink>
      </li>
      <li>
        <NavLink to="/admin/players" className={navItemClass}>
          Spillere
        </NavLink>
      </li>
      <li>
        <NavLink to="/admin/transactions" className={navItemClass}>
          Transaktioner
        </NavLink>
      </li>
      <li>
        <NavLink to="/admin/games" className={navItemClass}>
          Spil
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="min-h-screen bg-base-200 overflow-x-hidden">
      <nav className="navbar bg-primary text-primary-content shadow-lg px-6 py-3 md:py-4">
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
                className="menu menu-sm dropdown-content mt-3 z-[5] p-3 shadow-lg rounded-box w-56 right-0 border border-primary/30 bg-base-100 text-base-content"
              >
                {user.role === "Admin" ? adminLinks : playerLinks}
                <li className="mt-1">
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost btn-sm h-10 px-4 justify-start font-semibold"
                  >
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
              className="text-xl font-bold tracking-tight whitespace-nowrap drop-shadow-sm"
            >
              Dead Pigeons
            </span>
          </Link>
        </div>

        {isAuthenticated && user && (
          <div className="flex-none flex items-center gap-4">
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1 flex-wrap gap-2">
                {user.role === "Admin" ? adminLinks : playerLinks}
              </ul>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <span className="max-w-[220px] truncate text-sm font-semibold tracking-normal px-3 py-2 rounded-md bg-primary/20 text-primary-content/90">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-ghost h-10 px-4 text-sm font-semibold"
              >
                Log ud
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
