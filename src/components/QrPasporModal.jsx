/**
 * QrPasporModal.jsx — Modal Paspor Digital GREENWORTH Surabaya
 * Fitur "Cat-Eye" & Bukti Digital untuk Diserahkan/Discan Barista Kedai Kopi.
 * Sesuai blueprint kompetisi: "Verifikasi Paspor QR Publik".
 */

import { QrCode, ShieldCheck, X, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';

export default function QrPasporModal({ isOpen, onClose }) {
  const { akun, ringkasan } = useGreenworth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-[#063B24] via-[#042817] to-[#02180e] border border-amber-400/40 w-full max-w-sm rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden animate-scale-up">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white">
                Paspor Digital Anggota
              </h3>
              <span className="text-[10px] text-amber-300 font-mono">
                Jejak Sirkular Syariah
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-300 hover:text-white transition-all active:scale-95"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Kartu Paspor Bersinar */}
        <div className="my-4 bg-[#02140b] rounded-2xl p-4 border border-emerald-500/30 text-center relative z-10 shadow-inner">
          <div className="flex items-center justify-between mb-3 text-left">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                ID Anggota Surabaya
              </span>
              <h4 className="text-base font-black text-white">{akun.nama}</h4>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30">
              {akun.id}
            </span>
          </div>

          {/* Simulasi Gambar QR Code Resolusi Tinggi */}
          <div className="bg-white p-3 rounded-2xl mx-auto w-48 h-48 shadow-lg flex flex-col items-center justify-center relative group">
            {/* Corner Markers */}
            <div className="w-full h-full border-4 border-slate-900 rounded-xl p-2 flex flex-col justify-between relative bg-white">
              {/* Scan Reticle Simulation */}
              <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 animate-pulse rounded-full" />

              {/* QR Pattern Representation */}
              <div className="grid grid-cols-6 gap-1 w-full h-full p-1 opacity-90">
                <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs" />
                <div className="bg-slate-900" />
                <div className="bg-slate-300" />
                <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs" />
                <div className="bg-slate-900" />
                <div className="bg-slate-300" />
                <div className="bg-slate-900" />
                <div className="bg-slate-900" />
                <div className="bg-emerald-700 col-span-2 row-span-2 rounded-md flex items-center justify-center text-[10px] font-black text-white">
                  GW
                </div>
                <div className="bg-slate-900" />
                <div className="bg-slate-300" />
                <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs" />
                <div className="bg-slate-900" />
                <div className="bg-slate-300" />
                <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Terverifikasi • Terkoneksi Mitra Kedai</span>
          </div>

          {/* Saldo Poin Live di Paspor */}
          <div className="mt-3 pt-2.5 border-t border-emerald-900/60 flex items-center justify-around text-xs">
            <div>
              <span className="text-[10px] text-emerald-200/70 block">Saldo Poin</span>
              <span className="font-mono font-black text-amber-300 text-sm">{ringkasan.saldoPoin} pt</span>
            </div>
            <div className="w-px h-6 bg-emerald-900" />
            <div>
              <span className="text-[10px] text-emerald-200/70 block">Domisili</span>
              <span className="font-bold text-white text-xs">{akun.wilayahDomisili.split(' ')[1] || 'Surabaya'}</span>
            </div>
          </div>
        </div>

        {/* Petunjuk Penggunaan untuk Kasir / Barista */}
        <div className="bg-emerald-950/80 rounded-2xl p-3 border border-emerald-500/20 text-xs text-emerald-200/90 space-y-1 relative z-10">
          <p className="font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cara Penggunaan di Kedai Kopi:</span>
          </p>
          <p className="text-[11px] leading-relaxed text-emerald-100/80">
            Tunjukkan layar QR ini ke barista atau kasir kedai mitra Surabaya saat menyetor cup plastik atau kardus untuk verifikasi instan tanpa login berulang.
          </p>
        </div>

        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all relative z-10 border border-amber-200"
        >
          Selesai & Kembali
        </button>
      </div>
    </div>
  );
}
