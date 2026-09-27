import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analytics } from '../utils/analytics';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedTerms) {
      setError('Anda harus menyetujui Kebijakan Privasi dan Syarat & Ketentuan untuk melanjutkan.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(email, password, fullName, {
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
        terms_version: 'v1.0-sep2026',
        privacy_policy_version: 'v1.0-sep2026'
      });
      analytics.signup('email');
      // Pindahkan user ke login setelah sukses
      navigate('/login', { state: { message: 'Pendaftaran sukses! Silakan konfirmasi email Anda atau langsung login.' } });
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal. Pastikan password minimal 6 karakter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#185FA5] to-[#1D9E75]">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-white/20 backdrop-blur items-center justify-center text-3xl mb-3 shadow-lg border border-white/20">
            👋
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Buat Akun Baru</h1>
          <p className="text-white/70 text-sm mt-1">Gabung sekarang dan mulai berhemat</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          {error && (
            <div className="mb-4 bg-red-50 text-danger text-xs p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Nama Panggilan</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Misal: Andi"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kombinasi rahasia (min. 6 char)"
                className="input-field"
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="agreed-terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/20 border-gray-300 cursor-pointer"
                required
              />
              <label htmlFor="agreed-terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">
                Saya menyetujui{' '}
                <Link to="/kebijakan-privasi" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                  Kebijakan Privasi
                </Link>{' '}
                dan{' '}
                <Link to="/syarat-ketentuan" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                  Syarat & Ketentuan
                </Link>{' '}
                StrukKu (UU PDP No. 27/2022).
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedTerms}
              className={`btn-primary mt-2 flex items-center justify-center gap-2 ${loading || !agreedTerms ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang ✨'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
