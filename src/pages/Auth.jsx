/**
 * Auth.jsx — Halaman Masuk / Daftar GREENWORTH Surabaya
 * Tema: Hijau-Putih Segar & Bersih (Non-Gelap, Rapi, Seimbang & Terstruktur).
 */

import { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  User,
  Mail,
  MapPin,
  KeyRound,
  AlertCircle,
  Recycle,
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

    generateNewOtp();
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
    <div className="min-h-[80vh] flex flex-col justify-center py-6 px-1 animate-fade-in text-slate-900">
      {/* ── LOGO & BRANDING SEGAR ───────────────────────────────────────────── */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 mx-auto flex items-center justify-center shadow-md shadow-emerald-700/20 text-white mb-3">
          <Recycle className="w-7 h-7 stroke-[2.2]" />
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <h1 className="text-lg font-black tracking-tight text-slate-900">
            GREENWORTH
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            Surabaya
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Turning Waste into Worth, Worth into Impact
        </p>
      </div>

      {/* ── KARTU FORMULIR ONBOARDING ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Langkah {step} dari 3
          </span>
          <span className="text-xs text-emerald-700 font-bold">
            {step === 1 && 'Nomor Telepon'}
            {step === 2 && 'Verifikasi OTP'}
            {step === 3 && 'Lengkapi Profil'}
          </span>
        </div>

        {errorPesan && (
          <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorPesan}</span>
          </div>
        )}

        {/* ── LANGKAH 1: INPUT NOMOR HP ────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleKirimOtp} className="space-y-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Masuk atau Daftar Akun
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan nomor HP untuk menerima kode OTP demo 6 digit.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-150 text-xs">
              <button
                type="button"
                onClick={() => setTelepon('0812-3456-7890')}
                className="text-left text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                Gunakan Akun Demo Bawaan: 0812-3456-7890
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Kirim Kode OTP (6 Digit)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* ── LANGKAH 2: VERIFIKASI OTP 6 DIGIT ────────────────────────────── */}
        {step === 2 && (
          <form onSubmit={handleVerifikasiOtp} className="space-y-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Verifikasi Kode OTP
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kode verifikasi telah dikirim ke nomor <strong>{telepon}</strong>.
              </p>
            </div>

            {/* Banner Simulasi OTP */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Simulasi Kode OTP Demo
              </span>
              <div className="tracking-[0.3em] text-xl font-black text-slate-900 font-mono py-1">
                {otpGenerated}
              </div>
              <button
                type="button"
                onClick={() => setOtpInput(otpGenerated)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-lg transition-all inline-flex items-center gap-1 shadow-2xs"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Salin & Isi Otomatis</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Masukkan 6 Digit OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="------"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-center text-lg font-mono font-black tracking-[0.25em] rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verifikasi OTP</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={generateNewOtp}
                  className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Kirim Ulang</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  Ganti Nomor
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── LANGKAH 3: LENGKAPI NAMA & EMAIL ─────────────────────────────── */}
        {step === 3 && (
          <form onSubmit={handleSelesaiMasuk} className="space-y-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Lengkapi Data Diri
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nama diperlukan untuk sapaan dan akad tabarru' sedekah.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Rizky Pratama"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Alamat Email
                </label>
                <span className="text-[10px] text-slate-400">(Opsional)</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-slate-400"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Wilayah Domisili Surabaya
              </label>
              <div className="relative">
                <select
                  value={wilayahDomisili}
                  onChange={(e) => setWilayahDomisili(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl pl-9 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 appearance-none"
                >
                  <option value="Surabaya Timur">Surabaya Timur (Gubeng, Rungkut, Sukolilo)</option>
                  <option value="Surabaya Pusat">Surabaya Pusat (Tunjungan, Tegalsari, Genteng)</option>
                  <option value="Surabaya Selatan">Surabaya Selatan (Wonokromo, Gayungan, Sawahan)</option>
                  <option value="Surabaya Barat">Surabaya Barat (Sambikerep, Lakarsantri)</option>
                  <option value="Surabaya Utara">Surabaya Utara (Kenjeran, Pabean Cantian)</option>
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Selesai & Masuk ke Beranda</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      <p className="text-center mt-5 text-[11px] text-slate-400">
        Data tersimpan lokal untuk kebutuhan demonstrasi lomba.
      </p>
    </div>
  );
}
