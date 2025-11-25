import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { Layout } from "../shared/components/Layout";
import { RequireAuth } from "../shared/components/RequireAuth";
import { RequireAdmin } from "../shared/components/RequireAdmin";
import { RequirePlayer } from "../shared/components/RequirePlayer";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { PlayerDashboard } from "../features/dashboard/PlayerDashboard";
import { AdminDashboard } from "../features/dashboard/AdminDashboard";
import { BoardsPage } from "../features/boards/BoardsPage";
import { PurchaseBoardPage } from "../features/boards/PurchaseBoardPage";
import { GamesPage } from "../features/games/GamesPage";
import { CompleteGamePage } from "../features/games/CompleteGamePage";
import { TransactionsPage } from "../features/transactions/TransactionsPage";
import { DepositRequestPage } from "../features/transactions/DepositRequestPage";

// Root redirect based on auth state
function RootRedirect() {
  const { user } = useAuth();
  const target = user?.role === "Admin" ? "/admin" : "/dashboard";
  return <Navigate to={target} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
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
        element: (
          <RequirePlayer>
            <PlayerDashboard />
          </RequirePlayer>
        ),
      },
      {
        path: "boards",
        element: (
          <RequirePlayer>
            <BoardsPage />
          </RequirePlayer>
        ),
      },
      {
        path: "boards/purchase",
        element: (
          <RequirePlayer>
            <PurchaseBoardPage />
          </RequirePlayer>
        ),
      },
      {
        path: "games",
        element: (
          <RequireAuth>
            <GamesPage />
          </RequireAuth>
        ),
      },
      {
        path: "games/:gameId/complete",
        element: (
          <RequireAdmin>
            <CompleteGamePage />
          </RequireAdmin>
        ),
      },
      {
        path: "transactions",
        element: (
          <RequirePlayer>
            <TransactionsPage />
          </RequirePlayer>
        ),
      },
      {
        path: "transactions/deposit",
        element: (
          <RequirePlayer>
            <DepositRequestPage />
          </RequirePlayer>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        ),
      },
    ],
  },
]);
