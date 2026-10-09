/**
 * Beranda.jsx — Halaman Beranda GREENWORTH Surabaya
 * Konsep: Modern Fintech & Eco-App 2026.
 * Palet Warna: Emerald Harmonis, Mint Frosting, Rich Teal, Amber Gold, dan Pure Crisp White.
 * Tampilan keren & stylish tanpa mengubah struktur tata letak (layout tetap utuh & seimbang).
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
  QrCode,
  TrendingUp,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

export default function Beranda({ onPindahMenu, onOpenQr }) {
  const { akun, ringkasan, titikKumpulList, posSumbanganList } = useGreenworth();

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* ── 1. SAPAAN PENGGUNA & STATUS PROFIL ──────────────────────────────── */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block">
            Assalamu'alaikum,
          </span>
          <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>{akun.nama}</span>
            <span className="text-sm">👋</span>
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 shadow-2xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mitra Aktif</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/60">
            {akun.id}
          </span>
        </div>
      </div>

      {/* ── 2. FINTECH SUPER-CARD (EMERALD-JEWEL RADIANT GRADIENT) ─────────── */}
      <div className="bg-gradient-to-br from-[#059669] via-[#047857] to-[#0f766e] rounded-3xl p-5 text-white shadow-xl shadow-emerald-900/15 border border-emerald-400/25 relative overflow-hidden space-y-4">
        {/* Latar Belakang Geometris & Pantulan Cahaya Tipis */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-3 top-3 opacity-20 pointer-events-none">
          <Sparkles className="w-16 h-16 text-white" />
        </div>

        {/* Kotak Saldo Poin Bergaya Frosted Glass */}
        <div className="relative z-10 bg-white/12 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-100">
            <span className="font-semibold tracking-wide">Saldo Poin Kebaikan</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/25 shadow-2xs">
              1 Poin = Rp {NILAI_POIN}
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-3xl font-black text-white tracking-tight drop-shadow-xs">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-sm font-bold text-emerald-100 uppercase tracking-wider">
              Poin
            </span>
            <span className="text-xs font-bold text-white ml-auto bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 shadow-inner">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Indikator Poin Tertunda dengan Aksen Amber Honey */}
          <div className="pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 animate-spin-slow" />
              <span>Verifikasi Kedai:</span>
            </div>
            <span className="font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-300/30">
              +{ringkasan.poinTertunda || 15} Poin (Rp {(ringkasan.poinTertundaRupiah || 1500).toLocaleString('id-ID')})
            </span>
          </div>
        </div>

        {/* Action Dock 3 Tombol (Kontras Tinggi & Ergonomis) */}
        <div className="relative z-10 grid grid-cols-12 gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="col-span-6 py-2.5 px-3 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-900 font-extrabold text-xs rounded-xl shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-1.5 group"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600 stroke-[2.6] group-hover:rotate-90 transition-transform duration-300" />
            <span>Setor Sampah</span>
          </button>

          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="col-span-4 py-2.5 px-2 bg-emerald-800/60 hover:bg-emerald-800/80 active:scale-95 text-white font-bold text-xs rounded-xl border border-emerald-400/30 backdrop-blur-sm shadow-sm transition-all flex items-center justify-center gap-1"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-200 stroke-[2.2]" />
            <span>Salurkan</span>
          </button>

          {onOpenQr && (
            <button
              type="button"
              onClick={onOpenQr}
              aria-label="Buka QR Paspor"
              title="QR Paspor Digital"
              className="col-span-2 py-2.5 bg-emerald-800/60 hover:bg-emerald-800/80 active:scale-95 text-white rounded-xl border border-emerald-400/30 backdrop-blur-sm shadow-sm transition-all flex items-center justify-center"
            >
              <QrCode className="w-4 h-4 text-emerald-100" />
            </button>
          )}
        </div>
      </div>

      {/* ── 3. 4 MENU PINTASAN CEPAT (TACTILE DUAL-TINT SHORTCUTS) ───────────── */}
      <div className="grid grid-cols-4 gap-2 px-0.5">
        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-white hover:border-emerald-300 active:scale-95 transition-all p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center text-center gap-1.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-800 block leading-tight">
              Setor Cup
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md inline-block mt-0.5">
              10 pt/kg
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-white hover:border-amber-300 active:scale-95 transition-all p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center text-center gap-1.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/25 group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-800 block leading-tight">
              Setor Kardus
            </span>
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md inline-block mt-0.5">
              5 pt/kg
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onPindahMenu('lacak')}
          className="bg-white hover:border-teal-300 active:scale-95 transition-all p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center text-center gap-1.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-600/25 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-800 block leading-tight">
              Pos Wakaf
            </span>
            <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded-md inline-block mt-0.5">
              Syariah
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-white hover:border-emerald-300 active:scale-95 transition-all p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center text-center gap-1.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/25 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 stroke-[2.3]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-800 block leading-tight">
              Peta Kedai
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md inline-block mt-0.5">
              Surabaya
            </span>
          </div>
        </button>
      </div>

      {/* ── 4. BANNER PROMO KEDAI KOPI (MINT FROSTING & DUAL-TONE) ──────────── */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white rounded-2xl p-4 border border-emerald-200/90 shadow-sm space-y-2.5 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full shadow-2xs">
            ☕ Mitra Kedai Kopi Surabaya
          </span>
          <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200/80">
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

        <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 text-[11px]">
          <span className="flex items-center gap-1 font-bold text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            Mudah • Nyata • Berkah
          </span>
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1 text-[11px]"
          >
            <span>Cari Kedai</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── 5. BENTO METRIK DAMPAK LINGKUNGAN (BERSIH, MODERN & SEIMBANG) ─────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Dampak Lingkunganmu
            </h3>
            <p className="text-[11px] text-slate-400">Penyelamatan sampah daur ulang</p>
          </div>
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {ringkasan.totalTransaksiSetor} Transaksi Selesai
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Cup Plastik */}
          <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs text-center relative overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400 -mt-3 -mx-3 mb-2.5" />
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-1 border border-emerald-100">
              <Coffee className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Cup Plastik</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">
              {ringkasan.totalGelasPlastik}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              ({ringkasan.totalBeratPlastikKg} kg)
            </span>
          </div>

          {/* Kardus */}
          <div className="bg-white p-3 rounded-2xl border border-amber-100 shadow-2xs text-center relative overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500 -mt-3 -mx-3 mb-2.5" />
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-1 border border-amber-100">
              <Package className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Kardus</span>
            <span className="text-sm font-black text-slate-900 block mt-0.5">
              {ringkasan.totalBeratKardusKg}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">kg</span>
          </div>

          {/* Tersumbang */}
          <div className="bg-white p-3 rounded-2xl border border-teal-100 shadow-2xs text-center relative overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-emerald-500 -mt-3 -mx-3 mb-2.5" />
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-1 border border-teal-100">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Tersumbang</span>
            <span className="text-sm font-black text-teal-700 block mt-0.5">
              {ringkasan.totalPoinDisumbangkan}
            </span>
            <span className="text-[10px] text-teal-700 font-semibold">Poin</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-[11px] text-emerald-900 shadow-2xs">
          <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Total <strong>{ringkasan.totalBeratSampahKg} kg</strong> sampah telah dicegah dari TPA Surabaya untuk didaur ulang.
          </span>
        </div>
      </div>

      {/* ── 6. PROGRAM KEBAIKAN PILIHAN (MODERN SNAP CAROUSEL) ───────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Program Kebaikan Pilihan
            </h3>
            <p className="text-[11px] text-slate-500">
              Salurkan poin setoranmu untuk dampak sosial nyata
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 group"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Horizontal Snap Scroll Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x no-scrollbar -mx-4 px-4">
          {ringkasan.ringkasanPosSumbangan.map((pos) => (
            <div
              key={pos.id}
              className="w-[280px] flex-shrink-0 snap-start bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-400 shadow-xs transition-all space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                    {pos.kategori}
                  </span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {pos.persentaseTarget}%
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-emerald-800 transition-colors">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pos.lembagaPengelola}
                  </p>
                </div>

                {/* Progress Bar Hijau Gradasi Seimbang */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full transition-all duration-700"
                      style={{ width: `${pos.persentaseTarget}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Rp {pos.totalTerkumpulRupiah.toLocaleString('id-ID')}</span>
                    <span>Target: Rp {pos.targetDanaRupiah.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onPindahMenu('lacak')}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-700/20 active:scale-95"
              >
                <span>Salurkan Poin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. KEDAI KOPI MITRA TERDEKAT (MODERN DIRECTORY LIST) ─────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Kedai Kopi Mitra Terdekat
            </h3>
            <p className="text-[11px] text-slate-500">
              Lokasi setor sampah cup plastik dan kardus di Surabaya
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
            Surabaya
          </span>
        </div>

        <div className="space-y-2">
          {titikKumpulList.map((kedai) => (
            <div
              key={kedai.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-emerald-300 shadow-2xs transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100 shadow-2xs group-hover:scale-105 transition-transform">
                  <Coffee className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {kedai.namaKedai}
                    </h4>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                      {kedai.wilayah}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {kedai.alamat}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{kedai.jamBuka.split(',')[1] || kedai.jamBuka}</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{kedai.keterangan}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onPindahMenu('setor')}
                className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 active:scale-95 shadow-xs shadow-emerald-700/20 flex-shrink-0"
              >
                <span>Setor</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
