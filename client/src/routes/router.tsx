import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../shared/components/Layout";
import { RequireAuth } from "../shared/components/RequireAuth";
import { LoginPage } from "../features/auth/LoginPage";
import { PlayerDashboard } from "../features/dashboard/PlayerDashboard";
import { AdminDashboard } from "../features/dashboard/AdminDashboard";

function BoardsPage() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Plader</h2>
        <p>Under udvikling...</p>
      </div>
    </div>
  );
}

function GamesPage() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Spil</h2>
        <p>Under udvikling...</p>
      </div>
    </div>
  );
}

function TransactionsPage() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Transaktioner</h2>
        <p>Under udvikling...</p>
      </div>
    </div>
  );
}

// Root redirect based on auth state
function RootRedirect() {
  return <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: "dashboard",
        element: <PlayerDashboard />,
      },
      {
        path: "admin",
        element: (
          <RequireAuth allowedRoles={["Admin"]}>
            <AdminDashboard />
          </RequireAuth>
        ),
      },
      {
        path: "boards",
        element: <BoardsPage />,
      },
      {
        path: "games",
        element: <GamesPage />,
      },
      {
        path: "transactions",
        element: <TransactionsPage />,
      },
    ],
  },
]);
