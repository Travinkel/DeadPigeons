import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type AdminTransaction = {
  id?: string;
  playerId?: string;
  playerNameOrEmail?: string;
  amount?: number;
  mobilePayTransactionId?: string | null;
  isApproved?: boolean;
  createdAt?: string;
  type?: string;
};

type ErrorResponse = {
  message?: string;
};

export function AdminTransactionsPage() {
  const { token } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState<AdminTransaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<AdminTransaction[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"pending" | "all">("pending");

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const [pendingResp, allResp] = await Promise.all([
        fetch(`${API_URL}/api/Transactions/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
        fetch(`${API_URL}/api/Transactions/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
      ]);

      if (!pendingResp.ok) {
        const err: ErrorResponse | undefined = await pendingResp.json().catch(() => undefined);
        throw new Error(err?.message || "Failed to fetch pending transactions");
      }
      if (!allResp.ok) {
        const err: ErrorResponse | undefined = await allResp.json().catch(() => undefined);
        throw new Error(err?.message || "Failed to fetch transactions");
      }

      const pendingData: AdminTransaction[] = await pendingResp.json();
      const allData: AdminTransaction[] = await allResp.json();

      pendingData.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });

      allData.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });

      setPendingTransactions(pendingData);
      setAllTransactions(allData);
    } catch (err) {
      setError("Kunne ikke hente transaktioner.");
      console.error("Admin transactions error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [token]);

  const handleApprove = async (id?: string) => {
    if (!id || !token) return;
    setIsApproving(true);
    try {
      const resp = await fetch(`${API_URL}/api/Transactions/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!resp.ok) {
        const err: ErrorResponse | undefined = await resp.json().catch(() => undefined);
        throw new Error(err?.message || "Kunne ikke godkende");
      }
      await loadData();
    } catch (err) {
      setError("Godkendelse fejlede. Prøv igen.");
      console.error("Approve transaction error:", err);
    } finally {
      setIsApproving(false);
    }
  };

  const filteredAll = useMemo(() => {
    if (!filter.trim()) return allTransactions;
    const term = filter.toLowerCase();
    return allTransactions.filter(
      (tx) =>
        (tx.playerNameOrEmail || "").toLowerCase().includes(term) ||
        (tx.mobilePayTransactionId || "").toLowerCase().includes(term)
    );
  }, [filter, allTransactions]);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-3xl font-bold">Admin transaktioner</h1>
        <div className="join">
          <button
            className={`btn btn-sm join-item ${view === "pending" ? "btn-primary" : ""}`}
            onClick={() => setView("pending")}
          >
            Afventer godkendelse
          </button>
          <button
            className={`btn btn-sm join-item ${view === "all" ? "btn-primary" : ""}`}
            onClick={() => setView("all")}
          >
            Alle transaktioner
          </button>
        </div>
      </div>

      {view === "pending" ? (
        <div className="card bg-base-100 shadow-md rounded-2xl">
          <div className="card-body">
            <h2 className="card-title">Afventende indbetalinger</h2>
            {pendingTransactions.length === 0 ? (
              <p className="text-base-content/70">Ingen afventende indbetalinger.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Spiller</th>
                      <th>Beløb</th>
                      <th>Dato</th>
                      <th>MobilePay</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.playerNameOrEmail || tx.playerId}</td>
                        <td>{tx.amount?.toFixed(2)} kr</td>
                        <td>
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("da-DK") : "-"}
                        </td>
                        <td className="text-xs text-base-content/70">
                          {tx.mobilePayTransactionId || "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm text-white"
                            style={{ backgroundColor: "#d50000" }}
                            onClick={() => handleApprove(tx.id)}
                            disabled={isApproving}
                          >
                            {isApproving ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Godkend"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-md rounded-2xl">
          <div className="card-body space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="card-title">Alle transaktioner</h2>
              <input
                type="text"
                className="input input-bordered input-sm w-full sm:w-72"
                placeholder="Filtrer efter spiller eller MobilePay"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            {filteredAll.length === 0 ? (
              <p className="text-base-content/70">Ingen transaktioner matcher filteret.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Spiller</th>
                      <th>Beløb</th>
                      <th>Status</th>
                      <th>MobilePay</th>
                      <th>Dato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAll.map((tx) => (
                      <tr key={tx.id ?? `${tx.playerId}-${tx.createdAt}`}>
                        <td className="font-semibold">{tx.playerNameOrEmail || tx.playerId}</td>
                        <td className={tx.amount && tx.amount > 0 ? "text-success" : "text-error"}>
                          {tx.amount?.toFixed(2)} kr
                        </td>
                        <td>
                          {tx.isApproved ? (
                            <span className="badge badge-success badge-sm">Godkendt</span>
                          ) : (
                            <span className="badge badge-warning badge-sm">Afventer</span>
                          )}
                        </td>
                        <td className="text-xs">{tx.mobilePayTransactionId || "-"}</td>
                        <td>
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleString("da-DK") : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
