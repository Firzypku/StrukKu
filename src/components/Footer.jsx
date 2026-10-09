/**
 * Footer.jsx — Footer Resmi Prototipe
 * Wajib menampilkan label "Prototipe: data simulasi" untuk Syariah Business Plan Competition.
 * Bersih, modern, dan rapi.
 */

import { Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 pt-4 pb-6 border-t border-slate-200/80 text-center text-slate-500">
      <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300/80 px-3 py-1.5 rounded-full text-xs font-bold text-amber-900 mb-2 shadow-xs">
        <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span>Prototipe: data simulasi</span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
        Lampiran proposal <strong>Syariah Business Plan Competition</strong>. Semua data akun, kedai kopi, dan lembaga adalah fiktif untuk tujuan peragaan sistem.
      </p>

      <p className="text-[11px] text-slate-400 mt-2 font-medium">
        © 2026 GREENWORTH Surabaya · Ekonomi Sirkular Berbasis Syariah
      </p>
    </footer>
  );
}
