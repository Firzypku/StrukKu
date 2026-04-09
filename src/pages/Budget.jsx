/**
 * Budget.jsx — Manajemen budget bulanan
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/useBudget';
import { useExpenses } from '../hooks/useExpenses';
import { predictEndOfMonth, formatRupiah } from '../utils/prediction';
import ProgressBar from '../components/ProgressBar';
import { ExpensePieChart, CategoryLegend } from '../components/Chart';

const QUICK_BUDGETS = [300000, 500000, 750000, 1000000, 1500000, 2000000];

export default function Budget() {
  const navigate = useNavigate();
  const { budget, updateBudget, getStatus } = useBudget();
  const { stats, thisMonth } = useExpenses();
  const [inputVal, setInputVal] = useState(budget > 0 ? budget.toString() : '');
  const [saved, setSaved] = useState(false);

  const budgetStatus = getStatus(stats.thisMonthTotal);
  const prediction = predictEndOfMonth(thisMonth);

  const handleSave = () => {
    const val = parseFloat(inputVal.replace(/\./g, '')) || 0;
    if (val <= 0) return;
    updateBudget(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all">
            ←
          </button>
          <h1 className="text-xl font-bold text-white">Budget Bulanan</h1>
        </div>
        <p className="text-white/60 text-sm ml-12">Kelola keuanganmu dengan bijak 💰</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Budget Input Card */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-white/60">
          <h2 className="font-bold text-gray-800 mb-4">Set Budget Bulan Ini</h2>

          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
            <input
              id="input-budget"
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-xl font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50"
            />
          </div>

          {inputVal && parseFloat(inputVal) > 0 && (
            <p className="text-sm text-primary font-semibold mb-3 ml-1">
              {formatRupiah(parseFloat(inputVal.replace(/\./g, '')))}
            </p>
          )}

          {/* Quick Select */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {QUICK_BUDGETS.map((val) => (
              <button
                key={val}
                id={`quick-budget-${val}`}
                onClick={() => setInputVal(val.toString())}
                className={`py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  parseFloat(inputVal) === val
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-primary/30'
                }`}
              >
                {(val / 1000).toFixed(0)}rb
              </button>
            ))}
          </div>

          {saved ? (
            <div className="bg-success rounded-2xl p-3 text-white text-center font-bold text-sm animate-bounce-in">
              ✅ Budget tersimpan!
            </div>
          ) : (
            <button
              id="btn-save-budget"
              onClick={handleSave}
              disabled={!inputVal || parseFloat(inputVal) <= 0}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                inputVal && parseFloat(inputVal) > 0
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              💾 Simpan Budget
            </button>
          )}
        </div>

        {/* Status Budget */}
        {budget > 0 && (
          <div className={`rounded-2xl p-5 shadow-card border ${
            budgetStatus.status === 'danger'
              ? 'bg-red-50 border-red-100'
              : budgetStatus.status === 'warning'
              ? 'bg-yellow-50 border-yellow-100'
              : 'bg-green-50 border-green-100'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">
                {budgetStatus.status === 'danger' ? '🔴' : budgetStatus.status === 'warning' ? '🟡' : '🟢'}
              </span>
              <div>
                <h3 className="font-bold text-gray-800">Status Budget</h3>
                <p className={`text-sm font-semibold mt-0.5 ${budgetStatus.color}`}>
                  {budgetStatus.label}
                </p>
              </div>
            </div>

            <ProgressBar percent={budgetStatus.percent} />

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'Budget', value: formatRupiah(budget) },
                { label: 'Dipakai', value: formatRupiah(stats.thisMonthTotal) },
                { label: 'Sisa', value: formatRupiah(budgetStatus.remaining) },
              ].map(({ label, value }) => (
                <div key={label} className="text-center bg-white rounded-xl p-2.5">
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prediksi */}
        {budget > 0 && prediction?.predicted > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
            <h2 className="font-bold text-gray-800 mb-3">🔮 Prediksi Akhir Bulan</h2>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Prediksi total:</span>
              <span className={`font-black text-xl ${prediction.predicted > budget ? 'text-danger' : 'text-success'}`}>
                {formatRupiah(prediction.predicted)}
              </span>
            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  prediction.predicted > budget
                    ? 'bg-gradient-to-r from-danger to-danger-light'
                    : 'bg-gradient-to-r from-success to-success-light'
                }`}
                style={{ width: `${Math.min((prediction.predicted / budget) * 100, 100)}%` }}
              />
            </div>

            <p className="text-xs text-gray-400">
              Rata-rata {formatRupiah(prediction.dailyAvg)}/hari · Sisa {prediction.daysLeft} hari
              {prediction.confidence === 'low' && ' · (Data masih sedikit, prediksi belum akurat)'}
            </p>

            {prediction.predicted > budget && (
              <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-xs text-danger font-semibold">
                  ⚠️ Diprediksi over budget {formatRupiah(prediction.predicted - budget)}. Perketat pengeluaran!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pie Chart Kategori */}
        {stats.byCategory.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
            <h2 className="font-bold text-gray-800 mb-2">Distribusi Pengeluaran</h2>
            <ExpensePieChart data={stats.byCategory} height={180} />
            <CategoryLegend data={stats.byCategory} />
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-primary mb-2">💡 Aturan Keuangan Mahasiswa</p>
          <div className="space-y-2">
            {[
              { icon: '🍽️', text: '50% untuk kebutuhan pokok (makan, transport, kuliah)' },
              { icon: '🎮', text: '30% untuk keinginan (hiburan, jajan, shopping)' },
              { icon: '🏦', text: '20% untuk tabungan atau dana darurat' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2">
                <span className="text-lg">{icon}</span>
                <p className="text-xs text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* No budget state */}
        {budget === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center shadow-card border border-white/60">
            <span className="text-5xl block mb-3">💰</span>
            <p className="font-bold text-gray-700">Belum ada budget</p>
            <p className="text-gray-400 text-sm mt-1">Set budget di atas untuk mulai tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}
