import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";

type ErrorResponse = { message?: string };

export function AdminCreatePlayerPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Optional field
    const phoneRegex = /^[+]?[\d\s\-()]{7,}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    if (!token) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Navn og email er påkrævet.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Email-adressen er ugyldig.");
      return;
    }

    if (trimmedPhone && !validatePhone(trimmedPhone)) {
      setError("Telefonnummeret er ugyldigt.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const client = createApiClient(token);
      await client.playersPOST({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
      });
      navigate("/admin/players");
    } catch (err) {
      console.error("Create player error", err);
      const message =
        (err as ErrorResponse)?.message || "Kunne ikke oprette spiller. Prøv igen senere.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-base-content/70">
          <Link to="/admin" className="link link-hover">
            Admin
          </Link>{" "}
          /{" "}
          <Link to="/admin/players" className="link link-hover">
            Spillere
          </Link>{" "}
          / Ny spiller
        </p>
        <h1 className="text-h1 text-base-content">Opret ny spiller</h1>
        <p className="text-base text-base-content/70">
          Registrer en ny spiller i systemet. Alle felter er obligatoriske medmindre andet angives.
        </p>
      </div>

      <div className="card bg-base-100 rounded-box border border-base-300 shadow-md w-full max-w-2xl">
        <div className="card-body p-5 md:p-6 space-y-4">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Navn *</span>
              </label>
              <input
                type="text"
                className="input input-bordered h-11 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="F.eks. Lars Nielsen"
                disabled={isSubmitting}
                required
              />
              <label className="label">
                <span className="label-text-alt text-xs text-base-content/60">
                  Spillerens fulde navn
                </span>
              </label>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Email *</span>
              </label>
              <input
                type="email"
                className="input input-bordered h-11 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lars@jerneif.dk"
                disabled={isSubmitting}
                required
              />
              <label className="label">
                <span className="label-text-alt text-xs text-base-content/60">
                  Skal være unik og gyldig email
                </span>
              </label>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Telefon (valgfrit)</span>
              </label>
              <input
                type="tel"
                className="input input-bordered h-11 w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+45 12 34 56 78"
                disabled={isSubmitting}
              />
              <label className="label">
                <span className="label-text-alt text-xs text-base-content/60">
                  Dansk telefonnummer uden formatering eller med +45
                </span>
              </label>
            </div>
          </div>
          <div className="divider my-2"></div>
          <div className="flex justify-end gap-3">
            <button
              className="btn btn-ghost h-11 px-6"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Annuller
            </button>
            <button
              className="btn btn-primary h-11 px-6 shadow-md"
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim() || !email.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Opretter...
                </>
              ) : (
                "Opret spiller"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
