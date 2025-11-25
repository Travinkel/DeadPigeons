import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createApiClient } from "../../api/apiClient";
import {
  type PlayerResponse,
  type PlayerBalanceResponse,
  type BoardResponse,
  type TransactionResponse,
  type GameResponse,
} from "../../api/generated/api-client";
import { useAuth } from "../auth/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type ErrorResponse = {
  message?: string;
};

export function PlayerDetailPage() {
  const { playerId } = useParams();
  const { token } = useAuth();
  const [player, setPlayer] = useState<PlayerResponse | null>(null);
  const [balance, setBalance] = useState<PlayerBalanceResponse | null>(null);
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [games, setGames] = useState<GameResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !playerId) return;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const client = createApiClient(token);
        const [playerData, balanceData, boardsData, gamesData, transactionsResp] =
          await Promise.all([
            client.playersGET(playerId),
            client.balance(playerId),
            client.playerAll(playerId),
            client.gamesAll(),
            fetch(`${API_URL}/api/Transactions/player/${playerId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }),
          ]);

        if (!transactionsResp.ok) {
          const err: ErrorResponse | undefined = await transactionsResp
            .json()
            .catch(() => undefined);
          throw new Error(err?.message || "Kunne ikke hente transaktioner");
        }
        const transactionsData: TransactionResponse[] = await transactionsResp.json();

        boardsData.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        const sortedTransactions = [...transactionsData].sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        setPlayer(playerData);
        setBalance(balanceData);
        setBoards(boardsData);
        setTransactions(sortedTransactions);
        setGames(gamesData);
      } catch (err) {
        setError("Kunne ikke hente spillerdata.");
        console.error("Admin player detail error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [token, playerId]);

  const gameMap = useMemo(() => {
    const map = new Map<string, GameResponse>();
    games.forEach((g) => {
      if (g.id) {
        map.set(g.id, g);
      }
    });
    return map;
  }, [games]);

  const boardsWithFlags = boards.map((board) => {
    const game = board.gameId ? gameMap.get(board.gameId) : undefined;
    const winningNumbers = game?.winningNumbers || [];
    const isWinner =
      winningNumbers.length > 0 &&
      winningNumbers.every((num) => board.numbers && board.numbers.includes(num));
    return { ...board, isWinner, game };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="loading loading-spinner loading-sm text-primary"></span>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="alert alert-error">
        <span>{error || "Spiller ikke fundet."}</span>
      </div>
    );
  }

  const balanceValue = balance?.balance ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-base-content/70">
            <Link to="/admin" className="link link-hover">
              Admin
            </Link>{" "}
            / Spillere / {player.name}
          </p>
          <h1 className="text-h1 text-base-content flex items-center gap-2">
            {player.name}
            {player.isActive ? (
              <span className="badge badge-success">Aktiv</span>
            ) : (
              <span className="badge badge-ghost">Inaktiv</span>
            )}
          </h1>
          <p className="text-base-content/70">{player.email}</p>
        </div>
        <div className="card bg-primary text-primary-content shadow-md">
          <div className="card-body py-3 px-4">
            <p className="text-sm">Saldo</p>
            <p className="text-2xl font-bold">{balanceValue.toFixed(2)} kr</p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-md rounded-box border border-base-300">
        <div className="card-body p-5 md:p-6 space-y-3">
          <h2 className="text-h2 font-semibold">Plader</h2>
          {boardsWithFlags.length === 0 ? (
            <p className="text-base-content/70">Ingen plader.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Spil</th>
                    <th>Numre</th>
                    <th>Vinder?</th>
                    <th>Oprettet</th>
                  </tr>
                </thead>
                <tbody>
                  {boardsWithFlags.map((board) => (
                    <tr key={board.id}>
                      <td>
                        {board.weekNumber && board.year
                          ? `Uge ${board.weekNumber}, ${board.year}`
                          : board.friendlyTitle || board.gameId?.slice(0, 8)}
                      </td>
                      <td>
                        <div className="flex gap-1 flex-wrap">
                          {board.numbers?.map((num) => (
                            <span key={num} className="badge badge-sm">
                              {num}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        {board.isWinner ? (
                          <span className="badge badge-success badge-sm">Vinder</span>
                        ) : (
                          <span className="badge badge-ghost badge-sm">-</span>
                        )}
                      </td>
                      <td>
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

      <div className="card bg-base-100 shadow-md rounded-box border border-base-300">
        <div className="card-body p-5 md:p-6 space-y-3">
          <h2 className="text-h2 font-semibold">Transaktioner</h2>
          {transactions.length === 0 ? (
            <p className="text-base-content/70">Ingen transaktioner.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Beløb</th>
                    <th>Status</th>
                    <th>MobilePay</th>
                    <th>Dato</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className={tx.amount && tx.amount > 0 ? "text-success" : "text-error"}>
                        {tx.amount?.toFixed(2)} kr
                      </td>
                      <td>
                        {tx.isApproved || tx.approvedAt ? (
                          <span className="badge badge-success badge-sm">Godkendt</span>
                        ) : (
                          <span className="badge badge-warning badge-sm">Afventer</span>
                        )}
                      </td>
                      <td className="text-xs">{tx.mobilePayTransactionId || "-"}</td>
                      <td>
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("da-DK") : "-"}
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
