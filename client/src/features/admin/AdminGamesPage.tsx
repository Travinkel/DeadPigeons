import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type GameResponse } from "../../api/generated/api-client";

// Helper: Group games by year for section rendering
function groupGamesByYear(games: GameResponse[]): { year: number; games: GameResponse[] }[] {
  const grouped = new Map<number, GameResponse[]>();

  games.forEach((game) => {
    const year = game.year || 0;
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(game);
  });

  return Array.from(grouped.entries())
    .sort(([yearA], [yearB]) => yearB - yearA) // Descending (newest first)
    .map(([year, games]) => ({ year, games }));
}

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

  // Auto-scroll to selected year section when filter changes
  useEffect(() => {
    if (selectedYear !== null) {
      const yearSection = document.getElementById(`year-${selectedYear}`);
      if (yearSection) {
        yearSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [selectedYear]);

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

  // Filter upcoming games: must be pending/not completed AND year >= active game year
  const upcomingGames = sortedGames.filter((g) => {
    // Skip active and completed games
    if (g.status === "Active" || g.completedAt) return false;
    // If no active game exists, show all pending
    if (!activeGame) return true;
    // Only show games in same year or later years
    return (g.year || 0) >= (activeGame.year || 0);
  });

  // Get the earliest upcoming game: since sortedGames is desc (newest→oldest),
  // upcomingGames[upcomingGames.length - 1] is the earliest/next upcoming game
  const nextGame = upcomingGames.length > 0 ? upcomingGames[upcomingGames.length - 1] : null;

  // Extract unique years from sorted games for filtering
  const uniqueYears: number[] = Array.from(
    new Set(sortedGames.map((g) => g.year).filter((y): y is number => y !== undefined))
  ).sort((a, b) => b - a);

  // Filter displayed games by selected year or show all
  const displayedGames =
    selectedYear !== null ? sortedGames.filter((g) => g.year === selectedYear) : sortedGames;

  return (
    <div className="space-y-6">
      {/* Title + Subtitle */}
      <div className="space-y-2">
        <h1 className="text-h1 font-bold text-secondary leading-jumbo tracking-tight">
          Spil (Admin)
        </h1>
        <p className="text-base leading-body text-base-content/70">
          Oversigt over alle spil, afsluttede og kommende. Administrer aktive spil og udfyld
          vindertal.
        </p>
      </div>

      {/* Active Game Card */}
      {activeGame && (
        <div className="card bg-primary text-primary-content rounded-2xl shadow-sm border border-primary/20 px-6 py-4">
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm leading-body text-primary-content/80">Aktivt spil</p>
                <h2 className="text-h2 leading-display font-semibold tracking-tight">
                  Uge {activeGame.weekNumber}, {activeGame.year}
                </h2>
                <p className="text-lg leading-body font-semibold">
                  Plader: {activeGame.boardCount || 0}
                </p>
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

      {/* Next Game Card */}
      {nextGame && (
        <div className="card bg-base-100 rounded-2xl shadow-sm border border-base-300 px-6 py-4">
          <div className="space-y-2">
            <p className="text-sm leading-body text-base-content/70">
              Næste spil (klar til aktivering)
            </p>
            <h2 className="text-h2 leading-display font-semibold tracking-tight">
              Uge {nextGame.weekNumber}, {nextGame.year}
            </h2>
            <p className="text-sm leading-body text-base-content/70">
              Spillet aktiveres automatisk når det aktuelle spil afsluttes.
            </p>
          </div>
        </div>
      )}

      {/* Games Table Container */}
      <div className="rounded-2xl shadow-sm border border-base-300 bg-base-100 px-6 py-4">
        <div className="space-y-4">
          {/* Header: Title + Year Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-h2 leading-display font-semibold tracking-tight">
              Afsluttede og aktive spil
            </h2>

            {/* Year Filter Dropdown */}
            {uniqueYears.length > 1 && (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="year-filter"
                  className="text-sm leading-body font-semibold text-base-content"
                >
                  År:
                </label>
                <select
                  id="year-filter"
                  value={selectedYear === null ? "all" : selectedYear}
                  onChange={(e) =>
                    setSelectedYear(e.target.value === "all" ? null : parseInt(e.target.value))
                  }
                  className="select select-bordered select-sm h-10 max-w-xs text-base leading-body"
                >
                  <option value="all">Alle år</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Empty States */}
          {sortedGames.length === 0 ? (
            <p className="text-base leading-body text-base-content/70">
              Ingen spil oprettet endnu.
            </p>
          ) : displayedGames.length === 0 ? (
            <p className="text-base leading-body text-base-content/70">
              Ingen spil for det valgte år.
            </p>
          ) : (
            /* Year-Grouped Tables */
            <div className="space-y-6">
              {groupGamesByYear(displayedGames).map(({ year, games: yearGames }) => (
                <div key={year} id={`year-${year}`}>
                  {/* Year Header */}
                  <div className="px-6 py-3 bg-base-200 rounded-t-lg border-b border-base-300">
                    <h3 className="text-lg leading-display font-semibold text-base-content tracking-tight">
                      {year}
                    </h3>
                  </div>

                  {/* Year's Games Table */}
                  <div className="overflow-x-auto border border-base-300 border-t-0 rounded-b-lg">
                    <table className="table w-full">
                      <thead className="text-base leading-body font-semibold text-base-content">
                        <tr className="border-b border-base-300">
                          <th className="py-3 px-4 text-left">Uge</th>
                          <th className="py-3 px-4 text-left">År</th>
                          <th className="py-3 px-4 text-right">Plader</th>
                          <th className="py-3 px-4 text-left">Vindende numre</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Handling</th>
                        </tr>
                      </thead>
                      <tbody className="text-base leading-body">
                        {yearGames.map((game) => {
                          const isActive = activeGame?.id === game.id;
                          return (
                            <tr
                              key={game.id}
                              className={`
                                ${
                                  isActive
                                    ? "bg-primary/10 border-l-4 border-primary font-semibold text-primary"
                                    : "hover:bg-base-200"
                                }
                                transition-colors duration-150 cursor-pointer
                              `}
                              onClick={() => game.id && navigate(`/admin/games/${game.id}`)}
                            >
                              <td className="py-3 px-4">{game.weekNumber}</td>
                              <td className="py-3 px-4">{game.year}</td>
                              <td className="py-3 px-4 text-right">{game.boardCount || 0}</td>
                              <td className="py-3 px-4">
                                {game.winningNumbers && game.winningNumbers.length > 0 ? (
                                  <div className="flex gap-1 flex-wrap">
                                    {game.winningNumbers.map((num) => (
                                      <span key={num} className="badge badge-success badge-sm">
                                        {num}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-base-content/60">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {game.status === "Active" ? (
                                  <span className="badge badge-success">Aktiv</span>
                                ) : (
                                  <span className="badge badge-outline">Afsluttet</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Link
                                  to={`/admin/games/${game.id}`}
                                  className="btn btn-sm btn-ghost"
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
