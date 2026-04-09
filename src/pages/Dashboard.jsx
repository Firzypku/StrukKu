/**
 * Dashboard.jsx — Halaman utama dengan ringkasan pengeluaran
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import { useBudget } from '../hooks/useBudget';
import { useAuth } from '../context/AuthContext';
import { predictEndOfMonth, generateTip, formatRupiah } from '../utils/prediction';
import { CATEGORY_ICONS } from '../utils/ocr';
import ProgressBar from '../components/ProgressBar';
import { ExpenseBarChart } from '../components/Chart';

export default function Dashboard() {
  const navigate = useNavigate();
  const { thisMonth, stats, expenses } = useExpenses();
  const { budget, getStatus } = useBudget();
  const { user, logout } = useAuth();
  
  const [tip, setTip] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    setTip(generateTip(thisMonth));
    setPrediction(predictEndOfMonth(thisMonth));
  }, [thisMonth]);


  const budgetStatus = getStatus(stats.thisMonthTotal);

  // Siapkan data chart 7 hari terakhir
  const last7Days = (() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayExpenses = thisMonth.filter((e) => e.date === dateStr);
      const total = dayExpenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
      result.push({
        name: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        value: total,
      });
    }
    return result;
  })();

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 11 ? 'Selamat Pagi' : greetingHour < 15 ? 'Selamat Siang' : greetingHour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-4 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-sm">{greeting},</p>
            <h1 className="text-xl font-bold text-white truncate max-w-[250px]">
              {user?.user_metadata?.full_name || 'Mahasiswa'} 🎓
            </h1>
          </div>
        </div>

        {/* Total bulan ini */}
        <div className="relative z-10">
          <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Total Pengeluaran Bulan Ini</p>
          <p className="text-4xl font-black text-white mt-1">{formatRupiah(stats.thisMonthTotal)}</p>
          {budget > 0 && (
            <p className={`text-sm mt-1 font-medium ${budgetStatus.status === 'safe' ? 'text-green-300' : budgetStatus.status === 'warning' ? 'text-yellow-300' : 'text-red-300'}`}>
              {budgetStatus.status === 'danger' ? `⚠️ Over budget ${formatRupiah(Math.abs(budgetStatus.remaining))}` :
               budgetStatus.status === 'warning' ? `⚡ Hampir habis, sisa ${formatRupiah(budgetStatus.remaining)}` :
               `✅ Aman, sisa ${formatRupiah(budgetStatus.remaining)}`}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-8 relative z-10 grid grid-cols-3 gap-3 mb-4">
        {[
          {
            icon: '📋',
            label: 'Transaksi',
            value: stats.thisMonthCount,
            gradient: 'from-primary to-primary-light',
          },
          {
            icon: '🏆',
            label: 'Kategori Top',
            value: stats.topCategory ? CATEGORY_ICONS[stats.topCategory] || '💳' : '—',
            gradient: 'from-success to-success-light',
          },
          {
            icon: '📅',
            label: 'Rata/hari',
            value: prediction?.dailyAvg ? `${(prediction.dailyAvg / 1000).toFixed(0)}K` : '—',
            gradient: 'from-purple-500 to-purple-400',
          },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-3 shadow-card border border-white/60 text-center animate-bounce-in">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-base mx-auto mb-2`}>
              {item.icon}
            </div>
            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
            <p className="text-base font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {/* Budget Progress */}
        {budget > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-800">Budget Bulanan</h2>
              <button
                onClick={() => navigate('/budget')}
                className="text-xs text-primary font-semibold"
              >
                Ubah →
              </button>
            </div>
            <ProgressBar percent={budgetStatus.percent} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400">{formatRupiah(stats.thisMonthTotal)} digunakan</span>
              <span className="text-xs text-gray-400">dari {formatRupiah(budget)}</span>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-scan-struk"
            onClick={() => navigate('/scan')}
            className="bg-primary text-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-md hover:bg-primary-dark active:scale-95 transition-all"
          >
            <span className="text-3xl">📸</span>
            <span className="text-sm font-bold">Scan Struk</span>
          </button>
          <button
            id="btn-input-manual"
            onClick={() => navigate('/scan?mode=manual')}
            className="bg-white text-gray-700 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-card border border-white/60 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <span className="text-3xl">✏️</span>
            <span className="text-sm font-bold">Input Manual</span>
          </button>
        </div>

        {/* Chart 7 hari */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">7 Hari Terakhir</h2>
            <button onClick={() => navigate('/history')} className="text-xs text-primary font-semibold">
              Lihat semua →
            </button>
          </div>
          <ExpenseBarChart data={last7Days} height={160} />
        </div>

        {/* Prediksi Akhir Bulan */}
        {prediction && prediction.predicted > 0 && (
          <div className={`rounded-2xl p-4 shadow-card border ${
            prediction.predicted > budget && budget > 0
              ? 'bg-red-50 border-red-100'
              : 'bg-blue-50 border-blue-100'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{prediction.predicted > budget && budget > 0 ? '⚠️' : '🔮'}</span>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Prediksi Akhir Bulan</h3>
                <p className="text-xl font-black text-primary mt-1">{formatRupiah(prediction.predicted)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Berdasarkan rata-rata {formatRupiah(prediction.dailyAvg)}/hari selama {prediction.daysPassed} hari
                  {prediction.confidence === 'low' && ' (data masih sedikit)'}
                </p>
                {prediction.predicted > budget && budget > 0 && (
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
            <h2 className="font-bold text-gray-800 mb-3">Pengeluaran per Kategori</h2>
            <div className="flex flex-col gap-2">
              {stats.byCategory.slice(0, 4).map((cat, i) => {
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
            <h3 className="font-bold text-gray-700 text-lg">Belum ada pengeluaran</h3>
            <p className="text-gray-400 text-sm mt-2 mb-5">Mulai scan struk atau input manual untuk memantau keuanganmu</p>
            <button
              onClick={() => navigate('/scan')}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark active:scale-95 transition-all"
            >
              📸 Scan Struk Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
