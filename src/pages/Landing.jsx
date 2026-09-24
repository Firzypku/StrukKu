/**
 * Landing.jsx — Ultra-modern, European fintech SaaS design for StrukKu
 * Terinspirasi dari desain startup kelas dunia: palet deep cobalt blue,
 * obsidian navy cards, komposisi geometris 3D, dan tipografi presisi.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROBLEMS = [
  {
    num: '01',
    title: 'Uang Saku Ludes di Tengah Bulan',
    desc: 'Uang kiriman Rp1,5 juta kerap menguap di minggu ke-2 tanpa disadari karena tidak ada kontrol batas belanja harian yang terukur.',
    icon: '💸',
  },
  {
    num: '02',
    title: 'Patungan Makan Selalu Nombok',
    desc: 'Hitung split bill pesanan bareng teman kosan sering selisih karena pembagian porsi, biaya layanan, dan pajak yang rumit.',
    icon: '🍕',
  },
  {
    num: '03',
    title: 'Struk & Bukti QRIS Tercecer',
    desc: 'Bukti bayar hilang begitu saja, bikin panik saat akhir bulan harus menyusun laporan uang saku untuk Ayah & Ibu.',
    icon: '🧾',
  },
];

const CORE_SOLUTIONS = [
  {
    step: '01',
    title: 'Jatah Harian Aman (Safe Daily Limit)',
    desc: 'Algoritma cerdas yang membagi sisa saldo riil dengan sisa hari kiriman secara dinamis. Kamu tahu persis berapa maksimal yang boleh dibelanjakan hari ini agar tidak kekurangan di akhir bulan.',
    tag: 'Fitur Unggulan',
  },
  {
    step: '02',
    title: 'OCR Scanner Struk Fisik & QRIS On-Device',
    desc: 'Teknologi Tesseract OCR yang mengekstraksi nominal belanja murni tanpa salah baca uang kembalian atau diskon toko, dengan kompresi otomatis langsung ke database pribadi.',
    tag: 'Presisi Tinggi',
  },
  {
    step: '03',
    title: 'Split Bill Itemized Bebas Nombok',
    desc: 'Pilih siapa makan apa, bagi makanan patungan bersama secara proporsional, dan kirim rincian 100% transparan siap bayar ke grup WhatsApp dalam satu kali klik.',
    tag: 'Bebas Selisih',
  },
  {
    step: '04',
    title: 'Rekap Transparan untuk Orang Tua',
    desc: 'Hasilkan ringkasan keuangan profesional dengan 3 tingkat keterbukaan (ringkas, kategori, atau detail lengkap) plus ekspor spreadsheet Excel SheetJS tanpa perlu mengetik manual.',
    tag: 'Siap Ekspor',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Tentukan Saldo & Siklus Kiriman',
    desc: 'Masukkan uang saku awal dan tanggal kiriman rutin berikutnya untuk mengaktifkan perhitungan otomatis.',
  },
  {
    num: '02',
    title: 'Scan Struk atau Catat Cepat',
    desc: 'Foto struk belanja, unggah screenshot QRIS, atau catat manual dengan kategori pengeluaran terstandar.',
  },
  {
    num: '03',
    title: 'Cek Batas Belanja Harian',
    desc: 'Lihat jatah harian amanmu berubah dinamis setiap kali ada transaksi baru agar pengeluaran tetap terkontrol.',
  },
  {
    num: '04',
    title: 'Evaluasi & Menabung Lebih Banyak',
    desc: 'Ambil tantangan hemat mahasiswa, catat sisa uang saku, dan simpan tabungan untuk kebutuhan daruratmu.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Dimas Pratama',
    role: 'Mahasiswa Bisnis Digital · Telkom Univ',
    text: '“Fitur Jatah Harian beneran nyelametin dompet kosan saya. Dulu di minggu ketiga saldo tinggal Rp50.000, sekarang selalu sisa dan bisa ditabung.”',
    rating: '★★★★★',
  },
  {
    name: 'Nadhira Rahma',
    role: 'Mahasiswi Arsitektur · ITS Surabaya',
    text: '“Split bill per makanan terkeren yang pernah saya coba. Tinggal foto struk cafe, bagi per nama, kirim teks rapi ke WhatsApp. Gak pernah nombok lagi!”',
    rating: '★★★★★',
  },
  {
    name: 'Farhan Maulana',
    role: 'Mahasiswa Informatika · UB Malang',
    text: '“Laporan rekap ortunya sangat membantu pas mau minta transferan bulanan. Ayah & Ibu senang karena laporannya rapi dan bisa diekspor ke Excel.”',
    rating: '★★★★★',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden w-full">
      {/* Logged in notification banner */}
      {user && (
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-xs font-semibold py-2.5 px-4 text-center flex items-center justify-center gap-3">
          <span>👋 Halo <strong>{user?.user_metadata?.full_name || 'Mahasiswa'}</strong>! Akunmu sedang aktif.</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-3 py-1 bg-white text-blue-900 rounded-lg font-bold text-xs hover:bg-blue-50 active:scale-95 transition-all shadow-sm"
          >
            Buka Dashboard 🚀
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              🧾
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-950">
                Struk<span className="text-blue-600">Ku</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                Fintech Mahasiswa
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#solusi" className="hover:text-blue-600 transition-colors">
              Solusi Kami
            </a>
            <a href="#fitur" className="hover:text-blue-600 transition-colors">
              Fitur Lengkap
            </a>
            <a href="#alur" className="hover:text-blue-600 transition-colors">
              Alur Kerja
            </a>
            <a href="#testimoni" className="hover:text-blue-600 transition-colors">
              Pengalaman
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <span>🚀</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-600/20 transition-all"
                >
                  Mulai Gratis →
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION — Two-Column Precision SaaS Layout */}
      {/* ========================================================================= */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden border-b border-slate-200/60">
        {/* Subtle geometric background patterns */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>STUDENT FINANCIAL PRECISION</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] mb-5">
                Kelola Uang Saku Mahasiswa dengan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                  Presisi Finansial.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 mb-7">
                Bukan sekadar pencatat uang biasa. StrukKu menghitung otomatis{' '}
                <strong className="text-slate-900 font-semibold">Jatah Harian Aman</strong>,
                memindai struk fisik & QRIS tanpa selisih, split bill per makanan, dan rekap
                transparan untuk orang tua.
              </p>

              {/* Fast Action Container */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start max-w-md mx-auto lg:mx-0 mb-8">
                <button
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                  className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all duration-200 text-center"
                >
                  {user ? '🚀 Buka Dashboard Saya' : '🚀 Buat Akun Gratis Sekarang'}
                </button>
                <a
                  href="#fitur"
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all text-center"
                >
                  Lihat Fitur Inti ↓
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> 100% Gratis Tanpa Iklan
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> On-Device OCR Tesseract
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Supabase Cloud RLS
                </div>
              </div>
            </div>

            {/* Right Hero Visual Column (3D Geometric Composition) */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* 3D Geometric Card Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/15 border-4 border-white bg-slate-900 group">
                  <img
                    src="/images/hero-3d.jpg"
                    alt="Komposisi 3D Arsitektur StrukKu"
                    className="w-full h-[260px] sm:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Overlay Badges */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                        Siklus Aktif Kiriman
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Status Aman
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-slate-900">Rp42.500 / hari</span>
                      <span className="text-xs text-slate-500 font-medium">Sisa 14 hari lagi</span>
                    </div>
                  </div>
                </div>

                {/* Floating Micro Card Top Left */}
                <div className="hidden sm:flex absolute -top-4 -left-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-xl items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-black text-sm">
                    ✓
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">OCR Struk Cerdas</p>
                    <p className="text-[10px] text-slate-500">Mendeteksi total murni belanja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TANTANGAN MAHASISWA RANTAU (Problem Cards) */}
      {/* ========================================================================= */}
      <section id="solusi" className="py-16 sm:py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">
              Dilema Finansial Anak Kos
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Kenapa Mencatat Uang Secara Konvensional Selalu Gagal?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-normal">
              Aplikasi keuangan umum dibuat untuk pekerja kantoran berpenghasilan tetap, bukan untuk
              realitas hidup mahasiswa rantau dengan siklus kiriman orang tua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROBLEMS.map((item) => (
              <div
                key={item.num}
                className="bg-slate-50 hover:bg-white transition-all duration-300 rounded-3xl p-6 sm:p-8 border border-slate-200/80 hover:shadow-xl hover:border-blue-200 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl p-3 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                    {item.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE SIGNATURE OBSIDIAN NAVY CORE SOLUTIONS CONTAINER */}
      {/* (Inspired directly by the dark section of the user reference image) */}
      {/* ========================================================================= */}
      <section id="fitur" className="py-16 sm:py-24 bg-[#0A1128] text-white relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-3">
                <span>FITUR EKSKLUSIF STRUKKU</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Dirancang Khusus untuk Gaya Hidup & Kebutuhan Mahasiswa.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm font-normal">
              Empat pilar utama yang menyatukan kenyamanan visual modern dan ketepatan kalkulasi uang saku harian.
            </p>
          </div>

          {/* Solutions Row Container */}
          <div className="space-y-4">
            {CORE_SOLUTIONS.map((sol) => (
              <div
                key={sol.step}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 rounded-3xl p-5 sm:p-8 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5 sm:gap-6">
                    <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/20 px-2.5 py-1 rounded-xl flex-shrink-0">
                      {sol.step}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {sol.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {sol.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal max-w-2xl">
                        {sol.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(user ? '/dashboard' : '/register')}
                    className="w-full md:w-auto px-4 py-2.5 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-blue-600 rounded-xl transition-all whitespace-nowrap text-center"
                  >
                    Coba Fitur →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Blue Ribbon Banner — Direct Contact to Developer */}
          <div className="mt-10 sm:mt-12 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 sm:p-8 shadow-xl shadow-blue-900/40 border border-blue-400/30 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Pintu Terbuka untuk Ide & Masukan
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white mt-1">
                Ada kendala atau ingin fitur baru di StrukKu?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-lg">
                StrukKu dibuat independen untuk membantu sesama mahasiswa. Hubungi langsung pengembang via WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/6281251152940?text=Halo%20Firzy,%20saya%20pengguna%20StrukKu%20ingin%20berbagi%20masukan/tanya:"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-950 hover:bg-slate-100 active:scale-95 text-xs sm:text-sm font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap text-center"
            >
              <span>💬</span> Chat WA Firzy (081251152940)
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ALUR KERJA 4 LANGKAH DENGAN ABSTRACT ORB VISUAL */}
      {/* ========================================================================= */}
      <section id="alur" className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="/images/abstract-orb.jpg"
                  alt="Abstract 3D Orb Visual StrukKu"
                  className="w-full h-[260px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">
                    OTOMASI CERDAS
                  </span>
                  <p className="text-base font-bold mt-1">Presisi hingga rupiah terakhir.</p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Data dienkripsi dan hanya dapat diakses melalui akun pribadimu.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Text Column */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">
                CARA KERJA
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mb-8">
                Empat Langkah Sederhana untuk Menertibkan Keuangan Kos.
              </h2>

              <div className="space-y-6">
                {STEPS.map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 font-mono font-black text-sm flex items-center justify-center flex-shrink-0 border border-blue-200">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PROMO SHOWCASE / FINTECH BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-5 sm:p-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">
                PROGRESSIVE WEB APP (PWA)
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-4">
                Gunakan Langsung di Ponsel Tanpa Install Aplikasi Berat.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                StrukKu mendukung teknologi PWA standar industri. Cukup buka di Safari (iPhone) atau Chrome (Android), lalu pilih{' '}
                <strong className="text-slate-800">"Tambahkan ke Layar Utama"</strong>. Cepat, hemat memori, dan selalu update otomatis.
              </p>

              <div className="space-y-2.5 mb-8">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="text-emerald-500 font-bold">✓</span> Loading instan di bawah 1 detik
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="text-emerald-500 font-bold">✓</span> Mendukung offline cache dan sinkronisasi awan
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="text-emerald-500 font-bold">✓</span> Ukuran berkas kurang dari 1 megabyte
                </div>
              </div>

              <button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all text-center justify-center"
              >
                {user ? '🚀 Buka Dashboard Saya' : 'Pasang Sekarang di HP →'}
              </button>
            </div>

            <div className="lg:col-span-6 h-full min-h-[220px] sm:min-h-[300px] bg-slate-100 flex items-center justify-center p-4 sm:p-8">
              <img
                src="/images/fintech-banner.jpg"
                alt="Fintech Banner Showcase"
                className="w-full h-auto max-h-[360px] object-cover rounded-2xl shadow-lg border border-slate-200"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TESTIMONIALS / EXPERIENCES */}
      {/* ========================================================================= */}
      <section id="testimoni" className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">
              PENGALAMAN PENGGUNA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Dipercaya Teman-Teman Mahasiswa di Seluruh Indonesia.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="text-amber-500 text-sm mb-3">{t.rating}</div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    {t.text}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER CALL-TO-ACTION CARD */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#0A1128] text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl shadow-blue-500/20">
            🎓
          </div>
          <h2 className="text-2xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Kendalikan Finansial Kuliahmu Mulai Hari Ini.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-8 font-normal leading-relaxed">
            Bergabunglah dengan ekosistem StrukKu secara gratis. Tanpa kartu kredit, tanpa iklan pop-up mengganggu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto mb-12">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all text-center"
            >
              {user ? '🚀 Buka Dashboard Saya' : 'Daftar Sekarang (100% Gratis)'}
            </button>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all text-center"
            >
              {user ? 'Ke Beranda' : 'Masuk Akun'}
            </button>
          </div>

          {/* Footer Metadata */}
          <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-2">
            <p>
              Dikembangkan oleh <strong className="text-slate-300">Muhammad Firzy Islami Fathi</strong> · Mahasiswa S1 Bisnis Digital Universitas Telkom Surabaya.
            </p>
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} StrukKu. Hak cipta dilindungi. Mengutamakan privasi dan transparansi data mahasiswa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
