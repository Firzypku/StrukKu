/**
 * Beranda.jsx — Halaman Beranda GREENWORTH Surabaya
 * Tema: Hijau-Putih Segar, Bersih, Seimbang & Terstruktur.
 * Layout rapi & ergonomis: Kartu Saldo Utama di atas, Banner edukasi ramah & to-the-point,
 * Metrik dampak seimbang, serta daftar pos sumbangan dan kedai mitra yang tertata.
 */

import {
  ArrowRight,
  PlusCircle,
  HeartHandshake,
  Coffee,
  Package,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

export default function Beranda({ onPindahMenu, onOpenQr }) {
  const { akun, ringkasan, titikKumpulList, posSumbanganList } = useGreenworth();

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* ── 1. KARTU SALDO UTAMA (HERO FINTECH HIJAU SEGAR - EMERALD 600) ────── */}
      <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-sm space-y-4">
        {/* Sapaan Pengguna & ID Anggota */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-100 font-medium block">
              Assalamu'alaikum,
            </span>
            <h1 className="text-base font-extrabold text-white leading-tight">
              {akun.nama}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono font-bold bg-white/20 text-white px-2.5 py-1 rounded-lg border border-white/20 inline-block">
              {akun.id}
            </span>
          </div>
        </div>

        {/* Kotak Ringkasan Saldo Poin */}
        <div className="bg-white/10 rounded-xl p-3.5 border border-white/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-100">
            <span>Saldo Poin Kebaikan</span>
            <span className="font-semibold text-emerald-100">1 Poin = Rp {NILAI_POIN}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-sm font-bold text-emerald-100 uppercase">Poin</span>
            <span className="text-xs font-bold text-white ml-auto bg-black/15 px-2.5 py-1 rounded-md">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Notifikasi Poin Menunggu Verifikasi */}
          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-200 flex-shrink-0" />
              <span>Verifikasi Kedai:</span>
            </div>
            <span className="font-bold text-amber-200">
              +{ringkasan.poinTertunda || 15} Poin (Rp {(ringkasan.poinTertundaRupiah || 1500).toLocaleString('id-ID')})
            </span>
          </div>
        </div>

        {/* 2 Tombol Aksi Cepat (High Contrast & Rapi) */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="py-2.5 px-3 bg-white hover:bg-emerald-50 active:scale-98 text-emerald-800 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
            <span>Setor Sampah</span>
          </button>

          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="py-2.5 px-3 bg-emerald-700/80 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl border border-white/30 transition-all flex items-center justify-center gap-1.5"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-100 stroke-[2.2]" />
            <span>Salurkan Poin</span>
          </button>
        </div>
      </div>

      {/* ── 2. BANNER PROGRAM KEDAI KOPI (RAMAH, BERSIH & TIDAK JARGON) ──────── */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs relative overflow-hidden space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            ☕ Mitra Kedai Kopi Surabaya
          </span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            1 Cup = 5 Poin (Rp 500)
          </span>
        </div>

        <div>
          <h2 className="text-sm font-extrabold text-slate-900 leading-snug">
            Kopi Habis? <span className="text-emerald-700">Cup & Kardusnya Jangan Dibuang!</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Bawa cup plastik atau kardus bekasmu ke kedai kopi mitra terdekat. Dapatkan poin langsung untuk ditabung atau disedekahkan ke program sosial.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            Mudah • Nyata • Berkah
          </span>
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
          >
            <span>Cari Kedai Terdekat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 3. RINGKASAN DAMPAK LINGKUNGAN (3 KOLOM SEIMBANG) ────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Dampak Sampah Terkumpul
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            {ringkasan.totalTransaksiSetor} Transaksi Selesai
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Cup Plastik */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
              <Coffee className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Cup Plastik</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">
              {ringkasan.totalGelasPlastik}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ({ringkasan.totalBeratPlastikKg} kg)
            </span>
          </div>

          {/* Kardus */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1">
              <Package className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Kardus</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">
              {ringkasan.totalBeratKardusKg}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">kg</span>
          </div>

          {/* Tersumbang */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Tersumbang</span>
            <span className="text-sm font-black text-emerald-700 block mt-0.5">
              {ringkasan.totalPoinDisumbangkan}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Poin</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-normal pt-0.5">
          Total <strong>{ringkasan.totalBeratSampahKg} kg</strong> sampah terselamatkan dari TPA Surabaya untuk didaur ulang.
        </p>
      </div>

      {/* ── 4. POS SUMBANGAN SOSIAL SYARIAH (KARTU PUTIH BERSIH) ─────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Pos Sumbangan Sosial Syariah
            </h3>
            <p className="text-[11px] text-slate-500">
              Poin setoran dialirkan untuk kemaslahatan warga
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {ringkasan.ringkasanPosSumbangan.map((pos) => (
            <div
              key={pos.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {pos.kategori}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pos.lembagaPengelola}
                  </p>
                </div>

                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg whitespace-nowrap border border-emerald-200">
                  {pos.persentaseTarget}%
                </span>
              </div>

              {/* Progress Bar Hijau Bersih */}
              <div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${pos.persentaseTarget}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500 font-medium">
                  <span>
                    Terkumpul: <strong className="text-slate-800">Rp {pos.totalTerkumpulRupiah.toLocaleString('id-ID')}</strong>
                  </span>
                  <span>Target: Rp {pos.targetDanaRupiah.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {pos.sumbanganSayaRupiah > 0 && (
                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Sumbangan akunmu:</span>
                  <span className="font-bold text-emerald-700">
                    Rp {pos.sumbanganSayaRupiah.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. TITIK KUMPUL KEDAI KOPI SURABAYA (KARTU PUTIH BERSIH) ─────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Titik Kumpul Kedai Kopi
            </h3>
            <p className="text-[11px] text-slate-500">
              Lokasi setor sampah cup plastik dan kardus di Surabaya
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Jawa Timur
          </span>
        </div>

        <div className="space-y-2">
          {titikKumpulList.map((kedai) => (
            <div
              key={kedai.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {kedai.wilayah}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {kedai.namaKedai}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{kedai.alamat}</span>
                  </p>
                </div>

                <span className="text-[11px] text-slate-500 flex items-center gap-1 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{kedai.jamBuka.split(',')[1] || kedai.jamBuka}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] italic">
                  {kedai.keterangan}
                </span>
                <button
                  type="button"
                  onClick={() => onPindahMenu('setor')}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition-all flex items-center gap-1 active:scale-95 border border-emerald-200"
                >
                  <span>Setor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
