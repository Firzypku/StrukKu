/**
 * Header.jsx — App Bar GREENWORTH Surabaya
 * Minimalis, profesional, dan elegan (Vibe Design Standard).
 */

import { MapPin, Recycle } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0B3B24] text-white flex items-center justify-center shadow-xs">
            <Recycle className="w-5 h-5 text-emerald-300 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-slate-900">
                GREENWORTH
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-md">
                Surabaya
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Turning Waste into Worth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-full px-2.5 py-1 text-xs text-slate-700 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
          <span>Surabaya</span>
        </div>
      </div>
    </header>
  );
}
