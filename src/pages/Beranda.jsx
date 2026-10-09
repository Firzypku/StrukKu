/**
 * Beranda.jsx — Halaman Beranda GREENWORTH Surabaya
 * Konsep: Modern Fintech & Eco-App 2026 (Clean, High-Contrast, Hijau-Putih Segar).
 * Fitur Tata Letak Modern:
 * 1. Top Greeting & User Profile Chip
 * 2. Fintech Super-Card (Saldo Poin, Estimasi Rupiah, Status Poin Tertunda, Quick Action Dock)
 * 3. 4 Pintasan Layanan Cepat (Setor Cup, Setor Kardus, Salurkan Poin, Cari Kedai)
 * 4. Modern Promo Story Card (Aplikatif, Bebas Jargon Kontekstual)
 * 5. Bento Grid Metrik Dampak Lingkungan
 * 6. Horizontal Snap Carousel Program Kebaikan Pilihan
 * 7. Direktori Kedai Kopi Mitra Terdekat
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
  Compass,
  Building2,
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
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            🌱 Mitra Aktif
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
            {akun.id}
          </span>
        </div>
      </div>

      {/* ── 2. FINTECH SUPER-CARD (HERO HIJAU SEGAR - EMERALD 600) ───────────── */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-lg shadow-emerald-900/10 relative overflow-hidden space-y-4">
        {/* Latar Belakang Geometris Halus */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-3 top-3 opacity-15 pointer-events-none">
          <Sparkles className="w-16 h-16 text-white" />
        </div>

        {/* Saldo Poin Display */}
        <div className="relative z-10 space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-100">
            <span className="font-medium">Saldo Poin Kebaikan</span>
            <span className="bg-white/15 px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-100 border border-white/20">
              1 Poin = Rp {NILAI_POIN}
            </span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-3xl font-black text-white tracking-tight">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-sm font-bold text-emerald-100 uppercase tracking-wide">
              Poin
            </span>
            <span className="text-xs font-bold text-white ml-auto bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Indikator Poin Tertunda */}
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

        {/* Action Dock: 2 Tombol Aksi Utama + QR Paspor */}
        <div className="relative z-10 grid grid-cols-12 gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="col-span-6 py-2.5 px-3 bg-white hover:bg-emerald-50 active:scale-98 text-emerald-800 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
            <span>Setor Sampah</span>
          </button>

          <button
            type="button"
            onClick={() => onPindahMenu('lacak')}
            className="col-span-4 py-2.5 px-2.5 bg-emerald-700/80 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl border border-white/30 transition-all flex items-center justify-center gap-1"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-100 stroke-[2.2]" />
            <span>Salurkan</span>
          </button>

          {onOpenQr && (
            <button
              type="button"
              onClick={onOpenQr}
              aria-label="Buka QR Paspor"
              title="QR Paspor Digital"
              className="col-span-2 py-2.5 bg-white/15 hover:bg-white/25 active:scale-98 text-white rounded-xl border border-white/25 transition-all flex items-center justify-center"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── 3. 4 MENU PINTASAN CEPAT (MODERN QUICK SHORTCUTS) ───────────────── */}
      <div className="grid grid-cols-4 gap-2 px-0.5">
        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-white hover:bg-emerald-50/60 active:scale-95 transition-all p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center text-center gap-1.5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shadow-2xs">
            <Coffee className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 leading-tight">
            Setor Cup
          </span>
        </button>

        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-white hover:bg-amber-50/60 active:scale-95 transition-all p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center text-center gap-1.5"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shadow-2xs">
            <Package className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 leading-tight">
            Setor Kardus
          </span>
        </button>

        <button
          type="button"
          onClick={() => onPindahMenu('lacak')}
          className="bg-white hover:bg-emerald-50/60 active:scale-95 transition-all p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center text-center gap-1.5"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center shadow-2xs">
            <HeartHandshake className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 leading-tight">
            Pos Wakaf
          </span>
        </button>

        <button
          type="button"
          onClick={() => onPindahMenu('setor')}
          className="bg-white hover:bg-emerald-50/60 active:scale-95 transition-all p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center text-center gap-1.5"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shadow-2xs">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 leading-tight">
            Peta Kedai
          </span>
        </button>
      </div>

      {/* ── 4. BANNER PROMO KEDAI KOPI (APLIKATIF, RAMAH & BERSIH) ───────────── */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-50/40 to-white rounded-2xl p-4 border border-emerald-200/80 shadow-xs space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
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

        <div className="flex items-center justify-between pt-2 border-t border-emerald-100/80 text-[11px]">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            Mudah • Nyata • Berkah
          </span>
          <button
            type="button"
            onClick={() => onPindahMenu('setor')}
            className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 group"
          >
            <span>Cari Kedai Terdekat</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── 5. BENTO METRIK DAMPAK LINGKUNGAN (BERSIH & SEIMBANG) ─────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Dampak Lingkunganmu
            </h3>
            <p className="text-[11px] text-slate-400">Penyelamatan sampah daur ulang</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            {ringkasan.totalTransaksiSetor} Transaksi Selesai
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Cup Plastik */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 text-center">
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
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 text-center">
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
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 text-center">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-1">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] text-slate-500 block font-medium">Tersumbang</span>
            <span className="text-sm font-black text-emerald-700 block mt-0.5">
              {ringkasan.totalPoinDisumbangkan}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Poin</span>
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-2 flex items-center gap-2 text-[11px] text-emerald-800">
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
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Snap Scroll Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x no-scrollbar -mx-4 px-4">
          {ringkasan.ringkasanPosSumbangan.map((pos) => (
            <div
              key={pos.id}
              className="w-[280px] flex-shrink-0 snap-start bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {pos.kategori}
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {pos.persentaseTarget}%
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pos.lembagaPengelola}
                  </p>
                </div>

                {/* Progress Bar Hijau */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${pos.persentaseTarget}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Rp {pos.totalTerkumpulRupiah.toLocaleString('id-ID')}</span>
                    <span>Target: Rp {pos.targetDanaRupiah.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onPindahMenu('lacak')}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 active:scale-95 border border-emerald-200"
              >
                <span>Salurkan Poin</span>
                <ArrowRight className="w-3 h-3" />
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
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            Surabaya
          </span>
        </div>

        <div className="space-y-2">
          {titikKumpulList.map((kedai) => (
            <div
              key={kedai.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100">
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
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 active:scale-95 shadow-2xs flex-shrink-0"
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
