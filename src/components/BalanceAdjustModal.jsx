/**
 * BalanceAdjustModal.jsx — Modal Onboarding Siklus & "Sesuaikan Saldo" kapan saja
 * Menanyakan: "Berapa sisa uangmu sekarang?" dan "Kapan kiriman berikutnya?"
 */

import { useState } from 'react';
import { adjustBalance, getAllowanceConfig } from '../utils/pocketMoney';
import { formatRupiah } from '../utils/prediction';
import { todayLocal } from '../utils/date';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { analytics } from '../utils/analytics';

export default function BalanceAdjustModal({ isOpen, onClose, onSaved, isOnboarding = false }) {
  const { user } = useAuth();
  const toast = useToast();
  const currentConfig = getAllowanceConfig();

  // Hitung tanggal default: 1 bulan dari hari ini atau payDay yang ada
  const getDefaultNextPayDate = () => {
    if (currentConfig.nextPayDate) return currentConfig.nextPayDate;
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, currentConfig.payDay || 25);
    const y = nextMonth.getFullYear();
    const m = String(nextMonth.getMonth() + 1).padStart(2, '0');
    const d = String(nextMonth.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [balanceInput, setBalanceInput] = useState(
    currentConfig.currentBalance ? currentConfig.currentBalance.toString() : '800000'
  );
  const [nextPayDateInput, setNextPayDateInput] = useState(getDefaultNextPayDate());
  const [monthlyInput, setMonthlyInput] = useState(
    currentConfig.monthlyAmount ? currentConfig.monthlyAmount.toString() : '1500000'
  );
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  // Hitung preview jatah harian
  const numBalance = parseFloat(balanceInput.replace(/\./g, '')) || 0;
  const today = new Date(todayLocal() + 'T00:00:00');
  const target = new Date(nextPayDateInput + 'T00:00:00');
  const daysDiff = Math.max(1, Math.ceil((target - today) / (1000 * 60 * 60 * 24)));
  const previewDaily = Math.round(numBalance / daysDiff);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (numBalance <= 0) {
      toast.error('Masukkan sisa uangmu sekarang');
      return;
    }
    if (!nextPayDateInput) {
      toast.error('Pilih tanggal kiriman berikutnya');
      return;
    }

    setSaving(true);
    try {
      const numMonthly = parseFloat(monthlyInput.replace(/\./g, '')) || null;
      const updatedConfig = await adjustBalance(numBalance, nextPayDateInput, numMonthly, user?.id);
      if (isOnboarding) {
        analytics.onboardingDone();
      }
      toast.success(
        isOnboarding
          ? 'Siklus uang saku berhasil diset! Jatah harianmu siap dihitung 🚀'
          : 'Saldo & jatah harian berhasil disesuaikan! 💰'
      );
      if (onSaved) onSaved(updatedConfig);
      if (onClose) onClose();
    } catch (err) {
      toast.error('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-blue-100 animate-bounce-in max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-2.5 shadow-sm border border-blue-100">
            {isOnboarding ? '🎯' : '⚖️'}
          </div>
          <h3 className="font-black text-slate-900 text-lg tracking-tight">
            {isOnboarding ? 'Mulai Siklus Uang Saku' : 'Sesuaikan Saldo Saat Ini'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {isOnboarding
              ? 'Beri tahu sisa uangmu agar StrukKu bisa menghitung Jatah Harian Amanmu.'
              : 'Perbarui sisa uang riilmu sekarang jika ada pemasukan atau koreksi saldo.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pertanyaan 1: Berapa sisa uangmu sekarang? */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              1. Berapa sisa uangmu sekarang? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                Rp
              </span>
              <input
                id="input-current-balance"
                type="number"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                placeholder="Contoh: 800000"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base font-black rounded-xl pl-11 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all ph-no-capture"
                required
                autoFocus
              />
            </div>
            {numBalance > 0 && (
              <p className="text-[11px] text-blue-600 font-semibold mt-1 ph-no-capture">
                {formatRupiah(numBalance)}
              </p>
            )}
          </div>

          {/* Pertanyaan 2: Kapan kiriman berikutnya? */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              2. Kapan kiriman berikutnya? <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={nextPayDateInput}
              min={todayLocal()}
              onChange={(e) => setNextPayDateInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Sisa <strong>{daysDiff} hari</strong> sampai kiriman tiba.
            </p>
          </div>

          {/* Preview Jatah Harian Otomatis */}
          {numBalance > 0 && daysDiff > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                Hasil Perhitungan Jatah Harian
              </span>
              <p className="text-xl font-black text-slate-900 mt-0.5">
                {formatRupiah(previewDaily)} <span className="text-xs font-normal text-slate-500">/hari</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {formatRupiah(numBalance)} ÷ {daysDiff} hari
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            {!isOnboarding && onClose && (
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : isOnboarding ? 'Mulai Pakai StrukKu 🚀' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
