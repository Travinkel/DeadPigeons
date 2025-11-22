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
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
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
  const completedGames = games.filter((g) => g.status !== "Active");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Spil</h1>

      {/* Active Game */}
      {activeGame && (
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="card-title">Aktivt spil</h2>
                <p className="text-2xl font-bold mt-2">
                  Uge {activeGame.weekNumber}, {activeGame.year}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="badge badge-secondary">Aktiv</span>
                {isAdmin && (
                  <Link
                    to={`/games/${activeGame.id}/complete`}
                    className="btn btn-sm btn-secondary"
                  >
                    Afslut spil
                  </Link>
                )}
              </div>
            </div>
            <div className="stats stats-vertical lg:stats-horizontal bg-primary-focus mt-4">
              <div className="stat">
                <div className="stat-title text-primary-content/70">Plader</div>
                <div className="stat-value">{activeGame.boardCount || 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-primary-content/70">Startet</div>
                <div className="stat-value text-sm">
                  {activeGame.startedAt
                    ? new Date(activeGame.startedAt).toLocaleDateString("da-DK")
                    : "-"}
                </div>
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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Afsluttede spil</h2>
          {completedGames.length === 0 ? (
            <p className="text-base-content/70">Ingen afsluttede spil endnu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Uge</th>
                    <th>Ar</th>
                    <th>Plader</th>
                    <th>Vindende numre</th>
                    <th>Afsluttet</th>
                  </tr>
                </thead>
                <tbody>
                  {completedGames.map((game) => (
                    <tr key={game.id}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
