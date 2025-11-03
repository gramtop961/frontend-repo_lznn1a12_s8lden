import { useCallback, useState } from "react";
import Header from "./components/Header";
import AnalyticsConsent from "./components/AnalyticsConsent";
import CameraScanner from "./components/CameraScanner";
import ExhibitDetails from "./components/ExhibitDetails";

function App() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => {
    const saved = localStorage.getItem("muse_analytics_optin");
    return saved ? JSON.parse(saved) : false;
  });
  const [exhibit, setExhibit] = useState(null);

  const handleRecognized = useCallback((match) => {
    setExhibit(match);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-neutral-900">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <section className="rounded-3xl border bg-white overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-10">
              <p className="inline-flex text-xs font-medium tracking-wide uppercase text-indigo-700 bg-indigo-50 rounded-full px-2 py-1">No login • On-device scan • Private by design</p>
              <h1 className="mt-4 text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
                Instantly unlock stories behind every artwork
              </h1>
              <p className="mt-3 text-neutral-700">
                Point your camera, get context. Rich text, audio, and related works — all in a lightweight web experience that respects privacy while offering meaningful insights to museums.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a href="#scan" className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800">Start scanning</a>
                <a href="#about" className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50">Learn more</a>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-neutral-50 to-white">
              <div className="absolute inset-0 pointer-events-none" style={{background: "radial-gradient(1200px 500px at 40% 0%, rgba(99,102,241,0.12), transparent)",}} />
              <div className="aspect-[4/3] md:aspect-auto md:h-full grid place-items-center p-8">
                <div className="w-full max-w-sm rounded-2xl border bg-white shadow-sm overflow-hidden">
                  <div className="h-48 bg-neutral-100 grid place-items-center text-neutral-500">Live camera feed</div>
                  <div className="p-4 text-sm text-neutral-600">Use the scanner below to try it out in real-time.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CameraScanner onRecognized={handleRecognized} analyticsEnabled={analyticsEnabled} />

        {exhibit && (
          <ExhibitDetails exhibit={exhibit} onClose={() => setExhibit(null)} analyticsEnabled={analyticsEnabled} />
        )}

        <section id="about" className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="text-lg font-semibold">Privacy-conscious insights</h3>
            <p className="mt-2 text-sm text-neutral-700">
              This demo logs simple, anonymous events in your browser console when you opt in: scans, audio plays, and dwell time. In production, these events can be sent to a backend using privacy-safe IDs and aggregated metrics, without any user accounts.
            </p>
          </div>
        </section>
      </main>

      <AnalyticsConsent onChange={setAnalyticsEnabled} />
    </div>
  );
}

export default App;
