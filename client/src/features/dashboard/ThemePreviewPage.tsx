import { useEffect, useState } from "react";

type Health = "healthy" | "unavailable" | "checking" | string;

const StatusAlert = ({ health, onRetry }: { health: Health; onRetry: () => void }) => {
  if (health === "healthy") {
    return (
      <div className="alert alert-success mb-6">
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
        <span>Systemet kører normalt</span>
      </div>
    );
  }

  if (health === "checking") {
    return (
      <div className="alert mb-6">
        <span>Tjekker API...</span>
      </div>
    );
  }

  return (
    <div className="alert alert-error mb-6">
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
      <div>
        <h3 className="font-bold">API offline</h3>
        <p className="text-sm">Der kan ikke oprettes lodtrækninger lige nu.</p>
      </div>
      <button className="btn btn-sm" onClick={onRetry}>
        Prøv igen
      </button>
    </div>
  );
};

const colours = [
  { label: "Primær (rød)", className: "bg-primary" },
  { label: "Sekundær (hvid)", className: "bg-base-100 border-2 border-neutral" },
  { label: "Accent (sort)", className: "bg-accent" },
];

const statusLabels = [
  { label: "Vundet", badge: "badge-success", icon: "✓" },
  { label: "Afventer", badge: "badge-warning", icon: "⏳" },
  { label: "Afvist", badge: "badge-error", icon: "✗" },
  { label: "Aktiv", badge: "badge-info", icon: "ℹ" },
];

function ThemePreviewPage() {
  const [health, setHealth] = useState<Health>("checking");

  const fetchHealth = () => {
    setHealth("checking");
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setHealth(d.status))
      .catch(() => setHealth("unavailable"));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="app-shell min-h-screen bg-base-200">
      <header className="bg-primary text-primary-content py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h1 className="text-xl font-bold">Dead Pigeons</h1>
              <p className="text-sm opacity-80">Jerne IF - Ugentlig brætlodtrækning</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm text-primary-content">Log ind</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <StatusAlert health={health} onRetry={fetchHealth} />

        <div className="card bg-base-100 shadow-xl border-t-4 border-primary">
          <div className="card-body">
            <h2 className="card-title text-base-content">Jerne IF temaoversigt</h2>
            <p className="text-base-content/60 text-sm">
              Klubfarver og statusindikatorer for Dead Pigeons
            </p>

            <div className="mt-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-2">
                Klubfarver
              </h3>
              <div className="flex flex-wrap gap-3">
                {colours.map((colour) => (
                  <div key={colour.label} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded ${colour.className}`}></div>
                    <span className="text-sm">{colour.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-base-content/50 mb-2">
                Statusmærker for bræt
              </h3>
              <div className="flex flex-wrap gap-2">
                {statusLabels.map((status) => (
                  <span key={status.label} className={`badge ${status.badge} gap-1`}>
                    <span>{status.icon}</span> {status.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-actions justify-end mt-6">
              <button className="btn btn-ghost">Tilbage til dashboard</button>
              <button className="btn btn-primary">Fortsæt opsætning</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ThemePreviewPage;
