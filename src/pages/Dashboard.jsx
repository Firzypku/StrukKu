/**
 * Dashboard.jsx — Halaman utama dengan ringkasan pengeluaran & navigasi bulan
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import { useAuth } from '../context/AuthContext';
import { predictEndOfMonth, generateTip, formatRupiah } from '../utils/prediction';
import { CATEGORY_ICONS } from '../utils/ocr';
import { toLocalDateString, todayLocal } from '../utils/date';
import ProgressBar from '../components/ProgressBar';
import { ExpenseBarChart } from '../components/Chart';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    thisMonth,
    stats,
    expenses,
    selectedYear,
    selectedMonth,
    selectedMonthName,
    isCurrentMonth,
    prevMonth,
    nextMonth,
    goToCurrentMonth,
  } = useExpenses();

  const { budget, getStatus } = useBudget();
  const { user } = useAuth();
  
  const [tip, setTip] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    setTip(generateTip(thisMonth));
    setPrediction(predictEndOfMonth(thisMonth));
  }, [thisMonth]);

  const budgetStatus = getStatus(stats.thisMonthTotal);

  // Siapkan data chart: 7 hari terakhir jika bulan sekarang, atau 4 minggu jika bulan lampau
  const chartData = useMemo(() => {
    if (isCurrentMonth) {
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = toLocalDateString(d);
        const dayExpenses = thisMonth.filter((e) => e.date === dateStr);
        const total = dayExpenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
        result.push({
          name: d.toLocaleDateString('id-ID', { weekday: 'short' }),
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
  }, [thisMonth, isCurrentMonth, selectedYear, selectedMonth]);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 11 ? 'Selamat Pagi' : greetingHour < 15 ? 'Selamat Siang' : greetingHour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const userAvatarUrl =
    user?.user_metadata?.avatar_url || (user?.id ? localStorage.getItem(`user_avatar_${user.id}`) : null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B1E36] via-[#123E6B] to-[#1E40AF] px-4 pt-12 pb-16 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl pointer-events-none" />

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

        {/* Total pengeluaran bulan aktif */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
              {isCurrentMonth ? 'Total Pengeluaran Bulan Ini' : `Pengeluaran ${selectedMonthName} ${selectedYear}`}
            </p>
            {!isCurrentMonth && (
              <button
                onClick={goToCurrentMonth}
                className="text-[10px] bg-emerald-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full shadow-sm hover:bg-emerald-300 transition-all active:scale-95"
              >
                Ke Bulan Ini ⚡
              </button>
            )}
          </div>
          <p className="text-4xl font-black text-white mt-1 tracking-tight">{formatRupiah(stats.thisMonthTotal)}</p>
          {budget > 0 && (
            <p className={`text-sm mt-1.5 font-semibold ${budgetStatus.status === 'safe' ? 'text-emerald-300' : budgetStatus.status === 'warning' ? 'text-amber-300' : 'text-rose-300'}`}>
              {budgetStatus.status === 'danger' ? `⚠️ Over budget ${formatRupiah(Math.abs(budgetStatus.remaining))}` :
               budgetStatus.status === 'warning' ? `⚡ Hampir habis, sisa ${formatRupiah(budgetStatus.remaining)}` :
               `✅ Aman, sisa ${formatRupiah(budgetStatus.remaining)}`}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-3 sm:px-4 -mt-8 relative z-10 grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {[
          {
            icon: '📋',
            label: 'Transaksi',
            value: stats.thisMonthCount,
            gradient: 'from-blue-600 to-indigo-600',
          },
          {
            icon: '🏆',
            label: 'Top Kategori',
            value: stats.topCategory ? CATEGORY_ICONS[stats.topCategory] || '💳' : '—',
            gradient: 'from-emerald-500 to-teal-600',
          },
          {
            icon: '📅',
            label: 'Rata/hari',
            value: prediction?.dailyAvg ? `${(prediction.dailyAvg / 1000).toFixed(0)}K` : '—',
            gradient: 'from-violet-600 to-purple-600',
          },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-2 sm:p-3 shadow-md border border-slate-100 text-center">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-sm sm:text-base text-white mx-auto mb-1.5 sm:mb-2 shadow-sm`}>
              {item.icon}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">{item.label}</p>
            <p className="text-xs sm:text-base font-black text-slate-800 mt-0.5 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {/* Fintech Startup Promo / Ad Showcase Banner */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-blue-200/80 bg-white">
          <div className="relative h-28 w-full overflow-hidden bg-slate-950">
            <img
              src="/images/fintech-banner.jpg"
              alt="Promo StrukKu PWA"
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 bg-blue-900/60 border border-blue-400/30 px-2 py-0.5 rounded-full">
                ✨ FITUR STARTUP STRUKKU
              </span>
            </div>
          </div>
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-900">Jelajahi Homepage Baru StrukKu</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Panduan visual 3D, fitur OCR, dan split bill kosan.</p>
            </div>
            <button
              onClick={() => navigate('/landing')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              Lihat →
            </button>
          </div>
        </div>

        {/* Budget Progress */}
        {budget > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-slate-800 text-sm">Budget Bulanan</h2>
              <button
                onClick={() => navigate('/budget')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Ubah →
              </button>
            </div>
            <ProgressBar percent={budgetStatus.percent} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-400">{formatRupiah(stats.thisMonthTotal)} digunakan</span>
              <span className="text-xs text-slate-400">dari {formatRupiah(budget)}</span>
            </div>
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

        {/* Chart Tren Pengeluaran */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="font-bold text-gray-800">
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

        {/* Prediksi Akhir Bulan (atau Ringkasan jika bulan lampau) */}
        {prediction && prediction.predicted > 0 && (
          <div className={`rounded-2xl p-4 shadow-card border ${
            prediction.predicted > budget && budget > 0
              ? 'bg-red-50 border-red-100'
              : 'bg-blue-50 border-blue-100'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{prediction.predicted > budget && budget > 0 ? '⚠️' : '🔮'}</span>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">
                  {isCurrentMonth ? 'Prediksi Akhir Bulan' : `Rekapitulasi ${selectedMonthName}`}
                </h3>
                <p className="text-xl font-black text-primary mt-1">
                  {formatRupiah(isCurrentMonth ? prediction.predicted : stats.thisMonthTotal)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isCurrentMonth ? (
                    <>
                      Berdasarkan rata-rata {formatRupiah(prediction.dailyAvg)}/hari selama {prediction.daysPassed} hari
                      {prediction.confidence === 'low' && ' (data masih sedikit)'}
                    </>
                  ) : (
                    <>Total tercatat selama bulan {selectedMonthName} {selectedYear} ({thisMonth.length} transaksi)</>
                  )}
                </p>
                {prediction.predicted > budget && budget > 0 && isCurrentMonth && (
                  <p className="text-xs text-danger font-semibold mt-1">
                    ❌ Diprediksi over budget {formatRupiah(prediction.predicted - budget)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tip Hemat */}
        {tip && (
          <div className="bg-gradient-to-br from-success to-teal-400 rounded-2xl p-4 text-white">
            <p className="text-xs text-white/60 font-semibold uppercase tracking-wide mb-2">💡 Tip Hemat Hari Ini</p>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tip.icon}</span>
              <p className="text-sm font-semibold leading-relaxed">{tip.tip}</p>
            </div>
            <button
              onClick={() => navigate('/hemat')}
              className="mt-3 text-xs text-white/70 font-semibold underline underline-offset-2"
            >
              Lihat semua tips →
            </button>
          </div>
        )}

        {/* Kategori Terbesar */}
        {stats.byCategory.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
            <h2 className="font-bold text-gray-800 mb-3">
              Pengeluaran per Kategori {selectedMonthName}
            </h2>
            <div className="flex flex-col gap-2">
              {stats.byCategory.slice(0, 4).map((cat) => {
                const pct = stats.thisMonthTotal > 0 ? (cat.value / stats.thisMonthTotal) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 font-medium">
                        {CATEGORY_ICONS[cat.name] || '💳'} {cat.name}
                      </span>
                      <span className="text-sm font-bold text-gray-800">{formatRupiah(cat.value)}</span>
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
            <p className="text-gray-400 text-sm mt-2 mb-5">Mulai scan struk atau input manual untuk memantau keuanganmu</p>
            <button
              onClick={() => navigate('/scan')}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark active:scale-95 transition-all shadow-md"
            >
              📸 Scan Struk Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
