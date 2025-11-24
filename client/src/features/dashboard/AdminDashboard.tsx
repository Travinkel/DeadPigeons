import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type GameResponse, type PlayerResponse } from "../../api/generated/api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type AdminTransaction = {
  id?: string;
  playerId?: string;
  playerNameOrEmail?: string;
  amount?: number;
  mobilePayTransactionId?: string | null;
  isApproved?: boolean;
  createdAt?: string;
  type?: string;
};

type ErrorResponse = {
  message?: string;
};

export function AdminDashboard() {
  const { token } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState<AdminTransaction[]>([]);
  const [games, setGames] = useState<GameResponse[]>([]);
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = createApiClient(token);

        const [gamesData, playersData] = await Promise.all([
          client.gamesAll(),
          client.playersAll(),
        ]);

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

    fetchData();
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  const activeGame = games.find((g) => g.status === "Active");
  const inactivePlayers = players.filter((p) => !p.isActive);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Afventende indbetalinger</div>
          <div className="stat-value text-warning">{pendingTransactions.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Aktive spil</div>
          <div className="stat-value text-primary">{activeGame ? 1 : 0}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Spillere i alt</div>
          <div className="stat-value">{players.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Inaktive spillere</div>
          <div className="stat-value text-error">{inactivePlayers.length}</div>
        </div>
      </div>

      {/* Active Game */}
      {activeGame && (
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Aktivt spil</h2>
            <p>
              Uge {activeGame.weekNumber}, {activeGame.year}
            </p>
            <p>Plader: {activeGame.boardCount || 0}</p>
          </div>
        </div>
      )}

      {/* Pending Transactions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Afventende indbetalinger</h2>
          {pendingTransactions.length === 0 ? (
            <p className="text-base-content/70">Ingen afventende indbetalinger.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Spiller</th>
                    <th>Beløb</th>
                    <th>Dato</th>
                    <th>MobilePay</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTransactions.slice(0, 10).map((tx) => (
                    <tr key={tx.id ?? `${tx.playerId}-${tx.createdAt}`}>
                      <td>{tx.playerNameOrEmail || tx.playerId}</td>
                      <td>{tx.amount?.toFixed(2)} kr</td>
                      <td>
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("da-DK") : "-"}
                      </td>
                      <td className="text-xs text-base-content/70">
                        {tx.mobilePayTransactionId || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Games */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Seneste spil</h2>
          {games.length === 0 ? (
            <p className="text-base-content/70">Ingen spil oprettet endnu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Uge</th>
                    <th>År</th>
                    <th>Plader</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {games.slice(0, 5).map((game) => (
                    <tr key={game.id}>
                      <td>{game.weekNumber}</td>
                      <td>{game.year}</td>
                      <td>{game.boardCount || 0}</td>
                      <td>
                        {game.status === "Active" ? (
                          <span className="badge badge-success badge-sm">Aktiv</span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">Afsluttet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Inactive Players */}
      {inactivePlayers.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Inaktive spillere</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Navn</th>
                    <th>Email</th>
                    <th>Telefon</th>
                  </tr>
                </thead>
                <tbody>
                  {inactivePlayers.slice(0, 5).map((player) => (
                    <tr key={player.id}>
                      <td>{player.name}</td>
                      <td>{player.email}</td>
                      <td>{player.phone || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
