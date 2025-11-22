import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { createApiClient } from "../../api/apiClient";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const client = createApiClient();
      const response = await client.register({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
      });

      if (response.message) {
        setSuccess(response.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("409") || err.message.includes("Conflict")) {
          setError("Email er allerede registreret");
        } else if (err.message.includes("400")) {
          setError("Ugyldige oplysninger. Tjek alle felter.");
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
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Jerne IF" className="h-16 w-16" />
          </div>
          <h2 className="card-title text-2xl font-bold text-center justify-center mb-4">
            Opret konto
          </h2>
          <p className="text-center text-base-content/70 mb-6">
            Registrer dig for at deltage i spillet
          </p>

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

          {success && (
            <div className="alert alert-success mb-4">
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Navn</span>
              </label>
              <input
                type="text"
                placeholder="Dit fulde navn"
                className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                {...register("name", {
                  required: "Navn er påkrævet",
                  minLength: {
                    value: 2,
                    message: "Navn skal være mindst 2 tegn",
                  },
                })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name.message}</span>
                </label>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="din@email.dk"
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
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

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Telefon (valgfrit)</span>
              </label>
              <input
                type="tel"
                placeholder="+45 12 34 56 78"
                className={`input input-bordered w-full ${errors.phone ? "input-error" : ""}`}
                {...register("phone", {
                  pattern: {
                    value: /^[+]?[\d\s-]{8,}$/,
                    message: "Ugyldigt telefonnummer",
                  },
                })}
              />
              {errors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.phone.message}</span>
                </label>
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Adgangskode</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
                {...register("password", {
                  required: "Adgangskode er påkrævet",
                  minLength: {
                    value: 8,
                    message: "Adgangskode skal være mindst 8 tegn",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message: "Skal indeholde stort, lille bogstav, tal og specialtegn",
                  },
                })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Bekræft adgangskode</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.confirmPassword ? "input-error" : ""}`}
                {...register("confirmPassword", {
                  required: "Bekræft adgangskode",
                  validate: (value) => value === password || "Adgangskoderne matcher ikke",
                })}
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.confirmPassword.message}
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
              disabled={isLoading || !!success}
            >
              {isLoading ? "Opretter konto..." : "Opret konto"}
            </button>
          </form>

          <div className="divider">eller</div>

          <p className="text-center">
            Har du allerede en konto?{" "}
            <Link to="/login" className="link link-primary">
              Log ind
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
