/**
 * Auth.jsx — Halaman Masuk / Daftar GREENWORTH Surabaya
 * 1. Input nomor HP.
 * 2. Verifikasi OTP 6-digit (disimulasikan dengan menampilkan kode di layar secara jelas).
 * 3. Isi Nama (wajib) & Email (opsional).
 * 4. Menyimpan sesi ke localStorage dan masuk ke Beranda.
 */

import { useState, useEffect } from 'react';
import {
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  User,
  Mail,
  MapPin,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';

export default function Auth({ onSuccess }) {
  const { akun, login } = useGreenworth();

  // Langkah auth: 1 = Input HP, 2 = Input OTP, 3 = Lengkapi Nama & Email
  const [step, setStep] = useState(1);

  // Form states
  const [telepon, setTelepon] = useState(akun?.telepon || '0812-3456-7890');
  const [otpGenerated, setOtpGenerated] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [nama, setNama] = useState(akun?.nama || 'Ahmad Rizky Pratama');
  const [email, setEmail] = useState(akun?.email || 'rizky.surabaya@gmail.com');
  const [wilayahDomisili, setWilayahDomisili] = useState(akun?.wilayahDomisili || 'Surabaya Timur');
  const [errorPesan, setErrorPesan] = useState('');

  // Buat kode OTP acak 6 digit saat masuk ke langkah 2
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpGenerated(code);
    setOtpInput('');
    setErrorPesan('');
    return code;
  };

  // 1. Submit Nomor HP
  const handleKirimOtp = (e) => {
    e.preventDefault();
    setErrorPesan('');

    const cleanHp = telepon.replace(/[^0-9]/g, '');
    if (cleanHp.length < 9) {
      setErrorPesan('Nomor HP tidak valid. Masukkan minimal 9-13 digit angka.');
      return;
    }

    const kode = generateNewOtp();
    setStep(2);
  };

  // 2. Submit Verifikasi OTP
  const handleVerifikasiOtp = (e) => {
    e.preventDefault();
    setErrorPesan('');

    if (otpInput.trim() !== otpGenerated) {
      setErrorPesan('Kode OTP yang dimasukkan tidak cocok dengan kode simulasi.');
      return;
    }

    // Jika nomor yang dimasukkan adalah akun demo bawaan, nama sudah default terisi
    setStep(3);
  };

  // 3. Submit Profil & Masuk
  const handleSelesaiMasuk = (e) => {
    e.preventDefault();
    setErrorPesan('');

    if (!nama.trim() || nama.trim().length < 2) {
      setErrorPesan('Nama lengkap wajib diisi (minimal 2 karakter).');
      return;
    }

    // Simpan akun dan sesi ke store & localStorage
    login({
      nama: nama.trim(),
      email: email.trim(),
      telepon: telepon.trim(),
      wilayahDomisili,
    });

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-6 px-1 animate-fade-in">
      {/* ── LOGO & IDENTITAS BRANDING ────────────────────────────────────────── */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 mx-auto flex items-center justify-center text-3xl shadow-xl border-2 border-emerald-400 shadow-emerald-950/60 mb-3">
          🌱
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <h1 className="text-xl font-black tracking-tight text-white">
            GREENWORTH
          </h1>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-600/40 px-2 py-0.5 rounded-md">
            Surabaya
          </span>
        </div>
        <p className="text-xs text-emerald-300 font-medium mt-1">
          Turning Waste into Worth, Worth into Impact
        </p>
      </div>

      {/* ── KARTU FORMULIR ALUR MASUK / DAFTAR ──────────────────────────────── */}
      <div className="bg-[#042614] rounded-3xl p-5 border border-emerald-800/80 shadow-2xl space-y-5">
        {/* Indikator Langkah */}
        <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Langkah {step} dari 3</span>
          </span>
          <span className="text-xs text-emerald-300 font-medium">
            {step === 1 && 'Nomor Telepon'}
            {step === 2 && 'Verifikasi OTP'}
            {step === 3 && 'Lengkapi Profil'}
          </span>
        </div>

        {errorPesan && (
          <div className="bg-rose-950/80 border border-rose-600/60 p-3 rounded-2xl text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorPesan}</span>
          </div>
        )}

        {/* ── LANGKAH 1: INPUT NOMOR HP ────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleKirimOtp} className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Masuk atau Daftar Akun
              </h2>
              <p className="text-xs text-emerald-300 mt-0.5">
                Masukkan nomor HP aktif untuk menerima 6 digit kode OTP simulasi.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-[#05371a] border border-emerald-700 text-white text-base font-semibold rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
                <Phone className="w-5 h-5 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Tombol Cepat Demo */}
            <div className="bg-[#05371a]/70 rounded-2xl p-3 border border-emerald-800/60 text-xs text-emerald-200">
              <span className="font-semibold text-amber-300 block mb-1">
                Akses Cepat Pengujian Juri:
              </span>
              <button
                type="button"
                onClick={() => setTelepon('0812-3456-7890')}
                className="text-left text-xs font-bold text-white hover:text-amber-300 underline underline-offset-2"
              >
                Gunakan Akun Demo Bawaan: 0812-3456-7890
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Kirim Kode OTP (6 Digit)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}

        {/* ── LANGKAH 2: VERIFIKASI OTP 6 DIGIT ────────────────────────────── */}
        {step === 2 && (
          <form onSubmit={handleVerifikasiOtp} className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Verifikasi Kode OTP
              </h2>
              <p className="text-xs text-emerald-300 mt-0.5">
                Kode verifikasi telah dikirim ke nomor <strong>{telepon}</strong>.
              </p>
            </div>

            {/* BANNER SIMULASI KODE OTP DEMO (SESUAI PERMINTAAN PROMPT) */}
            <div className="bg-gradient-to-br from-amber-500/20 via-emerald-950 to-emerald-900 border-2 border-amber-400 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                Simulasi Demo OTP
              </span>
              <div className="my-2 py-1 tracking-[0.35em] text-2xl font-black text-white font-mono bg-emerald-950/80 rounded-xl border border-amber-400/40 inline-block px-5 shadow-inner">
                {otpGenerated}
              </div>
              <p className="text-xs text-emerald-200">
                Gunakan kode di atas untuk memverifikasi akun secara instan.
              </p>
              <button
                type="button"
                onClick={() => setOtpInput(otpGenerated)}
                className="mt-2.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-black rounded-xl transition-all inline-flex items-center gap-1 shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Salin & Isi Otomatis</span>
              </button>
            </div>

            {/* Input Manual Kode OTP */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200">
                Masukkan 6 Digit Kode OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="------"
                  className="w-full bg-[#05371a] border border-emerald-700 text-white text-center text-xl font-mono font-black tracking-[0.3em] rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
                <KeyRound className="w-4 h-4 text-amber-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Tombol Verifikasi & Kirim Ulang */}
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                <span>Verifikasi OTP</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={generateNewOtp}
                  className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Kirim Ulang Kode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-emerald-300 hover:text-emerald-100 font-semibold"
                >
                  Ganti Nomor HP
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── LANGKAH 3: LENGKAPI NAMA & EMAIL OPSIONAL ────────────────────── */}
        {step === 3 && (
          <form onSubmit={handleSelesaiMasuk} className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-white">
                Lengkapi Data Diri
              </h2>
              <p className="text-xs text-emerald-300 mt-0.5">
                Nama diperlukan untuk sapaan di Beranda dan pencatatan akad tabarru' sedekah.
              </p>
            </div>

            {/* Nama Lengkap (Wajib) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-emerald-200">
                Nama Lengkap <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Rizky Pratama"
                  className="w-full bg-[#05371a] border border-emerald-700 text-white text-sm font-semibold rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
                <User className="w-5 h-5 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Email (Opsional Sesuai Ketentuan Prompt) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-200">
                  Alamat Email
                </label>
                <span className="text-[11px] font-semibold text-emerald-400">
                  (Opsional)
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com (opsional)"
                  className="w-full bg-[#05371a] border border-emerald-700 text-white text-sm rounded-2xl pl-11 pr-4 py-3 placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <Mail className="w-5 h-5 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Wilayah Surabaya */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-emerald-200">
                Wilayah Domisili Surabaya
              </label>
              <div className="relative">
                <select
                  value={wilayahDomisili}
                  onChange={(e) => setWilayahDomisili(e.target.value)}
                  className="w-full bg-[#05371a] border border-emerald-700 text-white text-sm font-semibold rounded-2xl pl-11 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none"
                >
                  <option value="Surabaya Timur">Surabaya Timur (Gubeng, Rungkut, Sukolilo)</option>
                  <option value="Surabaya Pusat">Surabaya Pusat (Tunjungan, Tegalsari, Genteng)</option>
                  <option value="Surabaya Selatan">Surabaya Selatan (Wonokromo, Gayungan, Sawahan)</option>
                  <option value="Surabaya Barat">Surabaya Barat (Sambikerep, Lakarsantri)</option>
                  <option value="Surabaya Utara">Surabaya Utara (Kenjeran, Pabean Cantian)</option>
                </select>
                <MapPin className="w-5 h-5 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Selesai & Masuk ke Beranda</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}
      </div>

      {/* Catatan Privasi & Syariah */}
      <div className="text-center mt-6 text-xs text-emerald-400/80">
        <p>🔒 Data tersimpan lokal di perangkat untuk kebutuhan demonstrasi kompetisi.</p>
        <p className="mt-1">Prototipe Syariah Business Plan Competition 2026</p>
      </div>
    </div>
  );
}
