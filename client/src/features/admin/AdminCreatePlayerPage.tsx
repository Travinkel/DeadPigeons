import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { createApiClient } from "../../api/apiClient";

type ErrorResponse = { message?: string };

export function AdminCreatePlayerPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!token) return;
    if (!name.trim() || !email.trim()) {
      setError("Navn og email er påkrævet.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const client = createApiClient(token);
      await client.playersPOST({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        isActive,
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
        <h1 className="text-h1 text-secondary">Opret spiller</h1>
        <p className="text-base text-base-content/70">Registrer en ny spiller i systemet.</p>
      </div>

      <div className="card bg-base-100 rounded-box border border-base-300 shadow-md">
        <div className="card-body p-5 md:p-6 space-y-4">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Navn</span>
              </label>
              <input
                className="input input-bordered h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Telefon</span>
              </label>
              <input
                type="tel"
                className="input input-bordered h-11"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-control flex-row items-center gap-3">
              <label className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span className="label-text">Opret som aktiv</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn btn-ghost h-11 px-5" onClick={() => navigate(-1)}>
              Annuller
            </button>
            <button
              className="btn btn-primary h-11 px-5 shadow-md"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
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
