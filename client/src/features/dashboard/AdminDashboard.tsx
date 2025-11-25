import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { Link } from "react-router-dom";
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
  const [newPlayer, setNewPlayer] = useState<{ name: string; email: string; phone: string }>({
    name: "",
    email: "",
    phone: "",
  });
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: "",
    email: "",
    phone: "",
  });
  const [mobilePayFilter, setMobilePayFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isSavingPlayer, setIsSavingPlayer] = useState(false);
  const [isDeletingPlayer, setIsDeletingPlayer] = useState<string | null>(null);
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

  const handleApprove = async (id?: string) => {
    if (!id || !token) return;
    setIsApproving(true);
    try {
      const resp = await fetch(`${API_URL}/api/Transactions/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!resp.ok) {
        const err: ErrorResponse | undefined = await resp.json().catch(() => undefined);
        throw new Error(err?.message || "Kunne ikke godkende");
      }
      await loadData();
    } catch (err) {
      setError("Godkendelse fejlede. Prøv igen.");
      console.error("Approve transaction error:", err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleCreatePlayer = async () => {
    if (!token) return;
    if (!newPlayer.name || !newPlayer.email) {
      setError("Navn og email er påkrævet for at oprette en spiller.");
      return;
    }
    setIsSavingPlayer(true);
    setError(null);
    try {
      const client = createApiClient(token);
      await client.playersPOST({
        name: newPlayer.name.trim(),
        email: newPlayer.email.trim(),
        phone: newPlayer.phone.trim(),
      });
      setNewPlayer({ name: "", email: "", phone: "" });
      await loadData();
    } catch (err) {
      setError("Kunne ikke oprette spiller. Prøv igen.");
      console.error("Create player error:", err);
    } finally {
      setIsSavingPlayer(false);
    }
  };

  const handleTogglePlayerActive = async (player: PlayerResponse) => {
    if (!token || !player.id) return;
    setIsSavingPlayer(true);
    setError(null);
    try {
      const client = createApiClient(token);
      await client.playersPUT(player.id, {
        name: player.name,
        email: player.email,
        phone: player.phone,
        isActive: !player.isActive,
      });
      await loadData();
    } catch (err) {
      setError("Kunne ikke opdatere spillerstatus. Prøv igen.");
      console.error("Toggle player error:", err);
    } finally {
      setIsSavingPlayer(false);
    }
  };

  const handleStartEdit = (player: PlayerResponse) => {
    if (!player.id) return;
    setEditingPlayerId(player.id);
    setEditingPlayer({
      name: player.name ?? "",
      email: player.email ?? "",
      phone: player.phone ?? "",
    });
  };

  const handleSavePlayer = async (player: PlayerResponse) => {
    if (!token || !player.id) return;
    setIsSavingPlayer(true);
    setError(null);
    try {
      const client = createApiClient(token);
      await client.playersPUT(player.id, {
        name: editingPlayer.name.trim(),
        email: editingPlayer.email.trim(),
        phone: editingPlayer.phone.trim(),
        isActive: player.isActive,
      });
      setEditingPlayerId(null);
      await loadData();
    } catch (err) {
      setError("Kunne ikke opdatere spiller. Prøv igen.");
      console.error("Save player error:", err);
    } finally {
      setIsSavingPlayer(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
    setEditingPlayer({ name: "", email: "", phone: "" });
  };

  const handleDeletePlayer = async (playerId?: string) => {
    if (!token || !playerId) return;
    setIsDeletingPlayer(playerId);
    setError(null);
    try {
      const client = createApiClient(token);
      await client.playersDELETE(playerId);
      await loadData();
    } catch (err) {
      setError("Kunne ikke slette spiller. Prøv igen.");
      console.error("Delete player error:", err);
    } finally {
      setIsDeletingPlayer(null);
    }
  };

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
  const completedGames = games
    .filter((g) => g.status !== "Active")
    .slice()
    .sort((a, b) => {
      const yearDiff = (b.year || 0) - (a.year || 0);
      if (yearDiff !== 0) return yearDiff;
      return (b.weekNumber || 0) - (a.weekNumber || 0);
    });
  const filteredPending = pendingTransactions.filter((tx) =>
    mobilePayFilter.trim().length === 0
      ? true
      : (tx.mobilePayTransactionId || "").toLowerCase().includes(mobilePayFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Afventende indbetalinger</div>
          <div className="stat-value text-warning">{pendingTransactions.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Aktive spil</div>
          <div className="stat-value text-primary">{activeGame ? 1 : 0}</div>
        </div>
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Spillere i alt</div>
          <div className="stat-value">{players.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Inaktive spillere</div>
          <div className="stat-value text-error">{inactivePlayers.length}</div>
        </div>
      </div>

      {/* Active Game */}
      {activeGame && (
        <div className="card shadow-md rounded-2xl" style={{ backgroundColor: "#d50000" }}>
          <div className="card-body text-white">
            <h2 className="card-title">Aktivt spil</h2>
            <p>
              Uge {activeGame.weekNumber}, {activeGame.year}
            </p>
            <p>Plader: {activeGame.boardCount || 0}</p>
          </div>
        </div>
      )}

      {/* Pending Transactions */}
      <div className="card bg-base-100 shadow-md rounded-2xl">
        <div className="card-body">
          <h2 className="card-title">Afventende indbetalinger</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <p className="text-sm text-base-content/70">
              Godkend MobilePay betalinger. Filtrer efter MobilePay ID for manuel kontrol.
            </p>
            <input
              type="text"
              className="input input-bordered input-sm w-full sm:w-64"
              placeholder="Filtrer MobilePay ID"
              value={mobilePayFilter}
              onChange={(e) => setMobilePayFilter(e.target.value)}
            />
          </div>
          {pendingTransactions.length === 0 ? (
            <p className="text-base-content/70">Ingen afventende indbetalinger.</p>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Spiller</th>
                      <th>Beløb</th>
                      <th>Dato</th>
                      <th>MobilePay</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPending.slice(0, 10).map((tx) => (
                      <tr key={tx.id ?? `${tx.playerId}-${tx.createdAt}`}>
                        <td className="whitespace-pre-wrap break-words">
                          {tx.playerNameOrEmail || tx.playerId}
                        </td>
                        <td>{tx.amount?.toFixed(2)} kr</td>
                        <td>
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("da-DK") : "-"}
                        </td>
                        <td className="text-xs text-base-content/70">
                          {tx.mobilePayTransactionId || "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm text-white"
                            style={{ backgroundColor: "#d50000" }}
                            onClick={() => handleApprove(tx.id)}
                            disabled={isApproving}
                          >
                            {isApproving ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Godkend"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-base-100 to-transparent md:hidden" />
            </div>
          )}
        </div>
      </div>

      {/* Player Management */}
      <div className="card bg-base-100 shadow-md rounded-2xl">
        <div className="card-body space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="card-title">Spilleradministration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Navn"
                className="input input-bordered w-full"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={newPlayer.email}
                onChange={(e) => setNewPlayer((prev) => ({ ...prev, email: e.target.value }))}
              />
              <input
                type="tel"
                placeholder="Telefon"
                className="input input-bordered w-full"
                value={newPlayer.phone}
                onChange={(e) => setNewPlayer((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <button
                className="btn btn-primary col-span-1 sm:col-span-3 lg:col-span-1"
                onClick={handleCreatePlayer}
                disabled={isSavingPlayer}
              >
                {isSavingPlayer ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Opret spiller"
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-x-auto">
              <table className="table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Navn</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Status</th>
                    <th className="text-right">Handlinger</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id}>
                      <td className="font-semibold">
                        {editingPlayerId === player.id ? (
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            value={editingPlayer.name}
                            onChange={(e) =>
                              setEditingPlayer((prev) => ({ ...prev, name: e.target.value }))
                            }
                          />
                        ) : (
                          player.name
                        )}
                      </td>
                      <td className="whitespace-pre-wrap break-words">
                        {editingPlayerId === player.id ? (
                          <input
                            type="email"
                            className="input input-bordered input-sm w-full"
                            value={editingPlayer.email}
                            onChange={(e) =>
                              setEditingPlayer((prev) => ({ ...prev, email: e.target.value }))
                            }
                          />
                        ) : (
                          player.email
                        )}
                      </td>
                      <td>
                        {editingPlayerId === player.id ? (
                          <input
                            type="tel"
                            className="input input-bordered input-sm w-full"
                            value={editingPlayer.phone}
                            onChange={(e) =>
                              setEditingPlayer((prev) => ({ ...prev, phone: e.target.value }))
                            }
                          />
                        ) : (
                          player.phone || "-"
                        )}
                      </td>
                      <td>
                        {player.isActive ? (
                          <span className="badge badge-success badge-sm">Aktiv</span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">Inaktiv</span>
                        )}
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          {editingPlayerId === player.id ? (
                            <>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleSavePlayer(player)}
                                disabled={isSavingPlayer}
                              >
                                {isSavingPlayer ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  "Gem"
                                )}
                              </button>
                              <button className="btn btn-sm btn-ghost" onClick={handleCancelEdit}>
                                Annuller
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleTogglePlayerActive(player)}
                                disabled={isSavingPlayer}
                              >
                                {player.isActive ? "Deaktiver" : "Aktiver"}
                              </button>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleStartEdit(player)}
                                disabled={isSavingPlayer}
                              >
                                Rediger
                              </button>
                              <button
                                className="btn btn-sm btn-ghost text-error"
                                onClick={() => handleDeletePlayer(player.id)}
                                disabled={isDeletingPlayer === player.id}
                              >
                                {isDeletingPlayer === player.id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  "Slet"
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-base-100 to-transparent md:hidden" />
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="card bg-base-100 shadow-md rounded-2xl">
        <div className="card-body">
          <h2 className="card-title">Seneste spil</h2>
          {completedGames.length === 0 ? (
            <p className="text-base-content/70">Ingen spil oprettet endnu.</p>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Uge</th>
                      <th>År</th>
                      <th>Plader</th>
                      <th>Vindertal</th>
                      <th>Status</th>
                      <th className="text-right">Handling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedGames.slice(0, 5).map((game) => (
                      <tr key={game.id}>
                        <td>{game.weekNumber}</td>
                        <td>{game.year}</td>
                        <td>{game.boardCount || 0}</td>
                        <td>
                          {game.winningNumbers && game.winningNumbers.length > 0
                            ? game.winningNumbers.join(", ")
                            : "-"}
                        </td>
                        <td>
                          {game.status === "Active" ? (
                            <span className="badge badge-success badge-sm">Aktiv</span>
                          ) : (
                            <span className="badge badge-ghost badge-sm">Afsluttet</span>
                          )}
                        </td>
                        <td className="text-right">
                          {game.status === "Active" ? null : (
                            <Link to={`/games/${game.id}/complete`} className="btn btn-sm">
                              Afslut / vindertal
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-base-100 to-transparent md:hidden" />
            </div>
          )}
        </div>
      </div>

      {/* Inactive Players */}
      {inactivePlayers.length > 0 && (
        <div className="card bg-base-100 shadow-md rounded-2xl">
          <div className="card-body">
            <h2 className="card-title">Inaktive spillere</h2>
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[560px]">
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
                        <td className="whitespace-pre-wrap break-words tracking-normal">
                          {player.email}
                        </td>
                        <td>{player.phone || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-base-100 to-transparent md:hidden" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
