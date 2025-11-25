import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type GameResponse } from "../../api/generated/api-client";

export function GamesPage() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [games, setGames] = useState<GameResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = createApiClient(token);
        const gamesData = await client.gamesAll();
        // Sort by year and week number descending (newest first)
        gamesData.sort((a, b) => {
          const yearDiff = (b.year || 0) - (a.year || 0);
          if (yearDiff !== 0) return yearDiff;
          return (b.weekNumber || 0) - (a.weekNumber || 0);
        });
        setGames(gamesData);
      } catch (err) {
        setError("Kunne ikke hente spil. Prov igen senere.");
        console.error("Games fetch error:", err);
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
  const completedGames = games
    .filter((g) => g.status !== "Active")
    .slice()
    .sort((a, b) => {
      const yearDiff = (b.year || 0) - (a.year || 0);
      if (yearDiff !== 0) return yearDiff;
      return (b.weekNumber || 0) - (a.weekNumber || 0);
    });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Spil</h1>

      {/* Active Game */}
      {activeGame && (
        <div className="card shadow-md rounded-2xl" style={{ backgroundColor: "#d50000" }}>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="pt-6 pb-6 px-8 space-y-4">
                <div className="space-y-1">
                  <p className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
                    Aktivt spil
                  </p>
                  <p className="text-xl font-bold text-white">
                    Uge {activeGame.weekNumber}, {activeGame.year}
                  </p>
                </div>
                <div className="grid gap-y-2">
                  <div>
                    <p className="text-sm text-white/80">Plader</p>
                    <p className="text-xl font-bold text-white">{activeGame.boardCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Startet</p>
                    <p className="text-xl font-bold text-white">
                      {activeGame.startedAt
                        ? new Date(activeGame.startedAt).toLocaleDateString("da-DK")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6 pb-6 px-8 flex flex-col items-start md:items-end justify-center gap-3">
                <p className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
                  Aktiv
                </p>
                {isAdmin && (
                  <Link
                    to={`/games/${activeGame.id}/complete`}
                    className="rounded-lg px-4 py-2 text-sm font-medium bg-white text-red-700 hover:bg-gray-100 self-end shadow-sm"
                  >
                    Afslut spil
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to={`/admin/games/${activeGame.id}`}
                    className="rounded-lg px-4 py-2 text-sm font-medium bg-white text-red-700 hover:bg-gray-100 self-end shadow-sm"
                  >
                    Vis plader
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Active Game */}
      {!activeGame && (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Der er intet aktivt spil lige nu.</span>
        </div>
      )}

      {/* Completed Games */}
      <div className="card bg-base-100 shadow-md rounded-2xl">
        <div className="card-body">
          <h2 className="card-title">Afsluttede spil</h2>
          {completedGames.length === 0 ? (
            <p className="text-base-content/70">Ingen afsluttede spil endnu.</p>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Uge</th>
                      <th>Ar</th>
                      <th>Plader</th>
                      <th>Vindende numre</th>
                      <th>Afsluttet</th>
                      {isAdmin && <th className="text-right">Handling</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {completedGames.map((game) => {
                      const isActiveRow =
                        activeGame &&
                        activeGame.year === game.year &&
                        activeGame.weekNumber === game.weekNumber;
                      return (
                        <tr
                          key={game.id}
                          className={isActiveRow ? "bg-red-50 text-red-700 font-semibold" : ""}
                        >
                          <td className="font-semibold">{game.weekNumber}</td>
                          <td>{game.year}</td>
                          <td>{game.boardCount || 0}</td>
                          <td>
                            {game.winningNumbers && game.winningNumbers.length > 0 ? (
                              <div className="flex gap-1 flex-wrap">
                                {game.winningNumbers.map((num) => (
                                  <span key={num} className="badge badge-primary badge-sm">
                                    {num}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-base-content/50">-</span>
                            )}
                          </td>
                          <td>
                            {game.completedAt
                              ? new Date(game.completedAt).toLocaleDateString("da-DK")
                              : "-"}
                          </td>
                          {isAdmin && (
                            <td className="text-right">
                              <Link to={`/admin/games/${game.id}`} className="btn btn-xs btn-ghost">
                                Detaljer
                              </Link>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-base-100 to-transparent md:hidden" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
