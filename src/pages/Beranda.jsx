/**
 * Beranda.jsx — Halaman Beranda GREENWORTH Surabaya
 * Memadukan copywriting kuat: "Mengubah Sampah Jadi Berkah, Mengubah Nilai Jadi Dampak"
 * Tampilan mobile-first yang bersih, lapang, modern, dan bernuansa syariah (Hijau + Putih + Emas).
 */

import {
  ArrowRight,
  PlusCircle,
  HeartHandshake,
  Coffee,
  Package,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

export default function Beranda({ onPindahMenu }) {
  const { akun, ringkasan, titikKumpulList, posSumbanganList } = useGreenworth();

  return (
    <div className="space-y-4 animate-fade-in pb-2">
      {/* ── BANNER SLOGAN BERKAH & DAMPAK (IKONIK DARI WEB SEBELUMNYA) ────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full w-fit mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Ekonomi Sirkular Syariah Surabaya</span>
        </div>
        
        <h1 className="text-xl font-black text-slate-900 leading-snug tracking-tight">
          Mengubah Sampah Jadi <span className="text-[#065F46] underline decoration-amber-400 decoration-3 underline-offset-4">Berkah</span>,<br />
          Mengubah Nilai Jadi <span className="text-amber-600">Dampak</span>.
        </h1>
        
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Kumpulkan cup plastik dan kardus dari kedai kopi atau rumah di Surabaya. Raih <strong>Reward Poin (1 Poin = Rp 100)</strong> dan salurkan wakaf serta sedekah otomatis untuk kemaslahatan umat.
        </p>
      </div>

      {/* ── KARTU SALDO POIN, POIN TERTUNDA & DUA TOMBOL BESAR ───────────────── */}
      <div className="bg-gradient-to-br from-[#065F46] via-[#047857] to-[#064E3B] rounded-3xl p-5 text-white shadow-xl shadow-emerald-950/15 relative overflow-hidden border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Baris Sapaan Nama & ID Anggota */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="min-w-0">
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-200 block">
              Assalamu'alaikum,
            </span>
            <h2 className="text-lg font-black text-white truncate flex items-center gap-1.5">
              <span>{akun.nama}</span>
              <span className="text-amber-300">👋</span>
            </h2>
          </div>
          <span className="text-xs font-mono font-black bg-emerald-950/60 border border-emerald-400/30 text-amber-300 px-2.5 py-1 rounded-xl whitespace-nowrap shadow-xs">
            {akun.id}
          </span>
        </div>

        {/* Kotak Saldo Poin Aktif & Poin Tertunda */}
        <div className="bg-emerald-950/60 rounded-2xl p-4 border border-emerald-400/20 backdrop-blur-xs space-y-3">
          {/* 1. Saldo Poin Aktif */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-200">
              <span className="uppercase tracking-wider font-bold">Saldo Poin Aktif</span>
              <span className="text-amber-300 font-bold">1 Poin = Rp {NILAI_POIN}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-300 tracking-tight">
                {ringkasan.saldoPoin.toLocaleString('id-ID')}
              </span>
              <span className="text-base font-bold text-white">
                Poin
              </span>
              <span className="text-sm font-black text-emerald-100 ml-auto">
                ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* 2. Poin Tertunda */}
          <div className="pt-2.5 border-t border-emerald-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Poin Tertunda (Verifikasi Kedai):</span>
            </div>
            <div className="text-right">
              <span className="font-black text-amber-300">
                +{ringkasan.poinTertunda || 15} Poin
              </span>
              <span className="text-emerald-200 ml-1">
                (Rp {(ringkasan.poinTertundaRupiah || 1500).toLocaleString('id-ID')})
              </span>
            </div>
          </div>
        </div>

        {/* DUA TOMBOL BESAR UTAMA */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="w-full py-3 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all flex flex-col items-center justify-center border border-amber-300"
          >
            <div className="flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Setor Sampah</span>
            </div>
            <span className="text-[10px] font-bold text-slate-800 mt-0.5">Dapatkan Poin</span>
          </button>

          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="w-full py-3 px-3 bg-white hover:bg-slate-50 active:scale-98 text-[#065F46] font-black text-sm rounded-2xl shadow-md transition-all flex flex-col items-center justify-center border border-white"
          >
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#065F46] stroke-[2.4]" />
              <span>Cek & Sumbang</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 mt-0.5">Salurkan Berkah</span>
          </button>
        </div>
      </div>

      {/* ── RINGKASAN DAMPAK LINGKUNGAN (KARTU PUTIH BERSIH) ──────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Dampak Sampah Terkumpul
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            {ringkasan.totalTransaksiSetor} Setoran
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Plastik */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mx-auto mb-1.5">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 block font-medium">Cup Plastik</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">
              {ringkasan.totalGelasPlastik}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              ({ringkasan.totalBeratPlastikKg} kg)
            </span>
          </div>

          {/* Kardus */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center mx-auto mb-1.5">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 block font-medium">Kardus</span>
            <span className="text-base font-black text-slate-900 block mt-0.5">
              {ringkasan.totalBeratKardusKg}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              kg
            </span>
          </div>

          {/* Sumbangan */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mx-auto mb-1.5">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-500 block font-medium">Tersumbang</span>
            <span className="text-base font-black text-amber-700 block mt-0.5">
              {ringkasan.totalPoinDisumbangkan}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Poin
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed pt-1">
          Total <strong>{ringkasan.totalBeratSampahKg} kg</strong> sampah berhasil diselamatkan dari TPA Surabaya untuk didaur ulang secara produktif.
        </p>
      </div>

      {/* ── 3 POS SUMBANGAN SOSIAL SYARIAH (KARTU PUTIH BERSIH) ──────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              3 Pos Sumbangan Sosial Syariah
            </h3>
            <p className="text-xs text-slate-500">
              Poin dari sampah disalurkan langsung ke penerima manfaat
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
          >
            <span>Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {ringkasan.ringkasanPosSumbangan.map((pos) => (
            <div
              key={pos.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md inline-block mb-1">
                    {pos.kategori}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">
                    {pos.nama}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pengelola: {pos.lembagaPengelola}
                  </p>
                </div>

                <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl whitespace-nowrap">
                  {pos.persentaseTarget}%
                </span>
              </div>

              {/* Progress Bar Target Dana */}
              <div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#065F46] to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pos.persentaseTarget}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5 font-medium text-slate-600">
                  <span>
                    Terkumpul: <strong className="text-slate-900">Rp {pos.totalTerkumpulRupiah.toLocaleString('id-ID')}</strong>
                  </span>
                  <span className="text-slate-400">
                    Target: Rp {pos.targetDanaRupiah.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {pos.sumbanganSayaRupiah > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Sumbangan dari akunmu:</span>
                  <span className="font-black text-amber-700">
                    Rp {pos.sumbanganSayaRupiah.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 TITIK KUMPUL KEDAI KOPI SURABAYA ──────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              4 Titik Kumpul Kedai Kopi Surabaya
            </h3>
            <p className="text-xs text-slate-500">
              Tempat setor sampah cup dan kardus terdekat
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
            Surabaya
          </span>
        </div>

        <div className="space-y-2.5">
          {titikKumpulList.map((kedai) => (
            <div
              key={kedai.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Wilayah {kedai.wilayah}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-1.5">
                    {kedai.namaKedai}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{kedai.alamat}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{kedai.jamBuka.split(',')[1] || kedai.jamBuka}</span>
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 italic text-[11px]">
                  {kedai.keterangan}
                </span>
                <button
                  type="button"
                  onClick={() => onPindahMenu('setor')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold flex items-center gap-1 active:scale-95 transition-all"
                >
                  <span>Pilih Setor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
