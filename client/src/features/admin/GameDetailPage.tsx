import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createApiClient } from "../../api/apiClient";
import {
  type GameResponse,
  type BoardResponse,
  type PlayerResponse,
} from "../../api/generated/api-client";
import { useAuth } from "../auth/useAuth";

type ErrorResponse = {
  message?: string;
};

export function GameDetailPage() {
  const { gameId } = useParams();
  const { token } = useAuth();
  const [game, setGame] = useState<GameResponse | null>(null);
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !gameId) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const client = createApiClient(token);
        const [gameData, boardsData, playersData] = await Promise.all([
          client.gamesGET(gameId),
          client.game(gameId),
          client.playersAll(),
        ]);

        const sortedBoards = [...boardsData].sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        setGame(gameData);
        setBoards(sortedBoards);
        setPlayers(playersData);
      } catch (err) {
        setError("Kunne ikke hente spillets data.");
        console.error("Game detail error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [token, gameId]);

  const playerMap = useMemo(() => {
    const map = new Map<string, string>();
    players.forEach((p) => {
      if (p.id) {
        map.set(p.id, p.name ?? p.email ?? p.id);
      }
    });
    return map;
  }, [players]);

  const winningNumbers = game?.winningNumbers || [];
  const boardsWithFlags = boards.map((board) => {
    const isWinner =
      winningNumbers.length > 0 &&
      winningNumbers.every((num) => board.numbers && board.numbers.includes(num));
    return { ...board, isWinner };
  });

  const totalBoards = boards.length;
  const winningBoards = boardsWithFlags.filter((b) => b.isWinner).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="loading loading-spinner loading-sm text-primary"></span>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="alert alert-error">
        <span>{error || "Spil ikke fundet."}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-base-content/70">
            <Link to="/admin/games" className="link link-hover">
              Spil
            </Link>{" "}
            / {game.weekNumber ? `Uge ${game.weekNumber}` : "Spil"} {game.year}
          </p>
          <h1 className="text-h1 text-base-content flex items-center gap-2">
            Spil uge {game.weekNumber}, {game.year}
            {game.status === "Active" ? (
              <span className="badge badge-success">Aktiv</span>
            ) : (
              <span className="badge badge-ghost">Afsluttet</span>
            )}
          </h1>
          <p className="text-sm text-base-content/70">
            Vindertal:{" "}
            {winningNumbers.length > 0 ? winningNumbers.join(", ") : "Ikke angivet endnu."}
          </p>
          {game.status === "Active" && (
            <Link to={`/games/${game.id}/complete`} className="btn btn-primary h-11 px-5 shadow-md">
              Indtast vindertal
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="card bg-base-100 shadow-md rounded-box border border-base-300">
            <div className="card-body py-3 px-4">
              <p className="text-sm text-base-content/70">Solgte plader</p>
              <p className="text-xl font-bold">{totalBoards}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md rounded-box border border-base-300">
            <div className="card-body py-3 px-4">
              <p className="text-sm text-base-content/70">Vinderplader</p>
              <p className="text-xl font-bold text-success">{winningBoards}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-md rounded-box border border-base-300">
        <div className="card-body p-5 md:p-6 space-y-3">
          <h2 className="text-h2 font-semibold">Plader i spillet</h2>
          {boardsWithFlags.length === 0 ? (
            <p className="text-base-content/70">Ingen plader fundet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table min-w-[760px]">
                <thead className="text-sm font-semibold text-base-content">
                  <tr className="border-b border-base-300">
                    <th className="py-2.5 px-3 text-left">Spiller</th>
                    <th className="py-2.5 px-3 text-left">Numre</th>
                    <th className="py-2.5 px-3 text-left">Vinder?</th>
                    <th className="py-2.5 px-3 text-left">Oprettet</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {boardsWithFlags.map((board) => (
                    <tr
                      key={board.id}
                      className={`${
                        board.isWinner ? "bg-primary/10" : ""
                      } hover:bg-base-200 transition-colors duration-150`}
                    >
                      <td className="py-2.5 px-3 font-semibold">
                        {board.playerId ? (playerMap.get(board.playerId) ?? board.playerId) : "-"}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {board.numbers?.map((num) => (
                            <span key={num} className="badge badge-sm">
                              {num}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        {board.isWinner ? (
                          <span className="badge badge-success badge-sm">Vinder</span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {board.createdAt
                          ? new Date(board.createdAt).toLocaleDateString("da-DK")
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
