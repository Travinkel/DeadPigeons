import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import {
  type GameResponse,
  type GameResultResponse,
  type BoardResponse,
} from "../../api/generated/api-client";

export function CompleteGamePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const [game, setGame] = useState<GameResponse | null>(null);
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [previewResult, setPreviewResult] = useState<GameResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Admin check
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    if (!token || !gameId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = createApiClient(token);
        const [gameData, boardsData] = await Promise.all([
          client.gamesGET(gameId),
          client.game(gameId),
        ]);
        setGame(gameData);
        setBoards(boardsData);
      } catch (err) {
        setError("Kunne ikke hente spildata.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, gameId]);

  const toggleWinningNumber = (num: number) => {
    if (winningNumbers.includes(num)) {
      setWinningNumbers(winningNumbers.filter((n) => n !== num));
      setPreviewResult(null);
    } else if (winningNumbers.length < 3) {
      const newNumbers = [...winningNumbers, num].sort((a, b) => a - b);
      setWinningNumbers(newNumbers);
      setPreviewResult(null);
    }
  };

  const calculatePreview = () => {
    if (winningNumbers.length !== 3) return;

    // Find winning boards (boards that contain all 3 winning numbers)
    const winners = boards.filter((board) => {
      if (!board.numbers) return false;
      return winningNumbers.every((num) => board.numbers!.includes(num));
    });

    setPreviewResult({
      gameId,
      winningNumbers,
      totalBoards: boards.length,
      winningBoards: winners.length,
      winners: winners.map((b) => ({
        id: b.id,
        playerId: b.playerId,
        gameId: b.gameId,
        numbers: b.numbers,
        isRepeating: b.isRepeating,
        createdAt: b.createdAt,
      })),
    });
  };

  const handleComplete = async () => {
    if (!token || !gameId || winningNumbers.length !== 3) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const client = createApiClient(token);
      const result = await client.complete(gameId, {
        winningNumbers,
      });

      setSuccess(
        `Spil afsluttet! ${result.winningBoards} vindende plader ud af ${result.totalBoards} i alt.`
      );

      // Navigate to games after delay
      setTimeout(() => {
        navigate("/games");
      }, 3000);
    } catch (err) {
      setError("Kunne ikke afslutte spillet. Prov igen senere.");
      console.error("Complete game error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
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
        <span>Du har ikke adgang til denne side.</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="alert alert-error">
        <span>Spil ikke fundet.</span>
      </div>
    );
  }

  if (game.status !== "Active") {
    return (
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
        <span>Dette spil er allerede afsluttet.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Afslut spil</h1>

      {/* Game Info */}
      <div className="card bg-primary text-primary-content">
        <div className="card-body">
          <h2 className="card-title">
            Uge {game.weekNumber}, {game.year}
          </h2>
          <p>Antal plader: {boards.length}</p>
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

      {/* Winning Numbers Selection */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Vaelg 3 vindende numre</h2>
          <p className="text-base-content/70">Valgt: {winningNumbers.length}/3</p>

          {winningNumbers.length > 0 && (
            <div className="flex gap-2 my-2">
              {winningNumbers.map((num) => (
                <div
                  key={num}
                  className="w-12 h-12 rounded-full bg-success text-success-content flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-success-focus"
                  onClick={() => toggleWinningNumber(num)}
                >
                  {num}
                </div>
              ))}
            </div>
          )}

          {/* Number Grid */}
          <div className="grid grid-cols-9 sm:grid-cols-10 gap-2 mt-4">
            {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => {
              const isSelected = winningNumbers.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => toggleWinningNumber(num)}
                  disabled={!isSelected && winningNumbers.length >= 3}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm font-semibold
                    transition-colors duration-150
                    ${
                      isSelected
                        ? "bg-success text-success-content"
                        : "bg-base-200 hover:bg-base-300"
                    }
                    ${!isSelected && winningNumbers.length >= 3 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Preview Button */}
          <button
            className="btn btn-secondary mt-4"
            disabled={winningNumbers.length !== 3}
            onClick={calculatePreview}
          >
            Vis forhåndsvisning
          </button>
        </div>
      </div>

      {/* Preview Results */}
      {previewResult && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Forhåndsvisning af resultat</h2>

            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Plader i alt</div>
                <div className="stat-value">{previewResult.totalBoards}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Vindere</div>
                <div className="stat-value text-success">{previewResult.winningBoards}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Praemiepulje (70%)</div>
                <div className="stat-value text-primary">
                  {(
                    boards.reduce((sum, board) => {
                      const count = board.numbers?.length || 0;
                      let price = 0;
                      if (count === 5) price = 20;
                      else if (count === 6) price = 40;
                      else if (count === 7) price = 80;
                      else if (count >= 8) price = 160;
                      return sum + price;
                    }, 0) * 0.7
                  ).toFixed(0)}{" "}
                  kr
                </div>
              </div>
            </div>

            {previewResult.winners && previewResult.winners.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Vindende plader:</h3>
                <div className="space-y-2">
                  {previewResult.winners.map((winner) => (
                    <div
                      key={winner.id}
                      className="flex items-center gap-2 p-2 bg-success/10 rounded"
                    >
                      <span className="text-sm font-mono">{winner.id?.slice(0, 8)}...</span>
                      <span className="text-sm">Spiller: {winner.playerId?.slice(0, 8)}...</span>
                      <div className="flex gap-1 ml-auto">
                        {winner.numbers?.map((num) => (
                          <span
                            key={num}
                            className={`badge badge-sm ${
                              winningNumbers.includes(num) ? "badge-success" : "badge-ghost"
                            }`}
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewResult.winningBoards === 0 && (
              <div className="alert alert-info mt-4">
                <span>Ingen vindere med disse numre.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Complete Button */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Bekraeft afslutning</h2>
          <p className="text-base-content/70">
            Denne handling kan ikke fortrydes. Sørg for at de vindende numre er korrekte.
          </p>
          <button
            className="btn btn-primary btn-lg"
            disabled={winningNumbers.length !== 3 || isSubmitting}
            onClick={handleComplete}
          >
            {isSubmitting ? <span className="loading loading-spinner"></span> : "Afslut spil"}
          </button>
        </div>
      </div>

      {/* Back Button */}
      <button className="btn btn-ghost" onClick={() => navigate("/admin")}>
        Tilbage til admin
      </button>
    </div>
  );
}
