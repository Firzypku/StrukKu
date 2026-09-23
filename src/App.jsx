/**
 * App.jsx — Router utama StrukKu dengan Lazy Loading & Route Guarding
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/Toast';
import Navbar from './components/Navbar';

// Lazy load semua halaman untuk memangkas ukuran bundle awal
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Scan = lazy(() => import('./pages/Scan'));
const History = lazy(() => import('./pages/History'));
const Budget = lazy(() => import('./pages/Budget'));
const Hemat = lazy(() => import('./pages/Hemat'));
const Social = lazy(() => import('./pages/Social'));
const Profile = lazy(() => import('./pages/Profile'));

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

// Route untuk "/" — jika sudah login, langsung ke /dashboard (Bug 13)
const RootRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          {/* Max width mobile-first wrapper */}
          <div className="max-w-md mx-auto min-h-screen relative bg-surface">
            <ToastContainer />
            <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
              <Route path="/hemat" element={<ProtectedRoute><Hemat /></ProtectedRoute>} />
              <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Navbar />
        </div>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
