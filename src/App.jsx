/**
 * App.jsx — Aplikasi Utama GREENWORTH Surabaya
 * Prototipe Mobile-First untuk Lampiran Proposal Syariah Business Plan Competition.
 * Menghubungkan alur Masuk/Daftar (OTP demo) dan 4 menu: Beranda, Setor, Lacak, Akun.
 * Semua data bersumber dari GreenworthContext (terpusat & dinamis).
 */

import { useState } from 'react';
import { GreenworthProvider, useGreenworth } from './context/GreenworthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Beranda from './pages/Beranda';
import Setor from './pages/Setor';
import Lacak from './pages/Lacak';
import Akun from './pages/Akun';
import Auth from './pages/Auth';

import QrPasporModal from './components/QrPasporModal';

function GreenworthApp() {
  const { isAuthenticated } = useGreenworth();
  const [activeTab, setActiveTab] = useState('beranda');
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#02140b] text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans antialiased">
      {/* Container Mobile Terpusat (Max Width 448px) dengan border glass elegan */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#031d10] shadow-2xl relative border-x border-emerald-900/60 overflow-hidden">
        {/* Ambient Backlight Glow (Vibe Design Lighting) */}
        <div className="absolute top-0 right-[-10%] w-72 h-72 bg-amber-400/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-96 left-[-15%] w-80 h-80 bg-emerald-500/[0.09] rounded-full blur-3xl pointer-events-none" />

        {!isAuthenticated ? (
          /* Layar Masuk / Daftar dengan Verifikasi OTP Demo */
          <div className="flex-1 px-4 py-4 flex flex-col justify-between relative z-10">
            <Auth onSuccess={() => setActiveTab('beranda')} />
            <Footer />
          </div>
        ) : (
          /* Aplikasi Utama Setelah Masuk */
          <>
            {/* Header Tetap di Atas dengan Tombol Buka QR Paspor */}
            <Header onOpenQr={() => setShowQrModal(true)} />

            {/* Konten Halaman Aktif dengan Ruang Bawah Aman untuk Navigasi */}
            <main className="flex-1 px-4 py-4 pb-28 relative z-10">
              {activeTab === 'beranda' && (
                <Beranda
                  onPindahMenu={setActiveTab}
                  onOpenQr={() => setShowQrModal(true)}
                />
              )}
              {activeTab === 'setor' && <Setor onPindahMenu={setActiveTab} />}
              {activeTab === 'lacak' && <Lacak onPindahMenu={setActiveTab} />}
              {activeTab === 'akun' && (
                <Akun onOpenQr={() => setShowQrModal(true)} />
              )}

              {/* Footer Resmi Prototipe */}
              <Footer />
            </main>

            {/* Navigasi Bawah 4 Menu */}
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Modal Paspor QR Digital Publik */}
            <QrPasporModal
              isOpen={showQrModal}
              onClose={() => setShowQrModal(false)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GreenworthProvider>
      <GreenworthApp />
    </GreenworthProvider>
  );
}

