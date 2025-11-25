import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type PlayerResponse, type PlayerBalanceResponse } from "../../api/generated/api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type BoardSummary = {
  id?: string;
  gameId?: string;
  numbers?: number[];
  isRepeating?: boolean;
  friendlyTitle?: string;
  weekNumber?: number;
  year?: number;
};

type TransactionSummary = {
  id?: string;
  playerId?: string;
  amount?: number;
  type?: string;
  mobilePayTransactionId?: string | null;
  isApproved?: boolean;
  createdAt?: string;
  approvedAt?: string | null;
};

type ErrorResponse = {
  message?: string;
};

export function PlayerDashboard() {
  const { user, token } = useAuth();
  const [player, setPlayer] = useState<PlayerResponse | null>(null);
  const [balance, setBalance] = useState<PlayerBalanceResponse | null>(null);
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.playerId || !token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = createApiClient(token);
        const [playerData, balanceData] = await Promise.all([
          client.playersGET(user.playerId),
          client.balance(user.playerId),
        ]);

        const [boardsResp, transactionsResp] = await Promise.all([
          fetch(`${API_URL}/api/Boards/player/${user.playerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
          fetch(`${API_URL}/api/Transactions/player/${user.playerId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
        ]);

        if (!boardsResp.ok) {
          const err: ErrorResponse | undefined = await boardsResp.json().catch(() => undefined);
          throw new Error(err?.message || "Failed to fetch boards");
        }

        if (!transactionsResp.ok) {
          const err: ErrorResponse | undefined = await transactionsResp
            .json()
            .catch(() => undefined);
          throw new Error(err?.message || "Failed to fetch transactions");
        }

        const boardsData: BoardSummary[] = await boardsResp.json();
        const transactionsData: TransactionSummary[] = await transactionsResp.json();

        transactionsData.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });

        setPlayer(playerData);
        setBalance(balanceData);
        setBoards(boardsData);
        setTransactions(transactionsData.slice(0, 5)); // Latest 5
      } catch (err) {
        setError("Kunne ikke hente data. Prøv igen senere.");
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.playerId, token]);

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

  return (
    <div className="space-y-6">
      <h1 className="text-h1 text-base-content mb-6">Velkommen, {player?.name}</h1>

      {/* Balance Card */}
      <div className="card shadow-md rounded-2xl bg-primary text-primary-content">
        <div className="card-body">
          <h2 className="card-title">Din saldo</h2>
          <p className="text-4xl font-extrabold drop-shadow-sm">
            {balance?.balance?.toFixed(2)} kr
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Aktive plader</div>
          <div className="stat-value text-primary">{boards.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Email</div>
          <div className="stat-value text-sm break-all">{player?.email}</div>
        </div>
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Telefon</div>
          <div className="stat-value text-sm">{player?.phone || "-"}</div>
        </div>
      </div>

      {/* Recent Boards */}
      <div className="card bg-base-100 shadow-md rounded-2xl">
        <div className="card-body">
          <h2 className="card-title">Dine plader</h2>
          {boards.length === 0 ? (
            <p className="text-base-content/70">Du har ingen plader endnu.</p>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[620px]">
                  <thead>
                    <tr>
                      <th>Spil</th>
                      <th>Numre</th>
                      <th>Automatisk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boards.slice(0, 5).map((board) => (
                      <tr key={board.id ?? `${board.gameId}-${board.numbers?.join("-")}`}>
                        <td>
                          {board.friendlyTitle
                            ? board.friendlyTitle
                            : board.weekNumber && board.year
                              ? `Uge ${board.weekNumber}, ${board.year}`
                              : board.gameId
                                ? `Spil ${board.gameId.slice(0, 8)}`
                                : "Spil"}
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
                          {board.isRepeating ? (
                            <span className="badge badge-success badge-sm">Ja</span>
                          ) : (
                            <span className="badge badge-ghost badge-sm">Nej</span>
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

      {/* Recent Transactions */}
      <div className="card bg-base-100 shadow-md rounded-2xl">
        <div className="card-body">
          <h2 className="card-title">Seneste transaktioner</h2>
          {transactions.length === 0 ? (
            <p className="text-base-content/70">Ingen transaktioner endnu.</p>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[620px]">
                  <thead>
                    <tr>
                      <th>Dato</th>
                      <th>Type</th>
                      <th>Beløb</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("da-DK") : "-"}
                        </td>
                        <td>{tx.type}</td>
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
    </div>
  );
}
