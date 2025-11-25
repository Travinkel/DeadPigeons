import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type GameResponse } from "../../api/generated/api-client";

export function GamesPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
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
        gamesData.sort((a, b) => {
          const yearDiff = (b.year || 0) - (a.year || 0);
          if (yearDiff !== 0) return yearDiff;
          return (b.weekNumber || 0) - (a.weekNumber || 0);
        });
        setGames(gamesData);
      } catch (err) {
        setError("Kunne ikke hente spil. Prøv igen senere.");
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
        <span className="loading loading-spinner loading-sm text-error"></span>
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
  const filteredGames = games.filter((g) => g.status === "Active" || g.completedAt);
  const sortedGames = filteredGames
    .slice()
    .sort((a, b) => {
      const yearDiff = (b.year || 0) - (a.year || 0);
      if (yearDiff !== 0) return yearDiff;
      return (b.weekNumber || 0) - (a.weekNumber || 0);
    })
    .slice(0, 12);

  const winnerCountForGame = (game: GameResponse) => {
    if (!game.completedAt || !game.winningNumbers || game.winningNumbers.length === 0) return null;
    const boards = (game as unknown as { boards?: { numbers?: number[] }[] }).boards;
    if (!boards || boards.length === 0) return 0;
    return boards.filter((board) => game.winningNumbers?.every((n) => board.numbers?.includes(n)))
      .length;
  };

  return (
    <div className="space-y-6">
      {/* Page Title + Subtitle */}
      <div className="space-y-1">
        <h1 className="text-h1 text-base-content">Spiloversigt</h1>
        <p className="text-base text-base-content/70">
          Oversigt over alle aktive og afsluttede spil samt vindende plader
        </p>
      </div>

      {/* Active Game Card */}
      {activeGame && (
        <div className="card bg-error text-white shadow-xl rounded-box border border-error/40">
          <div className="card-body p-6 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-white/80">Aktivt spil</p>
                <p className="text-h2 font-semibold">
                  Uge {activeGame.weekNumber}, {activeGame.year}
                </p>
                <div className="grid gap-2">
                  <div>
                    <p className="text-sm text-white/80">Plader</p>
                    <p className="text-lg font-semibold">{activeGame.boardCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Startet</p>
                    <p className="text-lg font-semibold">
                      {activeGame.startedAt
                        ? new Date(activeGame.startedAt).toLocaleDateString("da-DK")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end justify-center gap-3">
                <span className="badge badge-success badge-lg font-semibold">Aktiv</span>
                {isAdmin && (
                  <div className="flex flex-wrap justify-end gap-3">
                    <Link
                      to={`/games/${activeGame.id}/complete`}
                      className="btn btn-primary h-11 px-5 shadow-md bg-white text-error border-white hover:bg-base-100"
                    >
                      Afslut spil
                    </Link>
                    <Link
                      to={`/admin/games/${activeGame.id}`}
                      className="btn btn-ghost h-11 px-5 bg-white/90 text-error shadow-sm hover:bg-white"
                    >
                      Vis plader
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

      <div className="card bg-base-100 shadow-sm rounded-box border border-base-300">
        <div className="card-body p-5 md:p-6 gap-3">
          <h2 className="text-h3 text-base-content">Seneste 12 spil</h2>
          {sortedGames.length === 0 ? (
            <p className="text-base-content/70 text-sm">Ingen spil oprettet endnu.</p>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[720px]">
                  <thead className="text-xs font-semibold leading-caption text-base-content/80">
                    <tr className="border-b border-base-300">
                      <th className="py-3 px-3 text-left">Uge</th>
                      <th className="py-3 px-3 text-left">År</th>
                      <th className="py-3 px-3 text-right">Plader</th>
                      <th className="py-3 px-3 text-left">Vindende numre</th>
                      <th className="py-3 px-3 text-left">Status</th>
                      <th className="py-3 px-3 text-right">Vinderplader</th>
                      {isAdmin && <th className="py-3 px-3 text-right">Handling</th>}
                    </tr>
                  </thead>
                  <tbody className="text-sm leading-body">
                    {sortedGames.map((game, index) => {
                      const isActiveRow = activeGame && activeGame.id === game.id;
                      const winnerCount = winnerCountForGame(game);
                      const hasWinners = winnerCount !== null && winnerCount > 0;

                      const rowClasses = [
                        "transition-colors duration-150",
                        index % 2 === 0 ? "bg-base-100" : "bg-base-200/60",
                        "hover:bg-error/5",
                        isAdmin && game.id ? "cursor-pointer" : "",
                        isActiveRow
                          ? "border-l-4 border-error bg-error/5 font-semibold"
                          : hasWinners && game.completedAt
                            ? "border-l-2 border-success/50 bg-success/5"
                            : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <tr
                          key={game.id}
                          className={rowClasses}
                          onClick={() => {
                            if (isAdmin && game.id) {
                              navigate(`/admin/games/${game.id}`);
                            }
                          }}
                        >
                          <td className="py-3 px-3 font-semibold">{game.weekNumber}</td>
                          <td className="py-3 px-3">{game.year}</td>
                          <td className="py-3 px-3 text-right">{game.boardCount || 0}</td>
                          <td className="py-3 px-3">
                            {game.winningNumbers && game.winningNumbers.length > 0 ? (
                              <div className="flex gap-2 flex-wrap">
                                {game.winningNumbers.map((num) => (
                                  <span
                                    key={num}
                                    className="badge badge-error badge-sm font-semibold"
                                  >
                                    {num}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-base-content/60">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {game.status === "Active" ? (
                              <span className="badge badge-success badge-sm">Aktiv</span>
                            ) : (
                              <span className="badge badge-ghost badge-sm">Afsluttet</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold">
                            {!game.completedAt ? (
                              "-"
                            ) : winnerCount === null ? (
                              "-"
                            ) : (
                              <span className={hasWinners ? "text-success" : ""}>
                                {winnerCount}
                              </span>
                            )}
                          </td>
                          {isAdmin && (
                            <td className="py-3 px-3 text-right">
                              <Link
                                to={`/admin/games/${game.id}`}
                                className="btn btn-sm btn-ghost h-10 px-4 hover:bg-error/10"
                                onClick={(e) => e.stopPropagation()}
                              >
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
