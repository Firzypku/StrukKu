/**
 * Auth.jsx — Halaman Masuk / Daftar GREENWORTH Surabaya
 * Vibe Design Framework & Cyber-Emerald Dark Luxury:
 * Form onboarding fintech kelas atas, verifikasi OTP 6 digit transparan, dan tampilan super memikat.
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
  Sparkles,
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
    <div className="min-h-[80vh] flex flex-col justify-center py-6 px-1 animate-fade-in text-white">
      {/* ── LOGO & BRANDING CAT-EYE ─────────────────────────────────────────── */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/80 text-white mb-3 ring-2 ring-emerald-300/30">
          <Recycle className="w-7 h-7 stroke-[2.4]" />
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <h1 className="text-xl font-black tracking-tight text-white">
            GREENWORTH
          </h1>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
            Surabaya
          </span>
        </div>
        <p className="text-xs text-emerald-200/80 font-medium mt-1">
          Turning Waste into Worth, Worth into Impact
        </p>
      </div>

      {/* ── KARTU FORMULIR ONBOARDING (DARK LUXURY GLASS) ───────────────────── */}
      <div className="bg-[#042416]/95 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/25 shadow-2xl space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
            Langkah {step} dari 3
          </span>
          <span className="text-xs text-amber-300 font-extrabold">
            {step === 1 && 'Nomor WhatsApp'}
            {step === 2 && 'Verifikasi OTP'}
            {step === 3 && 'Lengkapi Profil'}
          </span>
        </div>

        {errorPesan && (
          <div className="bg-rose-950/80 border border-rose-500/50 p-3 rounded-2xl text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorPesan}</span>
          </div>
        )}

        {/* ── LANGKAH 1: INPUT NOMOR HP ────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleKirimOtp} className="space-y-4">
            <div>
              <h2 className="text-sm font-black text-white">
                Masuk atau Registrasi Anggota
              </h2>
              <p className="text-xs text-emerald-200/75 mt-0.5 leading-relaxed">
                Masukkan nomor HP untuk menerima kode OTP demo 6 digit verifikasi instan.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-[#02180e] border border-emerald-500/30 text-white text-sm font-bold rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
                <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="bg-[#02180e] rounded-xl p-3 border border-emerald-500/25 text-xs">
              <button
                type="button"
                onClick={() => setTelepon('0812-3456-7890')}
                className="text-left text-xs font-bold text-amber-300 hover:text-amber-200 underline"
              >
                Gunakan Akun Demo Bawaan: 0812-3456-7890
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 border border-amber-200"
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
              <h2 className="text-sm font-black text-white">
                Verifikasi Kode OTP
              </h2>
              <p className="text-xs text-emerald-200/75 mt-0.5 leading-relaxed">
                Kode verifikasi telah dikirim ke nomor <strong className="text-white">{telepon}</strong>.
              </p>
            </div>

            {/* Banner Simulasi OTP */}
            <div className="bg-emerald-950/80 border border-amber-400/50 rounded-2xl p-4 text-center space-y-1.5 shadow-md">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                Simulasi Kode OTP Demo
              </span>
              <div className="tracking-[0.35em] text-2xl font-black text-amber-300 font-mono py-1 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]">
                {otpGenerated}
              </div>
              <button
                type="button"
                onClick={() => setOtpInput(otpGenerated)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-105 active:scale-95 text-slate-950 text-xs font-black rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md shadow-amber-500/25"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Salin & Isi Otomatis</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Masukkan 6 Digit OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="------"
                  className="w-full bg-[#02180e] border border-emerald-500/30 text-amber-300 text-center text-xl font-mono font-black tracking-[0.25em] rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
                  required
                />
                <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 border border-amber-200"
              >
                <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>Verifikasi OTP</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={generateNewOtp}
                  className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Kirim Ulang</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-emerald-400 hover:text-white"
                >
                  Ganti Nomor
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── LANGKAH 3: LENGKAPI NAMA & EMAIL ─────────────────────────────── */}
        {step === 3 && (
          <form onSubmit={handleSelesaiMasuk} className="space-y-4">
            <div>
              <h2 className="text-sm font-black text-white">
                Lengkapi Data Diri
              </h2>
              <p className="text-xs text-emerald-200/75 mt-0.5 leading-relaxed">
                Nama diperlukan untuk sapaan dan akad tabarru' sedekah.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Nama Lengkap <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Rizky Pratama"
                  className="w-full bg-[#02180e] border border-emerald-500/30 text-white text-xs font-bold rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
                <User className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                  Alamat Email
                </label>
                <span className="text-[10px] text-emerald-400/80 font-mono">(Opsional)</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-[#02180e] border border-emerald-500/30 text-white text-xs rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-emerald-700"
                />
                <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                Wilayah Domisili Surabaya
              </label>
              <div className="relative">
                <select
                  value={wilayahDomisili}
                  onChange={(e) => setWilayahDomisili(e.target.value)}
                  className="w-full bg-[#02180e] border border-emerald-500/30 text-white text-xs font-bold rounded-xl pl-9 pr-7 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none"
                >
                  <option value="Surabaya Timur" className="bg-[#02180e]">Surabaya Timur (Gubeng, Rungkut, Sukolilo)</option>
                  <option value="Surabaya Pusat" className="bg-[#02180e]">Surabaya Pusat (Tunjungan, Tegalsari, Genteng)</option>
                  <option value="Surabaya Selatan" className="bg-[#02180e]">Surabaya Selatan (Wonokromo, Gayungan, Sawahan)</option>
                  <option value="Surabaya Barat" className="bg-[#02180e]">Surabaya Barat (Sambikerep, Lakarsantri)</option>
                  <option value="Surabaya Utara" className="bg-[#02180e]">Surabaya Utara (Kenjeran, Pabean Cantian)</option>
                </select>
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 border border-amber-200"
            >
              <span>Selesai & Masuk ke Beranda</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}
      </div>

      <p className="text-center mt-5 text-[11px] text-emerald-300/60 font-mono">
        Data tersimpan lokal untuk kebutuhan demonstrasi lomba.
      </p>
    </div>
  );
}
