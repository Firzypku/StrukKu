/**
 * Akun.jsx — Halaman Profil & Pengaturan GREENWORTH Surabaya
 * Tema: Hijau-Putih Segar & Bersih (Non-Gelap, Rapi, Seimbang & Terstruktur).
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
    <div className="space-y-4 animate-fade-in pb-4">
      {/* ── NOTIFIKASI RESET ──────────────────────────────────────────────── */}
      {pesanResetSukses && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-slate-800 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Data demo berhasil dipulihkan ke pengaturan awal proposal.</span>
        </div>
      )}

      {/* ── KARTU PROFIL ANGGOTA (EMERALD-JEWEL RADIANT GRADIENT) ─────────── */}
      <div className="bg-gradient-to-br from-[#059669] via-[#047857] to-[#0f766e] rounded-3xl p-5 text-white shadow-xl shadow-emerald-900/15 border border-emerald-400/25 space-y-3.5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-emerald-700 font-black text-xl flex items-center justify-center shadow-xs">
              {akun.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                  Anggota Aktif
                </span>
                <span className="w-1 h-1 rounded-full bg-emerald-200" />
                <span className="text-[10px] text-amber-200 font-semibold">Surabaya</span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                {akun.nama}
              </h2>
              <span className="text-[11px] font-mono font-semibold text-emerald-100">
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
            className="text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-xs"
          >
            Edit
          </button>
        </div>

        {/* Informasi Kontak Ringkas */}
        <div className="pt-2.5 border-t border-white/20 grid grid-cols-1 gap-1 text-[11px] text-emerald-100">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-amber-200 flex-shrink-0" />
            <span>{akun.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-amber-200 flex-shrink-0" />
            <span>{akun.telepon}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-200 flex-shrink-0" />
            <span>Domisili: {akun.wilayahDomisili}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-amber-200 flex-shrink-0" />
            <span>Bergabung: {akun.tanggalBergabung}</span>
          </div>
        </div>
      </div>

      {/* ── MODAL EDIT PROFIL ──────────────────────────────────────────────── */}
      {bukaEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-4 text-slate-900 space-y-3.5 shadow-xl animate-scale-up">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Perbarui Profil Akun</h3>
              <p className="text-[11px] text-slate-500">Sesuaikan nama dan nomor kontak demo</p>
            </div>

            <form onSubmit={handleSimpanProfil} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={namaEdit}
                  onChange={(e) => setNamaEdit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={teleponEdit}
                  onChange={(e) => setTeleponEdit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setBukaEditModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REKAPITULASI STATISTIK DAMPAK (GRID PUTIH BERSIH) ────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Rekapitulasi Akun
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Saldo Aktif */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium">Saldo Poin Aktif</span>
            <span className="text-xl font-black text-emerald-700 block mt-0.5">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-400">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Total Perolehan */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium">Total Perolehan</span>
            <span className="text-xl font-black text-slate-900 block mt-0.5">
              {ringkasan.totalPoinPernahDidapat.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-400">
              (Bonus {akun.bonusPendaftaranPoin} pt)
            </span>
          </div>

          {/* Poin Tersumbang */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium">Tersumbang</span>
            <span className="text-xl font-black text-emerald-700 block mt-0.5">
              {ringkasan.totalPoinDisumbangkan.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              = Rp {ringkasan.totalRupiahDisumbangkan.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Transaksi */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium">Aktivitas</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-slate-900">
                {ringkasan.totalTransaksiSetor + ringkasan.totalTransaksiSumbang}
              </span>
              <span className="text-xs text-slate-400">kali</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {ringkasan.totalTransaksiSetor} setor, {ringkasan.totalTransaksiSumbang} sumbang
            </span>
          </div>
        </div>

        {/* Sampah Terselamatkan */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">Sampah Terkumpul:</span>
            <span className="font-bold text-slate-800 text-sm">{ringkasan.totalBeratSampahKg} kg total</span>
          </div>
          <div className="text-right text-[11px] text-slate-500">
            <div>{ringkasan.totalGelasPlastik} Cup ({ringkasan.totalBeratPlastikKg} kg)</div>
            <div>{ringkasan.totalBeratKardusKg} kg Kardus</div>
          </div>
        </div>
      </div>

      {/* ── PUSAT KONTROL DEMO & KELUAR ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {/* Paspor QR Digital */}
        {onOpenQr && (
          <div className="p-3.5">
            <button
              type="button"
              onClick={onOpenQr}
              className="w-full flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Buka Paspor QR Digital (Mitra Kedai)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* Reset Demo */}
        <div className="p-3.5">
          {!tampilkanKonfirmasiReset ? (
            <button
              type="button"
              onClick={() => setTampilkanKonfirmasiReset(true)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 transition-all text-left"
            >
              <div className="flex items-center gap-2">
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
                  className="flex-1 py-1.5 bg-slate-100 rounded-lg font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-1.5 bg-rose-600 text-white rounded-lg font-bold"
                >
                  Ya, Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keluar */}
        <div className="p-3.5">
          {!tampilkanKonfirmasiLogout ? (
            <button
              type="button"
              onClick={() => setTampilkanKonfirmasiLogout(true)}
              className="w-full flex items-center justify-between text-xs font-bold text-rose-600 hover:text-rose-700 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
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
                  className="flex-1 py-1.5 bg-slate-100 rounded-lg font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTampilkanKonfirmasiLogout(false);
                    logout();
                  }}
                  className="flex-1 py-1.5 bg-rose-600 text-white rounded-lg font-bold"
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
        <p className="text-[11px] text-slate-400">
          GREENWORTH Surabaya · Prototipe Syariah Business Plan Competition 2026.
        </p>
      </div>
    </div>
  );
}
