/**
 * Dashboard.jsx — Halaman utama dengan ringkasan Jatah Harian Aman, sisa uang riil,
 * navigasi bulan, batas belanja bulanan sekunder, dan chart aktivitas 7 hari.
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Sliders,
  PlusCircle,
  Receipt,
  Trophy,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Edit3,
  Users,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Truck,
  MapPin,
} from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { predictEndOfMonth, generateTip, formatRupiah } from '../utils/prediction';
import { toLocalDateString, todayLocal } from '../utils/date';
import {
  getAllowanceConfig,
  fetchAllowanceConfigFromSupabase,
  calculateAllowanceCycle,
} from '../utils/pocketMoney';
import { markNoSpendDay, isNoSpendDay } from '../utils/challenges';
import { ExpenseBarChart } from '../components/Chart';
import BalanceAdjustModal from '../components/BalanceAdjustModal';
import CategoryIcon from '../components/CategoryIcon';

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
    <div className="min-h-screen bg-[#F8FAF8] pb-28">
      {/* Header Utama: Hijau Zamrud Segar + Aksen Emas */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#059669] px-4 pt-12 pb-14 relative overflow-hidden shadow-md">
        {/* Subtle Decorative Light Orbs */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-amber-300/15 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/15 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />

        {/* Profil & Navigasi Bulan */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-300/80 bg-white/20 flex items-center justify-center flex-shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform"
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
              <p className="text-emerald-100 text-xs font-medium">{greeting},</p>
              <h1 className="text-lg font-black text-white truncate max-w-[170px] sm:max-w-[220px]">
                {user?.user_metadata?.full_name || 'Mahasiswa'}
              </h1>
            </div>
          </div>

          {/* Quick Month Navigator Badge */}
          <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/25 text-xs shadow-sm">
            <button
              onClick={prevMonth}
              className="text-white/80 hover:text-white p-0.5 font-bold active:scale-95"
              title="Bulan sebelumnya"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-white font-extrabold text-[11px] px-1 whitespace-nowrap">
              {stats.selectedMonthShort} {selectedYear}
            </span>
            <button
              onClick={nextMonth}
              className="text-white/80 hover:text-white p-0.5 font-bold active:scale-95"
              title="Bulan selanjutnya"
              aria-label="Bulan selanjutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* JATAH HARIAN AMAN — Hero Card Bersih (Putih + Hijau + Emas) */}
        <div className="relative z-10 bg-white rounded-3xl p-5 text-slate-800 shadow-xl border border-emerald-950/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jatah Harian Aman Hari Ini</span>
            </span>
            <button
              id="btn-tambah-saldo"
              onClick={() => setShowAdjustBalanceModal(true)}
              className="text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              title="Tambah saldo uang saku"
              aria-label="Tambah Saldo"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>+ Tambah Saldo</span>
            </button>
          </div>

          <div className="mt-2.5">
            <p className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight ph-no-capture">
              {formatRupiah(cycleData.safeDailySpend)}
              <span className="text-xs sm:text-sm font-semibold text-slate-400"> /hari</span>
            </p>
          </div>

          {/* Sisa Uang Saku & Kiriman — Badge Emas Ramah & Jelas */}
          <div className="mt-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl p-2.5 px-3 flex items-center justify-between text-xs text-amber-950 ph-no-capture">
            <span className="font-medium text-amber-900">
              Sisa Uang: <strong className="font-extrabold text-amber-950">{formatRupiah(cycleData.remainingAllowance)}</strong>
            </span>
            <span className="font-semibold text-amber-800 text-[11px]">
              Kiriman {cycleData.daysLeft} hari lagi ({cycleData.nextPayDate})
            </span>
          </div>

          {/* Sekunder: Pengeluaran Bulan Ini */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Terpakai {isCurrentMonth ? 'Bulan Ini' : selectedMonthName}:</span>
            <span className="font-extrabold text-slate-900 text-sm ph-no-capture">{formatRupiah(stats.thisMonthTotal)}</span>
          </div>

          {/* Sekunder: Budget Limit Bulanan */}
          {budget > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-[11px] text-slate-500 mb-1 ph-no-capture">
                <span>Batas belanja bulanan ({formatRupiah(budget)}):</span>
                <span className={budgetStatus.status === 'danger' ? 'text-rose-600 font-bold' : 'text-emerald-700 font-semibold'}>
                  {budgetStatus.status === 'danger'
                    ? `Over ${formatRupiah(Math.abs(budgetStatus.remaining))}`
                    : `Sisa ${formatRupiah(budgetStatus.remaining)}`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetStatus.status === 'danger' ? 'bg-rose-500' : 'bg-emerald-500'
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
            icon: Receipt,
            label: 'Transaksi',
            value: `${stats.thisMonthCount}x`,
            subValue: null,
            gradient: 'from-emerald-600 to-teal-700',
          },
          {
            icon: Trophy,
            label: 'Top Kategori',
            value: stats.topCategory ? (
              <span className="inline-flex items-center gap-1 justify-center truncate">
                <CategoryIcon category={stats.topCategory} className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{stats.topCategory}</span>
              </span>
            ) : (
              '—'
            ),
            subValue: stats.topCategory && stats.topCategoryAmount ? formatRupiah(stats.topCategoryAmount) : null,
            gradient: 'from-amber-500 to-amber-600',
          },
          {
            icon: Calendar,
            label: 'Rata/hari',
            value: prediction?.dailyAvg ? formatRupiah(prediction.dailyAvg) : '—',
            subValue: null,
            gradient: 'from-emerald-700 to-emerald-800',
          },
        ].map((item) => {
          const ItemIcon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-md border border-slate-100/80 text-center flex flex-col justify-between">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mx-auto mb-1 sm:mb-1.5 shadow-sm`}>
                <ItemIcon className="w-4 h-4 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">{item.label}</p>
                <div className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 truncate ph-no-capture">{item.value}</div>
                {item.subValue && (
                  <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 truncate mt-0.5 ph-no-capture">
                    {item.subValue}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 space-y-4">
        {/* Banner Check-in: "Hari ini aku tidak belanja" */}
        {isCurrentMonth && (
          <div className="bg-gradient-to-r from-emerald-50 via-emerald-50/70 to-amber-50/50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  {noSpendToday ? 'Hari Hemat Tercatat! 🧘' : 'Tidak jajan hari ini?'}
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
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aku Tidak Belanja</span>
              </button>
            ) : (
              <span className="text-[11px] bg-emerald-200/80 text-emerald-900 font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                <span>Tercatat</span>
              </span>
            )}
          </div>
        )}

        {/* Banner Live Tracking Sampah (Surabaya Live Tracker) */}
        <div
          id="btn-live-tracking-sampah"
          onClick={() => navigate('/tracking')}
          className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/50 border border-emerald-200/90 rounded-2xl p-3.5 shadow-sm cursor-pointer hover:border-emerald-300 active:scale-[0.99] transition-all group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    Live Tracking Sampah
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-xs font-bold text-emerald-950 truncate mt-0.5">
                  Batch #GW-SBY-081: Menuju Pabrik SIER Rungkut
                </p>
                <p className="text-[11px] text-emerald-700 truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span>Jl. Raya Darmo &rarr; Rungkut (Tahap 2/5)</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 whitespace-nowrap pl-1">
              <span>Lacak</span>
              <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Quick Actions (Scan Struk & Input Manual) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-scan-struk"
            onClick={() => navigate('/scan')}
            className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <Camera className="w-7 h-7 text-white" />
            <span className="text-sm font-extrabold tracking-tight">Scan Struk</span>
          </button>
          <button
            id="btn-input-manual"
            onClick={() => navigate('/scan?mode=manual')}
            className="bg-white text-emerald-950 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border-2 border-emerald-600/20 hover:border-emerald-600 hover:bg-emerald-50/40 active:scale-95 transition-all"
          >
            <Edit3 className="w-7 h-7 text-emerald-600" />
            <span className="text-sm font-extrabold tracking-tight">Input Manual</span>
          </button>
        </div>

        {/* Fitur Favorit: Split Bill & Tantangan Hemat */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="btn-split-bill"
            onClick={() => navigate('/social')}
            className="py-2.5 px-3 bg-white hover:bg-emerald-50/50 active:scale-95 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Split Bill / Patungan</span>
          </button>
          <button
            id="btn-tantangan-hemat"
            onClick={() => navigate('/hemat')}
            className="py-2.5 px-3 bg-white hover:bg-amber-50/50 active:scale-95 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Tantangan & Resep</span>
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
            <button onClick={() => navigate('/history')} className="text-xs text-primary font-semibold flex items-center gap-1">
              <span>Lihat Kalender</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ExpenseBarChart data={chartData} height={160} />
        </div>

        {/* Prediksi Akhir Bulan: Hanya tampil jika ada minimal 7 hari data DAN 5 transaksi */}
        {hasEnoughPredictionData ? (
          <div className={`rounded-2xl p-4 shadow-card border ${
            prediction.predicted > budget && budget > 0
              ? 'bg-rose-50 border-rose-200'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs flex-shrink-0">
                {prediction.predicted > budget && budget > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Prediksi Akhir Bulan</h3>
                <p className="text-xl font-black text-emerald-700 mt-1">
                  {formatRupiah(prediction.predicted)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Berdasarkan rata-rata {formatRupiah(prediction.dailyAvg)}/hari selama {prediction.daysPassed} hari.
                </p>
                {prediction.predicted > budget && budget > 0 && (
                  <p className="text-xs text-danger font-semibold mt-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-danger flex-shrink-0" />
                    <span>Diprediksi over budget {formatRupiah(prediction.predicted - budget)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-500 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-slate-500" />
              </div>
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
          <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 rounded-2xl p-4 text-white shadow-md">
            <p className="text-xs text-amber-200 font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>Tip Hemat Dipersonalisasi</span>
            </p>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-amber-300" />
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">{tip.tip}</p>
            </div>
            <button
              onClick={() => navigate('/hemat')}
              className="mt-3 text-xs text-emerald-100 font-semibold underline underline-offset-2 flex items-center gap-1 hover:text-white"
            >
              <span>Buka Tantangan & Resep Hemat</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <CategoryIcon category={cat.name} className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-xs font-bold text-gray-900">{formatRupiah(cat.value)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
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
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100">
              <Receipt className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-700 text-lg">
              Belum ada pengeluaran di {selectedMonthName} {selectedYear}
            </h3>
            <p className="text-gray-400 text-sm mt-2 mb-5">
              Mulai scan struk atau input manual untuk memantau keuanganmu
            </p>
            <button
              onClick={() => navigate('/scan')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Struk Pertama</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Tambah Saldo / Sesuaikan Saldo */}
      <BalanceAdjustModal
        isOpen={showAdjustBalanceModal}
        onClose={() => setShowAdjustBalanceModal(false)}
        onSaved={(newCfg) => setAllowanceConfig(newCfg)}
        currentRemaining={cycleData.remainingAllowance}
        daysLeft={cycleData.daysLeft}
      />
    </div>
  );
}
