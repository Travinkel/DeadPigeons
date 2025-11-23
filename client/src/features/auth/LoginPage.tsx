import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { createApiClient } from "../../api/apiClient";

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
    return null;
  }

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setIsLoading(true);

    try {
      const client = createApiClient();
      const response = await client.login({
        email: data.email,
        password: data.password,
      });

      if (response.token && response.playerId && response.email && response.role) {
        login(response.token, {
          playerId: response.playerId,
          email: response.email,
          role: response.role as "Admin" | "Player",
        });

        const from = (location.state as { from?: Location })?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setError("Ugyldig svar fra server");
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
          setError("Forkert email eller adgangskode");
        } else {
          setError("Der opstod en fejl. Prøv igen senere.");
        }
      } else {
        setError("Der opstod en fejl. Prøv igen senere.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Jerne IF" className="h-16 w-16" />
          </div>
          <p className="text-sm text-center text-neutral/70 mb-2">Dead Pigeons</p>
          <h1 className="text-[28px] font-bold text-center mb-1">Log ind</h1>
          <p className="text-sm text-center text-neutral/70 mb-6">Log ind for at fortsætte</p>

          {error && (
            <div className="alert alert-error mb-4">
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="din@email.dk"
                className={`input input-bordered w-full h-12 ${errors.email ? "input-error" : ""}`}
                {...register("email", {
                  required: "Email er påkrævet",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Ugyldig email adresse",
                  },
                })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Adgangskode</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full h-12 ${errors.password ? "input-error" : ""}`}
                {...register("password", {
                  required: "Adgangskode er påkrævet",
                  minLength: {
                    value: 6,
                    message: "Adgangskode skal være mindst 6 tegn",
                  },
                })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full h-10" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Log ind"}
            </button>
          </form>

          <div className="divider">eller</div>

          <p className="text-center">
            Har du ikke en konto?{" "}
            <Link to="/register" className="link link-primary">
              Opret konto
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
