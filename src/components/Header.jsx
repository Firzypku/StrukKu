/**
 * Header.jsx — App Bar GREENWORTH Surabaya
 * Bersih, Segar, Hijau-Putih (Non-Gelap, Rapi & Elegan).
 */

import { MapPin, Recycle, QrCode } from 'lucide-react';

export default function Header({ onOpenQr }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand & Logo Hijau Segar */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Recycle className="w-5 h-5 text-white stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900">
                GREENWORTH
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                Surabaya
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Turning Waste into Worth
            </p>
          </div>
        </div>

        {/* Tombol Aksi Kanan */}
        <div className="flex items-center gap-1.5">
          {onOpenQr && (
            <button
              type="button"
              onClick={onOpenQr}
              className="px-2 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-all active:scale-95 flex items-center gap-1 text-xs"
              aria-label="Buka QR Paspor"
              title="Paspor QR Publik"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>QR Paspor</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 text-xs text-slate-700 font-semibold">
            <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span>Surabaya</span>
          </div>
        </div>
      </div>
    </header>
  );
}
