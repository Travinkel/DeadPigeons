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

        const target =
          (location.state as { from?: Location })?.from?.pathname ||
          (response.role === "Admin" ? "/admin" : "/dashboard");
        navigate(target, { replace: true });
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
      <div className="card w-full max-w-sm bg-base-100 shadow-xl rounded-xl">
        <div className="card-body p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 rounded-full p-3">
              <img src="/logo.png" alt="Jerne IF" className="w-16 h-16" />
            </div>
          </div>
          <h1
            className="text-center text-[28px] font-bold text-gray-900 tracking-tight mt-1"
            aria-label="Dead Pigeons"
          >
            Dead Pigeons
          </h1>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-1">Log ind</h2>
          <p className="text-center text-gray-500 text-sm mt-1 mb-6">Log ind for at fortsætte</p>

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
              <label className="label mb-1">
                <span className="label-text text-sm text-gray-600 font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="din@email.dk"
                className={`w-full px-3 py-2 rounded-md border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } bg-gray-50 focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-200 transition-all duration-150 ${
                  errors.email ? "input-error" : ""
                }`}
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
              <label className="label mb-1">
                <span className="label-text text-sm text-gray-600 font-medium">Adgangskode</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-3 py-2 rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } bg-gray-50 focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-200 transition-all duration-150 ${
                  errors.password ? "input-error" : ""
                }`}
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

            <button
              type="submit"
              className="w-full py-2 mt-4 rounded-md text-white font-semibold bg-gradient-to-b from-red-600 to-red-700 shadow-sm hover:shadow-md transition-all duration-150"
              disabled={isLoading}
            >
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
