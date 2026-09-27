import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengecek apakah URL mengandung parameter callback OAuth (access_token atau code)
    const isOAuthRedirect =
      typeof window !== 'undefined' &&
      (window.location.hash.includes('access_token') || window.location.search.includes('code='));

    // Mengecek sesi login aktif saat pertama reload halaman
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session?.user) {
          setUser(session.user);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Gagal membaca sesi Supabase:', err);
      }

      // Cek apakah ada sesi demo aktif
      try {
        const demoUser = localStorage.getItem('strukku_demo_user');
        if (demoUser) {
          setUser(JSON.parse(demoUser));
          setLoading(false);
          return;
        }
      } catch (_e) {
        // Abaikan kegagalan baca localStorage demo user
      }

      // Jika bukan redirect OAuth, kita selesaikan loading (user belum login)
      if (!isOAuthRedirect) {
        setLoading(false);
      }
    };
    
    getSession();

    // Listener otomatis dari Supabase jika ada perubahan state login (login/logout realtime)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      } else if (!isOAuthRedirect) {
        setUser(null);
        setLoading(false);
      }
    });

    // Safety timeout untuk OAuth redirect agar tidak stuck di loading spinner jika login dibatalkan
    let timeoutId;
    if (isOAuthRedirect) {
      timeoutId = setTimeout(() => {
        setLoading(false);
      }, 4500);
    }

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async (email, password, fullName, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...metadata
        }
      }
    });
    if (error) throw error;
    return data;
  };

  // Login 1-klik untuk pengujian & evaluator tanpa harus isi formulir
  const demoLogin = async () => {
    setLoading(true);
    // Coba login via Supabase jika user demo sudah pernah dibuat
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@strukku.id',
        password: 'PasswordDemo123!',
      });
      if (!error && data?.user) {
        setUser(data.user);
        setLoading(false);
        return data;
      }
    } catch (_e) {
      // Abaikan jika akun demo belum dibuat di server Supabase
    }

    // Fallback: buat atau pakai akun demo lokal
    const demoUser = {
      id: 'demo-mahasiswa-telkom',
      email: 'demo@strukku.id',
      user_metadata: { full_name: 'Firzy (Akun Demo)' },
      aud: 'authenticated',
      role: 'authenticated',
    };
    try {
      localStorage.setItem('strukku_demo_user', JSON.stringify(demoUser));
    } catch (_e) {
      // Abaikan jika storage quota penuh
    }
    setUser(demoUser);
    setLoading(false);
    return { user: demoUser };
  };

  const logout = async () => {
    try {
      localStorage.removeItem('strukku_demo_user');
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Logout warning:', e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, demoLogin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
