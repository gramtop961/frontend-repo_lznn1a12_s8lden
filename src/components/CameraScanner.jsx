import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, Sparkles } from "lucide-react";

const samples = [
  {
    id: "starry-night",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    description:
      "A swirling night sky over Saint-Rémy, exploring turbulence and emotion through bold, rhythmic brushstrokes.",
    audio:
      "https://cdn.pixabay.com/download/audio/2024/01/04/audio_7b6b6d5d1f.mp3?filename=soft-ambient-169880.mp3",
    media: "https://images.unsplash.com/photo-1520697222868-7cbb3b344b00?q=80&w=1200&auto=format&fit=crop",
    location: "East Wing, Room 12",
  },
  {
    id: "mona-lisa",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    year: "c. 1503–1506",
    description:
      "Renaissance portrait famed for its enigmatic smile and sfumato technique blending light and shadow.",
    audio:
      "https://cdn.pixabay.com/download/audio/2023/06/06/audio_3a9c60a88b.mp3?filename=ambient-piano-14631.mp3",
    media: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop",
    location: "Grand Gallery, 2F",
  },
  {
    id: "girl-with-pearl",
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    year: "c. 1665",
    description:
      "Tronie capturing a fleeting glance, luminous skin, and a pearl rendered with minimal, masterful strokes.",
    audio:
      "https://cdn.pixabay.com/download/audio/2022/03/10/audio_1c20b7fba5.mp3?filename=gentle-piano-ambient-1106.mp3",
    media: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop",
    location: "North Gallery, Room 5",
  },
];

export default function CameraScanner({ onRecognized, analyticsEnabled }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      // Stop streams on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []);

  async function startCamera() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (e) {
      setError("Unable to access camera. You can upload or use samples.");
    }
  }

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
    }
    setStreaming(false);
  }

  function avgBrightness(imageData) {
    const data = imageData.data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      sum += (r + g + b) / 3;
    }
    return sum / (data.length / 4);
  }

  async function captureAndIdentify() {
    if (!videoRef.current) return;
    setBusy(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const brightness = avgBrightness(imageData);

    // Lightweight heuristic to map to sample items (demo only)
    let match;
    if (brightness < 80) match = samples[0];
    else if (brightness < 140) match = samples[1];
    else match = samples[2];

    if (analyticsEnabled) {
      console.log("analytics:event", {
        type: "scan",
        ts: Date.now(),
        matchId: match.id,
        heuristic: "avg_brightness",
      });
    }

    onRecognized?.(match);
    setBusy(false);
  }

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Fake a quick identification flow off an upload
      const match = samples[Math.floor(Math.random() * samples.length)];
      if (analyticsEnabled) {
        console.log("analytics:event", { type: "upload_scan", ts: Date.now(), matchId: match.id });
      }
      onRecognized?.(match);
    };
    reader.readAsDataURL(file);
  }

  return (
    <section id="scan" className="mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="relative rounded-2xl border bg-white overflow-hidden shadow-sm">
          <div className="p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-2 text-neutral-700">
              <Camera size={18} />
              <span className="font-medium">Scan an artwork</span>
            </div>
            {streaming ? (
              <button onClick={stopCamera} className="text-sm px-3 py-1.5 rounded-lg border hover:bg-neutral-50">Stop</button>
            ) : (
              <button onClick={startCamera} className="text-sm px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800">Start camera</button>
            )}
          </div>

          <div className="relative">
            <video ref={videoRef} playsInline className="w-full h-[320px] object-cover bg-neutral-100" />
            {!streaming && (
              <div className="absolute inset-0 grid place-items-center text-neutral-500">
                <div className="text-center px-6">
                  <p className="font-medium">Camera inactive</p>
                  <p className="text-sm">Grant permissions to scan, or upload a photo.</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex items-center gap-3">
            <button onClick={captureAndIdentify} disabled={!streaming || busy} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-500 disabled:opacity-50">
              <Sparkles size={16} /> Identify
            </button>
            <label className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50 cursor-pointer">
              <ImageIcon size={16} /> Upload image
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            <button onClick={() => onRecognized?.(samples[0])} className="ml-auto text-xs text-neutral-500 hover:text-neutral-700">Use sample →</button>
          </div>
          <canvas ref={canvasRef} className="hidden" />

          {error && (
            <div className="px-4 pb-4">
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">{error}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-neutral-50 to-white p-6">
          <h3 className="text-lg font-semibold">How it works</h3>
          <ol className="mt-3 space-y-3 text-sm text-neutral-700 list-decimal list-inside">
            <li>Point your camera at a painting or upload a photo.</li>
            <li>We match what we see to an artwork using visual cues.</li>
            <li>Explore stories, audio, and related works — no login required.</li>
            <li>Anonymous analytics help museums improve the experience.</li>
          </ol>
          <div className="mt-4 text-xs text-neutral-500">
            This demo uses a simple heuristic to showcase the flow. Production setups would use robust on-device or server-side vision models.
          </div>
        </div>
      </div>
    </section>
  );
}
