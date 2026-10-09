/**
 * Header.jsx — App Bar GREENWORTH Surabaya
 * Minimalis, profesional, dan elegan (Vibe Design Standard).
 */

import { MapPin, Recycle, QrCode } from 'lucide-react';

export default function Header({ onOpenQr }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* ── TICKER ATAS: LEDGER REAL-TIME SURABAYA (HIJAU EMERALD SEIMBANG) ── */}
      <div className="bg-[#064E3B] px-3.5 py-1 flex items-center justify-between text-[11px] font-mono text-emerald-100">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          <span className="font-extrabold tracking-wider text-emerald-200 text-[10px] uppercase">
            Ledger Real-Time
          </span>
        </div>
        <div className="text-[10px] text-emerald-100/90 font-medium truncate flex items-center gap-2">
          <span>Sampah: <strong className="text-white">501,5 kg</strong></span>
          <span className="text-emerald-400/60">•</span>
          <span>Wakaf: <strong className="text-amber-300">Rp 426.047</strong></span>
        </div>
      </div>

      {/* ── APP BAR UTAMA: PUTIH BERSIH DENGAN AKSEN HIJAU EMERALD ─────────── */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
            <Recycle className="w-4.5 h-4.5 text-white stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-slate-900">
                GREENWORTH
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-300/80 px-1.5 py-0.5 rounded-md">
                Surabaya
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
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
              <span className="text-[10px] font-black pr-0.5">QR</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-full px-2.5 py-1 text-[11px] text-slate-700 font-semibold shadow-2xs">
            <MapPin className="w-3 h-3 text-[#064E3B] flex-shrink-0" />
            <span>Surabaya</span>
          </div>
        </div>
      </div>
    </header>
  );
}
