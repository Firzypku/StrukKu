/**
 * App.jsx — Router utama StrukKu dengan Lazy Loading & Route Guarding
 */

import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/Toast';
import Navbar from './components/Navbar';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import PwaUpdater from './components/PwaUpdater';
import { lazyWithRetry } from './utils/lazyWithRetry';

// Lazy load semua halaman dengan proteksi retry jika chunk lama di-deploy ulang
const Landing = lazyWithRetry(() => import('./pages/Landing'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Register = lazyWithRetry(() => import('./pages/Register'));
const ResetPassword = lazyWithRetry(() => import('./pages/ResetPassword'));
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'));
const Scan = lazyWithRetry(() => import('./pages/Scan'));
const History = lazyWithRetry(() => import('./pages/History'));
const Budget = lazyWithRetry(() => import('./pages/Budget'));
const Hemat = lazyWithRetry(() => import('./pages/Hemat'));
const Social = lazyWithRetry(() => import('./pages/Social'));
const Profile = lazyWithRetry(() => import('./pages/Profile'));

// Loading fallback yang ringan
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-gray-400">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
    <span className="text-xs font-semibold">Memuat StrukKu...</span>
  </div>
);

// Wrapper untuk melarang akses bagi yang belum login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Wrapper untuk melarang akses halaman login/register kalau sudah login
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Route untuk "/" — menampilkan Landing page
const RootRoute = () => {
  return <Landing />;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen relative bg-[#F8FAFC]">
            <ToastContainer />
            <PwaUpdater />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public & Landing Routes */}
                <Route path="/" element={<RootRoute />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<PublicRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><Login /></div></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><Register /></div></PublicRoute>} />
                <Route path="/reset-password" element={<PublicRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><ResetPassword /></div></PublicRoute>} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><Dashboard /></div></ProtectedRoute>} />
                <Route path="/scan" element={<ProtectedRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><Scan /></div></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><History /></div></ProtectedRoute>} />
                <Route path="/budget" element={<ProtectedRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><Budget /></div></ProtectedRoute>} />
                <Route path="/hemat" element={<ProtectedRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><Hemat /></div></ProtectedRoute>} />
                <Route path="/social" element={<ProtectedRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><Social /></div></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><div className="max-w-md mx-auto min-h-screen bg-surface"><Profile /></div></ProtectedRoute>} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <FloatingWhatsApp />
            <Navbar />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
