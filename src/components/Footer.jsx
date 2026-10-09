/**
 * Footer.jsx — Footer Resmi Prototipe
 * Wajib menampilkan label "Prototipe: data simulasi" untuk Syariah Business Plan Competition.
 * Bersih, modern, dan rapi.
 */

import { Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 pt-4 pb-6 border-t border-emerald-800/40 text-center text-emerald-200/70">
      <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-full text-xs font-black text-amber-300 mb-2 shadow-xs">
        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>Prototipe: data simulasi</span>
      </div>

      <p className="text-xs text-emerald-100/70 leading-relaxed max-w-xs mx-auto">
        Lampiran proposal <strong className="text-white">Syariah Business Plan Competition</strong>. Semua data akun, kedai kopi, dan lembaga adalah peragaan simulasi sistem.
      </p>

      <p className="text-[11px] text-emerald-300/50 mt-2 font-mono">
        © 2026 GREENWORTH Surabaya · Ekonomi Sirkular Berbasis Syariah
      </p>
    </footer>
  );
}
