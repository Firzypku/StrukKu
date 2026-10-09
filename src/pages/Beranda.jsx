/**
 * Beranda.jsx — Halaman Beranda GREENWORTH Surabaya
 * Mengadopsi Vibe Design Framework: hierarki visual jelas, tipografi berkelas,
 * tanpa elemen dekoratif berlebihan ("anti-AI slop"), bersih dan mudah digunakan.
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
    <div className="space-y-4 animate-fade-in pb-3">
      {/* ── IDENTITAS PROPOSISI NILAI (BERSIH & TERFOKUS) ───────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            Ekonomi Sirkular Syariah
          </span>
          <span className="text-[11px] text-slate-400">Jawa Timur</span>
        </div>
        <h1 className="text-lg font-black text-slate-900 leading-snug tracking-tight">
          Mengubah Sampah Jadi <span className="text-[#0B3B24]">Berkah</span>,<br />
          Mengubah Nilai Jadi <span className="text-amber-700">Dampak</span>.
        </h1>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Kumpulkan cup kopi dan kardus dari kedai kuliner Surabaya. Dapatkan poin penukaran untuk disalurkan ke wakaf dan sedekah produktif.
        </p>
      </div>

      {/* ── KARTU ASET UTAMA: SALDO POIN (FOREST GREEN ELEGAN) ─────────────── */}
      <div className="bg-[#0B3B24] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        {/* Header Kartu: Sapaan & ID */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] text-emerald-300 font-medium block">
              Assalamu'alaikum
            </span>
            <h2 className="text-base font-extrabold text-white">
              {akun.nama}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-white/10 text-emerald-200 px-2.5 py-1 rounded-lg border border-white/10">
            {akun.id}
          </span>
        </div>

        {/* Saldo Poin */}
        <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-medium">
            <span>Saldo Poin Aktif</span>
            <span className="text-amber-300 font-semibold">1 Poin = Rp {NILAI_POIN}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300 tracking-tight">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-sm font-bold text-white">Poin</span>
            <span className="text-xs font-bold text-emerald-200 ml-auto">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Indikator Poin Tertunda */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>Verifikasi Kedai:</span>
            </div>
            <span className="font-bold text-amber-300">
              +{ringkasan.poinTertunda || 15} Poin (Rp {(ringkasan.poinTertundaRupiah || 1500).toLocaleString('id-ID')})
            </span>
          </div>
        </div>

        {/* 2 Tombol Aksi Utama */}
        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Setor Sampah</span>
          </button>

          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="py-2.5 px-3 bg-white/10 hover:bg-white/20 active:scale-98 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-300" />
            <span>Sumbangkan</span>
          </button>
        </div>
      </div>

      {/* ── METRIK DAMPAK LINGKUNGAN (MINIMALIS & JELAS) ────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Dampak Sampah Terkumpul
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {ringkasan.totalTransaksiSetor} Transaksi
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Plastik */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 text-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1">
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
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 text-center">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-1">
              <Package className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Kardus</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">
              {ringkasan.totalBeratKardusKg}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">kg</span>
          </div>

          {/* Sumbangan */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 text-center">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Tersumbang</span>
            <span className="text-sm font-black text-amber-700 block mt-0.5">
              {ringkasan.totalPoinDisumbangkan}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Poin</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-normal">
          Total <strong>{ringkasan.totalBeratSampahKg} kg</strong> sampah terselamatkan dari TPA Surabaya untuk didaur ulang secara teratur.
        </p>
      </div>

      {/* ── 3 POS SUMBANGAN SOSIAL SYARIAH ──────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              3 Pos Sumbangan Sosial Syariah
            </h3>
            <p className="text-[11px] text-slate-500">
              Poin setoran dialirkan untuk kemaslahatan warga
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {ringkasan.ringkasanPosSumbangan.map((pos) => (
            <div
              key={pos.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:border-slate-200 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                    {pos.kategori}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pos.lembagaPengelola}
                  </p>
                </div>

                <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                  {pos.persentaseTarget}%
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0B3B24] to-amber-500 rounded-full transition-all duration-500"
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
                <div className="pt-1.5 border-t border-slate-50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Sumbangan akunmu:</span>
                  <span className="font-bold text-amber-700">
                    Rp {pos.sumbanganSayaRupiah.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 TITIK KUMPUL KEDAI KOPI SURABAYA ──────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              4 Titik Kumpul Kedai Kopi
            </h3>
            <p className="text-[11px] text-slate-500">
              Lokasi setor sampah cup plastik dan kardus
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Surabaya
          </span>
        </div>

        <div className="space-y-2">
          {titikKumpulList.map((kedai) => (
            <div
              key={kedai.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:border-slate-200 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {kedai.wilayah}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {kedai.namaKedai}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{kedai.alamat}</span>
                  </p>
                </div>

                <span className="text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  <span>{kedai.jamBuka.split(',')[1] || kedai.jamBuka}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] italic">
                  {kedai.keterangan}
                </span>
                <button
                  type="button"
                  onClick={() => onPindahMenu('setor')}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-emerald-800 font-bold rounded-lg transition-all flex items-center gap-1 active:scale-95"
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
