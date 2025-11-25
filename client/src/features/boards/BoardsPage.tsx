import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { type PlayerResponse } from "../../api/generated/api-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type PlayerBoard = {
  id?: string;
  playerId?: string;
  gameId?: string;
  numbers?: number[];
  isRepeating?: boolean;
  createdAt?: string;
  friendlyTitle?: string;
  weekNumber?: number;
  year?: number;
};

type ErrorResponse = {
  message?: string;
};

export function BoardsPage() {
  const { user, token } = useAuth();
  const [player, setPlayer] = useState<PlayerResponse | null>(null);
  const [boards, setBoards] = useState<PlayerBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInactivePlayer = player && player.isActive === false;

  useEffect(() => {
    if (!user?.playerId || !token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [playerData, boardsResp] = await Promise.all([
          fetch(`${API_URL}/api/Players/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch player");
            return res.json() as Promise<PlayerResponse>;
          }),
          fetch(`${API_URL}/api/Boards/player/${user.playerId}`, {
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

        setPlayer(playerData);
        const boardsData: PlayerBoard[] = await boardsResp.json();
        boardsData.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });
        setBoards(boardsData);
      } catch (err) {
        setError("Kunne ikke hente plader. Prøv igen senere.");
        console.error("Boards fetch error:", err);
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
      <div className="flex justify-between items-center">
        <h1 className="text-h1 text-base-content mb-6">Mine plader</h1>
        {!isInactivePlayer && (
          <Link
            to="/boards/purchase"
            className="btn btn-primary h-11 px-6 text-base font-semibold shadow-md"
          >
            Køb plade
          </Link>
        )}
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
            Din konto er inaktiv. Aktiver spilleren hos en administrator for at købe plader.
          </span>
        </div>
      )}

      {boards.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <p className="text-[17px] font-medium text-neutral">Du har ingen plader endnu.</p>
          <p className="text-[15px] text-neutral/70 mt-1">
            Plader oprettes automatisk, når du deltager i et spil.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {boards.map((board, index) => (
            <div
              key={board.id ?? `${board.gameId ?? "board"}-${index}`}
              className="card bg-base-100 shadow-md rounded-2xl"
            >
              <div className="card-body">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="card-title">
                        {board.friendlyTitle
                          ? board.friendlyTitle
                          : board.weekNumber && board.year
                            ? `Uge ${board.weekNumber}, ${board.year}`
                            : board.gameId
                              ? `Spil: ${board.gameId.slice(0, 8)}…`
                              : "Spil"}
                      </h2>
                      {board.isRepeating ? (
                        <span className="badge badge-success badge-sm px-2 py-1">Automatisk</span>
                      ) : (
                        <span className="badge badge-neutral badge-outline badge-sm px-2 py-1">
                          Enkelt
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-base-content/70">
                      Oprettet:{" "}
                      {board.createdAt
                        ? new Date(board.createdAt).toLocaleDateString("da-DK")
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Valgte numre:</p>
                  <div className="flex flex-wrap gap-2">
                    {board.numbers?.map((num) => (
                      <div
                        key={num}
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary text-primary-content"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
