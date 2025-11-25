import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type GameResponse } from "../../api/generated/api-client";

export function AdminGamesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState<GameResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const client = createApiClient(token);
        const data = await client.gamesAll();
        data.sort((a, b) => {
          const yearDiff = (b.year || 0) - (a.year || 0);
          if (yearDiff !== 0) return yearDiff;
          return (b.weekNumber || 0) - (a.weekNumber || 0);
        });
        setGames(data);
      } catch (err) {
        setError("Kunne ikke hente spil. Prøv igen senere.");
        console.error("Admin games fetch error:", err);
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
        <span>{error}</span>
      </div>
    );
  }

  const activeGame = games.find((g) => g.status === "Active");
  const sortedGames = games.slice().sort((a, b) => {
    const yearDiff = (b.year || 0) - (a.year || 0);
    if (yearDiff !== 0) return yearDiff;
    return (b.weekNumber || 0) - (a.weekNumber || 0);
  });
  const completedGames = sortedGames.filter((g) => g.completedAt || g.status === "Completed");
  const upcomingGames = sortedGames.filter((g) => g.status !== "Active" && !g.completedAt);
  // Get the earliest upcoming game: since sortedGames is desc (newest→oldest),
  // upcomingGames[upcomingGames.length - 1] is the earliest/next upcoming game
  const nextGame = upcomingGames.length > 0 ? upcomingGames[upcomingGames.length - 1] : null;

  // Extract unique years from sorted games for filtering
  const uniqueYears = Array.from(new Set(sortedGames.map((g) => g.year).filter(Boolean))).sort(
    (a, b) => (b || 0) - (a || 0)
  );

  // Filter displayed games by selected year or show all
  const displayedGames =
    selectedYear !== null ? sortedGames.filter((g) => g.year === selectedYear) : sortedGames;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-h1 text-secondary">Spil (Admin)</h1>
        <p className="text-base text-base-content/70">
          Oversigt over alle spil, afsluttede og kommende. Administrer aktive spil og udfyld
          vindertal.
        </p>
      </div>

      {activeGame && (
        <div className="card bg-primary text-primary-content rounded-box shadow-lg border border-primary/40">
          <div className="card-body p-6 md:p-7 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm text-primary-content/80">Aktivt spil</p>
                <h2 className="text-h2 font-semibold">
                  Uge {activeGame.weekNumber}, {activeGame.year}
                </h2>
                <p className="text-lg font-semibold">Plader: {activeGame.boardCount || 0}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/admin/games/${activeGame.id}`}
                  className="btn btn-ghost h-11 px-5 bg-base-100 text-primary shadow-md"
                >
                  Gå til spil
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {nextGame && (
        <div className="card bg-base-100 rounded-box shadow-md border border-base-300">
          <div className="card-body p-5 md:p-6 space-y-2">
            <p className="text-sm text-base-content/70">Næste spil (klar til aktivering)</p>
            <h2 className="text-h2 font-semibold">
              Uge {nextGame.weekNumber}, {nextGame.year}
            </h2>
            <p className="text-sm text-base-content/70">
              Spillet aktiveres automatisk når det aktuelle spil afsluttes.
            </p>
          </div>
        </div>
      )}

      <div className="card bg-base-100 rounded-box shadow-md border border-base-300">
        <div className="card-body p-5 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-h2 font-semibold">Afsluttede og aktive spil</h2>
            {uniqueYears.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`btn btn-sm ${selectedYear === null ? "btn-primary" : "btn-ghost"} h-10 px-3 transition-all`}
                  onClick={() => setSelectedYear(null)}
                >
                  Alle år
                </button>
                {uniqueYears.map((year) => (
                  <button
                    key={year}
                    className={`btn btn-sm ${selectedYear === year ? "btn-primary" : "btn-ghost"} h-10 px-3 transition-all`}
                    onClick={() => setSelectedYear(year)}
                    title={`Filtrér efter år ${year}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
          {sortedGames.length === 0 ? (
            <p className="text-base-content/70 text-sm">Ingen spil oprettet endnu.</p>
          ) : displayedGames.length === 0 ? (
            <p className="text-base-content/70 text-sm">Ingen spil for det valgte år.</p>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[760px]">
                  <thead className="text-sm font-semibold text-base-content">
                    <tr className="border-b border-base-300">
                      <th className="py-2.5 px-3 text-left">Uge</th>
                      <th className="py-2.5 px-3 text-left">År</th>
                      <th className="py-2.5 px-3 text-right">Plader</th>
                      <th className="py-2.5 px-3 text-left">Vindende numre</th>
                      <th className="py-2.5 px-3 text-left">Status</th>
                      <th className="py-2.5 px-3 text-right">Handling</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {displayedGames.map((game, index) => {
                      const isActiveRow = activeGame && activeGame.id === game.id;
                      const rowClasses = [
                        index % 2 === 0 ? "bg-base-100" : "bg-base-200/60",
                        isActiveRow ? "bg-success/10 hover:bg-success/20" : "hover:bg-base-300",
                        "transition-colors duration-150",
                        "cursor-pointer",
                        isActiveRow ? "border-l-4 border-success font-semibold" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <tr
                          key={game.id}
                          className={rowClasses}
                          onClick={() => game.id && navigate(`/admin/games/${game.id}`)}
                        >
                          <td className="py-2.5 px-3 font-semibold">{game.weekNumber}</td>
                          <td className="py-2.5 px-3">{game.year}</td>
                          <td className="py-2.5 px-3 text-right">{game.boardCount || 0}</td>
                          <td className="py-2.5 px-3">
                            {game.winningNumbers && game.winningNumbers.length > 0 ? (
                              <div className="flex gap-2 flex-wrap">
                                {game.winningNumbers.map((num) => (
                                  <span key={num} className="badge badge-primary badge-sm">
                                    {num}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-base-content/60">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            {game.status === "Active" ? (
                              <span className="badge badge-success badge-sm">Aktiv</span>
                            ) : (
                              <span className="badge badge-warning badge-sm">Afsluttet</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <Link
                              to={`/admin/games/${game.id}`}
                              className="btn btn-sm btn-ghost h-10 px-4"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Detaljer
                            </Link>
                          </td>
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
