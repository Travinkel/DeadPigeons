import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../shared/components/Layout";
import { RequireAuth } from "../shared/components/RequireAuth";
import { LoginPage } from "../features/auth/LoginPage";
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
        path: "boards/purchase",
        element: <PurchaseBoardPage />,
      },
      {
        path: "games",
        element: <GamesPage />,
      },
      {
        path: "games/:gameId/complete",
        element: (
          <RequireAuth allowedRoles={["Admin"]}>
            <CompleteGamePage />
          </RequireAuth>
        ),
      },
      {
        path: "transactions",
        element: <TransactionsPage />,
      },
      {
        path: "transactions/deposit",
        element: <DepositRequestPage />,
      },
    ],
  },
]);
