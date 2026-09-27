/**
 * PaywallModal.jsx — Komponen Upgrade StrukKu Pro / Berbayar
 * Terintegrasi penuh dengan event PostHog: paywall_viewed, checkout_started, payment_success.
 */

import { useEffect, useState } from 'react';
import { analytics } from '../utils/analytics';
import { formatRupiah } from '../utils/prediction';
import { useToast } from '../context/ToastContext';

export default function PaywallModal({ isOpen, onClose, triggerSource = 'profile_menu' }) {
  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState('pro_monthly'); // 'pro_monthly' | 'pro_semester'
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      analytics.paywallViewed(selectedPlan, triggerSource);
    }
  }, [isOpen, selectedPlan, triggerSource]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setProcessing(true);
    analytics.checkoutStarted(selectedPlan);

    // Simulasi checkout gateway / WhatsApp upgrade
    setTimeout(() => {
      setProcessing(false);
      analytics.paymentSuccess(selectedPlan);
      toast.success('Selamat! Akunmu telah ditingkatkan ke StrukKu Pro 🎉');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-blue-100 relative animate-bounce-in max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold transition-all"
        >
          ✕
        </button>

        {/* Header Paywall */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-amber-500/20">
            💎
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
            StrukKu Pro Mahasiswa
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
            Hemat Lebih Cerdas, Bebas Batas
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Buka seluruh kecerdasan scan tanpa kuota harian & sinkronisasi otomatis.
          </p>
        </div>

        {/* Fitur Pro */}
        <div className="space-y-2.5 mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {[
            { icon: '⚡', title: 'Scan OCR Tanpa Batas', desc: 'Scan struk puluhan kali sehari sepuasnya' },
            { icon: '📊', title: 'Export Laporan Excel & PDF Ortu', desc: 'Rekap keuangan rapi siap kirim kapan saja' },
            { icon: '☁️', title: 'Cadangan Cloud Terenkripsi', desc: 'Foto struk tersimpan aman di cloud pribadi' },
            { icon: '👥', title: 'Split Bill Multi-Grup & Circle', desc: 'Lacak utang-piutang teman otomatis' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2.5">
              <span className="text-base">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-800">{item.title}</p>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pilihan Paket */}
        <div className="space-y-2 mb-5">
          <div
            onClick={() => setSelectedPlan('pro_monthly')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              selectedPlan === 'pro_monthly'
                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-slate-900">Paket Bulanan</p>
              <p className="text-[11px] text-slate-500">Bayar per bulan, bisa batalkan kapan saja</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-blue-700">{formatRupiah(9900)}</span>
              <span className="text-[10px] text-slate-400 block">/bulan</span>
            </div>
          </div>

          <div
            onClick={() => setSelectedPlan('pro_semester')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between relative ${
              selectedPlan === 'pro_semester'
                ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
              HEMAT 35%
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">Paket 1 Semester (6 Bulan)</p>
              <p className="text-[11px] text-slate-500">Pas untuk 1 periode kuliah</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-amber-700">{formatRupiah(39000)}</span>
              <span className="text-[10px] text-slate-400 block">/semester</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>{processing ? 'Menghubungkan Pembayaran...' : 'Mulai Berlangganan Sekarang'}</span>
          <span>⚡</span>
        </button>

        <p className="text-[10px] text-center text-slate-400 mt-3">
          Pembayaran aman via QRIS, GoPay, OVO, ShopeePay & Transfer Bank.
        </p>
      </div>
    </div>
  );
}
