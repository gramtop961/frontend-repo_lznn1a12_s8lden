import { Camera, Map, Info } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-white shadow-sm">
            <Camera size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none tracking-tight">MuseScan</p>
            <p className="text-xs text-neutral-500">Point. Learn. Wander.</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-600">
          <a href="#scan" className="hover:text-neutral-900 transition-colors inline-flex items-center gap-1"><Camera size={16}/> Scan</a>
          <a href="#guide" className="hover:text-neutral-900 transition-colors inline-flex items-center gap-1"><Map size={16}/> Guide</a>
          <a href="#about" className="hover:text-neutral-900 transition-colors inline-flex items-center gap-1"><Info size={16}/> About</a>
        </nav>
      </div>
    </header>
  );
}
