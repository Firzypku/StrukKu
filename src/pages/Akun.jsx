/**
 * Akun.jsx — Halaman Profil & Pengaturan GREENWORTH Surabaya
 * Estetika Hijau Putih Seimbang & Clear (Vibe Design Standard):
 * Profil elegan mobile banking, rekap metrik bersih, dan kontrol akun berkelas.
 */

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  RotateCcw,
  Coffee,
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';

export default function Akun({ onOpenQr }) {
  const { akun, ringkasan, resetKeDataAwal, perbaruiAkun, logout } = useGreenworth();

  const [tampilkanKonfirmasiReset, setTampilkanKonfirmasiReset] = useState(false);
  const [tampilkanKonfirmasiLogout, setTampilkanKonfirmasiLogout] = useState(false);
  const [pesanResetSukses, setPesanResetSukses] = useState(false);
  const [bukaEditModal, setBukaEditModal] = useState(false);
  const [namaEdit, setNamaEdit] = useState(akun.nama);
  const [teleponEdit, setTeleponEdit] = useState(akun.telepon);

  const handleReset = () => {
    resetKeDataAwal();
    setTampilkanKonfirmasiReset(false);
    setPesanResetSukses(true);
    setTimeout(() => setPesanResetSukses(false), 4000);
  };

  const handleSimpanProfil = (e) => {
    e.preventDefault();
    perbaruiAkun({
      nama: namaEdit,
      telepon: teleponEdit,
    });
    setBukaEditModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-3">
      {/* ── NOTIFIKASI RESET ──────────────────────────────────────────────── */}
      {pesanResetSukses && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 text-slate-900 text-xs flex items-center gap-2 shadow-2xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#064E3B] flex-shrink-0" />
          <span>Data demo berhasil dipulihkan ke pengaturan awal proposal.</span>
        </div>
      )}

      {/* ── KARTU PROFIL ANGGOTA (DEEP EMERALD SEIMBANG) ───────────────────── */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#043E2E] to-[#022C1B] rounded-3xl p-5 text-white shadow-md relative overflow-hidden space-y-3.5">
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-xs">
              {akun.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200">
                  Anggota Aktif
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-amber-300 font-bold">Surabaya</span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5 tracking-tight">
                {akun.nama}
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-200">
                {akun.id}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setNamaEdit(akun.nama);
              setTeleponEdit(akun.telepon);
              setBukaEditModal(true);
            }}
            className="text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-2xs"
          >
            Edit
          </button>
        </div>

        {/* Informasi Kontak Ringkas */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 gap-1.5 text-xs text-emerald-100 relative z-10">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>{akun.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>{akun.telepon}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>Domisili: {akun.wilayahDomisili}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>Bergabung: {akun.tanggalBergabung}</span>
          </div>
        </div>
      </div>

      {/* ── MODAL EDIT PROFIL ──────────────────────────────────────────────── */}
      {bukaEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-5 text-slate-900 space-y-4 shadow-xl animate-scale-up">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Perbarui Profil Akun</h3>
              <p className="text-[11px] text-slate-500">Sesuaikan nama dan nomor kontak demo</p>
            </div>

            <form onSubmit={handleSimpanProfil} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={namaEdit}
                  onChange={(e) => setNamaEdit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={teleponEdit}
                  onChange={(e) => setTeleponEdit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBukaEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#043E2E] text-white text-xs font-black shadow-xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REKAPITULASI STATISTIK DAMPAK (PUTIH BERSIH) ────────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
          Rekapitulasi Akun
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Saldo Aktif */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Saldo Poin Aktif</span>
            <span className="text-xl font-black text-amber-700 font-mono block mt-1">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Total Perolehan */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Perolehan</span>
            <span className="text-xl font-black text-slate-900 font-mono block mt-1">
              {ringkasan.totalPoinPernahDidapat.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              (Bonus {akun.bonusPendaftaranPoin} pt)
            </span>
          </div>

          {/* Poin Tersumbang */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Tersumbang</span>
            <span className="text-xl font-black text-[#064E3B] font-mono block mt-1">
              {ringkasan.totalPoinDisumbangkan.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-[#064E3B] font-bold font-mono">
              = Rp {ringkasan.totalRupiahDisumbangkan.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Transaksi */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Aktivitas</span>
            <div className="flex items-baseline gap-1 mt-1 font-mono">
              <span className="text-xl font-black text-slate-900">
                {ringkasan.totalTransaksiSetor + ringkasan.totalTransaksiSumbang}
              </span>
              <span className="text-xs text-slate-500">kali</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {ringkasan.totalTransaksiSetor} setor, {ringkasan.totalTransaksiSumbang} sumbang
            </span>
          </div>
        </div>

        {/* Sampah Terselamatkan */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">Sampah Terkumpul:</span>
            <span className="font-black text-slate-900 text-sm font-mono">{ringkasan.totalBeratSampahKg} kg total</span>
          </div>
          <div className="text-right text-[11px] text-slate-600 font-mono">
            <div>{ringkasan.totalGelasPlastik} Cup ({ringkasan.totalBeratPlastikKg} kg)</div>
            <div>{ringkasan.totalBeratKardusKg} kg Kardus</div>
          </div>
        </div>
      </div>

      {/* ── PUSAT KONTROL DEMO & KELUAR (PUTIH BERSIH) ───────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {/* Paspor QR Digital */}
        {onOpenQr && (
          <div className="p-4">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-900 hover:text-[#064E3B] transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4 text-[#064E3B]" />
                <span>Buka Paspor QR Digital (Mitra Kedai)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* Reset Demo */}
        <div className="p-4">
          {!tampilkanKonfirmasiReset ? (
            <button
              type="button"
              onClick={() => setTampilkanKonfirmasiReset(true)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset ke Data Awal Demo Juri</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ) : (
            <div className="space-y-2 text-xs">
              <p className="text-slate-600 text-[11px]">
                Pulihkan saldo, 5 setoran, dan status sumbangan ke data proposal awal?
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTampilkanKonfirmasiReset(false)}
                  className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black"
                >
                  Ya, Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keluar */}
        <div className="p-4">
          {!tampilkanKonfirmasiLogout ? (
            <button
              type="button"
              onClick={() => setTampilkanKonfirmasiLogout(true)}
              className="w-full flex items-center justify-between text-xs font-bold text-rose-600 hover:text-rose-700 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-300" />
            </button>
          ) : (
            <div className="space-y-2 text-xs">
              <p className="text-slate-600 text-[11px]">
                Keluar dari akun {akun.nama}? Anda dapat masuk kembali kapan saja.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTampilkanKonfirmasiLogout(false)}
                  className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTampilkanKonfirmasiLogout(false);
                    logout();
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Catatan Legal Singkat */}
      <div className="px-2 text-center">
        <p className="text-[11px] text-slate-400 font-mono">
          GREENWORTH Surabaya · Prototipe Syariah Business Plan Competition 2026.
        </p>
      </div>
    </div>
  );
}
