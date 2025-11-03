import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Map, Clock, X } from "lucide-react";

export default function ExhibitDetails({ exhibit, onClose, analyticsEnabled }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!exhibit) return;
    setStartTime(Date.now());
    return () => {
      if (startTime && analyticsEnabled) {
        const dwell = Math.round((Date.now() - startTime) / 1000);
        console.log("analytics:event", { type: "dwell", ts: Date.now(), exhibitId: exhibit.id, seconds: dwell });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exhibit?.id]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const related = useMemo(() => {
    if (!exhibit) return [];
    const tags = ["Post-Impressionism", "Renaissance", "Dutch Golden Age", "Brushwork", "Portraiture", "Color Theory"];
    return tags.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [exhibit]);

  if (!exhibit) return null;

  return (
    <section className="mx-auto max-w-6xl px-4" aria-live="polite">
      <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
        <button aria-label="Close" onClick={onClose} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 border hover:bg-white">
          <X size={16} />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative h-72 md:h-full">
            <img src={exhibit.media} alt={exhibit.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold tracking-tight">{exhibit.title}</h2>
            <p className="text-neutral-600 mt-1">{exhibit.artist} • {exhibit.year}</p>
            <p className="mt-4 text-neutral-800 leading-relaxed">{exhibit.description}</p>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => {
                  if (!audioRef.current) return;
                  if (playing) {
                    audioRef.current.pause();
                    setPlaying(false);
                  } else {
                    audioRef.current.play();
                    setPlaying(true);
                    if (analyticsEnabled) {
                      console.log("analytics:event", { type: "audio_play", ts: Date.now(), exhibitId: exhibit.id });
                    }
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-3 py-2 text-sm hover:bg-neutral-800"
              >
                {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? "Pause audio" : "Play audio guide"}
              </button>
              <audio ref={audioRef} src={exhibit.audio} onEnded={() => setPlaying(false)} />
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border p-3">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Location</div>
                <div className="mt-1 inline-flex items-center gap-2 text-sm text-neutral-800"><Map size={16} /> {exhibit.location}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs uppercase tracking-wide text-neutral-500">Avg. dwell time</div>
                <div className="mt-1 inline-flex items-center gap-2 text-sm text-neutral-800"><Clock size={16} /> ~3–5 min</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-neutral-500">Related topics</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {related.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-lg border bg-neutral-50">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
