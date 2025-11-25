import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type GameResponse, type PlayerResponse } from "../../api/generated/api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type AdminTransaction = {
  createdAt?: string;
};

type ErrorResponse = {
  message?: string;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState<AdminTransaction[]>([]);
  const [games, setGames] = useState<GameResponse[]>([]);
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const client = createApiClient(token);
      const [gamesData, playersData] = await Promise.all([client.gamesAll(), client.playersAll()]);

      const pendingResp = await fetch(`${API_URL}/api/Transactions/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!pendingResp.ok) {
        const err: ErrorResponse | undefined = await pendingResp.json().catch(() => undefined);
        throw new Error(err?.message || "Failed to fetch pending transactions");
      }

      const pendingData: AdminTransaction[] = await pendingResp.json();
      pendingData.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });

      setPendingTransactions(pendingData);
      setGames(gamesData);
      setPlayers(playersData);
    } catch (err) {
      setError("Kunne ikke hente data. Prøv igen senere.");
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="loading loading-spinner loading-sm text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  const activeGame = games.find((g) => g.status === "Active");
  const inactivePlayers = players.filter((p) => !p.isActive);

  return (
    <div className="space-y-6">
      <h1 className="text-h1 text-base-content">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-box shadow p-4 border border-base-300">
          <div className="stat-title text-sm text-base-content/70">Afventende indbetalinger</div>
          <div className="stat-value text-2xl font-semibold text-warning">
            {pendingTransactions.length}
          </div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow p-4 border border-base-300">
          <div className="stat-title text-sm text-base-content/70">Aktive spil</div>
          <div className="stat-value text-2xl font-semibold text-primary">{activeGame ? 1 : 0}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow p-4 border border-base-300">
          <div className="stat-title text-sm text-base-content/70">Spillere i alt</div>
          <div className="stat-value text-2xl font-semibold">{players.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow p-4 border border-base-300">
          <div className="stat-title text-sm text-base-content/70">Inaktive spillere</div>
          <div className="stat-value text-2xl font-semibold text-error">
            {inactivePlayers.length}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 rounded-box border border-base-300 shadow-md">
        <div className="card-body p-5 md:p-6 space-y-3">
          <h2 className="text-h2 font-semibold">Genveje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              className="btn btn-primary h-11 px-5 shadow-md"
              onClick={() => navigate("/admin/players")}
            >
              Spilleradministration
            </button>
            <button
              className="btn btn-primary h-11 px-5 shadow-md"
              onClick={() => navigate("/admin/transactions")}
            >
              Transaktioner
            </button>
            <button
              className="btn btn-primary h-11 px-5 shadow-md"
              onClick={() => navigate("/admin/games")}
            >
              Spiloversigt
            </button>
          </div>
          <p className="text-sm text-base-content/70">
            Nye spil oprettes automatisk på serveren. Aktiver et eksisterende spil via
            spiloversigten.
          </p>
        </div>
      </div>
    </div>
  );
}
