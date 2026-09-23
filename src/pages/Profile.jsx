import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { formatRupiah } from '../utils/prediction';
import { supabase } from '../utils/supabase';

export default function Profile() {
  const { user, logout } = useAuth();
  const { selectedMonthName, selectedYear, stats, resetSelectedMonth } = useExpenses();
  const navigate = useNavigate();

  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Edit Name State
  const initialName = user?.user_metadata?.full_name || '';
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [currentDisplayName, setCurrentDisplayName] = useState(
    initialName || user?.email?.split('@')[0] || 'Mahasiswa'
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setIsSavingName(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });
      if (error) throw error;
      setCurrentDisplayName(trimmed);
      setIsEditingName(false);
      alert('Nama akun berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui nama: ' + err.message);
    } finally {
      setIsSavingName(false);
    }
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

  const avatarInitial = currentDisplayName ? currentDisplayName.charAt(0).toUpperCase() : 'M';

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Header Profil */}
      <div className="bg-gradient-to-br from-primary to-primary-dark pt-12 pb-8 rounded-b-[2rem] px-6 text-white shadow-lg">
        <h1 className="text-xl font-bold mb-4">Profil Akun</h1>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-black border-2 border-white/40 shadow-inner flex-shrink-0">
            {avatarInitial}
          </div>
          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Nama lengkap..."
                  className="bg-white/20 text-white placeholder-white/60 text-xs px-2.5 py-1.5 rounded-lg border border-white/30 focus:outline-none w-full"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSavingName}
                  className="bg-white text-primary text-xs px-2.5 py-1.5 rounded-lg font-bold hover:bg-white/90"
                >
                  {isSavingName ? '...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="text-white/70 text-xs px-1"
                >
                  ✕
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-lg truncate">{currentDisplayName}</p>
                <button
                  onClick={() => {
                    setNameInput(currentDisplayName);
                    setIsEditingName(true);
                  }}
                  className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md font-semibold"
                  title="Ubah nama"
                >
                  ✏️
                </button>
              </div>
            )}
            <p className="text-white/75 text-xs truncate mt-0.5">{user?.email || 'mahasiswa@kampus.id'}</p>
            <span className="inline-block text-[10px] bg-white/15 px-2 py-0.5 rounded-full mt-1.5 font-bold">
              🎓 Mahasiswa StrukKu
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-4">
        {/* Ringkasan Akun & Status */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Ringkasan Bulan Aktif</h2>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-xs text-gray-600 font-medium">Bulan</span>
            <span className="text-xs font-bold text-gray-800">{selectedMonthName} {selectedYear}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-xs text-gray-600 font-medium">Pengeluaran</span>
            <span className="text-xs font-bold text-primary">{formatRupiah(stats.thisMonthTotal)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-gray-600 font-medium">Transaksi</span>
            <span className="text-xs font-bold text-gray-800">{stats.thisMonthCount} transaksi</span>
          </div>
        </div>

        {/* Akses Cepat Menu Fitur Mahasiswa */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-2">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Fitur Finansial</h2>

          <button
            onClick={() => navigate('/budget')}
            className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>🎯</span>
              Siklus Uang Saku & Jatah Harian
            </span>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>📊</span>
              Riwayat Kalender & Ekspor Excel
            </span>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => navigate('/social')}
            className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>🍕</span>
              Patungan & Split Bill (Satu Scan)
            </span>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => navigate('/hemat')}
            className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>💡</span>
              Tantangan Hemat & Resep Masak
            </span>
            <span className="text-gray-400">→</span>
          </button>
        </div>

        {/* Manajemen Data & Reset */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-2">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Kelola Database</h2>

          <button
            onClick={() => setShowResetModal(true)}
            disabled={stats.thisMonthCount === 0}
            className={`w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between font-bold text-xs transition-colors border ${
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

        {/* Keamanan & Logout */}
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
          <p className="font-bold text-primary text-sm mb-0.5">StrukKu App</p>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            Dibuat untuk Mahasiswa Indonesia oleh <span className="font-semibold text-gray-600">Muhammad Firzy Islami Fathi</span><br/>
            Universitas Telkom Surabaya — Bisnis Digital
          </p>
          <p className="text-gray-400 text-[10px] mt-2 font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">v1.3.0</p>
        </div>
      </div>

      {/* Modal Konfirmasi Reset */}
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
