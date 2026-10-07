/**
 * Footer.jsx — Footer Resmi Prototipe
 * Wajib menampilkan label "Prototipe: data simulasi" untuk Syariah Business Plan Competition.
 */

import { Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 pt-4 pb-6 border-t border-emerald-900/60 text-center text-emerald-300/80">
      <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 mb-2">
        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>Prototipe: data simulasi</span>
      </div>

      <p className="text-sm text-emerald-200/90 leading-relaxed max-w-xs mx-auto">
        Lampiran proposal <strong>Syariah Business Plan Competition</strong>. Semua data akun, kedai kopi, dan lembaga adalah fiktif untuk tujuan peragaan sistem.
      </p>

      <p className="text-xs text-emerald-400/60 mt-2">
        © 2026 GREENWORTH Surabaya · Ekonomi Sirkular Berbasis Syariah
      </p>
    </footer>
  );
}
