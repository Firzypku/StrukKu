/**
 * Budget.jsx — Siklus Uang Saku Mahasiswa, Jatah Harian Aman, Simulasi Belanja, Rekap Ortu & Budget Kalender
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/useBudget';
import { useExpenses } from '../hooks/useExpenses';
import { formatRupiah } from '../utils/prediction';
import {
  getAllowanceConfig,
  saveAllowanceConfig,
  calculateAllowanceCycle,
  simulatePurchase,
} from '../utils/pocketMoney';
import ProgressBar from '../components/ProgressBar';
import { ExpensePieChart, CategoryLegend } from '../components/Chart';

const QUICK_BUDGETS = [500000, 1000000, 1500000, 2000000, 2500000, 3000000];

export default function Budget() {
  const navigate = useNavigate();
  const { budget, updateBudget, getStatus } = useBudget();
  const { stats, expenses, allExpenses } = useExpenses();

  const [activeTab, setActiveTab] = useState('cycle'); // 'cycle' | 'simulation' | 'parent' | 'standard'

  // Allowance Cycle State
  const [allowanceConfig, setAllowanceConfig] = useState(getAllowanceConfig);
  const [editAllowance, setEditAllowance] = useState(false);
  const [inputAllowanceAmount, setInputAllowanceAmount] = useState(allowanceConfig.monthlyAmount.toString());
  const [inputPayDay, setInputPayDay] = useState(allowanceConfig.payDay.toString());
  const [configSaved, setConfigSaved] = useState(false);

  // Simulation State
  const [simItemName, setSimItemName] = useState('');
  const [simItemPrice, setSimItemPrice] = useState('');
  const [simResult, setSimResult] = useState(null);

  // Parent Report State
  const [reportLevel, setReportLevel] = useState('category'); // 'summary' | 'category' | 'detailed'
  const [copiedReport, setCopiedReport] = useState(false);

  // Standard Budget Input State
  const [inputVal, setInputVal] = useState(budget > 0 ? budget.toString() : '');
  const [savedBudget, setSavedBudget] = useState(false);

  // Calculate current cycle data
  const cycleData = useMemo(() => {
    return calculateAllowanceCycle(allExpenses || expenses, allowanceConfig);
  }, [allExpenses, expenses, allowanceConfig]);

  const budgetStatus = getStatus(stats.thisMonthTotal);

  // Handle Simpan Konfigurasi Siklus Uang Saku
  const handleSaveAllowanceConfig = () => {
    const amt = parseFloat(inputAllowanceAmount) || 0;
    const day = parseInt(inputPayDay, 10) || 1;
    if (amt <= 0) return;
    const newCfg = saveAllowanceConfig(amt, day);
    setAllowanceConfig(newCfg);
    setEditAllowance(false);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  // Handle Simulasi Belanja
  const handleRunSimulation = (e) => {
    e.preventDefault();
    const price = parseFloat(simItemPrice) || 0;
    if (price <= 0) return;
    const res = simulatePurchase(cycleData, simItemName, price);
    setSimResult(res);
  };

  // Handle Simpan Standard Budget
  const handleSaveStandardBudget = () => {
    const val = parseFloat(inputVal.replace(/\./g, '')) || 0;
    if (val <= 0) return;
    updateBudget(val);
    setSavedBudget(true);
    setTimeout(() => setSavedBudget(false), 2000);
  };

  // Generate Pesan Laporan Orang Tua
  const parentReportText = useMemo(() => {
    const studentName = 'Ananda';
    const monthName = stats.selectedMonthName;
    const year = stats.selectedYear;

    let text = `Assalamu'alaikum / Halo Ayah & Ibu 🙏\n\n`;
    text += `Berikut adalah Rekapitulasi Penggunaan Uang Saku bulan *${monthName} ${year}*:\n`;
    text += `--------------------------------\n`;
    text += `💰 Uang Saku: ${formatRupiah(allowanceConfig.monthlyAmount)}\n`;
    text += `📉 Terpakai: ${formatRupiah(cycleData.totalSpentInCycle)}\n`;
    text += `💵 Sisa Uang Saku: ${formatRupiah(cycleData.remainingAllowance)}\n`;
    text += `📅 Sisa Hari ke Kiriman Berikutnya: ${cycleData.daysLeft} hari (s.d. ${cycleData.nextPayDate})\n`;
    text += `🛡️ Jatah Aman Harian: ${formatRupiah(cycleData.safeDailySpend)}/hari\n`;

    if (reportLevel === 'category' || reportLevel === 'detailed') {
      text += `\n📊 *Rincian per Kategori:*\n`;
      stats.byCategory.forEach((cat) => {
        text += `• ${cat.name}: ${formatRupiah(cat.value)}\n`;
      });
    }

    if (reportLevel === 'detailed') {
      text += `\n🧾 *Transaksi Terakhir:*\n`;
      const recent = (allExpenses || expenses).slice(0, 5);
      recent.forEach((e) => {
        text += `• ${e.date}: ${e.title} (${formatRupiah(e.amount)})\n`;
      });
    }

    text += `--------------------------------\n`;
    text += `Alhamdulillah pengelolaan keuangan terkontrol dengan baik lewat aplikasi *StrukKu* 🧾✨`;
    return text;
  }, [allowanceConfig, cycleData, stats, reportLevel, allExpenses, expenses]);

  const handleShareWhatsAppReport = () => {
    const encoded = encodeURIComponent(parentReportText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(parentReportText).then(() => {
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all active:scale-95"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Siklus & Anggaran</h1>
            <p className="text-white/70 text-xs">Jatah harian, simulasi beli & rekap ortu 🎓</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex bg-white/15 rounded-2xl p-1 gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'cycle', label: '🎯 Jatah Harian' },
            { id: 'simulation', label: '🧮 Simulasi Beli' },
            { id: 'parent', label: '👨‍👩‍👦 Rekap Ortu' },
            { id: 'standard', label: '⚙️ Budget Limit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* TAB 1: SIKLUS UANG SAKU & JATAH HARIAN */}
        {activeTab === 'cycle' && (
          <>
            {/* Kartu Jatah Harian Aman */}
            <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-3xl p-5 shadow-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
              
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-wider text-white/75 font-semibold">
                  Jatah Harian Aman Hari Ini
                </span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  Sisa {cycleData.daysLeft} Hari
                </span>
              </div>

              <p className="text-4xl font-black mt-1">
                {formatRupiah(cycleData.safeDailySpend)}
                <span className="text-sm font-normal text-white/80"> /hari</span>
              </p>

              <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-white/70 block">Sisa Uang Saku:</span>
                  <span className="font-extrabold text-sm">{formatRupiah(cycleData.remainingAllowance)}</span>
                </div>
                <div>
                  <span className="text-white/70 block">Kiriman Berikutnya:</span>
                  <span className="font-extrabold text-sm">{cycleData.nextPayDate}</span>
                </div>
              </div>
            </div>

            {/* Peringatan Prediksi Uang Habis (Jika belanja berlebihan) */}
            {cycleData.willRunOutEarly ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm animate-bounce-in">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🚨</span>
                  <div>
                    <h3 className="font-black text-red-800 text-sm">
                      Peringatan: Uang Berpotensi Habis Lebih Awal!
                    </h3>
                    <p className="text-xs text-red-700 mt-1 leading-relaxed">
                      Dengan pola belanja rata-rata <strong>{formatRupiah(cycleData.actualDailyAvg)}/hari</strong>,
                      uang sakumu diprediksi habis pada tanggal{' '}
                      <strong className="underline text-red-900">{cycleData.predictedDepletionDate}</strong>{' '}
                      (<em>{cycleData.daysShortOfPayday} hari sebelum kiriman baru masuk</em>).
                    </p>
                    <p className="text-[11px] text-red-600 mt-2 font-medium bg-red-100/70 p-2 rounded-lg">
                      💡 <strong>Saran:</strong> Batasi belanja harianmu maksimal{' '}
                      <strong>{formatRupiah(cycleData.safeDailySpend)}/hari</strong> agar aman sampai kiriman berikutnya!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="text-xs font-bold text-green-900">Arus Uang Saku Masih Sangat Sehat</p>
                  <p className="text-[11px] text-green-700 mt-0.5">
                    Pengeluaran harianmu terkendali. Pertahankan jatah aman Rp {cycleData.safeDailySpend.toLocaleString('id-ID')}/hari!
                  </p>
                </div>
              </div>
            )}

            {/* Pengaturan Siklus Uang Saku */}
            <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Pengaturan Kiriman Uang Saku</h3>
                  <p className="text-[11px] text-gray-400">Atur sesuai tanggal masuk kiriman dari ortu</p>
                </div>
                <button
                  onClick={() => setEditAllowance(!editAllowance)}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  {editAllowance ? 'Batal' : 'Ubah ⚙️'}
                </button>
              </div>

              {editAllowance ? (
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">
                      Besar Kiriman per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      value={inputAllowanceAmount}
                      onChange={(e) => setInputAllowanceAmount(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">
                      Tanggal Kiriman Masuk Setiap Bulan (Tanggal 1 - 31)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={inputPayDay}
                      onChange={(e) => setInputPayDay(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Contoh: Isi 25 jika uang saku biasa dikirim tiap tanggal 25.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveAllowanceConfig}
                    className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
                  >
                    Simpan Pengaturan Siklus
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Uang Saku per Bulan</span>
                    <span className="font-extrabold text-gray-800 text-sm">
                      {formatRupiah(allowanceConfig.monthlyAmount)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Tanggal Kiriman</span>
                    <span className="font-extrabold text-gray-800 text-sm">
                      Tiap Tanggal {allowanceConfig.payDay}
                    </span>
                  </div>
                </div>
              )}

              {configSaved && (
                <p className="text-xs text-green-600 font-bold mt-2 text-center animate-bounce-in">
                  ✅ Pengaturan uang saku berhasil disimpan!
                </p>
              )}
            </div>
          </>
        )}

        {/* TAB 2: SIMULASI "KALAU AKU BELI..." */}
        {activeTab === 'simulation' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-white/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧮</span>
                <div>
                  <h2 className="font-bold text-gray-800 text-sm">Simulasi: "Kalau Aku Beli..."</h2>
                  <p className="text-xs text-gray-400">Cek dampak belanja sebelum menyesal</p>
                </div>
              </div>

              <form onSubmit={handleRunSimulation} className="space-y-3 mt-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Nama Barang / Rencana Belanja
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Sepatu Converse, Tiket Konser, Kopi Mahal"
                    value={simItemName}
                    onChange={(e) => setSimItemName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Harga Barang (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="Contoh: 350000"
                    value={simItemPrice}
                    onChange={(e) => setSimItemPrice(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  Hitung Dampak terhadap Jatah Harian ⚡
                </button>
              </form>
            </div>

            {/* Hasil Simulasi */}
            {simResult && (
              <div
                className={`rounded-2xl p-5 shadow-card border animate-bounce-in ${
                  simResult.riskLevel === 'danger'
                    ? 'bg-red-50 border-red-200'
                    : simResult.riskLevel === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-sm text-gray-800">
                    Hasil Analisis: {simResult.itemName}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      simResult.riskLevel === 'danger'
                        ? 'bg-red-200 text-red-800'
                        : simResult.riskLevel === 'warning'
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-green-200 text-green-800'
                    }`}
                  >
                    {simResult.riskLevel === 'danger'
                      ? '🚨 Berbahaya'
                      : simResult.riskLevel === 'warning'
                      ? '⚡ Waspada'
                      : '✅ Aman'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 text-center">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-white">
                    <span className="text-[10px] text-gray-500 block">Jatah Harian Saat Ini</span>
                    <span className="text-sm font-extrabold text-gray-800">
                      {formatRupiah(simResult.currentSafeDaily)}/hr
                    </span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-white">
                    <span className="text-[10px] text-gray-500 block">Jatah Harian Setelah Beli</span>
                    <span
                      className={`text-sm font-black ${
                        simResult.newSafeDaily < 15000 ? 'text-red-600' : 'text-primary'
                      }`}
                    >
                      {formatRupiah(simResult.newSafeDaily)}/hr
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium bg-white/60 p-3 rounded-xl">
                  📉 Jatah harianmu akan terpotong sebesar{' '}
                  <strong className="text-red-600">{formatRupiah(simResult.dailyReduction)}/hari</strong> selama{' '}
                  {simResult.daysLeft} hari ke depan sampai kiriman berikutnya tanggal {simResult.nextPayDate}.
                </p>

                <p className="text-xs mt-2 font-bold text-gray-800">{simResult.message}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REKAP UNTUK ORANG TUA */}
        {activeTab === 'parent' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-white/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👨‍👩‍👦</span>
                <div>
                  <h2 className="font-bold text-gray-800 text-sm">Rekap Khusus Orang Tua</h2>
                  <p className="text-xs text-gray-400">Transparansi yang tetap menjaga privasimu</p>
                </div>
              </div>

              <div className="my-4">
                <label className="text-xs font-bold text-gray-600 block mb-2">
                  Tingkat Keterbukaan Laporan:
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1 rounded-xl text-[11px] font-bold">
                  {[
                    { id: 'summary', label: 'Ringkas' },
                    { id: 'category', label: 'Per Kategori' },
                    { id: 'detailed', label: 'Rinci' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setReportLevel(lvl.id)}
                      className={`py-1.5 rounded-lg transition-all ${
                        reportLevel === lvl.id
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Format Pesan */}
              <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/80 font-mono text-[11px] text-gray-700 whitespace-pre-wrap max-h-56 overflow-y-auto no-scrollbar">
                {parentReportText}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleShareWhatsAppReport}
                  className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-green-500/20"
                >
                  <span>📲 Kirim ke WhatsApp Ortu</span>
                </button>
                <button
                  onClick={handleCopyReport}
                  className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs active:scale-95 transition-all"
                  title="Salin pesan"
                >
                  {copiedReport ? '✅ Disalin' : '📋 Salin'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BUDGET LIMIT KALENDER (STANDARD) */}
        {activeTab === 'standard' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-white/60">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Set Limit Budget Bulanan</h2>
                <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">
                  {stats.selectedMonthName} {stats.selectedYear}
                </span>
              </div>

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

              {savedBudget ? (
                <div className="bg-success rounded-2xl p-3 text-white text-center font-bold text-sm animate-bounce-in">
                  ✅ Budget limit tersimpan!
                </div>
              ) : (
                <button
                  onClick={handleSaveStandardBudget}
                  disabled={!inputVal || parseFloat(inputVal) <= 0}
                  className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                    inputVal && parseFloat(inputVal) > 0
                      ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  💾 Simpan Limit Budget
                </button>
              )}
            </div>

            {/* Status Budget */}
            {budget > 0 && (
              <div
                className={`rounded-2xl p-5 shadow-card border ${
                  budgetStatus.status === 'danger'
                    ? 'bg-red-50 border-red-100'
                    : budgetStatus.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-100'
                    : 'bg-green-50 border-green-100'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">
                    {budgetStatus.status === 'danger' ? '🔴' : budgetStatus.status === 'warning' ? '🟡' : '🟢'}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-800">Status Budget Kalender</h3>
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

            {/* Pie Chart Distribusi */}
            {stats.byCategory.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
                <h2 className="font-bold text-gray-800 mb-2">Distribusi Pengeluaran</h2>
                <ExpensePieChart data={stats.byCategory} height={180} />
                <CategoryLegend data={stats.byCategory} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
