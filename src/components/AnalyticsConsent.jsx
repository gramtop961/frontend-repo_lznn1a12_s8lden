import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalyticsConsent({ onChange }) {
  const [consented, setConsented] = useState(() => {
    const saved = localStorage.getItem("muse_analytics_optin");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (consented !== null) {
      localStorage.setItem("muse_analytics_optin", JSON.stringify(consented));
      onChange?.(consented);
    }
  }, [consented, onChange]);

  if (consented !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-3xl m-4 rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center">
            <Shield size={18} />
          </div>
          <div className="text-sm text-neutral-700">
            <p className="font-medium text-neutral-900">Anonymous analytics</p>
            <p className="mt-1">We use privacy-friendly metrics to understand which artworks are viewed and what content helps visitors most. No login, no personal data. You can opt out anytime.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setConsented(true)} className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-3 py-2 text-sm hover:bg-neutral-800">
                Allow
              </button>
              <button onClick={() => setConsented(false)} className="inline-flex items-center gap-2 rounded-lg bg-white text-neutral-700 border px-3 py-2 text-sm hover:bg-neutral-50">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
