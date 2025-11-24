import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";

export function DepositRequestPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [mobilePayId, setMobilePayId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.playerId || !token) return;

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const client = createApiClient(token);
        const balanceData = await client.balance(user.playerId);
        setBalance(balanceData.balance || 0);
      } catch (err) {
        console.error("Balance fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [user?.playerId, token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.playerId || !token) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Indtast et gyldigt belob.");
      return;
    }

    const trimmedMobilePayId = mobilePayId.trim();
    if (!trimmedMobilePayId) {
      setError("MobilePay transaktions-ID er paakraevet.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const client = createApiClient(token);
      await client.deposit({
        playerId: user.playerId,
        amount: amountNum,
        mobilePayTransactionId: trimmedMobilePayId,
      });

      setSuccess("Indbetalingsanmodning oprettet! Den afventer godkendelse fra administrator.");
      setAmount("");
      setMobilePayId("");

      // Navigate to transactions after delay
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    } catch (err) {
      setError("Kunne ikke oprette indbetalingsanmodning. Prov igen senere.");
      console.error("Deposit request error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="loading loading-spinner loading-sm text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-2 xs:flex-row xs:items-center xs:justify-between">
        <h1 className="text-3xl font-bold">Anmod om indbetaling</h1>
        <div className="self-start xs:self-auto px-3 py-2 rounded-full bg-[#d60000] text-white font-extrabold text-sm tracking-tight shadow-sm">
          Saldo: {balance.toFixed(2)} kr
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Saadan gor du</h2>
          <ol className="list-decimal list-inside space-y-2 text-base-content/80">
            <li>Overfør det onskede belob via MobilePay til klubbens konto</li>
            <li>Noter transaktions-ID fra MobilePay</li>
            <li>Udfyld formularen nedenfor med belob og transaktions-ID</li>
            <li>Administrator godkender din indbetaling</li>
          </ol>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="alert alert-success">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {error && (
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
      )}

      {/* Deposit Form */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Indbetalingsanmodning</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Amount Buttons */}
            <div>
              <label className="label">
                <span className="label-text">Hurtig valg</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`btn btn-sm ${
                      amount === amt.toString() ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => setAmount(amt.toString())}
                  >
                    {amt} kr
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Belob (DKK)</span>
              </label>
              <input
                type="number"
                placeholder="Indtast belob"
                className="input input-bordered"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                required
              />
            </div>

            {/* MobilePay ID Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">MobilePay transaktions-ID</span>
              </label>
              <input
                type="text"
                placeholder="F.eks. MP-123456789"
                className="input input-bordered"
                value={mobilePayId}
                onChange={(e) => setMobilePayId(e.target.value)}
                required
                maxLength={50}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Paakraevet for godkendelse; findes i MobilePay app under betalingshistorik
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting || !amount}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Send anmodning"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Back Button */}
      <button className="btn btn-ghost" onClick={() => navigate("/transactions")}>
        Tilbage til transaktioner
      </button>
    </div>
  );
}
