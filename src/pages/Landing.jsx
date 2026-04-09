/**
 * Landing.jsx — Halaman landing page StrukKu
 */

import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: '📸', title: 'Scan Struk', desc: 'OCR otomatis extract total & detail struk belanja' },
  { icon: '📊', title: 'Dashboard Cerdas', desc: 'Visualisasi pengeluaran dengan grafik interaktif' },
  { icon: '💰', title: 'Kelola Budget', desc: 'Set budget bulanan dan pantau sisa dengan real-time' },
  { icon: '🏆', title: 'Tantangan Hemat', desc: 'Kompetisi hemat dengan teman, raih badge seru' },
  { icon: '🤝', title: 'Split Bill', desc: 'Hitung dan bagikan tagihan ke teman lewat WhatsApp' },
  { icon: '🎙️', title: 'Input Suara', desc: 'Catat pengeluaran cukup dengan bicara' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f2a4a] via-[#185FA5] to-[#1D9E75] text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative px-6 pt-16 pb-12 text-center">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute top-20 right-0 w-48 h-48 bg-success/20 rounded-full translate-x-1/3 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10 mb-6">
          <div className="inline-flex w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-sm items-center justify-center text-5xl animate-bounce-in border border-white/20 shadow-2xl mb-4">
            🧾
          </div>
          <h1 className="text-5xl font-black tracking-tight">
            Struk<span className="text-green-300">Ku</span>
          </h1>
          <p className="text-white/70 text-sm mt-1 font-medium">strukku.vercel.app</p>
        </div>

        {/* Headline */}
        <p className="text-xl font-bold leading-snug mb-3 relative z-10">
          Kelola pengeluaran mahasiswa<br/>
          <span className="text-green-300">lebih cerdas & hemat</span> 🎓
        </p>
        <p className="text-white/60 text-sm max-w-xs mx-auto leading-relaxed mb-8 relative z-10">
          Scan struk, pantau budget, dan tantang dirimu hemat lebih banyak setiap bulan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto relative z-10">
          <button
            id="btn-mulai-sekarang"
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-white text-primary font-bold text-base rounded-2xl shadow-2xl hover:bg-gray-50 active:scale-95 transition-all duration-200"
          >
            🚀 Mulai Sekarang — Gratis!
          </button>
          <button
            id="btn-scan-struk"
            onClick={() => navigate('/scan')}
            className="w-full py-4 bg-white/15 text-white font-semibold text-base rounded-2xl border border-white/30 backdrop-blur hover:bg-white/20 active:scale-95 transition-all duration-200"
          >
            📸 Scan Struk Pertama
          </button>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="mx-4 mb-6">
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 grid grid-cols-3 gap-4">
          {[
            { num: '10K+', label: 'Pengguna' },
            { num: '99%', label: 'Akurasi OCR' },
            { num: '100%', label: 'Gratis' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-green-300">{num}</p>
              <p className="text-xs text-white/60 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 pb-6">
        <h2 className="text-lg font-bold text-center mb-4 text-white/90">Fitur Lengkap untuk Mahasiswa</h2>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-200">
              <span className="text-3xl block mb-2">{icon}</span>
              <h3 className="text-sm font-bold mb-1">{title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 pb-8">
        <h2 className="text-lg font-bold text-center mb-4 text-white/90">Cara Pakai</h2>
        <div className="flex flex-col gap-3">
          {[
            { step: '1', icon: '📸', text: 'Foto struk belanjaanmu' },
            { step: '2', icon: '🤖', text: 'AI extract total & tanggal otomatis' },
            { step: '3', icon: '📊', text: 'Lihat laporan & tips hematmu' },
          ].map(({ step, icon, text }) => (
            <div key={step} className="flex items-center gap-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-lg flex-shrink-0">
                {step}
              </div>
              <span className="text-2xl">{icon}</span>
              <p className="text-sm font-medium text-white/80">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-16 text-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full max-w-xs mx-auto block py-4 bg-green-400 text-green-900 font-black text-base rounded-2xl shadow-2xl hover:bg-green-300 active:scale-95 transition-all duration-200"
        >
          Mulai Hemat Sekarang! 🏆
        </button>
        <p className="text-white/30 text-[10px] mt-6 px-4 leading-relaxed font-medium">
          Dibuat oleh <span className="font-bold">Muhammad Firzy Islami Fathi</span><br/>
          Mahasiswa Universitas Telkom Surabaya Jurusan Bisnis Digital
        </p>
      </div>
    </div>
  );
}
