/**
 * App.jsx — Aplikasi Utama GREENWORTH Surabaya
 * Prototipe Mobile-First untuk Lampiran Proposal Syariah Business Plan Competition.
 * Menghubungkan alur Masuk/Daftar (OTP demo) dan 4 menu: Beranda, Setor, Lacak, Akun.
 * Dilengkapi deep parameter passing antar menu tanpa bug.
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
  const [navParams, setNavParams] = useState({});
  const [showQrModal, setShowQrModal] = useState(false);

  // Navigasi terpadu antar halaman dengan parameter dinamis
  const handlePindahMenu = (tab, params = {}) => {
    setNavParams(params);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans antialiased">
      {/* Container Mobile Terpusat (Max Width 448px) — Bersih, Seimbang & Elegan */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#F8FAFC] shadow-2xl relative border-x border-slate-200/80">
        {!isAuthenticated ? (
          /* Layar Masuk / Daftar dengan Verifikasi OTP Demo */
          <div className="flex-1 px-4 py-4 flex flex-col justify-between">
            <Auth onSuccess={() => handlePindahMenu('beranda')} />
            <Footer />
          </div>
        ) : (
          /* Aplikasi Utama Setelah Masuk */
          <>
            {/* Header Tetap di Atas dengan Tombol Buka QR Paspor */}
            <Header onOpenQr={() => setShowQrModal(true)} />

            {/* Konten Halaman Aktif dengan Ruang Bawah Aman untuk Navigasi */}
            <main className="flex-1 px-4 py-4 pb-28">
              {activeTab === 'beranda' && (
                <Beranda
                  onPindahMenu={handlePindahMenu}
                  onOpenQr={() => setShowQrModal(true)}
                />
              )}
              {activeTab === 'setor' && (
                <Setor
                  onPindahMenu={handlePindahMenu}
                  navParams={navParams}
                />
              )}
              {activeTab === 'lacak' && (
                <Lacak
                  onPindahMenu={handlePindahMenu}
                  navParams={navParams}
                />
              )}
              {activeTab === 'akun' && (
                <Akun
                  onPindahMenu={handlePindahMenu}
                  onOpenQr={() => setShowQrModal(true)}
                />
              )}

              {/* Footer Resmi Prototipe */}
              <Footer />
            </main>

            {/* Navigasi Bawah 4 Menu */}
            <BottomNav activeTab={activeTab} onTabChange={(tab) => handlePindahMenu(tab)} />

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
