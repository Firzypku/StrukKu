/**
 * Auth.jsx — Halaman Masuk / Daftar GREENWORTH Surabaya
 * Estetika Hijau Putih Seimbang & Clear (Vibe Design Standard):
 * Form onboarding fintech bersih, verifikasi OTP 6 digit transparan, dan kenyamanan visual maksimal.
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
    <div className="min-h-[80vh] flex flex-col justify-center py-6 px-1 animate-fade-in text-slate-900">
      {/* ── LOGO & BRANDING SEIMBANG ────────────────────────────────────────── */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#064E3B] mx-auto flex items-center justify-center shadow-md text-white mb-3">
          <Recycle className="w-7 h-7 stroke-[2.3]" />
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            GREENWORTH
          </h1>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
            Surabaya
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Turning Waste into Worth, Worth into Impact
        </p>
      </div>

      {/* ── KARTU FORMULIR ONBOARDING (PUTIH BERSIH) ────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Langkah {step} dari 3
          </span>
          <span className="text-xs text-[#064E3B] font-extrabold">
            {step === 1 && 'Nomor WhatsApp'}
            {step === 2 && 'Verifikasi OTP'}
            {step === 3 && 'Lengkapi Profil'}
          </span>
        </div>

        {errorPesan && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorPesan}</span>
          </div>
        )}

        {/* ── LANGKAH 1: INPUT NOMOR HP ────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={handleKirimOtp} className="space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Masuk atau Registrasi Anggota
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Masukkan nomor HP untuk menerima kode OTP demo 6 digit verifikasi instan.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setTelepon('0812-3456-7890')}
                className="text-left text-xs font-bold text-[#064E3B] hover:underline"
              >
                Gunakan Akun Demo Bawaan: 0812-3456-7890
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#064E3B] hover:bg-[#043E2E] active:scale-95 text-white font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
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
              <h2 className="text-sm font-black text-slate-900">
                Verifikasi Kode OTP
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Kode verifikasi telah dikirim ke nomor <strong className="text-slate-900">{telepon}</strong>.
              </p>
            </div>

            {/* Banner Simulasi OTP */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-center space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">
                Simulasi Kode OTP Demo
              </span>
              <div className="tracking-[0.35em] text-2xl font-black text-slate-900 font-mono py-1">
                {otpGenerated}
              </div>
              <button
                type="button"
                onClick={() => setOtpInput(otpGenerated)}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-black rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Salin & Isi Otomatis</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Masukkan 6 Digit OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="------"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-center text-xl font-mono font-black tracking-[0.25em] rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#064E3B] hover:bg-[#043E2E] active:scale-95 text-white font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>Verifikasi OTP</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={generateNewOtp}
                  className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
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
          <form onSubmit={handleSelesaiMasuk} className="space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Lengkapi Data Diri
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Nama diperlukan untuk sapaan dan akad tabarru' sedekah.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Rizky Pratama"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Alamat Email
                </label>
                <span className="text-[10px] text-slate-400 font-mono">(Opsional)</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#064E3B] placeholder-slate-400"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Wilayah Domisili Surabaya
              </label>
              <div className="relative">
                <select
                  value={wilayahDomisili}
                  onChange={(e) => setWilayahDomisili(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl pl-9 pr-7 py-3 focus:outline-none focus:ring-2 focus:ring-[#064E3B] appearance-none"
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
              className="w-full py-3.5 bg-[#064E3B] hover:bg-[#043E2E] active:scale-95 text-white font-black text-xs rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Selesai & Masuk ke Beranda</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        )}
      </div>

      <p className="text-center mt-5 text-[11px] text-slate-400 font-mono">
        Data tersimpan lokal untuk kebutuhan demonstrasi lomba.
      </p>
    </div>
  );
}
