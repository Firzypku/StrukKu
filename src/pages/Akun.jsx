/**
 * Akun.jsx — Halaman Profil & Statistik Dampak GREENWORTH Surabaya
 * Menampilkan rincian akun Ahmad Rizky Pratama (GW-SBY-042),
 * akumulasi angka terhitung dari store, serta tombol reset ke data demo awal.
 */

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  RotateCcw,
  Award,
  Coffee,
  Package,
  HeartHandshake,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

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
    <div className="space-y-6">
      {/* ── NOTIFIKASI RESET SUKSES ────────────────────────────────────────── */}
      {pesanResetSukses && (
        <div className="bg-emerald-900 border-2 border-amber-400 rounded-2xl p-4 text-white shadow-xl animate-fade-in flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-amber-300 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-black text-amber-300">
              Data Demo Berhasil Direset!
            </h4>
            <p className="text-xs text-emerald-100">
              Semua data akun, 5 setoran, dan 2 sumbangan telah dipulihkan ke kondisi awal kompetisi.
            </p>
          </div>
        </div>
      )}

      {/* ── KARTU PROFIL ANGGOTA ───────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#0b5337] rounded-3xl p-5 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-amber-300">
              {akun.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Anggota Tetap
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-amber-300">
                  Surabaya
                </span>
              </div>
              <h2 className="text-lg font-black text-white leading-tight mt-0.5">
                {akun.nama}
              </h2>
              <span className="text-xs font-mono font-bold bg-emerald-950/70 text-amber-300 px-2 py-0.5 rounded border border-emerald-400/30 inline-block mt-1">
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
            className="text-xs font-bold text-amber-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/40 px-3 py-1.5 rounded-xl transition-all active:scale-95"
          >
            Edit
          </button>
        </div>

        {/* Informasi Kontak */}
        <div className="mt-4 pt-3 border-t border-emerald-700/60 grid grid-cols-1 gap-1.5 text-xs text-emerald-100">
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
            <span>Bergabung sejak: {akun.tanggalBergabung}</span>
          </div>
        </div>
      </div>

      {/* ── MODAL EDIT PROFIL SEDERHANA ─────────────────────────────────────── */}
      {bukaEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#042614] border border-emerald-600 w-full max-w-sm rounded-3xl p-5 text-white space-y-4 animate-scale-up">
            <div className="border-b border-emerald-800 pb-2">
              <h3 className="text-base font-black">Perbarui Profil Akun</h3>
              <p className="text-xs text-emerald-300">Sesuaikan nama dan nomor kontak</p>
            </div>

            <form onSubmit={handleSimpanProfil} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={namaEdit}
                  onChange={(e) => setNamaEdit(e.target.value)}
                  className="w-full bg-[#05371a] border border-emerald-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={teleponEdit}
                  onChange={(e) => setTeleponEdit(e.target.value)}
                  className="w-full bg-[#05371a] border border-emerald-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBukaEditModal(false)}
                  className="flex-1 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-emerald-200 hover:bg-emerald-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black hover:from-amber-300"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REKAP STATISTIK DAMPAK (TERHITUNG OTOMATIS) ──────────────────────── */}
      <div className="bg-[#042614] rounded-3xl p-5 border border-emerald-800/80 shadow-md space-y-4">
        <div className="border-b border-emerald-900/80 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">
              Rekapitulasi Kebaikan & Lingkungan
            </h3>
            <p className="text-xs text-emerald-300">
              Dihitung otomatis dan transparan dari transaksi akun
            </p>
          </div>
          <Award className="w-5 h-5 text-amber-300" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Saldo Poin Aktif */}
          <div className="bg-[#05371a] p-3.5 rounded-2xl border border-emerald-700/60">
            <span className="text-xs text-emerald-300 block font-medium">Saldo Poin Aktif</span>
            <span className="text-2xl font-black text-amber-300 block mt-1">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-emerald-400/90 font-medium">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Total Poin Pernah Didapat */}
          <div className="bg-[#05371a] p-3.5 rounded-2xl border border-emerald-700/60">
            <span className="text-xs text-emerald-300 block font-medium">Total Perolehan Poin</span>
            <span className="text-2xl font-black text-white block mt-1">
              {ringkasan.totalPoinPernahDidapat.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-emerald-300/80">
              (Termasuk bonus {akun.bonusPendaftaranPoin} poin)
            </span>
          </div>

          {/* Total Poin Disumbangkan */}
          <div className="bg-[#05371a] p-3.5 rounded-2xl border border-emerald-700/60">
            <span className="text-xs text-emerald-300 block font-medium">Poin Disumbangkan</span>
            <span className="text-2xl font-black text-amber-300 block mt-1">
              {ringkasan.totalPoinDisumbangkan.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-emerald-200 font-medium">
              = Rp {ringkasan.totalRupiahDisumbangkan.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Frekuensi Transaksi */}
          <div className="bg-[#05371a] p-3.5 rounded-2xl border border-emerald-700/60">
            <span className="text-xs text-emerald-300 block font-medium">Total Transaksi</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">
                {ringkasan.totalTransaksiSetor + ringkasan.totalTransaksiSumbang}
              </span>
              <span className="text-xs text-emerald-300">kali</span>
            </div>
            <span className="text-xs text-emerald-400/80">
              ({ringkasan.totalTransaksiSetor} setor, {ringkasan.totalTransaksiSumbang} sumbang)
            </span>
          </div>
        </div>

        {/* Rincian Berat Sampah yang Dipilah */}
        <div className="bg-[#052E16] rounded-2xl p-4 border border-emerald-700/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            <span className="font-bold uppercase tracking-wider text-amber-300">
              Total Sampah Terselamatkan
            </span>
            <span className="font-extrabold text-sm text-white">
              {ringkasan.totalBeratSampahKg} kg
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#05371a] p-2.5 rounded-xl border border-emerald-800 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-emerald-300 block">Cup Plastik</span>
                <span className="font-black text-white">
                  {ringkasan.totalGelasPlastik} cup ({ringkasan.totalBeratPlastikKg} kg)
                </span>
              </div>
            </div>

            <div className="bg-[#05371a] p-2.5 rounded-xl border border-emerald-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-emerald-300 block">Kardus Boks</span>
                <span className="font-black text-white">
                  {ringkasan.totalBeratKardusKg} kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PUSAT KONTROL DEMO & RESET DATA ─────────────────────────────────── */}
      <div className="bg-[#042614] rounded-3xl p-5 border border-emerald-800/80 shadow-md space-y-3">
        <div className="flex items-start gap-2.5">
          <RotateCcw className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-black text-white">
              Pusat Kontrol Demo Juri
            </h3>
            <p className="text-xs text-emerald-300 leading-relaxed mt-0.5">
              Untuk kebutuhan presentasi kompetisi, Anda dapat mengembalikan seluruh saldo, 5 setoran, dan 2 status sumbangan ke setelan pabrik demo.
            </p>
          </div>
        </div>

        {!tampilkanKonfirmasiReset ? (
          <button
            type="button"
            onClick={() => setTampilkanKonfirmasiReset(true)}
            className="w-full py-3 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-amber-300 font-extrabold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset ke Data Awal Demo</span>
          </button>
        ) : (
          <div className="bg-rose-950/60 border border-rose-600/60 p-4 rounded-2xl space-y-3">
            <div className="flex items-start gap-2 text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>
                Yakin ingin mereset data? Riwayat baru yang baru saja diinputkan selama pengujian akan kembali ke data awal proposal.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTampilkanKonfirmasiReset(false)}
                className="flex-1 py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition-all"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── KELUAR DARI AKUN (LOGOUT) ───────────────────────────────────────── */}
      <div className="bg-[#042614] rounded-3xl p-5 border border-emerald-800/80 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">
              Sesi Masuk Akun
            </h3>
            <p className="text-xs text-emerald-300">
              Keluar untuk mencoba kembali alur pendaftaran dan verifikasi OTP demo
            </p>
          </div>
          <LogOut className="w-5 h-5 text-amber-300" />
        </div>

        {!tampilkanKonfirmasiLogout ? (
          <button
            type="button"
            onClick={() => setTampilkanKonfirmasiLogout(true)}
            className="w-full py-3 bg-[#05371a] hover:bg-emerald-900 border border-emerald-700 text-rose-300 hover:text-rose-200 font-extrabold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>
        ) : (
          <div className="bg-rose-950/60 border border-rose-600/60 p-4 rounded-2xl space-y-3 animate-fade-in">
            <div className="flex items-start gap-2 text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>
                Apakah kamu yakin ingin keluar dari akun <strong>{akun.nama}</strong>? Kamu dapat masuk kembali menggunakan nomor HP dan verifikasi OTP.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTampilkanKonfirmasiLogout(false)}
                className="flex-1 py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setTampilkanKonfirmasiLogout(false);
                  logout();
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Keluar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── CATATAN KHUSUS KOMPETISI ────────────────────────────────────────── */}
      <div className="bg-[#052E16] rounded-3xl p-4 border border-emerald-700/60 space-y-2 text-xs text-emerald-200">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Informasi Prototipe Bisnis Syariah</span>
        </div>
        <p className="leading-relaxed">
          GREENWORTH Surabaya dirancang sebagai platform sirkular berbasis <em>fiqh muamalah</em> dan <em>maqashid syariah</em> (menjaga lingkungan/<em>hifzhul bi'ah</em> dan harta/<em>hifzhul mal</em>).
        </p>
        <p className="text-emerald-400/80">
          Semua nama kedai kopi dan yayasan pengelola adalah <strong>fiktif</strong> untuk peragaan lomba Business Plan.
        </p>
      </div>
    </div>
  );
}
