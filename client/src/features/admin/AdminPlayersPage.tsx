import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type PlayerResponse } from "../../api/generated/api-client";

type PlayerRow = PlayerResponse & {
  boardCount?: number;
  transactionCount?: number;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AdminPlayersPage() {
  const { token, user: authUser } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPlayers = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const client = createApiClient(token);
      const playersData = await client.playersAll();

      const enriched = await Promise.all(
        playersData.map(async (player) => {
          try {
            const [boardsResp, txResp] = await Promise.all([
              fetch(`${API_URL}/api/Boards/player/${player.id}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
              }),
              fetch(`${API_URL}/api/Transactions/player/${player.id}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
              }),
            ]);
            const boards = boardsResp.ok ? await boardsResp.json() : [];
            const transactions = txResp.ok ? await txResp.json() : [];
            return { ...player, boardCount: boards.length, transactionCount: transactions.length };
          } catch {
            return { ...player };
          }
        })
      );
      setPlayers(enriched);
    } catch (err) {
      console.error("Players load error", err);
      setError("Kunne ikke hente spillere. Prøv igen.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPlayers();
  }, [token]);

  const toggleActive = async (player: PlayerResponse) => {
    if (!token || !player.id) return;
    if (player.email === authUser?.email) {
      setError("Du kan ikke deaktivere din egen bruger.");
      return;
    }
    setIsSaving(player.id);
    try {
      const client = createApiClient(token);
      await client.playersPUT(player.id, {
        name: player.name,
        email: player.email,
        phone: player.phone,
        isActive: !player.isActive,
      });
      await loadPlayers();
    } catch (err) {
      console.error("Toggle player error", err);
      setError("Kunne ikke opdatere spillerstatus. Prøv igen.");
    } finally {
      setIsSaving(null);
    }
  };

  const deletePlayer = async (playerId?: string) => {
    if (!token || !playerId) return;
    setIsSaving(playerId);
    try {
      const client = createApiClient(token);
      await client.playersDELETE(playerId);
      await loadPlayers();
    } catch (err) {
      console.error("Delete player error", err);
      setError("Kunne ikke slette spiller. Prøv igen.");
    } finally {
      setIsSaving(null);
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
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-h1 text-base-content">Spilleradministration</h1>
          <p className="text-base text-base-content/70">
            Administrer spillere, aktivering, plader og transaktioner.
          </p>
        </div>
        <button
          className="btn btn-primary h-11 px-5 shadow-md"
          onClick={() => navigate("/admin/players/new")}
        >
          Ny spiller
        </button>
      </div>

      <div className="card bg-base-100 rounded-box border border-base-300 shadow-md">
        <div className="card-body p-5 md:p-6 space-y-4">
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="table min-w-[840px]">
                <thead className="text-sm font-semibold text-base-content">
                  <tr className="border-b border-base-300">
                    <th className="py-2.5 px-3 text-left">Navn</th>
                    <th className="py-2.5 px-3 text-left">Email</th>
                    <th className="py-2.5 px-3 text-left">Telefon</th>
                    <th className="py-2.5 px-3 text-left">Aktiv</th>
                    <th className="py-2.5 px-3 text-right">Plader</th>
                    <th className="py-2.5 px-3 text-right">Transaktioner</th>
                    <th className="py-2.5 px-3 text-right">Handlinger</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {players.map((player, idx) => (
                    <tr
                      key={player.id}
                      className={`${
                        idx % 2 === 0 ? "bg-base-100" : "bg-base-200/60"
                      } hover:bg-base-200 transition-colors duration-150`}
                    >
                      <td className="py-2.5 px-3 font-semibold">{player.name}</td>
                      <td className="py-2.5 px-3 whitespace-pre-wrap break-words">
                        {player.email}
                      </td>
                      <td className="py-2.5 px-3">{player.phone || "-"}</td>
                      <td className="py-2.5 px-3">
                        {player.isActive ? (
                          <span className="badge badge-success badge-sm">Aktiv</span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">Inaktiv</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold">
                        {player.boardCount ?? "-"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold">
                        {player.transactionCount ?? "-"}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/players/${player.id}`}
                            className="btn btn-sm btn-ghost h-10 px-4"
                          >
                            Detaljer
                          </Link>
                          <button
                            className={`btn btn-sm ${player.isActive ? "btn-ghost" : "btn-primary"} h-10 px-4 shadow-md`}
                            onClick={() => toggleActive(player)}
                            disabled={isSaving === player.id || player.email === authUser?.email}
                            title={
                              player.email === authUser?.email
                                ? "Admins kan ikke deaktivere sig selv"
                                : ""
                            }
                          >
                            {player.isActive ? "Deaktiver" : "Aktiver"}
                          </button>
                          <button
                            className="btn btn-sm btn-error h-10 px-4"
                            onClick={() => deletePlayer(player.id)}
                            disabled={isSaving === player.id}
                          >
                            {isSaving === player.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Slet"
                            )}
                          </button>
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
    </div>
  );
}
