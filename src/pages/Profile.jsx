import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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

      <div className="px-5 mt-8 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
           <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Pengaturan Akun</h2>
           <button 
             onClick={handleLogout} 
             className="w-full text-left py-4 px-5 rounded-2xl flex items-center justify-between text-danger font-bold bg-danger/5 hover:bg-danger/10 transition-colors border border-danger/10 active:scale-95"
           >
             <span className="flex items-center gap-3">
               <span className="text-xl">🚪</span>
               Keluar Akun (Logout)
             </span>
             <span>→</span>
           </button>
        </div>
        
        <div className="mt-12 text-center px-4">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-3">🧾</div>
          <p className="font-bold text-primary mb-1">StrukKu App</p>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            Dibuat oleh <span className="font-semibold text-gray-500">Muhammad Firzy Islami Fathi</span><br/>
            Mahasiswa Universitas Telkom Surabaya Jurusan Bisnis Digital
          </p>
          <p className="text-gray-400 text-[10px] mt-2 font-mono bg-gray-100 inline-block px-2 py-1 rounded">v1.0.0 (Cloud)</p>
        </div>
      </div>
      <Navbar />
    </div>
  );
}
