/**
 * QrPasporModal.jsx — Modal Paspor Digital GREENWORTH Surabaya
 * Format Hijau-Putih Segar, Bersih & Profesional untuk Barista Kedai Kopi.
 */

import { QrCode, ShieldCheck, X, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';

export default function QrPasporModal({ isOpen, onClose }) {
  const { akun, ringkasan } = useGreenworth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-5 text-slate-900 shadow-2xl relative overflow-hidden animate-scale-up">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-slate-900">
                Paspor Digital Anggota
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Mitra Kedai Kopi Surabaya
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all active:scale-95"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Kartu Paspor Bersih (Hijau-Putih Seimbang) */}
        <div className="my-4 bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 text-center shadow-2xs">
          <div className="flex items-center justify-between mb-3 text-left">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                ID Anggota Surabaya
              </span>
              <h4 className="text-base font-black text-slate-900">{akun.nama}</h4>
            </div>
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
              {akun.id}
            </span>
          </div>

          {/* Simulasi Gambar QR Code */}
          <div className="bg-white p-3 rounded-2xl mx-auto w-48 h-48 shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
            <div className="w-full h-full border-4 border-slate-900 rounded-xl p-2 flex flex-col justify-between relative bg-white">
              {/* Scan Reticle Simulation */}
              <div className="absolute inset-x-2 top-0 h-1 bg-emerald-500 animate-pulse rounded-full" />

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
                <div className="bg-emerald-600 col-span-2 row-span-2 rounded-md flex items-center justify-center text-[10px] font-black text-white">
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

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Terverifikasi • Terkoneksi Mitra Kedai</span>
          </div>

          {/* Saldo Poin Live di Paspor */}
          <div className="mt-3 pt-2.5 border-t border-emerald-200/80 flex items-center justify-around text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Saldo Poin</span>
              <span className="font-mono font-black text-amber-700 text-sm">{ringkasan.saldoPoin} pt</span>
            </div>
            <div className="w-px h-6 bg-emerald-200" />
            <div>
              <span className="text-[10px] text-slate-500 block">Domisili</span>
              <span className="font-bold text-slate-800 text-xs">{akun.wilayahDomisili.split(' ')[1] || 'Surabaya'}</span>
            </div>
          </div>
        </div>

        {/* Petunjuk Penggunaan untuk Kasir / Barista */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-emerald-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cara Penggunaan di Kedai Kopi:</span>
          </p>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Tunjukkan layar QR ini ke barista atau kasir kedai mitra Surabaya saat menyetor cup plastik atau kardus untuk verifikasi instan.
          </p>
        </div>

        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-sm active:scale-95 transition-all"
        >
          Selesai & Kembali
        </button>
      </div>
    </div>
  );
}
