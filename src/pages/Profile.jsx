import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { useNavigate, Link } from 'react-router-dom';
import { formatRupiah } from '../utils/prediction';
import { supabase } from '../utils/supabase';
import { useToast } from '../context/ToastContext';
import { uploadAvatarToStorage } from '../utils/imageProcess';
import { FeedbackModal } from '../components/FeedbackForm';
import PaywallModal from '../components/PaywallModal';

// Icon Chevron rapi untuk navigasi mobile modern
function ChevronIcon({ className = 'text-gray-400' }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 transition-transform ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { selectedMonthName, selectedYear, stats, resetSelectedMonth } = useExpenses();
  const navigate = useNavigate();
  const toast = useToast();

  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Edit Name State
  const initialName = user?.user_metadata?.full_name || '';
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [currentDisplayName, setCurrentDisplayName] = useState(
    initialName || user?.email?.split('@')[0] || 'Mahasiswa'
  );

  // Avatar Photo State
  const fileInputRef = useRef(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || (user?.id ? localStorage.getItem(`user_avatar_${user.id}`) : null)
  );

  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Harap pilih file gambar (JPG/PNG/WEBP).');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const uploadedUrl = await uploadAvatarToStorage(file, user?.id);
      if (!uploadedUrl) {
        throw new Error('Gagal memproses foto profil.');
      }

      setAvatarUrl(uploadedUrl);
      if (user?.id) {
        localStorage.setItem(`user_avatar_${user.id}`, uploadedUrl);
      }

      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: uploadedUrl },
      });
      if (error) throw error;

      toast.success('Foto profil berhasil dipasang! 📸');
    } catch (err) {
      toast.error('Gagal memperbarui foto: ' + err.message);
    } finally {
      setIsUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!avatarUrl) return;
    setIsUploadingPhoto(true);
    try {
      setAvatarUrl(null);
      if (user?.id) {
        localStorage.removeItem(`user_avatar_${user.id}`);
      }
      await supabase.auth.updateUser({
        data: { avatar_url: null },
      });
      toast.success('Foto profil dihapus.');
    } catch (err) {
      toast.error('Gagal menghapus foto: ' + err.message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

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
      toast.success('Nama akun berhasil diperbarui!');
    } catch (err) {
      toast.error('Gagal memperbarui nama: ' + err.message);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await resetSelectedMonth();
      setShowResetModal(false);
      toast.success(`Pengeluaran bulan ${selectedMonthName} ${selectedYear} berhasil direset!`);
    } catch (e) {
      toast.error('Gagal mereset: ' + e.message);
    } finally {
      setIsResetting(false);
    }
  };

  const avatarInitial = currentDisplayName ? currentDisplayName.charAt(0).toUpperCase() : 'M';

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Hidden File Input for Avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileSelect}
        className="hidden"
      />

      {/* Header Profil */}
      <div className="bg-gradient-to-br from-[#0B1E36] via-[#123E6B] to-[#1E40AF] pt-12 pb-8 rounded-b-[2.5rem] px-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-400/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-xl font-black mb-4 tracking-tight">Profil Akun</h1>
          <div className="flex items-center gap-4">
          {/* Avatar with Camera Overlay */}
          <div className="relative group flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-md bg-white/20 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentDisplayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-white">{avatarInitial}</span>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white rounded-full flex items-center justify-center text-xs shadow-md border border-white"
              title="Ganti Foto Profil"
            >
              {isUploadingPhoto ? '⏳' : '📷'}
            </button>
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
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-block text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-bold">
                🎓 Mahasiswa StrukKu
              </span>
              {avatarUrl && (
                <button
                  onClick={handleRemovePhoto}
                  className="text-[10px] text-white/60 hover:text-white underline decoration-white/30"
                >
                  Hapus Foto
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="px-5 mt-6 space-y-4">
        {/* Banner Upgrade StrukKu Pro */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
              Fitur Pro
            </span>
            <h3 className="font-black text-sm mt-1">Upgrade StrukKu Pro</h3>
            <p className="text-[11px] text-white/85 mt-0.5">Scan tanpa batas & backup cloud otomatis</p>
          </div>
          <button
            onClick={() => setShowPaywall(true)}
            className="relative z-10 px-3.5 py-2 bg-white text-orange-600 font-black text-xs rounded-xl shadow-md active:scale-95 transition-all whitespace-nowrap"
          >
            Upgrade ⚡
          </button>
        </div>

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

        {/* Menu Utama Akun */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-2">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Pengaturan & Fitur</h2>

          {/* 0. Ubah Foto Profil */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPhoto}
            className="w-full text-left py-3.5 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>📷</span>
              {isUploadingPhoto ? 'Mengunggah Foto...' : 'Ganti Foto Profil'}
            </span>
            <ChevronIcon />
          </button>

          {/* 1. Ubah Nama */}
          <button
            onClick={() => {
              setNameInput(currentDisplayName);
              setIsEditingName(true);
            }}
            className="w-full text-left py-3.5 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>✏️</span>
              Ubah Nama Akun
            </span>
            <ChevronIcon />
          </button>

          {/* 1.5 Tombol Lihat Website */}
          <button
            onClick={() => navigate('/landing')}
            className="w-full text-left py-3.5 px-3.5 rounded-xl flex items-center justify-between text-blue-900 font-bold bg-blue-50/70 hover:bg-blue-100/70 active:scale-[0.99] transition-all border border-blue-200/60 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>🌐</span>
              Lihat Website
            </span>
            <ChevronIcon className="text-blue-600" />
          </button>

          {/* 2. Budget Bulanan */}
          <button
            onClick={() => navigate('/budget')}
            className="w-full text-left py-3.5 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>🎯</span>
              Budget Bulanan & Jatah Harian
            </span>
            <ChevronIcon />
          </button>

          {/* 3. Riwayat & Export Excel */}
          <button
            onClick={() => navigate('/history')}
            className="w-full text-left py-3.5 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>📊</span>
              Riwayat Transaksi & Export Excel
            </span>
            <ChevronIcon />
          </button>

          {/* Fitur Sosial / Split Bill */}
          <button
            onClick={() => navigate('/social')}
            className="w-full text-left py-3.5 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>🍕</span>
              Patungan & Split Bill (Satu Scan)
            </span>
            <ChevronIcon />
          </button>

          <button
            onClick={() => navigate('/hemat')}
            className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>💡</span>
              Tantangan Hemat & Resep Masak
            </span>
            <ChevronIcon />
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

        {/* Bantuan & Keluhan */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-2">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Bantuan & Masukan</h2>

          {/* Formulir Masukan (in-app) */}
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full text-left py-3.5 px-3.5 rounded-xl flex items-center justify-between text-blue-900 font-bold bg-blue-50/70 hover:bg-blue-100/70 active:scale-[0.99] transition-all border border-blue-200/60 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>📝</span>
              Kirim Masukan atau Keluhan
            </span>
            <ChevronIcon className="text-blue-600" />
          </button>

          {/* WhatsApp Support — dibaca dari env */}
          {import.meta.env.VITE_SUPPORT_WA && (
            <a
              href={`https://wa.me/${import.meta.env.VITE_SUPPORT_WA}?text=Halo%2C%20saya%20pengguna%20StrukKu%20ingin%20menyampaikan%20masukan%3A`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-emerald-900 font-bold bg-emerald-50/80 hover:bg-emerald-100/80 transition-all border border-emerald-200/80 active:scale-95 text-xs"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base">💬</span>
                <span>Chat WhatsApp Tim StrukKu</span>
              </span>
              <ChevronIcon className="text-emerald-700" />
            </a>
          )}
        </div>

        {/* Informasi Legal */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-2">
          <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Informasi</h2>
          <Link
            to="/kebijakan-privasi"
            className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>🔒</span>
              Kebijakan Privasi
            </span>
            <ChevronIcon />
          </Link>
          <Link
            to="/syarat-ketentuan"
            className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>📋</span>
              Syarat & Ketentuan
            </span>
            <ChevronIcon />
          </Link>
          <Link
            to="/status"
            className="w-full text-left py-3 px-3.5 rounded-xl flex items-center justify-between text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition-all border border-gray-100 text-xs"
          >
            <span className="flex items-center gap-2.5">
              <span>🟢</span>
              Status Sistem & Layanan
            </span>
            <ChevronIcon />
          </Link>
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
            <ChevronIcon className="text-danger" />
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

      {/* Modal Formulir Masukan */}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />

      {/* Modal Upgrade Pro (Paywall) */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        triggerSource="profile_banner"
      />
    </div>
  );
}
