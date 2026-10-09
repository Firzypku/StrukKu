/**
 * Beranda.jsx — Halaman Beranda GREENWORTH Surabaya
 * Vibe Design Framework & Cyber-Emerald Luxury:
 * Tipografi punchy, Quick Action Dock (Setor Cup, Kardus, Wakaf, Paspor QR),
 * Watermark Geometris Syariah, dan 4 Pilar Metrik Terintegrasi.
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
      {/* ── IDENTITAS PROPOSISI NILAI (CAT-EYE & HIGH CONTRAST) ─────────────── */}
      <div className="bg-[#042416]/90 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/25 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-400/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ekonomi Sirkular Syariah • Surabaya
          </span>
        </div>

        <h1 className="text-2xl font-black text-white leading-tight tracking-tight">
          Mengubah Sampah Jadi{' '}
          <span className="text-emerald-400 drop-shadow-[0_0_14px_rgba(52,211,153,0.45)]">
            Berkah
          </span>
          ,<br />
          Mengubah Nilai Jadi{' '}
          <span className="text-amber-300 drop-shadow-[0_0_14px_rgba(252,211,77,0.45)]">
            Dampak
          </span>
          .
        </h1>

        <p className="text-xs text-emerald-100/80 mt-2 leading-relaxed font-medium">
          Platform ekonomi sirkular pertama di <strong className="text-white">Surabaya, Jawa Timur</strong> yang menghubungkan Kedai Kopi & UMKM Kuliner dengan pabrik daur ulang dan wakaf produktif otomatis.
        </p>
      </div>

      {/* ── KARTU SALDO UTAMA: EMERALD OBSIDIAN DENGAN WATERMARK SACRED GEOMETRY ── */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#053B27] to-[#022013] rounded-3xl p-5 text-white shadow-2xl border border-emerald-400/35 relative overflow-hidden">
        {/* Glow Ambient dalam Kartu */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Sacred Circular Islamic Geometry Watermark */}
        <svg
          className="absolute -right-8 -bottom-8 w-56 h-56 text-emerald-300/[0.08] pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="50" cy="50" r="46" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="36" />
          <circle cx="50" cy="50" r="26" strokeDasharray="2 2" />
          <polygon points="50,14 62,38 86,50 62,62 50,86 38,62 14,50 38,38" />
          <polygon points="50,22 58,42 78,50 58,58 50,78 42,58 22,50 42,42" strokeDasharray="1 2" />
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
          <span className="text-xs font-mono font-bold bg-emerald-950/90 text-amber-300 px-3 py-1 rounded-xl border border-emerald-500/40 shadow-xs">
            {akun.id}
          </span>
        </div>

        {/* Kotak Saldo Poin */}
        <div className="bg-[#02180d]/85 rounded-2xl p-4 border border-emerald-500/30 space-y-3 relative z-10 shadow-inner">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
            <span>Saldo Poin Aktif</span>
            <span className="text-amber-300 font-mono font-bold">1 Poin = Rp {NILAI_POIN}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-300 tracking-tight drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-sm font-extrabold text-white uppercase tracking-wider">Poin</span>
            <span className="text-xs font-bold text-emerald-300 ml-auto font-mono bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Indikator Poin Tertunda */}
          <div className="pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center gap-1.5 text-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
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
            className="py-3 px-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 border border-amber-200"
          >
            <PlusCircle className="w-4.5 h-4.5 stroke-[2.8]" />
            <span>Setor Sampah</span>
          </button>

          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="py-3 px-3.5 bg-emerald-950/90 hover:bg-emerald-900/90 active:scale-95 text-white font-black text-xs rounded-2xl border-2 border-amber-400/80 shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-1.5"
          >
            <HeartHandshake className="w-4.5 h-4.5 text-amber-300 stroke-[2.4]" />
            <span>Sumbangkan</span>
          </button>
        </div>
      </div>

      {/* ── QUICK ACTION DOCK (4 PILAR AKSI TAKTIL ALA FINTECH LUXURY) ───────── */}
      <div className="grid grid-cols-4 gap-2">
        {/* Aksi 1: Setor Cup */}
        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-[#042416]/90 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-400/40 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center group active:scale-95 transition-all shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-950/90 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors mb-1">
            <Coffee className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-black text-white leading-tight">Cup Kopi</span>
          <span className="text-[9px] text-emerald-300/80 font-mono">10 pt/kg</span>
        </button>

        {/* Aksi 2: Setor Kardus */}
        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-[#042416]/90 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-400/40 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center group active:scale-95 transition-all shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-950/90 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:text-white transition-colors mb-1">
            <Package className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-black text-white leading-tight">Kardus</span>
          <span className="text-[9px] text-amber-300/80 font-mono">5 pt/kg</span>
        </button>

        {/* Aksi 3: Wakaf Uang */}
        <button
          type="button"
          onClick={() => onPindahMenu('lacak')}
          className="bg-[#042416]/90 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-400/40 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center group active:scale-95 transition-all shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-950/90 border border-emerald-500/30 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors mb-1">
            <HeartHandshake className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-black text-white leading-tight">Wakaf</span>
          <span className="text-[9px] text-emerald-300/80 font-mono">Syariah</span>
        </button>

        {/* Aksi 4: Paspor QR Publik */}
        <button
          type="button"
          onClick={onOpenQr}
          className="bg-[#042416]/90 backdrop-blur-md border border-amber-400/30 hover:border-amber-400/60 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center group active:scale-95 transition-all shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform mb-1">
            <QrCode className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-black text-amber-300 leading-tight">Paspor QR</span>
          <span className="text-[9px] text-emerald-200/80 font-mono">Barista</span>
        </button>
      </div>

      {/* ── 4 PILAR METRIK DAMPAK (PERSIS DENGAN LANDING PAGE WEB) ────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-200">
              Capaian Dampak Nyata
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">
            Live Surabaya
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Metrik 1: Sampah Terhindar TPA */}
          <div className="bg-[#042416]/90 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/20 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                Terhindar TPA
              </span>
              <div className="w-7 h-7 rounded-xl bg-emerald-900/70 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Coffee className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-white font-mono tracking-tight">
              501,5 <span className="text-xs font-bold text-emerald-400">kg</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 mt-1 font-medium">
              Cup plastik & kardus
            </span>
          </div>

          {/* Metrik 2: Nilai Ekonomi Sirkular */}
          <div className="bg-[#042416]/90 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/20 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                Nilai Sirkular
              </span>
              <div className="w-7 h-7 rounded-xl bg-teal-900/70 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-white font-mono tracking-tight">
              Rp 2 <span className="text-xs font-bold text-teal-300">Jt+</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 mt-1 font-medium">
              Potensi nilai pasar
            </span>
          </div>

          {/* Metrik 3: Dana Sosial Tersalurkan */}
          <div className="bg-[#042416]/90 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/20 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">
                Dana Sosial
              </span>
              <div className="w-7 h-7 rounded-xl bg-amber-950/80 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <HeartHandshake className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-amber-300 font-mono tracking-tight">
              Rp 426 <span className="text-xs font-bold text-amber-200">Rb</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 mt-1 font-medium">
              25% disalurkan ke wakaf
            </span>
          </div>

          {/* Metrik 4: Serapan Karbon / Pohon */}
          <div className="bg-[#042416]/90 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/20 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                Serapan CO2
              </span>
              <div className="w-7 h-7 rounded-xl bg-emerald-900/70 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <TreeDeciduous className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-emerald-300 font-mono tracking-tight">
              36 <span className="text-xs font-bold text-white">Pohon</span>
            </div>
            <span className="text-[10px] text-emerald-200/70 mt-1 font-medium">
              Ekuivalen reduksi emisi
            </span>
          </div>
        </div>
      </div>

      {/* ── 3 POS SUMBANGAN SOSIAL SYARIAH (DENGAN FILTER KATEGORI INTERAKTIF) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-white">
              3 Pos Sumbangan Sosial Syariah
            </h3>
            <p className="text-[11px] text-emerald-200/70">
              Poin setoran dialirkan untuk kemaslahatan umat
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-0.5 active:scale-95 transition-all"
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
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-[#02180e] text-emerald-200/80 border border-emerald-500/20 hover:border-emerald-400/40'
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
              className="bg-[#042416]/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 shadow-md hover:border-emerald-400/40 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                    {pos.kategori}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-emerald-200/70 mt-0.5 font-medium">
                    {pos.lembagaPengelola}
                  </p>
                </div>

                <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 border border-emerald-400/30 px-2.5 py-1 rounded-xl whitespace-nowrap font-mono">
                  {pos.persentaseTarget}%
                </span>
              </div>

              {/* Progress Bar Luminous */}
              <div>
                <div className="w-full bg-emerald-950/90 h-2.5 rounded-full overflow-hidden p-0.5 border border-emerald-800/60">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${pos.persentaseTarget}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1.5 text-emerald-200/80 font-medium font-mono">
                  <span>
                    Terkumpul: <strong className="text-white">Rp {pos.totalTerkumpulRupiah.toLocaleString('id-ID')}</strong>
                  </span>
                  <span>Target: Rp {pos.targetDanaRupiah.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {pos.sumbanganSayaRupiah > 0 && (
                <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300/80">Sumbangan akunmu:</span>
                  <span className="font-extrabold text-amber-300 font-mono">
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
            <h3 className="text-sm font-extrabold text-white">
              4 Titik Kumpul Kedai Kopi
            </h3>
            <p className="text-[11px] text-emerald-200/70">
              Lokasi setor sampah cup plastik dan kardus di Surabaya
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30">
            Jawa Timur
          </span>
        </div>

        <div className="space-y-2">
          {titikKumpulList.map((kedai) => (
            <div
              key={kedai.id}
              className="bg-[#042416]/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 shadow-md hover:border-emerald-400/40 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                    {kedai.wilayah}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">
                    {kedai.namaKedai}
                  </h4>
                  <p className="text-xs text-emerald-200/75 mt-0.5 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{kedai.alamat}</span>
                  </p>
                </div>

                <span className="text-[11px] text-emerald-300/80 flex items-center gap-1 whitespace-nowrap font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{kedai.jamBuka.split(',')[1] || kedai.jamBuka}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-xs">
                <span className="text-emerald-300/70 text-[11px] italic">
                  {kedai.keterangan}
                </span>
                <button
                  type="button"
                  onClick={() => onPindahMenu('setor')}
                  className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-105 text-slate-950 font-black rounded-xl transition-all flex items-center gap-1 active:scale-95 shadow-sm shadow-amber-500/20"
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
