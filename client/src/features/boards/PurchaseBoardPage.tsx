import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type GameResponse, type PlayerResponse } from "../../api/generated/api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type ErrorResponse = {
  message?: string;
};

// Pricing model: 5=20, 6=40, 7=80, 8=160 DKK
function calculatePrice(count: number): number {
  if (count < 5) return 0;
  if (count === 5) return 20;
  if (count === 6) return 40;
  if (count === 7) return 80;
  return 160; // 8 numbers
}

export function PurchaseBoardPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [player, setPlayer] = useState<PlayerResponse | null>(null);
  const [activeGame, setActiveGame] = useState<GameResponse | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mobilePayId, setMobilePayId] = useState("");

  // Check for prefilled numbers from repeat functionality
  useEffect(() => {
    const prefillNumbers = searchParams.get("numbers");
    if (prefillNumbers) {
      const numbers = prefillNumbers
        .split(",")
        .map(Number)
        .filter((n) => n >= 1 && n <= 90);
      setSelectedNumbers(numbers);
      setIsRepeating(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user?.playerId || !token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = createApiClient(token);
        const [playerData, gameData, balanceData] = await Promise.all([
          fetch(`${API_URL}/api/Players/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch player");
            return res.json() as Promise<PlayerResponse>;
          }),
          client.active(),
          client.balance(user.playerId),
        ]);
        setPlayer(playerData);
        setActiveGame(gameData);
        setBalance(balanceData.balance || 0);
      } catch (err) {
        setError("Kunne ikke hente spildata. Prøv igen senere.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.playerId, token]);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else if (selectedNumbers.length < 8) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
    setIsRepeating(false);
  };

  const isInactivePlayer = player && player.isActive === false;
  const price = calculatePrice(selectedNumbers.length);
  const canPurchase =
    !isInactivePlayer &&
    selectedNumbers.length >= 5 &&
    selectedNumbers.length <= 8 &&
    mobilePayId.trim().length > 0 &&
    balance >= price &&
    activeGame &&
    !isPastCutoff();

  function isPastCutoff(): boolean {
    // Saturday 5 PM cutoff (17:00)
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();

    // If it's Saturday and past 5 PM
    if (day === 6 && hour >= 17) {
      return true;
    }
    return false;
  }

  const handleSubmit = async () => {
    if (!user?.playerId || !token || !activeGame?.id) return;

    const trimmedMobilePayId = mobilePayId.trim();
    if (!trimmedMobilePayId) {
      setError("MobilePay transaktions-ID er påkrævet.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const resp = await fetch(`${API_URL}/api/Boards`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          playerId: user.playerId,
          gameId: activeGame.id,
          numbers: selectedNumbers,
          isRepeating,
          mobilePayTransactionId: trimmedMobilePayId,
        }),
      });

      if (!resp.ok) {
        const err: ErrorResponse | undefined = await resp.json().catch(() => undefined);
        throw new Error(err?.message || "Failed to create board");
      }

      setSuccess("Plade oprettet! Den afventer godkendelse.");
      setSelectedNumbers([]);
      setIsRepeating(false);
      setMobilePayId("");

      // Refresh balance
      const client = createApiClient(token);
      const balanceData = await client.balance(user.playerId);
      setBalance(balanceData.balance || 0);

      // Navigate to boards after delay
      setTimeout(() => {
        navigate("/boards");
      }, 2000);
    } catch (err) {
      setError("Kunne ikke oprette plade. Tjek din saldo og prøv igen.");
      console.error("Board purchase error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="loading loading-spinner loading-sm text-primary"></span>
      </div>
    );
  }

  if (!activeGame) {
    return (
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
        <span>Der er intet aktivt spil lige nu. Kom tilbage senere!</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-h1 text-base-content">Køb plade</h1>
        <div className="badge badge-lg bg-primary text-primary-content font-semibold min-w-[140px] justify-center">
          Saldo: {balance.toFixed(2)} kr
        </div>
      </div>

      {/* Active Game Info */}
      <div className="card bg-primary text-primary-content shadow-md rounded-box">
        <div className="card-body p-5 md:p-6">
          <p className="text-lg">
            Aktivt spil:{" "}
            <strong>
              Uge {activeGame.weekNumber}, {activeGame.year}
            </strong>
          </p>
        </div>
      </div>

      {isInactivePlayer && (
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
          <span>
            Din konto er inaktiv. Kontakt en administrator for at aktivere, før du kan købe plader.
          </span>
        </div>
      )}

      {/* Cutoff Warning */}
      {isPastCutoff() && (
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
          <span>Det er efter fristen for denne uge. Din plade bliver brugt næste uge.</span>
        </div>
      )}

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

      {/* Pricing Info */}
      <div className="card bg-base-100 shadow-md rounded-box">
        <div className="card-body">
          <h2 className="card-title">Priser</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div
              className={`stat ${selectedNumbers.length === 5 ? "bg-primary text-primary-content" : "bg-base-200"} rounded-box`}
            >
              <div className="stat-title">5 numre</div>
              <div className="stat-value text-lg">20 kr</div>
            </div>
            <div
              className={`stat ${selectedNumbers.length === 6 ? "bg-primary text-primary-content" : "bg-base-200"} rounded-box`}
            >
              <div className="stat-title">6 numre</div>
              <div className="stat-value text-lg">40 kr</div>
            </div>
            <div
              className={`stat ${selectedNumbers.length === 7 ? "bg-primary text-primary-content" : "bg-base-200"} rounded-box`}
            >
              <div className="stat-title">7 numre</div>
              <div className="stat-value text-lg">80 kr</div>
            </div>
            <div
              className={`stat ${selectedNumbers.length === 8 ? "bg-primary text-primary-content" : "bg-base-200"} rounded-box`}
            >
              <div className="stat-title">8 numre</div>
              <div className="stat-value text-lg">160 kr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Status */}
      <div className="card bg-base-100 shadow-md rounded-box">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="card-title">Valgte numre: {selectedNumbers.length}/8</h2>
              <p className="text-sm text-base-content/70">Minimum 5, maksimum 8 numre</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
              Ryd
            </button>
          </div>

          {selectedNumbers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedNumbers.map((num) => (
                <div
                  key={num}
                  className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold cursor-pointer hover:bg-primary-focus"
                  onClick={() => toggleNumber(num)}
                >
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Number Grid */}
      <div className="card bg-base-100 shadow-md rounded-box border border-base-300">
        <div className="card-body p-5 md:p-6 space-y-3">
          <h2 className="text-h2 font-semibold">Vælg numre (1-16)</h2>
          <p className="text-sm text-base-content/70">
            Vælg mellem 5 og 8 numre. Du kan vælge automatisk gentag for næste spil.
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => {
              const isSelected = selectedNumbers.includes(num);
              const isDisabled = !isSelected && selectedNumbers.length >= 8;
              return (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  disabled={isDisabled}
                  className={`
                    h-12 rounded-lg font-semibold text-base
                    transition-all duration-200 ease-out
                    ${
                      isSelected
                        ? "bg-primary text-primary-content shadow-lg scale-100"
                        : "bg-base-200 text-base-content hover:bg-base-300 scale-95 hover:scale-100"
                    }
                    ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    active:scale-90
                  `}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Auto-repeat Option */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Gentag automatisk næste uge</span>
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={isRepeating}
            onChange={(e) => setIsRepeating(e.target.checked)}
          />
        </label>
      </div>

      {/* MobilePay ID */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">MobilePay transaktions-ID</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          placeholder="F.eks. MP-123456789"
          value={mobilePayId}
          onChange={(e) => setMobilePayId(e.target.value)}
          required
          maxLength={50}
        />
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            Påkrævet for køb; findes i MobilePay app under betalingshistorik
          </span>
        </label>
      </div>

      {/* Purchase Summary */}
      <div className="card bg-base-100 shadow-md rounded-box">
        <div className="card-body">
          <h2 className="card-title">Samlet pris</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{price} kr</p>
              {balance < price && selectedNumbers.length >= 5 && (
                <p className="text-error text-sm">Utilstrækkelig saldo</p>
              )}
            </div>
            <button
              className="btn btn-primary btn-lg h-12 px-6 shadow-md"
              disabled={!canPurchase || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Køb plade"
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Back Link */}
      <button className="btn btn-ghost" onClick={() => navigate("/boards")}>
        Tilbage til plader
      </button>
    </div>
  );
}
