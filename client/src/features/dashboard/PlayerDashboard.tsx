import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import {
  type PlayerResponse,
  type PlayerBalanceResponse,
  type BoardResponse,
  type TransactionResponse,
} from "../../api/generated/api-client";

export function PlayerDashboard() {
  const { user, token } = useAuth();
  const [player, setPlayer] = useState<PlayerResponse | null>(null);
  const [balance, setBalance] = useState<PlayerBalanceResponse | null>(null);
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.playerId || !token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = createApiClient(token);

        const [playerData, balanceData, boardsData, transactionsData] = await Promise.all([
          client.playersGET(user.playerId),
          client.balance(user.playerId),
          client.player(user.playerId),
          client.player2(user.playerId),
        ]);

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-md text-primary"></span>
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
      <h1 className="text-3xl font-bold">Velkommen, {player?.name}</h1>

      {/* Balance Card */}
      <div className="card bg-primary text-primary-content shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Din saldo</h2>
          <p className="text-4xl font-bold">{balance?.balance?.toFixed(2)} kr</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Aktive plader</div>
          <div className="stat-value text-primary">{boards.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Email</div>
          <div className="stat-value text-sm">{player?.email}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Telefon</div>
          <div className="stat-value text-sm">{player?.phone || "-"}</div>
        </div>
      </div>

      {/* Recent Boards */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Dine plader</h2>
          {boards.length === 0 ? (
            <p className="text-base-content/70">Du har ingen plader endnu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Spil</th>
                    <th>Numre</th>
                    <th>Automatisk</th>
                  </tr>
                </thead>
                <tbody>
                  {boards.slice(0, 5).map((board) => (
                    <tr key={board.id}>
                      <td>Uge {board.gameId?.slice(0, 8)}</td>
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
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Seneste transaktioner</h2>
          {transactions.length === 0 ? (
            <p className="text-base-content/70">Ingen transaktioner endnu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
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
                        {tx.approvedAt ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
