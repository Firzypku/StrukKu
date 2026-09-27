/**
 * Dashboard.jsx — Halaman utama dengan ringkasan Jatah Harian Aman, sisa uang riil,
 * navigasi bulan, batas belanja bulanan sekunder, dan chart aktivitas 7 hari.
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { predictEndOfMonth, generateTip, formatRupiah } from '../utils/prediction';
import { CATEGORY_ICONS } from '../utils/ocr';
import { toLocalDateString, todayLocal } from '../utils/date';
import {
  getAllowanceConfig,
  fetchAllowanceConfigFromSupabase,
  calculateAllowanceCycle,
} from '../utils/pocketMoney';
import { markNoSpendDay, isNoSpendDay } from '../utils/challenges';
import { ExpenseBarChart } from '../components/Chart';
import BalanceAdjustModal from '../components/BalanceAdjustModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const {
    thisMonth,
    stats,
    expenses,
    allExpenses,
    selectedYear,
    selectedMonth,
    selectedMonthName,
    isCurrentMonth,
    prevMonth,
    nextMonth,
    goToCurrentMonth,
  } = useExpenses();

  const { budget, getStatus } = useBudget();

  // Konfigurasi siklus uang saku & jatah harian
  const [allowanceConfig, setAllowanceConfig] = useState(getAllowanceConfig);
  const [showAdjustBalanceModal, setShowAdjustBalanceModal] = useState(false);
  const [noSpendToday, setNoSpendToday] = useState(isNoSpendDay());

  // Ambil konfigurasi uang saku dari Supabase
  useEffect(() => {
    if (user?.id) {
      fetchAllowanceConfigFromSupabase(user.id).then((cfg) => {
        if (cfg) setAllowanceConfig(cfg);
      });
    }
  }, [user?.id]);

  // Hitung siklus uang saku dinamis
  const cycleData = useMemo(() => {
    return calculateAllowanceCycle(allExpenses || expenses, allowanceConfig);
  }, [allExpenses, expenses, allowanceConfig]);

  const [tip, setTip] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    setTip(generateTip(thisMonth, cycleData.safeDailySpend));
    setPrediction(predictEndOfMonth(thisMonth));
  }, [thisMonth, cycleData.safeDailySpend]);

  const budgetStatus = getStatus(stats.thisMonthTotal);

  // Check-in "Hari ini aku tidak belanja"
  const handleCheckInNoSpend = () => {
    const today = todayLocal();
    const marked = markNoSpendDay(today);
    setNoSpendToday(true);
    if (marked) {
      toast.success('Keren! Hari hemat tanpa jajan tercatat 🧘 Streak bertambah!');
    } else {
      toast.info('Kamu sudah check-in tanpa belanja hari ini.');
    }
  };

  // Siapkan data chart: benar-benar 7 hari terakhir berakhir hari ini (menggunakan allExpenses)
  const chartData = useMemo(() => {
    if (isCurrentMonth) {
      const result = [];
      const sourceExpenses = allExpenses && allExpenses.length > 0 ? allExpenses : expenses;
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = toLocalDateString(d);
        const dayExpenses = sourceExpenses.filter((e) => e.date === dateStr);
        const total = dayExpenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
        const isToday = i === 0;
        result.push({
          name: isToday ? 'Hari Ini' : d.toLocaleDateString('id-ID', { weekday: 'short' }),
          value: total,
        });
      }
      return result;
    } else {
      // Pembagian minggu untuk bulan lampau
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const weeks = [
        { name: 'Mgg 1 (1-7)', start: 1, end: 7, value: 0 },
        { name: 'Mgg 2 (8-14)', start: 8, end: 14, value: 0 },
        { name: 'Mgg 3 (15-21)', start: 15, end: 21, value: 0 },
        { name: `Mgg 4 (22-${daysInMonth})`, start: 22, end: daysInMonth, value: 0 },
      ];
      thisMonth.forEach((e) => {
        if (!e.date) return;
        const day = parseInt(e.date.split('-')[2], 10);
        const amt = parseFloat(e.amount) || 0;
        const w = weeks.find((wk) => day >= wk.start && day <= wk.end);
        if (w) w.value += amt;
      });
      return weeks;
    }
  }, [thisMonth, isCurrentMonth, allExpenses, expenses, selectedYear, selectedMonth]);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 11 ? 'Selamat Pagi' : greetingHour < 15 ? 'Selamat Siang' : greetingHour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const userAvatarUrl =
    user?.user_metadata?.avatar_url || (user?.id ? localStorage.getItem(`user_avatar_${user.id}`) : null);

  // Kriteria prediksi: minimal 7 hari data dan 5 transaksi
  const hasEnoughPredictionData = isCurrentMonth && thisMonth.length >= 5 && (prediction?.daysPassed || 0) >= 7;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28">
      {/* Header Utama dengan Jatah Harian sebagai Angka Utama */}
      <div className="bg-gradient-to-br from-[#0B1E36] via-[#123E6B] to-[#1E40AF] px-4 pt-12 pb-14 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />

        {/* Profil & Navigasi Bulan */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/60 bg-white/20 flex items-center justify-center flex-shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform"
              title="Buka Profil"
            >
              {userAvatarUrl ? (
                <img src={userAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-black text-white">
                  {(user?.user_metadata?.full_name || 'M').charAt(0).toUpperCase()}
                </span>
              )}
            </button>
            <div>
              <p className="text-white/60 text-xs font-medium">{greeting},</p>
              <h1 className="text-lg font-black text-white truncate max-w-[170px] sm:max-w-[220px]">
                {user?.user_metadata?.full_name || 'Mahasiswa'} 🎓
              </h1>
            </div>
          </div>

          {/* Quick Month Navigator Badge */}
          <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-xs shadow-sm">
            <button
              onClick={prevMonth}
              className="text-white/80 hover:text-white px-1 font-bold active:scale-95"
              title="Bulan sebelumnya"
            >
              ◀
            </button>
            <span className="text-white font-extrabold text-[11px] px-1 whitespace-nowrap">
              {stats.selectedMonthShort} {selectedYear}
            </span>
            <button
              onClick={nextMonth}
              className="text-white/80 hover:text-white px-1 font-bold active:scale-95"
              title="Bulan selanjutnya"
            >
              ▶
            </button>
          </div>
        </div>

        {/* JATAH HARIAN AMAN — Angka Utama Beranda */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-5 text-white shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/80 font-bold flex items-center gap-1.5">
              <span>🎯</span>
              <span>Jatah Harian Aman Hari Ini</span>
            </span>
            <button
              onClick={() => setShowAdjustBalanceModal(true)}
              className="text-[11px] bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1 rounded-xl border border-white/25 active:scale-95 transition-all flex items-center gap-1"
              title="Sesuaikan sisa uang dan tanggal kiriman"
            >
              <span>Sesuaikan Saldo</span> ⚙️
            </button>
          </div>

          <p className="text-3xl sm:text-4xl font-black text-white mt-1.5 tracking-tight">
            {formatRupiah(cycleData.safeDailySpend)}
            <span className="text-sm font-normal text-white/70"> /hari</span>
          </p>

          <p className="text-xs text-blue-100/90 mt-1 font-medium leading-relaxed">
            Sisa uang: <strong>{formatRupiah(cycleData.remainingAllowance)}</strong> • Kiriman dalam {cycleData.daysLeft} hari ({cycleData.nextPayDate})
          </p>

          {/* Sekunder: Pengeluaran Bulan Ini */}
          <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs text-white/80">
            <span>Terpakai {isCurrentMonth ? 'Bulan Ini' : selectedMonthName}:</span>
            <span className="font-bold text-white text-sm">{formatRupiah(stats.thisMonthTotal)}</span>
          </div>

          {/* Sekunder: Budget Limit Bulanan */}
          {budget > 0 && (
            <div className="mt-2.5 pt-2 border-t border-white/10">
              <div className="flex justify-between items-center text-[11px] text-white/80 mb-1">
                <span>Batas belanja bulanan ({formatRupiah(budget)}):</span>
                <span className={budgetStatus.status === 'danger' ? 'text-rose-300 font-bold' : 'text-emerald-300 font-semibold'}>
                  {budgetStatus.status === 'danger'
                    ? `Over ${formatRupiah(Math.abs(budgetStatus.remaining))}`
                    : `Sisa ${formatRupiah(budgetStatus.remaining)}`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetStatus.status === 'danger' ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(budgetStatus.percent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards — Rata/hari dalam rupiah penuh & Top Kategori lengkap nominal */}
      <div className="px-3 sm:px-4 -mt-6 relative z-10 grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {[
          {
            icon: '📋',
            label: 'Transaksi',
            value: `${stats.thisMonthCount}x`,
            subValue: null,
            gradient: 'from-blue-600 to-indigo-600',
          },
          {
            icon: '🏆',
            label: 'Top Kategori',
            value: stats.topCategory ? `${CATEGORY_ICONS[stats.topCategory] || '💳'} ${stats.topCategory}` : '—',
            subValue: stats.topCategory && stats.topCategoryAmount ? formatRupiah(stats.topCategoryAmount) : null,
            gradient: 'from-emerald-500 to-teal-600',
          },
          {
            icon: '📅',
            label: 'Rata/hari',
            // Menampilkan rupiah penuh tanpa singkatan K (misal Rp1.852)
            value: prediction?.dailyAvg ? formatRupiah(prediction.dailyAvg) : '—',
            subValue: null,
            gradient: 'from-violet-600 to-purple-600',
          },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-2 sm:p-3 shadow-md border border-slate-100 text-center flex flex-col justify-between">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-sm sm:text-base text-white mx-auto mb-1 sm:mb-1.5 shadow-sm`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">{item.label}</p>
              <p className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 truncate">{item.value}</p>
              {item.subValue && (
                <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 truncate mt-0.5">
                  {item.subValue}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {/* Banner Check-in: "Hari ini aku tidak belanja" */}
        {isCurrentMonth && (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{noSpendToday ? '🧘' : '🍃'}</span>
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  {noSpendToday ? 'Hari Hemat Tercatat!' : 'Tidak jajan hari ini?'}
                </p>
                <p className="text-[11px] text-emerald-700">
                  {noSpendToday
                    ? 'Streak hemat bertambah. Pertahankan!'
                    : 'Check-in untuk menambah streak tantangan hematmu.'}
                </p>
              </div>
            </div>
            {!noSpendToday ? (
              <button
                onClick={handleCheckInNoSpend}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap transition-all"
              >
                Hari Ini Aku Tidak Belanja ✨
              </button>
            ) : (
              <span className="text-[11px] bg-emerald-200/80 text-emerald-900 font-bold px-2.5 py-1 rounded-xl">
                ✓ Tercatat
              </span>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-scan-struk"
            onClick={() => navigate('/scan')}
            className="bg-blue-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md hover:bg-blue-700 active:scale-95 transition-all"
          >
            <span className="text-3xl">📸</span>
            <span className="text-sm font-bold">Scan Struk</span>
          </button>
          <button
            id="btn-input-manual"
            onClick={() => navigate('/scan?mode=manual')}
            className="bg-white text-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-card border border-slate-200/80 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <span className="text-3xl">✏️</span>
            <span className="text-sm font-bold">Input Manual</span>
          </button>
        </div>

        {/* Chart Aktivitas 7 Hari Terakhir (Menggunakan data riil 7 hari berakhir hari ini) */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60 overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="font-bold text-gray-800 text-sm">
                {isCurrentMonth ? 'Aktivitas 7 Hari Terakhir' : `Tren Mingguan ${selectedMonthName}`}
              </h2>
              <p className="text-[11px] text-gray-400">
                {isCurrentMonth ? 'Pengeluaran harian terbaru' : 'Distribusi transaksi per minggu'}
              </p>
            </div>
            <button onClick={() => navigate('/history')} className="text-xs text-primary font-semibold">
              Lihat Kalender →
            </button>
          </div>
          <ExpenseBarChart data={chartData} height={160} />
        </div>

        {/* Prediksi Akhir Bulan: Hanya tampil jika ada minimal 7 hari data DAN 5 transaksi */}
        {hasEnoughPredictionData ? (
          <div className={`rounded-2xl p-4 shadow-card border ${
            prediction.predicted > budget && budget > 0
              ? 'bg-red-50 border-red-100'
              : 'bg-blue-50 border-blue-100'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{prediction.predicted > budget && budget > 0 ? '⚠️' : '🔮'}</span>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Prediksi Akhir Bulan</h3>
                <p className="text-xl font-black text-primary mt-1">
                  {formatRupiah(prediction.predicted)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Berdasarkan rata-rata {formatRupiah(prediction.dailyAvg)}/hari selama {prediction.daysPassed} hari.
                </p>
                {prediction.predicted > budget && budget > 0 && (
                  <p className="text-xs text-danger font-semibold mt-1">
                    ❌ Diprediksi over budget {formatRupiah(prediction.predicted - budget)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔮</span>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Prediksi Pengeluaran Akhir Bulan
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Catat 5 transaksi untuk membuka prediksi
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Saat ini tercatat {thisMonth.length}/5 transaksi di bulan ini.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tip Hemat Dipersonalisasi dengan Jatah Harian Aktual */}
        {tip && (
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-4 text-white shadow-md">
            <p className="text-xs text-white/75 font-semibold uppercase tracking-wide mb-1.5">
              💡 Tip Hemat Dipersonalisasi
            </p>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tip.icon}</span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">{tip.tip}</p>
            </div>
            <button
              onClick={() => navigate('/hemat')}
              className="mt-3 text-xs text-white/80 font-semibold underline underline-offset-2"
            >
              Buka Tantangan & Resep Hemat →
            </button>
          </div>
        )}

        {/* Kategori Terbesar */}
        {stats.byCategory.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
            <h2 className="font-bold text-gray-800 text-sm mb-3">
              Pengeluaran per Kategori {selectedMonthName}
            </h2>
            <div className="flex flex-col gap-2">
              {stats.byCategory.slice(0, 4).map((cat) => {
                const pct = stats.thisMonthTotal > 0 ? (cat.value / stats.thisMonthTotal) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {CATEGORY_ICONS[cat.name] || '💳'} {cat.name}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{formatRupiah(cat.value)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {thisMonth.length === 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-card text-center border border-white/60">
            <span className="text-6xl block mb-4">🧾</span>
            <h3 className="font-bold text-gray-700 text-lg">
              Belum ada pengeluaran di {selectedMonthName} {selectedYear}
            </h3>
            <p className="text-gray-400 text-sm mt-2 mb-5">
              Mulai scan struk atau input manual untuk memantau keuanganmu
            </p>
            <button
              onClick={() => navigate('/scan')}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark active:scale-95 transition-all shadow-md"
            >
              📸 Scan Struk Pertama
            </button>
          </div>
        )}
      </div>

      {/* Modal Sesuaikan Saldo Kapan Saja */}
      <BalanceAdjustModal
        isOpen={showAdjustBalanceModal}
        onClose={() => setShowAdjustBalanceModal(false)}
        onSaved={(newCfg) => setAllowanceConfig(newCfg)}
      />
    </div>
  );
}
