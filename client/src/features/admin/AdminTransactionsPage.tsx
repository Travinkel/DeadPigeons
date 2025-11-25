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
  approvedAt?: string | null;
  type?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
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
  const [isRejecting, setIsRejecting] = useState(false);
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

  const handleReject = async (id?: string) => {
    if (!id || !token) return;

    const confirmed = window.confirm(
      "Afviser denne indbetalingsanmodning? Spillerens saldo ændres ikke."
    );
    if (!confirmed) return;

    setIsRejecting(true);
    try {
      const resp = await fetch(`${API_URL}/api/Transactions/${id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resp.ok) {
        const err: ErrorResponse | undefined = await resp.json().catch(() => undefined);
        throw new Error(err?.message || "Kunne ikke afvise");
      }
      await loadData();
    } catch (err) {
      setError("Afvisning fejlede. Prøv igen.");
      console.error("Reject transaction error:", err);
    } finally {
      setIsRejecting(false);
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-h1 text-base-content">Admin transaktioner</h1>
          <p className="text-base text-base-content/70">
            Godkend indbetalinger og se historik for alle transaktioner.
          </p>
        </div>
        <div className="join">
          <button
            className={`btn ${view === "pending" ? "btn-primary" : "btn-ghost"} h-11 px-5 shadow-md join-item`}
            onClick={() => setView("pending")}
          >
            Afventer godkendelse
          </button>
          <button
            className={`btn ${view === "all" ? "btn-primary" : "btn-ghost"} h-11 px-5 shadow-md join-item`}
            onClick={() => setView("all")}
          >
            Alle transaktioner
          </button>
        </div>
      </div>

      {view === "pending" ? (
        <div className="card bg-base-100 shadow-md rounded-box border border-base-300">
          <div className="card-body p-5 md:p-6 gap-4">
            <h2 className="text-h2 font-semibold">Afventende indbetalinger</h2>
            {pendingTransactions.length === 0 ? (
              <p className="text-base-content/70 text-sm">Ingen afventende indbetalinger.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table min-w-[720px]">
                  <thead className="text-sm font-semibold text-base-content">
                    <tr className="border-b border-base-300">
                      <th className="py-2.5 px-3 text-left">Spiller</th>
                      <th className="py-2.5 px-3 text-right">Beløb</th>
                      <th className="py-2.5 px-3 text-left">Dato</th>
                      <th className="py-2.5 px-3 text-left">MobilePay</th>
                      <th className="py-2.5 px-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {pendingTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="odd:bg-base-100 even:bg-base-200/60 hover:bg-base-200 transition-colors duration-150"
                      >
                        <td className="py-2.5 px-3">{tx.playerNameOrEmail || tx.playerId}</td>
                        <td
                          className={`py-2.5 px-3 text-right font-semibold ${
                            tx.amount && tx.amount > 0 ? "text-success" : "text-error"
                          }`}
                        >
                          {tx.amount?.toFixed(2)} kr
                        </td>
                        <td className="py-2.5 px-3">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("da-DK") : "-"}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-base-content/70">
                          {tx.mobilePayTransactionId || "-"}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              className="btn btn-sm btn-primary h-10 px-5 shadow-md"
                              onClick={() => handleApprove(tx.id)}
                              disabled={isApproving || isRejecting}
                            >
                              {isApproving ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                "Godkend"
                              )}
                            </button>
                            <button
                              className="btn btn-sm btn-outline btn-warning h-10 px-4 shadow-md"
                              onClick={() => handleReject(tx.id)}
                              disabled={isApproving || isRejecting}
                            >
                              {isRejecting ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                "Afvis"
                              )}
                            </button>
                          </div>
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
        <div className="card bg-base-100 shadow-md rounded-box border border-base-300">
          <div className="card-body p-5 md:p-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-h2 font-semibold">Alle transaktioner</h2>
              <input
                type="text"
                className="input input-bordered input-sm h-10 w-full sm:w-72"
                placeholder="Filtrer efter spiller eller MobilePay"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            {filteredAll.length === 0 ? (
              <p className="text-base-content/70 text-sm">Ingen transaktioner matcher filteret.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table min-w-[760px]">
                  <thead className="text-sm font-semibold text-base-content">
                    <tr className="border-b border-base-300">
                      <th className="py-2.5 px-3 text-left">Spiller</th>
                      <th className="py-2.5 px-3 text-right">Beløb</th>
                      <th className="py-2.5 px-3 text-left">Status</th>
                      <th className="py-2.5 px-3 text-left">MobilePay</th>
                      <th className="py-2.5 px-3 text-left">Dato</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredAll.map((tx) => (
                      <tr
                        key={tx.id ?? `${tx.playerId}-${tx.createdAt}`}
                        className="odd:bg-base-100 even:bg-base-200/60 hover:bg-base-200 transition-colors duration-150"
                      >
                        <td className="py-2.5 px-3 font-semibold">
                          {tx.playerNameOrEmail || tx.playerId}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-semibold ${
                            tx.amount && tx.amount > 0 ? "text-success" : "text-error"
                          }`}
                        >
                          {tx.amount?.toFixed(2)} kr
                        </td>
                        <td className="py-2.5 px-3">
                          {tx.isApproved ? (
                            <div>
                              <span className="badge badge-success badge-sm">Godkendt</span>
                              {tx.approvedAt && (
                                <div className="text-xs text-base-content/60 mt-1">
                                  {new Date(tx.approvedAt).toLocaleString("da-DK")}
                                </div>
                              )}
                            </div>
                          ) : tx.isDeleted ? (
                            <div>
                              <span className="badge badge-error badge-sm">Afvist</span>
                              {tx.deletedAt && (
                                <div className="text-xs text-base-content/60 mt-1">
                                  {new Date(tx.deletedAt).toLocaleString("da-DK")}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="badge badge-warning badge-sm">Afventer</span>
                              {tx.createdAt && (
                                <div className="text-xs text-base-content/60 mt-1">
                                  {new Date(tx.createdAt).toLocaleString("da-DK")}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-xs">{tx.mobilePayTransactionId || "-"}</td>
                        <td className="py-2.5 px-3">
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
