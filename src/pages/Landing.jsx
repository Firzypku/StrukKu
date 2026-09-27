/**
 * Landing.jsx — Landing page StrukKu yang jujur dan ringkas.
 * Struktur: Hero → 3 Manfaat → Cara Kerja 3 Langkah → FAQ → CTA
 * Target: < 4000px tinggi di mobile 375px
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

/* ─── DATA STATIS ─────────────────────────────────────────────────────────── */

const BENEFITS = [
  {
    icon: '💰',
    title: 'Jatah Harian Aman',
    desc: 'Otomatis membagi sisa uangmu dengan sisa hari kiriman. Kamu tahu batas belanja hari ini tanpa hitung manual.',
  },
  {
    icon: '🧾',
    title: 'Scan Struk & QRIS',
    desc: 'Foto struk belanja langsung di HP-mu. Data diproses di perangkat, strukmu tidak dikirim ke server mana pun.',
  },
  {
    icon: '🍕',
    title: 'Split Bill per Item',
    desc: 'Pilih siapa makan apa, bagi proporsional termasuk pajak. Kirim rincian ke WhatsApp dalam satu klik.',
  },
];

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Masukkan Saldo & Tanggal Kiriman',
    desc: 'Beri tahu sisa uangmu sekarang dan kapan kiriman berikutnya tiba.',
  },
  {
    num: '02',
    title: 'Catat Pengeluaran',
    desc: 'Foto struk, screenshot QRIS, atau ketik manual. StrukKu mengenali nominal otomatis.',
  },
  {
    num: '03',
    title: 'Pantau Jatah Harian',
    desc: 'Lihat batas belanja harianmu berubah dinamis setiap kali ada pengeluaran baru.',
  },
];

const FAQS = [
  {
    q: 'Apakah StrukKu benar-benar gratis?',
    a: 'Ya. StrukKu adalah proyek mahasiswa dan sepenuhnya gratis tanpa iklan maupun biaya tersembunyi.',
  },
  {
    q: 'Apakah data keuanganku aman?',
    a: 'Data disimpan di database cloud terenkripsi dan hanya bisa diakses oleh akun pribadimu. Gambar struk diproses langsung di HP-mu dan tidak diunggah ke server.',
  },
  {
    q: 'Bagaimana cara memasang StrukKu di HP?',
    a: 'Buka strukku.vercel.app di Chrome (Android) atau Safari (iPhone), lalu pilih "Tambahkan ke Layar Utama". Tidak perlu unduh dari app store.',
  },
  {
    q: 'Apakah hasil scan struk selalu akurat?',
    a: 'Hasil scan adalah perkiraan otomatis. Kami sarankan untuk selalu mengecek dan mengedit jika ada perbedaan. Kamu bisa koreksi nominal kapan saja.',
  },
  {
    q: 'Siapa yang membuat StrukKu?',
    a: 'StrukKu dibuat oleh Muhammad Firzy Islami Fathi, mahasiswa S1 Bisnis Digital Universitas Telkom Surabaya, sebagai proyek untuk membantu sesama mahasiswa mengelola keuangan.',
  },
];

/* ─── KOMPONEN TESTIMONI DARI DATABASE ────────────────────────────────────── */

function ApprovedTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('id, name, role, text, rating')
          .eq('approved', true)
          .eq('consent', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (!error && data && data.length > 0) {
          setTestimonials(data);
        }
      } catch {
        // Tabel belum ada atau kosong — tidak apa-apa
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center mb-8">
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">
            PENGALAMAN NYATA
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Dari Pengguna Asli StrukKu
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Testimoni dari mahasiswa yang sudah menggunakan StrukKu dan mengizinkan ceritanya ditampilkan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="text-amber-500 text-sm mb-2">{'★'.repeat(t.rating || 5)}</div>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-4">"{t.text}"</p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                {t.role && <p className="text-[11px] text-slate-500 mt-0.5">{t.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── KOMPONEN UTAMA ──────────────────────────────────────────────────────── */

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden w-full">
      {/* Logged in notification banner */}
      {user && (
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-xs font-semibold py-2.5 px-4 text-center flex items-center justify-center gap-3">
          <span>👋 Halo <strong>{user?.user_metadata?.full_name || 'Mahasiswa'}</strong>!</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-3 py-1 bg-white text-blue-900 rounded-lg font-bold text-xs hover:bg-blue-50 active:scale-95 transition-all shadow-sm"
          >
            Buka Dashboard 🚀
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* NAVIGATION BAR                                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              🧾
            </div>
            <span className="text-lg font-black tracking-tight text-slate-950">
              Struk<span className="text-blue-600">Ku</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#manfaat" className="hover:text-blue-600 transition-colors">Manfaat</a>
            <a href="#cara-kerja" className="hover:text-blue-600 transition-colors">Cara Kerja</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md transition-all"
              >
                Dashboard 🚀
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md transition-all"
                >
                  Daftar Gratis →
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 overflow-hidden border-b border-slate-200/60">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>KEUANGAN MAHASISWA</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15] mb-4">
                Uang Saku Cukup Sampai{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                  Kiriman Berikutnya.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-6">
                StrukKu menghitung otomatis batas belanja harianmu berdasarkan sisa uang dan sisa hari.
                Scan struk, split bill patungan, dan kirim rekap ke orang tua.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center lg:justify-start max-w-md mx-auto lg:mx-0 mb-6">
                <button
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 transition-all text-center"
                >
                  {user ? '🚀 Buka Dashboard' : '🚀 Daftar Gratis'}
                </button>
                <a
                  href="#manfaat"
                  className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-2xl shadow-sm transition-all text-center"
                >
                  Pelajari Fitur ↓
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-200/70">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> 100% Gratis
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Struk diproses di HP-mu
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span> Data pribadimu terlindungi
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="lg:col-span-5 relative mt-2 lg:mt-0">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/15 border-4 border-white bg-slate-900 group">
                  <img
                    src="/images/hero-3d.jpg"
                    alt="Tampilan StrukKu"
                    className="w-full h-[220px] sm:h-[360px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/60">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        Jatah Harian Aman
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        Contoh
                      </span>
                    </div>
                    <span className="text-base font-black text-slate-900">Rp42.500 / hari</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* 3 MANFAAT UTAMA                                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="manfaat" className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Tiga Hal yang StrukKu Bantu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Dirancang khusus untuk mahasiswa rantau dengan siklus kiriman orang tua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BENEFITS.map((item) => (
              <div
                key={item.title}
                className="bg-slate-50 hover:bg-white transition-all rounded-2xl p-5 border border-slate-200/80 hover:shadow-lg hover:border-blue-200 group"
              >
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CARA KERJA 3 LANGKAH                                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="cara-kerja" className="py-12 sm:py-16 bg-[#0A1128] text-white relative overflow-hidden border-b border-slate-200/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold mb-3">
              CARA KERJA
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Mulai dalam 3 Langkah Sederhana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.num}
                className="bg-white/[0.05] border border-white/10 hover:border-blue-500/30 rounded-2xl p-5 transition-all"
              >
                <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/20 px-2.5 py-1 rounded-xl inline-block mb-3">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONI ASLI (dari database, hanya muncul jika ada data)           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <ApprovedTestimonials />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PENGGUNA AWAL — GANTI TESTIMONI PALSU                                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-3xl block mb-3">🌱</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2">
            Jadilah Pengguna Awal StrukKu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
            StrukKu masih dalam tahap awal pengembangan. Masukanmu sangat berarti
            untuk membuat aplikasi ini lebih baik bagi sesama mahasiswa.
          </p>
          <button
            onClick={() => navigate(user ? '/profile' : '/register')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all"
          >
            {user ? '📝 Kirim Masukan di Profil' : '🚀 Daftar & Bantu Kembangkan StrukKu'}
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* FAQ                                                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Pertanyaan Umum
            </h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3"
                >
                  <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                  <span className={`text-slate-400 text-sm transition-transform duration-200 flex-shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {activeFaq === i && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CTA AKHIR + FOOTER                                                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-[#0A1128] text-white relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl shadow-blue-500/20">
            🎓
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mb-3">
            Kelola Keuangan Kuliahmu Mulai Hari Ini
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Gratis sepenuhnya. Tanpa kartu kredit, tanpa iklan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto mb-10">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all text-center"
            >
              {user ? '🚀 Buka Dashboard' : 'Daftar Gratis Sekarang'}
            </button>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-2xl border border-white/20 transition-all text-center"
            >
              {user ? 'Ke Beranda' : 'Masuk Akun'}
            </button>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 space-y-3">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/kebijakan-privasi" className="hover:text-slate-300 transition-colors underline underline-offset-2">
                Kebijakan Privasi
              </Link>
              <Link to="/syarat-ketentuan" className="hover:text-slate-300 transition-colors underline underline-offset-2">
                Syarat & Ketentuan
              </Link>
            </div>
            <p>
              Dikembangkan oleh <strong className="text-slate-300">Muhammad Firzy Islami Fathi</strong> · Mahasiswa S1 Bisnis Digital Universitas Telkom Surabaya.
            </p>
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} StrukKu. Mengutamakan kejujuran, privasi, dan transparansi data mahasiswa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
