/**
 * Header.jsx — App Bar GREENWORTH Surabaya
 * Konsep: Bersih, Simetris, Modern, Bebas Redundansi.
 * - Menghilangkan duplikasi teks "Surabaya"
 * - Tombol "QR Paspor" dan chip "Surabaya" dibuat satu baris rapi (h-9 simetris dengan logo 36px)
 * - Teks tidak terlipat/wrap canggung
 */

import { MapPin, Recycle, QrCode } from 'lucide-react';

export default function Header({ onOpenQr }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs px-4 py-2.5 pt-[max(env(safe-area-inset-top),10px)]">
      <div className="flex items-center justify-between gap-3">
        {/* Brand & Logo Hijau Segar */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <Recycle className="w-5 h-5 text-white stroke-[2.3]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-black tracking-tight text-slate-900 leading-tight">
              GREENWORTH
            </h1>
            <p className="text-[11px] text-slate-500 font-medium leading-tight truncate">
              Turning Waste into Worth
            </p>
          </div>
        </div>

        {/* Tombol Aksi Kanan (Tinggi Simetris 36px / h-9, Rapi & Sejajar) */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onOpenQr && (
            <button
              type="button"
              onClick={onOpenQr}
              className="h-9 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/90 transition-all active:scale-95 flex items-center gap-1.5 text-xs shadow-2xs whitespace-nowrap"
              aria-label="Buka QR Paspor"
              title="Paspor QR Digital"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span>QR Paspor</span>
            </button>
          )}

          <div className="h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-1 text-xs text-slate-700 font-semibold shadow-2xs whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Surabaya</span>
          </div>
        </div>
      </div>
    </header>
  );
}
