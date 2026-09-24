/**
 * Landing.jsx — Landing page modern, jujur & student-centric untuk StrukKu
 * Dibuat khusus menjawab kebutuhan nyata mahasiswa rantau Indonesia.
 */

import { useNavigate } from 'react-router-dom';

const VALUE_PROPS = [
  {
    icon: '🛡️',
    title: 'Jatah Harian Aman',
    desc: 'Hitung otomatis batas belanja per hari agar uang saku cukup sampai tanggal kiriman berikutnya tanpa panik di akhir bulan.',
    badge: 'Fitur Utama',
  },
  {
    icon: '🧾',
    title: 'Scan Struk & Bukti QRIS',
    desc: 'Tesseract OCR presisi yang cerdas: otomatis baca total belanja, abaikan uang kembalian dan nomor nota transaksi.',
    badge: 'Otomatis',
  },
  {
    icon: '🍕',
    title: 'Patungan Tanpa Nombok',
    desc: 'Split bill per makanan yang dipesan masing-masing, bagi piring bersama, dan kirim rincian 100% pas ke WhatsApp.',
    badge: 'Bebas Selisih',
  },
  {
    icon: '👨‍👩‍👦',
    title: 'Rekap Kiriman Ortu',
    desc: 'Buat laporan uang saku transparan satu klik untuk Ayah & Ibu dengan 3 pilihan keterbukaan (ringkas, kategori, atau detail).',
    badge: 'Satu Klik',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1E36] via-[#123E6B] to-[#0A2540] text-white overflow-hidden pb-12">
      {/* Decorative Glow Blobs */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* HERO SECTION */}
        <div className="relative z-10 px-5 pt-12 pb-8 text-center max-w-md mx-auto">
          {/* Student Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-6 shadow-sm">
            <span className="text-emerald-400">🎓</span>
            <span className="text-white/90">Aplikasi Keuangan Mahasiswa Rantau</span>
          </div>

          {/* Logo Brand */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-3xl shadow-xl shadow-primary/30">
              🧾
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Struk<span className="text-emerald-400">Ku</span>
            </h1>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white mb-3">
            Uang saku cukup sampai kiriman berikutnya.
          </h2>

          {/* Subheadline */}
          <p className="text-sm text-white/75 leading-relaxed max-w-sm mx-auto mb-8 font-normal">
            Scan struk fisik atau bukti QRIS, pantau jatah harian amanmu, dan patungan split bill tanpa drama nombok.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-gray-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-200"
            >
              🚀 Mulai Sekarang — Gratis!
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-200"
            >
              Sudah punya akun? Masuk →
            </button>
          </div>
        </div>
      </div>

      {/* 3 PILAR KEPERCAYAAN */}
      <div className="px-5 mb-8 max-w-md mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-1">
            <span className="text-xl block mb-1">🎓</span>
            <p className="text-[11px] font-bold text-white">100% Gratis</p>
            <p className="text-[9px] text-white/50 mt-0.5 leading-tight">Khusus mahasiswa</p>
          </div>
          <div className="p-1 border-x border-white/10">
            <span className="text-xl block mb-1">🔒</span>
            <p className="text-[11px] font-bold text-white">Data Aman</p>
            <p className="text-[9px] text-white/50 mt-0.5 leading-tight">Proteksi RLS Supabase</p>
          </div>
          <div className="p-1">
            <span className="text-xl block mb-1">📍</span>
            <p className="text-[11px] font-bold text-white">Telkom Univ</p>
            <p className="text-[9px] text-white/50 mt-0.5 leading-tight">Surabaya</p>
          </div>
        </div>
      </div>

      {/* 4 FITUR UTAMA MAHASISWA */}
      <div className="px-5 space-y-3 max-w-md mx-auto mb-10">
        <div className="text-center mb-4">
          <h3 className="text-base font-bold text-white">Fitur yang Memang Kamu Butuhkan</h3>
          <p className="text-xs text-white/60 mt-0.5">Bukan sekadar pencatat uang biasa</p>
        </div>

        {VALUE_PROPS.map(({ icon, title, desc, badge }) => (
          <div
            key={title}
            className="bg-white/5 hover:bg-white/10 transition-all border border-white/10 rounded-2xl p-4 flex items-start gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-white">{title}</h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  {badge}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-normal">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* BANTUAN WHATSAPP & PENGEMBANG */}
      <div className="px-5 max-w-md mx-auto text-center space-y-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center">
          <span className="text-3xl block mb-2">💬</span>
          <h4 className="font-bold text-sm text-white">Ada Masukan atau Kendala?</h4>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            StrukKu dikembangkan terbuka untuk mendengar masukan teman-teman mahasiswa.
          </p>
          <a
            href="https://wa.me/6281251152940?text=Halo%20Firzy,%20saya%20mau%20kasih%20masukan/tanya%20tentang%20StrukKu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-gray-950 font-bold text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow-md"
          >
            <span>📱</span> Hubungi Firzy (081251152940)
          </a>
        </div>

        {/* Footer Credit */}
        <div className="pt-2 text-white/40 text-[11px] leading-relaxed">
          <p>
            Dibuat oleh <strong className="text-white/70">Muhammad Firzy Islami Fathi</strong>
          </p>
          <p>Mahasiswa Universitas Telkom Surabaya · Bisnis Digital</p>
        </div>
      </div>
    </div>
  );
}
