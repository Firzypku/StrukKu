/**
 * Header.jsx — Header Atas GREENWORTH Surabaya
 * Bersih, elegan, modern dengan palet Hijau + Putih + Emas.
 */

import { MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#065F46] to-[#047857] border border-emerald-600/30 flex items-center justify-center text-xl shadow-md shadow-emerald-900/10 text-white">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                GREENWORTH
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.2 rounded-md">
                Surabaya
              </span>
            </div>
            <p className="text-xs text-emerald-800 font-semibold leading-none mt-0.5">
              Turning Waste into Worth, Worth into Impact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1 text-xs text-emerald-800">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-bold text-xs">Jatim</span>
        </div>
      </div>
    </header>
  );
}
