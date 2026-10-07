/**
 * Header.jsx — Header Atas GREENWORTH Surabaya
 * Menampilkan logo, nama kota, dan tagline resmi.
 */

import { Sparkles, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#052E16]/95 backdrop-blur-md border-b border-emerald-900/60 px-4 py-3 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400 flex items-center justify-center text-xl shadow-md shadow-emerald-950/40">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">
                GREENWORTH
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-600/40 px-1.5 py-0.2 rounded">
                Surabaya
              </span>
            </div>
            <p className="text-xs text-emerald-300 font-medium leading-none mt-0.5">
              Turning Waste into Worth, Worth into Impact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-emerald-900/70 border border-emerald-700/50 rounded-xl px-2 py-1 text-xs text-emerald-200">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-semibold text-xs">Jatim</span>
        </div>
      </div>
    </header>
  );
}
