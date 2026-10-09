/**
 * Header.jsx — App Bar GREENWORTH Surabaya
 * Minimalis, profesional, dan elegan (Vibe Design Standard).
 */

import { MapPin, Recycle, QrCode } from 'lucide-react';

export default function Header({ onOpenQr }) {
  return (
    <header className="sticky top-0 z-40 bg-[#031d10]/95 backdrop-blur-md border-b border-emerald-500/20 shadow-md">
      {/* ── TICKER ATAS: LEDGER REAL-TIME SURABAYA (PERSIS SEPERTI DESKTOP WEB) ── */}
      <div className="bg-[#02140b] border-b border-emerald-500/15 px-3 py-1 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold tracking-wider text-emerald-400 text-[10px] uppercase">
            Ledger Real-Time
          </span>
        </div>
        <div className="text-[10px] text-emerald-200/90 font-medium truncate flex items-center gap-2">
          <span>Sampah: <strong className="text-white">501,5 kg</strong></span>
          <span className="text-emerald-700">•</span>
          <span>Wakaf: <strong className="text-amber-300">Rp 426.047</strong></span>
        </div>
      </div>

      {/* ── APP BAR UTAMA ────────────────────────────────────────────────────── */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-950/60 ring-1 ring-emerald-300/30">
            <Recycle className="w-4.5 h-4.5 text-white stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white">
                GREENWORTH
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded-md">
                Surabaya
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/70 font-medium leading-tight">
              Turning Waste into Worth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenQr && (
            <button
              type="button"
              onClick={onOpenQr}
              className="p-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-xs transition-all active:scale-95 flex items-center gap-1 text-[11px]"
              aria-label="Buka QR Paspor"
              title="Paspor QR Publik"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="text-[10px] font-extrabold pr-0.5">QR</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/30 rounded-full px-2.5 py-1 text-[11px] text-emerald-200 font-semibold shadow-xs">
            <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>Surabaya</span>
          </div>
        </div>
      </div>
    </header>
  );
}
