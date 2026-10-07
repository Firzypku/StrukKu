/**
 * BalanceAdjustModal.jsx — Modal Tambah Saldo & Penyesuaian Saldo Beranda
 * Memungkinkan user menambah saldo uang saku dengan mudah melalui input yang jelas,
 * auto-format nominal standar (Rp500.000), validasi lengkap, dan update realtime.
 */

import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Sliders,
  Target,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Wallet,
} from 'lucide-react';
import { adjustBalance, addBalance, getAllowanceConfig } from '../utils/pocketMoney';
import { formatRupiah, formatRupiahInput, parseRupiahInput } from '../utils/prediction';
import { MAX_AMOUNT, validateAmount } from '../utils/validation';
import { todayLocal } from '../utils/date';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { analytics } from '../utils/analytics';

// Pilihan cepat nominal tanpa singkatan (memenuhi standar format konsisten)
const QUICK_PRESETS = [50000, 100000, 200000, 500000, 1000000];

export default function BalanceAdjustModal({
  isOpen,
  onClose,
  onSaved,
  isOnboarding = false,
  currentRemaining = 0,
  daysLeft = 30,
}) {
  const { user } = useAuth();
  const toast = useToast();
  const currentConfig = getAllowanceConfig();

  // Mode: jika onboarding langsung ke 'adjust' (atur awal), jika dari beranda default 'add' (tambah saldo)
  const [activeTab, setActiveTab] = useState(isOnboarding ? 'adjust' : 'add');
  const [addAmountStr, setAddAmountStr] = useState('');
  const [totalAmountStr, setTotalAmountStr] = useState('');
  const [nextPayDateInput, setNextPayDateInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Inisialisasi default saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSaving(false);
      setSuccess(false);
      setAddAmountStr('');
      setActiveTab(isOnboarding ? 'adjust' : 'add');

      // Tentukan tanggal kiriman default
      if (currentConfig.nextPayDate) {
        setNextPayDateInput(currentConfig.nextPayDate);
      } else {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, currentConfig.payDay || 25);
        const y = nextMonth.getFullYear();
        const m = String(nextMonth.getMonth() + 1).padStart(2, '0');
        const d = String(nextMonth.getDate()).padStart(2, '0');
        setNextPayDateInput(`${y}-${m}-${d}`);
      }

      // Default nilai total saldo saat ini untuk tab koreksi
      const baseTotal = currentRemaining > 0 ? currentRemaining : (currentConfig.currentBalance || 800000);
      setTotalAmountStr(formatRupiahInput(baseTotal));
    }
  }, [isOpen, isOnboarding, currentRemaining]);

  if (!isOpen) return null;

  // Nilai numerik hasil parsing realtime
  const numericAddAmount = parseRupiahInput(addAmountStr);
  const numericTotalAmount = parseRupiahInput(totalAmountStr);

  // Perhitungan sisa hari
  const today = new Date(todayLocal() + 'T00:00:00');
  const target = nextPayDateInput ? new Date(nextPayDateInput + 'T00:00:00') : today;
  const calculatedDaysDiff = Math.max(1, Math.ceil((target - today) / (1000 * 60 * 60 * 24)));
  const effectiveDays = daysLeft > 0 ? daysLeft : calculatedDaysDiff;

  // Preview saldo baru setelah penambahan
  const projectedRemainingAfterAdd = currentRemaining + numericAddAmount;
  const projectedDailyAfterAdd = Math.round(projectedRemainingAfterAdd / effectiveDays);

  // Preview jatah harian untuk mode atur total
  const projectedDailyFromTotal = Math.round(numericTotalAmount / calculatedDaysDiff);

  // Handler auto-format saat user mengetik
  const handleAmountChange = (rawVal, setter) => {
    setError('');
    // Validasi 1: Hanya boleh karakter angka
    const digitsOnly = rawVal.replace(/\D/g, '');

    if (!digitsOnly) {
      setter('');
      return;
    }

    const num = parseInt(digitsOnly, 10);

    // Validasi 2: Cek batas maksimum realistis (Rp999.999.999)
    if (num > MAX_AMOUNT) {
      setError(`Nominal terlalu besar. Masukkan nominal maksimal ${formatRupiah(MAX_AMOUNT)}.`);
      setter(formatRupiahInput(MAX_AMOUNT));
      return;
    }

    setter(formatRupiahInput(num));
  };

  // Handler tombol cepat nominal (Quick Presets)
  const handleApplyPreset = (presetVal) => {
    setError('');
    if (activeTab === 'add') {
      const current = parseRupiahInput(addAmountStr);
      const nextVal = current + presetVal;
      if (nextVal > MAX_AMOUNT) {
        setError(`Nominal terlalu besar. Masukkan nominal maksimal ${formatRupiah(MAX_AMOUNT)}.`);
        setAddAmountStr(formatRupiahInput(MAX_AMOUNT));
        return;
      }
      setAddAmountStr(formatRupiahInput(nextVal));
    } else {
      setTotalAmountStr(formatRupiahInput(presetVal));
    }
  };

  // Submit Penambahan / Penyesuaian Saldo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'add') {
      // Validasi Tambah Saldo
      const validation = validateAmount(addAmountStr, {
        fieldName: 'Nominal saldo',
        min: 1000,
        max: MAX_AMOUNT,
        required: true,
      });

      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      setSaving(true);
      try {
        const updatedConfig = await addBalance(validation.value, nextPayDateInput, user?.id);
        setSuccess(true);
        toast.success(`Saldo berhasil ditambahkan sebesar ${formatRupiah(validation.value)}!`);

        setTimeout(() => {
          if (onSaved) onSaved(updatedConfig);
          if (onClose) onClose();
        }, 500);
      } catch (err) {
        setError('Gagal menambahkan saldo: ' + err.message);
      } finally {
        setSaving(false);
      }
    } else {
      // Validasi Atur Ulang Total Saldo
      const validation = validateAmount(totalAmountStr, {
        fieldName: 'Total saldo',
        min: 1000,
        max: MAX_AMOUNT,
        required: true,
      });

      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      if (!nextPayDateInput) {
        setError('Silakan pilih tanggal kiriman berikutnya');
        return;
      }

      setSaving(true);
      try {
        const updatedConfig = await adjustBalance(validation.value, nextPayDateInput, null, user?.id);
        if (isOnboarding) {
          analytics.onboardingDone();
        }
        setSuccess(true);
        toast.success(
          isOnboarding
            ? 'Siklus uang saku berhasil diset! Jatah harianmu siap dihitung.'
            : `Saldo berhasil disesuaikan menjadi ${formatRupiah(numericTotalAmount)}!`
        );

        setTimeout(() => {
          if (onSaved) onSaved(updatedConfig);
          if (onClose) onClose();
        }, 500);
      } catch (err) {
        setError('Gagal menyimpan perubahan saldo: ' + err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-bounce-in max-h-[92vh] overflow-y-auto no-scrollbar relative">
        {/* Tombol Tutup Silang */}
        {!isOnboarding && onClose && !saving && (
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Ikon & Judul */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 shadow-sm border border-emerald-100">
            {isOnboarding ? (
              <Target className="w-6 h-6 text-emerald-600" />
            ) : activeTab === 'add' ? (
              <PlusCircle className="w-6 h-6 text-emerald-600" />
            ) : (
              <Sliders className="w-6 h-6 text-emerald-600" />
            )}
          </div>
          <h3 className="font-black text-slate-900 text-lg tracking-tight">
            {isOnboarding
              ? 'Mulai Siklus Uang Saku'
              : activeTab === 'add'
              ? 'Tambah Saldo'
              : 'Atur Total Saldo'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {isOnboarding
              ? 'Beri tahu sisa uangmu agar StrukKu bisa menghitung Jatah Harian Amanmu.'
              : activeTab === 'add'
              ? 'Tambahkan uang saku atau pemasukan baru ke saldo berjalanmu.'
              : 'Perbarui total uang riil yang kamu pegang jika terdapat selisih.'}
          </p>
        </div>

        {/* Tab Navigasi (Hanya muncul jika bukan onboarding) */}
        {!isOnboarding && (
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 gap-1">
            <button
              type="button"
              id="tab-tambah-saldo"
              onClick={() => {
                setActiveTab('add');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'add'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Saldo</span>
            </button>
            <button
              type="button"
              id="tab-atur-ulang-saldo"
              onClick={() => {
                setActiveTab('adjust');
                setError('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'adjust'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Atur Ulang Total</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TAB 1: TAMBAH SALDO */}
          {activeTab === 'add' && (
            <div className="space-y-3.5">
              {/* Info Saldo Saat Ini */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  <span>Saldo Saat Ini:</span>
                </span>
                <span className="text-xs font-black text-slate-800">
                  {formatRupiah(currentRemaining)}
                </span>
              </div>

              {/* Input Nominal yang Ditambahkan */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Nominal yang Ditambahkan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-tambah-saldo"
                    type="text"
                    inputMode="numeric"
                    value={addAmountStr}
                    onChange={(e) => handleAmountChange(e.target.value, setAddAmountStr)}
                    placeholder="Contoh: Rp500.000"
                    className={`w-full bg-slate-50 border text-slate-900 text-lg font-black rounded-2xl px-4 py-3 outline-none transition-all ph-no-capture ${
                      error
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                    autoFocus
                  />
                  {addAmountStr && (
                    <button
                      type="button"
                      onClick={() => setAddAmountStr('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title="Bersihkan input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Pilihan Cepat Nominal (Quick Presets) */}
              <div>
                <p className="text-[11px] text-slate-500 font-medium mb-1.5">Pilihan Cepat Tambah:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs border border-slate-200/60 active:scale-95 transition-all"
                    >
                      +{formatRupiah(preset)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Hasil Penambahan */}
              {numericAddAmount > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-3.5 text-center animate-fade-in">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Hasil Setelah Saldo Ditambahkan
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-1">
                    {formatRupiah(projectedRemainingAfterAdd)}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Jatah harian baru: <strong>{formatRupiah(projectedDailyAfterAdd)}</strong> /hari (sisa {effectiveDays} hari)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ATUR ULANG TOTAL SALDO (ATAU ONBOARDING) */}
          {activeTab === 'adjust' && (
            <div className="space-y-3.5">
              {/* Input Total Saldo Riil */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {isOnboarding ? 'Berapa sisa uangmu sekarang?' : 'Total Saldo Baru (Riil)'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="input-total-saldo"
                    type="text"
                    inputMode="numeric"
                    value={totalAmountStr}
                    onChange={(e) => handleAmountChange(e.target.value, setTotalAmountStr)}
                    placeholder="Contoh: Rp800.000"
                    className={`w-full bg-slate-50 border text-slate-900 text-lg font-black rounded-2xl px-4 py-3 outline-none transition-all ph-no-capture ${
                      error
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                    autoFocus
                  />
                  {totalAmountStr && (
                    <button
                      type="button"
                      onClick={() => setTotalAmountStr('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title="Bersihkan input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tanggal Kiriman Berikutnya */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Kapan kiriman uang saku berikutnya? <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-next-pay-date"
                  type="date"
                  value={nextPayDateInput}
                  min={todayLocal()}
                  onChange={(e) => {
                    setError('');
                    setNextPayDateInput(e.target.value);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-2xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Sisa <strong>{calculatedDaysDiff} hari</strong> sampai kiriman berikutnya.
                </p>
              </div>

              {/* Preview Hasil Atur Ulang */}
              {numericTotalAmount > 0 && calculatedDaysDiff > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-3.5 text-center animate-fade-in">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Jatah Harian Aman Dihitung Ulang
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-1">
                    {formatRupiah(projectedDailyFromTotal)} <span className="text-xs font-normal text-slate-500">/hari</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {formatRupiah(numericTotalAmount)} ÷ {calculatedDaysDiff} hari
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pesan Error Validasi Ramah Pengguna */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Feedback Sukses Berhasil Disimpan */}
          {success && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Saldo berhasil diperbarui!</span>
            </div>
          )}

          {/* Tombol Aksi */}
          <div className="flex gap-2.5 pt-2">
            {!isOnboarding && onClose && (
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs transition-all"
              >
                Batal
              </button>
            )}

            <button
              id="btn-submit-saldo"
              type="submit"
              disabled={saving || success}
              className="flex-1 py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </>
              ) : isOnboarding ? (
                <>
                  <span>Mulai Pakai StrukKu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : activeTab === 'add' ? (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Saldo</span>
                </>
              ) : (
                <>
                  <Sliders className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
