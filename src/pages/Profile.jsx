import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { formatRupiah } from '../utils/prediction';

export default function Profile() {
  const { user, logout } = useAuth();
  const { selectedMonthName, selectedYear, stats, resetSelectedMonth } = useExpenses();
  const navigate = useNavigate();

  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetSelectedMonth();
      setShowResetModal(false);
      alert(`Pengeluaran bulan ${selectedMonthName} ${selectedYear} berhasil direset!`);
    } catch (e) {
      alert('Gagal mereset: ' + e.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      <div className="bg-gradient-to-br from-primary to-primary-dark pt-12 pb-8 rounded-b-[2rem] px-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/40 shadow-inner">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.email || 'Pengguna'}</p>
            <p className="text-white/70 text-sm">Member StrukKu</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {/* Ringkasan Akun & Status */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Status Pengeluaran</h2>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-xs text-gray-600 font-medium">Bulan Aktif</span>
            <span className="text-xs font-bold text-gray-800">{selectedMonthName} {selectedYear}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-xs text-gray-600 font-medium">Pengeluaran Bulan Ini</span>
            <span className="text-xs font-bold text-primary">{formatRupiah(stats.thisMonthTotal)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-gray-600 font-medium">Jumlah Transaksi</span>
            <span className="text-xs font-bold text-gray-800">{stats.thisMonthCount} transaksi</span>
          </div>
        </div>

        {/* Manajemen Data */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-2">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Manajemen Data</h2>
          
          <button
            onClick={() => navigate('/history')}
            className="w-full text-left py-3 px-4 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>📅</span>
              Jelajahi Riwayat Bulan Kebelakang
            </span>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            disabled={stats.thisMonthCount === 0}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center justify-between font-bold text-xs transition-colors border ${
              stats.thisMonthCount > 0
                ? 'text-amber-700 bg-amber-50/70 border-amber-100 hover:bg-amber-100 active:scale-95'
                : 'text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span>🔄</span>
              Reset Pengeluaran {selectedMonthName}
            </span>
            <span className="text-amber-600">⚠️</span>
          </button>
        </div>

        {/* Pengaturan Akun */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Keamanan</h2>
          <button 
            onClick={handleLogout} 
            className="w-full text-left py-3.5 px-4 rounded-xl flex items-center justify-between text-danger font-bold bg-danger/5 hover:bg-danger/10 transition-colors border border-danger/10 active:scale-95 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span className="text-base">🚪</span>
              Keluar Akun (Logout)
            </span>
            <span>→</span>
          </button>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center px-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-2">🧾</div>
          <p className="font-bold text-primary text-sm mb-1">StrukKu App</p>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            Dibuat oleh <span className="font-semibold text-gray-500">Muhammad Firzy Islami Fathi</span><br/>
            Mahasiswa Universitas Telkom Surabaya Jurusan Bisnis Digital
          </p>
          <p className="text-gray-400 text-[10px] mt-2 font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">v1.2.0 (Multi-Month)</p>
        </div>
      </div>

      {/* Modal Konfirmasi Reset di Profil */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-red-100 text-center animate-bounce-in">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-500 mx-auto flex items-center justify-center text-2xl mb-3 shadow-inner">
              ⚠️
            </div>

            <h3 className="font-black text-gray-800 text-base">
              Reset Bulan {selectedMonthName} {selectedYear}?
            </h3>
            
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Hapus seluruh <strong>{stats.thisMonthCount} transaksi</strong> bulan {selectedMonthName} senilai{' '}
              <strong className="text-red-500">{formatRupiah(stats.thisMonthTotal)}</strong>. Saldo bulan ini akan kembali menjadi Rp 0.
            </p>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20"
              >
                {isResetting ? 'Mereset...' : 'Ya, Reset Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
