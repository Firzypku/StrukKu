/**
 * Beranda.jsx — Halaman Beranda GREENWORTH Surabaya
 * Estetika Hijau Putih Seimbang & Clear (Vibe Design Standard):
 * Bersih, kontras tinggi, hierarki visual jelas, tanpa elemen gelap berlebihan.
 */

import { useState } from 'react';
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
  TrendingUp,
  TreeDeciduous,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

export default function Beranda({ onPindahMenu, onOpenQr }) {
  const { akun, ringkasan, titikKumpulList, posSumbanganList } = useGreenworth();
  const [filterKategori, setFilterKategori] = useState('Semua');

  // Filter pos sumbangan
  const posTerfilter =
    filterKategori === 'Semua'
      ? ringkasan.ringkasanPosSumbangan
      : ringkasan.ringkasanPosSumbangan.filter((p) =>
          p.kategori.toLowerCase().includes(filterKategori.toLowerCase())
        );

  return (
    <div className="space-y-4 animate-fade-in pb-3">
      {/* ── IDENTITAS PROPOSISI NILAI (PUTIH BERSIH & SEIMBANG) ─────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#064E3B] bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B] animate-pulse" />
            Ekonomi Sirkular Syariah • Surabaya
          </span>
        </div>

        <h1 className="text-xl font-black text-slate-900 leading-snug tracking-tight">
          Mengubah Sampah Jadi{' '}
          <span className="text-[#064E3B]">
            Berkah
          </span>
          ,<br />
          Mengubah Nilai Jadi{' '}
          <span className="text-amber-600">
            Dampak
          </span>
          .
        </h1>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Platform ekonomi sirkular pertama di <strong className="text-slate-900">Surabaya, Jawa Timur</strong> yang menghubungkan Kedai Kopi & UMKM Kuliner dengan daur ulang dan wakaf produktif otomatis.
        </p>
      </div>

      {/* ── KARTU SALDO UTAMA: DEEP EMERALD ROYAL (JANGKAR VISUAL HIJAU) ─────── */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#043E2E] to-[#022C1B] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        {/* Subtle Sacred Geometry Watermark */}
        <svg
          className="absolute -right-8 -bottom-8 w-56 h-56 text-white/[0.06] pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="50" cy="50" r="46" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="36" />
          <circle cx="50" cy="50" r="26" strokeDasharray="2 2" />
          <polygon points="50,14 62,38 86,50 62,62 50,86 38,62 14,50 38,38" />
        </svg>

        {/* Header Kartu: Sapaan & ID Anggota */}
        <div className="flex items-center justify-between mb-3.5 relative z-10">
          <div>
            <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider block">
              Assalamu'alaikum
            </span>
            <h2 className="text-base font-black text-white tracking-tight">
              {akun.nama}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-white/10 text-amber-300 px-3 py-1 rounded-xl border border-white/15">
            {akun.id}
          </span>
        </div>

        {/* Kotak Saldo Poin */}
        <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-3 relative z-10">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
            <span>Saldo Poin Aktif</span>
            <span className="text-amber-300 font-mono font-bold">1 Poin = Rp {NILAI_POIN}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-300 tracking-tight">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-sm font-extrabold text-white uppercase tracking-wider">Poin</span>
            <span className="text-xs font-bold text-emerald-200 ml-auto font-mono bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Indikator Poin Tertunda */}
          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Clock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>Verifikasi Kedai:</span>
            </div>
            <span className="font-extrabold text-amber-300 font-mono">
              +{ringkasan.poinTertunda || 15} Poin (Rp {(ringkasan.poinTertundaRupiah || 1500).toLocaleString('id-ID')})
            </span>
          </div>
        </div>

        {/* DUA TOMBOL AKSI UTAMA BERKONTRAS TINGGI */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 relative z-10">
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="py-3 px-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4.5 h-4.5 stroke-[2.8]" />
            <span>Setor Sampah</span>
          </button>

          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="py-3 px-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-black text-xs rounded-2xl border border-white/25 transition-all flex items-center justify-center gap-1.5"
          >
            <HeartHandshake className="w-4.5 h-4.5 text-emerald-200 stroke-[2.4]" />
            <span>Sumbangkan</span>
          </button>
        </div>
      </div>

      {/* ── QUICK ACTION DOCK (4 PILAR AKSI PUTIH BERSIH) ───────────────────── */}
      <div className="grid grid-cols-4 gap-2">
        {/* Aksi 1: Setor Cup */}
        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center group active:scale-95 transition-all shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mb-1 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
            <Coffee className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-black text-slate-900 leading-tight">Cup Kopi</span>
          <span className="text-[9px] text-[#064E3B] font-bold">10 pt/kg</span>
        </button>

        {/* Aksi 2: Setor Kardus */}
        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-white border border-slate-200/80 hover:border-amber-300 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center group active:scale-95 transition-all shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <Package className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-black text-slate-900 leading-tight">Kardus</span>
          <span className="text-[9px] text-amber-700 font-bold">5 pt/kg</span>
        </button>

        {/* Aksi 3: Wakaf Uang */}
        <button
          type="button"
          onClick={() => onPindahMenu('lacak')}
          className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center group active:scale-95 transition-all shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center mb-1 group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
            <HeartHandshake className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-black text-slate-900 leading-tight">Wakaf</span>
          <span className="text-[9px] text-slate-500">Syariah</span>
        </button>

        {/* Aksi 4: Paspor QR Publik */}
        <button
          type="button"
          onClick={onOpenQr}
          className="bg-white border border-amber-300/80 hover:border-amber-400 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center group active:scale-95 transition-all shadow-2xs"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black mb-1 group-hover:scale-105 transition-transform">
            <QrCode className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-black text-amber-900 leading-tight">Paspor QR</span>
          <span className="text-[9px] text-slate-500">Barista</span>
        </button>
      </div>

      {/* ── 4 PILAR METRIK DAMPAK (PUTIH BERSIH & KONTRAS JELAS) ─────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Capaian Dampak Nyata
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#064E3B] font-bold">
            Live Surabaya
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Metrik 1: Sampah Terhindar TPA */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Terhindar TPA
              </span>
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                <Coffee className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono tracking-tight">
              501,5 <span className="text-xs font-bold text-[#064E3B]">kg</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 font-medium">
              Cup plastik & kardus
            </span>
          </div>

          {/* Metrik 2: Nilai Ekonomi Sirkular */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Nilai Sirkular
              </span>
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono tracking-tight">
              Rp 2 <span className="text-xs font-bold text-[#064E3B]">Jt+</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 font-medium">
              Potensi nilai pasar
            </span>
          </div>

          {/* Metrik 3: Dana Sosial Tersalurkan */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Dana Sosial
              </span>
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-amber-700 font-mono tracking-tight">
              Rp 426 <span className="text-xs font-bold text-slate-500">Rb</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 font-medium">
              25% disalurkan ke wakaf
            </span>
          </div>

          {/* Metrik 4: Serapan Karbon / Pohon */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Serapan CO2
              </span>
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center">
                <TreeDeciduous className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-[#064E3B] font-mono tracking-tight">
              36 <span className="text-xs font-bold text-slate-600">Pohon</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 font-medium">
              Ekuivalen reduksi emisi
            </span>
          </div>
        </div>
      </div>

      {/* ── 3 POS SUMBANGAN SOSIAL SYARIAH (PUTIH BERSIH DENGAN FILTER) ──────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              3 Pos Sumbangan Sosial Syariah
            </h3>
            <p className="text-[11px] text-slate-500">
              Poin setoran dialirkan untuk kemaslahatan umat
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="text-xs font-bold text-[#064E3B] hover:text-[#043E2E] flex items-center gap-0.5 active:scale-95 transition-all"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Chips Kategori */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {['Semua', 'Wakaf', 'Pendidikan', 'Bencana'].map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => setFilterKategori(kat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterKategori === kat
                  ? 'bg-[#064E3B] text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {posTerfilter.map((pos) => (
            <div
              key={pos.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    {pos.kategori}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {pos.lembagaPengelola}
                  </p>
                </div>

                <span className="text-xs font-black text-[#064E3B] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl whitespace-nowrap font-mono">
                  {pos.persentaseTarget}%
                </span>
              </div>

              {/* Progress Bar Bersih */}
              <div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                  <div
                    className="h-full bg-gradient-to-r from-[#064E3B] to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pos.persentaseTarget}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-600 font-medium font-mono">
                  <span>
                    Terkumpul: <strong className="text-slate-900">Rp {pos.totalTerkumpulRupiah.toLocaleString('id-ID')}</strong>
                  </span>
                  <span>Target: Rp {pos.targetDanaRupiah.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {pos.sumbanganSayaRupiah > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Sumbangan akunmu:</span>
                  <span className="font-extrabold text-amber-700 font-mono">
                    Rp {pos.sumbanganSayaRupiah.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 TITIK KUMPUL KEDAI KOPI SURABAYA (PUTIH BERSIH) ────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              4 Titik Kumpul Kedai Kopi
            </h3>
            <p className="text-[11px] text-slate-500">
              Lokasi setor sampah cup plastik dan kardus di Surabaya
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
            Jawa Timur
          </span>
        </div>

        <div className="space-y-2">
          {titikKumpulList.map((kedai) => (
            <div
              key={kedai.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold text-[#064E3B] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {kedai.wilayah}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">
                    {kedai.namaKedai}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{kedai.alamat}</span>
                  </p>
                </div>

                <span className="text-[11px] text-slate-600 flex items-center gap-1 whitespace-nowrap font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/80">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{kedai.jamBuka.split(',')[1] || kedai.jamBuka}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] italic">
                  {kedai.keterangan}
                </span>
                <button
                  type="button"
                  onClick={() => onPindahMenu('setor')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#064E3B] font-bold rounded-xl transition-all flex items-center gap-1 active:scale-95 border border-emerald-200"
                >
                  <span>Setor</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
