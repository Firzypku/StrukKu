/**
 * Akun.jsx — Halaman Profil & Statistik Dampak GREENWORTH Surabaya
 * Bersih, modern, dan elegan (Hijau + Putih + Emas).
 * Menampilkan rincian akun Ahmad Rizky Pratama (GW-SBY-042),
 * akumulasi angka terhitung dari store, tombol reset demo, dan tombol keluar.
 */

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  RotateCcw,
  Award,
  Coffee,
  Package,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';

export default function Akun() {
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
    <div className="space-y-6 animate-fade-in">
      {/* ── NOTIFIKASI RESET SUKSES ────────────────────────────────────────── */}
      {pesanResetSukses && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-4 text-slate-800 shadow-md flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-black text-emerald-950">
              Data Demo Berhasil Direset!
            </h4>
            <p className="text-xs text-slate-600">
              Data akun, 5 setoran, dan 2 status sumbangan telah dipulihkan ke kondisi awal.
            </p>
          </div>
        </div>
      )}

      {/* ── KARTU PROFIL ANGGOTA (HIJAU ZAMRUD MEWAH) ───────────────────────── */}
      <div className="bg-gradient-to-br from-[#065F46] via-[#047857] to-[#064E3B] rounded-3xl p-6 text-white border border-emerald-400/20 shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md border-2 border-amber-300">
              {akun.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                  Anggota Aktif
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[11px] font-bold text-amber-300">
                  Surabaya
                </span>
              </div>
              <h2 className="text-lg font-black text-white leading-tight mt-0.5">
                {akun.nama}
              </h2>
              <span className="text-xs font-mono font-bold bg-emerald-950/60 text-amber-300 px-2 py-0.5 rounded-lg border border-emerald-400/30 inline-block mt-1">
                ID: {akun.id}
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
            className="text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-xs"
          >
            Edit
          </button>
        </div>

        {/* Informasi Kontak */}
        <div className="mt-4 pt-3.5 border-t border-emerald-500/30 grid grid-cols-1 gap-1.5 text-xs text-emerald-100">
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
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-5 text-slate-900 space-y-4 shadow-2xl animate-scale-up">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-base font-extrabold text-slate-900">Perbarui Profil Akun</h3>
              <p className="text-xs text-slate-500">Sesuaikan nama dan nomor kontak</p>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBukaEditModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black shadow-xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REKAP STATISTIK DAMPAK (KARTU PUTIH BERSIH) ──────────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Rekapitulasi Kebaikan
            </h3>
            <p className="text-xs text-slate-500">
              Dihitung otomatis dan transparan dari transaksi akun
            </p>
          </div>
          <Award className="w-5 h-5 text-amber-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Saldo Poin Aktif */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block font-medium">Saldo Poin Aktif</span>
            <span className="text-2xl font-black text-amber-700 block mt-1">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Total Poin Pernah Didapat */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block font-medium">Total Poin</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">
              {ringkasan.totalPoinPernahDidapat.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-slate-400">
              (Bonus {akun.bonusPendaftaranPoin} poin)
            </span>
          </div>

          {/* Total Poin Disumbangkan */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block font-medium">Disumbangkan</span>
            <span className="text-2xl font-black text-emerald-800 block mt-1">
              {ringkasan.totalPoinDisumbangkan.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              = Rp {ringkasan.totalRupiahDisumbangkan.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Frekuensi Transaksi */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block font-medium">Transaksi</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">
                {ringkasan.totalTransaksiSetor + ringkasan.totalTransaksiSumbang}
              </span>
              <span className="text-xs text-slate-500">kali</span>
            </div>
            <span className="text-[11px] text-slate-400">
              ({ringkasan.totalTransaksiSetor} setor, {ringkasan.totalTransaksiSumbang} sumbang)
            </span>
          </div>
        </div>

        {/* Rincian Berat Sampah yang Dipilah */}
        <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-emerald-900">
              Total Sampah Terkumpul
            </span>
            <span className="font-black text-sm text-emerald-950">
              {ringkasan.totalBeratSampahKg} kg
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-2xs">
              <Coffee className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">Cup Plastik</span>
                <span className="font-black text-slate-900">
                  {ringkasan.totalGelasPlastik} cup
                </span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-2xs">
              <Package className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">Kardus Boks</span>
                <span className="font-black text-slate-900">
                  {ringkasan.totalBeratKardusKg} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KONTROL RESET DATA DEMO ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-start gap-2.5">
          <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Pusat Kontrol Demo Juri
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
              Kembalikan seluruh saldo, 5 setoran, dan status sumbangan ke setelan pabrik proposal.
            </p>
          </div>
        </div>

        {!tampilkanKonfirmasiReset ? (
          <button
            type="button"
            onClick={() => setTampilkanKonfirmasiReset(true)}
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Reset ke Data Awal Demo</span>
          </button>
        ) : (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-3 animate-fade-in">
            <div className="flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>
                Yakin ingin mereset data? Riwayat baru yang baru saja diinputkan akan kembali ke data awal proposal.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTampilkanKonfirmasiReset(false)}
                className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-all"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── KELUAR DARI AKUN (LOGOUT) ───────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Sesi Masuk Akun
            </h3>
            <p className="text-xs text-slate-500">
              Keluar untuk mencoba kembali alur pendaftaran dan OTP demo
            </p>
          </div>
          <LogOut className="w-5 h-5 text-slate-400" />
        </div>

        {!tampilkanKonfirmasiLogout ? (
          <button
            type="button"
            onClick={() => setTampilkanKonfirmasiLogout(true)}
            className="w-full py-3 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>
        ) : (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-3 animate-fade-in">
            <div className="flex items-start gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>
                Apakah kamu yakin ingin keluar dari akun <strong>{akun.nama}</strong>?
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTampilkanKonfirmasiLogout(false)}
                className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setTampilkanKonfirmasiLogout(false);
                  logout();
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CATATAN KHUSUS KOMPETISI ────────────────────────────────────────── */}
      <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-emerald-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Informasi Prototipe Bisnis Syariah</span>
        </div>
        <p className="leading-relaxed">
          GREENWORTH Surabaya dirancang sebagai platform sirkular berbasis <em>fiqh muamalah</em> dan <em>maqashid syariah</em> (menjaga lingkungan/<em>hifzhul bi'ah</em> dan harta/<em>hifzhul mal</em>).
        </p>
        <p className="text-slate-400 text-[11px]">
          Semua nama kedai kopi dan yayasan pengelola adalah <strong>fiktif</strong> untuk peragaan lomba Business Plan.
        </p>
      </div>
    </div>
  );
}
