/**
 * Beranda.jsx — Halaman Beranda GREENWORTH Surabaya
 * Menampilkan saldo poin terhitung, ringkasan dampak sampah, 4 kedai kumpul, dan 3 pos sumbangan.
 * Font isi minimal 14 px, tema hijau gelap, kontras tinggi, mobile 375px aman.
 */

import {
  Coins,
  ArrowRight,
  PlusCircle,
  HeartHandshake,
  Coffee,
  Package,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

export default function Beranda({ onPindahMenu }) {
  const { akun, ringkasan, titikKumpulList, posSumbanganList } = useGreenworth();

  return (
    <div className="space-y-5">
      {/* ── KARTU UTAMA: SALDO POIN, POIN TERTUNDA & DUA TOMBOL BESAR ─────────── */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#0b5337] rounded-3xl p-5 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Baris Sapaan Nama & ID Anggota */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="min-w-0">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200 block">
              Assalamu'alaikum,
            </span>
            <h2 className="text-lg font-black text-white truncate flex items-center gap-1.5">
              <span>{akun.nama}</span>
              <span className="text-amber-300">👋</span>
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-950/70 border border-emerald-400/40 text-amber-300 px-2.5 py-1 rounded-xl whitespace-nowrap">
            {akun.id}
          </span>
        </div>

        {/* Kotak Saldo Poin Aktif & Poin Tertunda */}
        <div className="bg-emerald-950/70 rounded-2xl p-4 border border-emerald-600/40 space-y-3">
          {/* 1. Saldo Poin Aktif */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Saldo Poin Aktif
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                1 Poin = Rp {NILAI_POIN}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-300 tracking-tight">
                {ringkasan.saldoPoin.toLocaleString('id-ID')}
              </span>
              <span className="text-base font-bold text-white">
                Poin
              </span>
              <span className="text-sm font-semibold text-emerald-200 ml-auto">
                ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* 2. Poin Tertunda */}
          <div className="pt-2.5 border-t border-emerald-800/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-200/90">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Poin Tertunda (Verifikasi Kedai):</span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-amber-300">
                +{ringkasan.poinTertunda || 15} Poin
              </span>
              <span className="text-emerald-300 ml-1">
                (Rp {(ringkasan.poinTertundaRupiah || 1500).toLocaleString('id-ID')})
              </span>
            </div>
          </div>
        </div>

        {/* DUA TOMBOL BESAR: "Setor Sampah" dan "Cek Poin & Sumbangkan" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 border border-amber-200"
          >
            <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            <span>Setor Sampah</span>
          </button>

          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="w-full py-3.5 px-4 bg-emerald-900/90 hover:bg-emerald-800 active:scale-98 text-white border-2 border-amber-400/70 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-5 h-5 text-amber-300 stroke-[2.2]" />
            <span>Cek Poin & Sumbangkan</span>
          </button>
        </div>
      </div>

      {/* ── RINGKASAN DAMPAK LINGKUNGAN (TERHITUNG DARI STORE) ─────────────────── */}
      <div className="bg-[#042614] rounded-3xl p-4 border border-emerald-900/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Dampak Sampah Dipilah
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-800">
            {ringkasan.totalTransaksiSetor} Kali Setor
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Plastik */}
          <div className="bg-[#05371a] p-3 rounded-2xl border border-emerald-800/60 text-center">
            <Coffee className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="text-xs text-emerald-300 block font-medium">Cup Plastik</span>
            <span className="text-base font-black text-white block mt-0.5">
              {ringkasan.totalGelasPlastik}
            </span>
            <span className="text-xs text-emerald-400/90 font-medium">
              ({ringkasan.totalBeratPlastikKg} kg)
            </span>
          </div>

          {/* Kardus */}
          <div className="bg-[#05371a] p-3 rounded-2xl border border-emerald-800/60 text-center">
            <Package className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="text-xs text-emerald-300 block font-medium">Kardus</span>
            <span className="text-base font-black text-white block mt-0.5">
              {ringkasan.totalBeratKardusKg}
            </span>
            <span className="text-xs text-emerald-400/90 font-medium">
              kg
            </span>
          </div>

          {/* Sumbangan */}
          <div className="bg-[#05371a] p-3 rounded-2xl border border-emerald-800/60 text-center">
            <HeartHandshake className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <span className="text-xs text-emerald-300 block font-medium">Tersumbang</span>
            <span className="text-base font-black text-amber-300 block mt-0.5">
              {ringkasan.totalPoinDisumbangkan}
            </span>
            <span className="text-xs text-emerald-400/90 font-medium">
              Poin
            </span>
          </div>
        </div>

        <p className="text-xs text-emerald-300/80 leading-relaxed pt-1">
          Total <strong>{ringkasan.totalBeratSampahKg} kg</strong> sampah berhasil diselamatkan dari timbulan sampah kota Surabaya.
        </p>
      </div>

      {/* ── 3 POS SUMBANGAN SYARIAH DENGAN PROGRES DANA ──────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              3 Pos Sumbangan Sosial Syariah
            </h3>
            <p className="text-xs text-emerald-300">
              Poin dari sampah disalurkan untuk kemaslahatan warga
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {ringkasan.ringkasanPosSumbangan.map((pos) => (
            <div
              key={pos.id}
              className="bg-[#042614] rounded-2xl p-4 border border-emerald-900/80 hover:border-emerald-700 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {pos.kategori}
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    {pos.nama}
                  </h4>
                  <p className="text-xs text-emerald-300/90 mt-0.5">
                    Pengelola: {pos.lembagaPengelola}
                  </p>
                </div>

                <span className="text-xs font-extrabold text-amber-300 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded-lg whitespace-nowrap">
                  {pos.persentaseTarget}%
                </span>
              </div>

              {/* Progress Bar Target Dana */}
              <div>
                <div className="w-full bg-[#05371a] h-2 rounded-full overflow-hidden border border-emerald-800/40">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pos.persentaseTarget}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5 font-medium">
                  <span className="text-emerald-300">
                    Terkumpul: <strong>Rp {pos.totalTerkumpulRupiah.toLocaleString('id-ID')}</strong>
                  </span>
                  <span className="text-emerald-400/80">
                    Target: Rp {pos.targetDanaRupiah.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {pos.sumbanganSayaRupiah > 0 && (
                <div className="pt-1.5 border-t border-emerald-900/60 flex items-center justify-between text-xs text-amber-200">
                  <span>Sumbangan dari akunmu:</span>
                  <span className="font-extrabold text-amber-300">
                    Rp {pos.sumbanganSayaRupiah.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 TITIK KUMPUL KEDAI KOPI FIKTIF DI SURABAYA ──────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">
              4 Titik Kumpul Kedai Kopi Surabaya
            </h3>
            <p className="text-xs text-emerald-300">
              Tempat setor sampah cup dan kardus terdekat
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Fiktif
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {titikKumpulList.map((kedai) => (
            <div
              key={kedai.id}
              className="bg-[#042614] rounded-2xl p-3.5 border border-emerald-900/80 hover:border-emerald-600 transition-all flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                    Wilayah {kedai.wilayah}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{kedai.jamBuka.split(',')[1] || kedai.jamBuka}</span>
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-white mt-1.5">
                  {kedai.namaKedai}
                </h4>
                <p className="text-sm text-emerald-200/90 mt-0.5 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{kedai.alamat}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between">
                <span className="text-xs text-emerald-300/80 italic">
                  {kedai.keterangan}
                </span>
                <button
                  type="button"
                  onClick={() => onPindahMenu('setor')}
                  className="px-2.5 py-1 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 text-xs font-bold flex items-center gap-1 whitespace-nowrap active:scale-95 transition-all"
                >
                  <span>Pilih Setor</span>
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
