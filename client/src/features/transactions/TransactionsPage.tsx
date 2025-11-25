import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type PlayerTransaction = {
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
  code?: string;
  message?: string;
  correlationId?: string;
};

export function TransactionsPage() {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState<PlayerTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.playerId || !token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const resp = await fetch(`${API_URL}/api/Transactions/player/${user.playerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!resp.ok) {
          const err: ErrorResponse | undefined = await resp.json().catch(() => undefined);
          throw new Error(err?.message || "Failed to fetch transactions");
        }
        const data: PlayerTransaction[] = await resp.json();
        data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setTransactions(data);
      } catch (err) {
        setError("Kunne ikke hente transaktioner. Prøv igen senere.");
        console.error("Transactions fetch error:", err);
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

  const totalDeposits = transactions
    .filter((tx) => tx.type === "Deposit" && tx.isApproved)
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const pendingDeposits = transactions.filter((tx) => tx.type === "Deposit" && !tx.isApproved);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mine transaktioner</h1>
        <Link
          to="/transactions/deposit"
          className="btn text-white"
          style={{ backgroundColor: "#d50000" }}
        >
          Anmod indbetaling
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Transaktioner i alt</div>
          <div className="stat-value text-primary">{transactions.length}</div>
        </div>
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Godkendte indbetalinger</div>
          <div className="stat-value text-success">{totalDeposits.toFixed(2)} kr</div>
        </div>
        <div className="stat bg-base-100 rounded-2xl shadow-md">
          <div className="stat-title">Afventer godkendelse</div>
          <div className="stat-value text-warning">{pendingDeposits.length}</div>
        </div>
      </div>

      {/* Pending Transactions Alert */}
      {pendingDeposits.length > 0 && (
        <div className="alert alert-warning">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Du har {pendingDeposits.length} indbetaling(er) der afventer godkendelse.</span>
        </div>
      )}

      {/* Transactions List */}
      <div className="card bg-base-100 shadow-md rounded-2xl">
        <div className="card-body">
          <h2 className="card-title">Transaktionshistorik</h2>
          {transactions.length === 0 ? (
            <p className="text-base-content/70">Ingen transaktioner endnu.</p>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto">
                <table className="table min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Dato</th>
                      <th>Type</th>
                      <th>Beløb</th>
                      <th>MobilePay ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleDateString("da-DK", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td>
                          {tx.type === "Deposit" ? (
                            <span className="badge badge-info badge-sm">Indbetaling</span>
                          ) : tx.type === "BoardPurchase" ? (
                            <span className="badge badge-secondary badge-sm">Plade</span>
                          ) : (
                            <span className="badge badge-ghost badge-sm">{tx.type}</span>
                          )}
                        </td>
                        <td
                          className={
                            tx.amount && tx.amount > 0 ? "text-success font-semibold" : "text-error"
                          }
                        >
                          {tx.amount && tx.amount > 0 ? "+" : ""}
                          {tx.amount?.toFixed(2)} kr
                        </td>
                        <td className="text-sm text-base-content/70 whitespace-pre-wrap break-words">
                          {tx.mobilePayTransactionId || "-"}
                        </td>
                        <td>
                          {tx.isApproved ? (
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
