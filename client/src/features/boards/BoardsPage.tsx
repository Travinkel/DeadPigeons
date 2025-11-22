import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";
import { type BoardResponse } from "../../api/generated/api-client";

export function BoardsPage() {
  const { user, token } = useAuth();
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.playerId || !token) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = createApiClient(token);
        const boardsData = await client.player(user.playerId);
        setBoards(boardsData);
      } catch (err) {
        setError("Kunne ikke hente plader. Prov igen senere.");
        console.error("Boards fetch error:", err);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mine plader</h1>
        <Link to="/boards/purchase" className="btn btn-primary">
          Køb plade
        </Link>
      </div>

      {boards.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <p className="text-base-content/70">Du har ingen plader endnu.</p>
            <p className="text-sm text-base-content/50">
              Plader oprettes automatisk nar du deltager i et spil.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {boards.map((board) => (
            <div key={board.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title">Spil: {board.gameId?.slice(0, 8)}...</h2>
                    <p className="text-sm text-base-content/70">
                      Oprettet:{" "}
                      {board.createdAt
                        ? new Date(board.createdAt).toLocaleDateString("da-DK")
                        : "-"}
                    </p>
                  </div>
                  {board.isRepeating ? (
                    <span className="badge badge-success">Automatisk</span>
                  ) : (
                    <span className="badge badge-ghost">Enkelt</span>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Valgte numre:</p>
                  <div className="flex flex-wrap gap-2">
                    {board.numbers?.map((num) => (
                      <div
                        key={num}
                        className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold"
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
