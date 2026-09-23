import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useToast } from '../context/ToastContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Cek apakah ada hash token recovery dari email di URL
  useState(() => {
    if (window.location.hash && window.location.hash.includes('type=recovery')) {
      setIsUpdateMode(true);
    }
  });

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success('Tautan reset password telah dikirim ke email Anda!');
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim email reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password berhasil diperbarui! Silakan masuk kembali.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-white shadow-card items-center justify-center text-4xl mb-4">
            🔑
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">
            {isUpdateMode ? 'Buat Password Baru' : 'Lupa Password?'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isUpdateMode
              ? 'Masukkan password baru yang aman untuk akun Anda.'
              : 'Kami akan mengirimkan instruksi ke email akun Anda.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-white/60">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 text-success rounded-full flex items-center justify-center text-2xl mx-auto">
                ✉️
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tautan pemulihan telah dikirim ke <strong>{email}</strong>. Cek kotak masuk atau folder spam Anda.
              </p>
              <Link
                to="/login"
                className="block w-full py-3 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-dark transition-all"
              >
                Kembali ke Halaman Masuk
              </Link>
            </div>
          ) : isUpdateMode ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Password Baru</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder=""
                  autoComplete="new-password"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn-primary mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email Terdaftar</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn-primary mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Mengirim...' : 'Kirim Tautan Reset →'}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                  ← Kembali ke Masuk
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
