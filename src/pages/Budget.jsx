/**
 * Budget.jsx — Siklus Uang Saku Mahasiswa, Jatah Harian Aman, Simulasi Belanja, Rekap Ortu & Budget Kalender
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Calculator,
  Users,
  SlidersHorizontal,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Check,
  Sliders,
  Edit3,
  Share2,
  Copy,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useExpenses } from '../hooks/useExpenses';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../utils/prediction';
import {
  getAllowanceConfig,
  fetchAllowanceConfigFromSupabase,
  saveAllowanceConfig,
  calculateAllowanceCycle,
  simulatePurchase,
} from '../utils/pocketMoney';
import ProgressBar from '../components/ProgressBar';
import { ExpensePieChart, CategoryLegend } from '../components/Chart';
import BalanceAdjustModal from '../components/BalanceAdjustModal';

const QUICK_BUDGETS = [500000, 1000000, 1500000, 2000000, 2500000, 3000000];

const BUDGET_MENU_ITEMS = [
  {
    id: 'cycle',
    label: 'Jatah Harian Aman',
    shortLabel: 'Jatah Harian',
    subtitle: 'Siklus uang saku & batas belanja harian aman',
    icon: Target,
    activeBg: 'bg-blue-600 text-white',
    inactiveBg: 'bg-blue-50 text-blue-600',
    tag: 'Rekomendasi',
  },
  {
    id: 'simulation',
    label: 'Simulasi Belanja',
    shortLabel: 'Simulasi Beli',
    subtitle: 'Cek dampak belanja sebelum uang habis',
    icon: Calculator,
    activeBg: 'bg-amber-500 text-white',
    inactiveBg: 'bg-amber-50 text-amber-600',
    tag: 'Kalkulator',
  },
  {
    id: 'parent',
    label: 'Rekap untuk Orang Tua',
    shortLabel: 'Rekap Ortu',
    subtitle: 'Format laporan uang saku via WhatsApp',
    icon: Users,
    activeBg: 'bg-emerald-600 text-white',
    inactiveBg: 'bg-emerald-50 text-emerald-600',
    tag: 'WhatsApp',
  },
  {
    id: 'standard',
    label: 'Target Batas Belanja',
    shortLabel: 'Batas Belanja',
    subtitle: 'Atur limit budget bulanan & pantau grafik',
    icon: SlidersHorizontal,
    activeBg: 'bg-indigo-600 text-white',
    inactiveBg: 'bg-indigo-50 text-indigo-600',
    tag: 'Limit',
  },
];

export default function Budget() {
  const navigate = useNavigate();
  const { budget, updateBudget, getStatus } = useBudget();
  const { stats, expenses, allExpenses } = useExpenses();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('cycle'); // 'cycle' | 'simulation' | 'parent' | 'standard'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const currentTab = BUDGET_MENU_ITEMS.find((item) => item.id === activeTab) || BUDGET_MENU_ITEMS[0];
  const CurrentIcon = currentTab.icon;

  // Allowance Cycle State (Sinkron ke Supabase allowances & localStorage)
  const [allowanceConfig, setAllowanceConfig] = useState(getAllowanceConfig);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [editAllowance, setEditAllowance] = useState(false);
  const [inputAllowanceAmount, setInputAllowanceAmount] = useState(allowanceConfig.monthlyAmount.toString());
  const [inputPayDay, setInputPayDay] = useState(allowanceConfig.payDay.toString());
  const [configSaved, setConfigSaved] = useState(false);

  // Ambil data uang saku dari Supabase saat user login
  useEffect(() => {
    if (user?.id) {
      fetchAllowanceConfigFromSupabase(user.id).then((cfg) => {
        if (cfg) {
          setAllowanceConfig(cfg);
          setInputAllowanceAmount(cfg.monthlyAmount.toString());
          setInputPayDay(cfg.payDay.toString());
        }
      });
    }
  }, [user?.id]);

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
  const handleSaveAllowanceConfig = async () => {
    const amt = parseFloat(inputAllowanceAmount) || 0;
    const day = parseInt(inputPayDay, 10) || 1;
    if (amt <= 0) return;
    const newCfg = await saveAllowanceConfig(amt, day, user?.id);
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
      <div className="bg-gradient-to-br from-[#0B1E36] via-[#123E6B] to-[#1E40AF] px-4 pt-12 pb-5 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-400/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
        
        {/* Top Header Row: Back button, Title, and Hamburger Menu Button */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white hover:bg-white/25 transition-all active:scale-95 border border-white/20"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Siklus & Anggaran</h1>
              <p className="text-white/60 text-xs">Jatah harian, simulasi beli & rekap ortu 🎓</p>
            </div>
          </div>

          {/* Quick Burger/Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 border ${
              isMenuOpen
                ? 'bg-white text-primary border-white shadow-md'
                : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
            }`}
            aria-expanded={isMenuOpen}
            aria-label="Pilih menu anggaran"
            title="Pilih fitur anggaran"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Compact Dropdown Feature Switcher Pill */}
        <div className="relative z-30" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="w-full flex items-center justify-between bg-white/12 hover:bg-white/20 active:bg-white/25 backdrop-blur-md border border-white/20 rounded-2xl p-2 pl-2.5 pr-3 text-white transition-all shadow-sm group"
            aria-expanded={isMenuOpen}
            aria-label="Pilih fitur aktif"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${currentTab.activeBg} shadow-sm`}>
                <CurrentIcon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                    Fitur Aktif
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-sm font-black text-white block truncate leading-tight">
                  {currentTab.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-semibold text-blue-100 group-hover:text-white transition-colors bg-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                <span>Pilih Menu</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-white' : 'text-blue-200'}`} />
              </span>
            </div>
          </button>

          {/* Dropdown Menu Modal / Popover */}
          {isMenuOpen && (
            <>
              {/* Backdrop for click outside on mobile */}
              <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Dropdown Card */}
              <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl p-2.5 shadow-2xl border border-slate-100 animate-bounce-in">
                <div className="px-2.5 py-2 border-b border-slate-100 flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Pilih Fitur Anggaran
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    4 Fitur
                  </span>
                </div>

                <div className="space-y-1">
                  {BUDGET_MENU_ITEMS.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-blue-50/90 text-primary border border-blue-200/80 shadow-xs'
                            : 'hover:bg-slate-50 text-slate-700 active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            isActive ? item.activeBg : item.inactiveBg
                          }`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-sm font-bold truncate ${isActive ? 'text-blue-950 font-black' : 'text-slate-800'}`}>
                                {item.label}
                              </span>
                              {isActive ? (
                                <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-full">
                                  Aktif
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-md">
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate leading-tight">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center pl-2 flex-shrink-0">
                          {isActive ? (
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>💡 Ganti fitur kapan saja tanpa kehilangan data</span>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </>
          )}
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
                <button
                  onClick={() => setShowAdjustModal(true)}
                  className="text-[11px] bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1.5 rounded-xl border border-white/25 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-white" />
                  <span>Sesuaikan Saldo</span>
                </button>
              </div>

              <p className="text-4xl font-black mt-1">
                {formatRupiah(cycleData.safeDailySpend)}
                <span className="text-sm font-normal text-white/80"> /hari</span>
              </p>

              <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-white/70 block">Sisa Uang Saat Ini:</span>
                  <span className="font-extrabold text-sm">{formatRupiah(cycleData.remainingAllowance)}</span>
                </div>
                <div>
                  <span className="text-white/70 block">Kiriman Berikutnya:</span>
                  <span className="font-extrabold text-sm">{cycleData.nextPayDate} ({cycleData.daysLeft} hari)</span>
                </div>
              </div>
            </div>

            {/* Peringatan Prediksi Uang Habis (Jika belanja berlebihan) */}
            {cycleData.willRunOutEarly ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm animate-bounce-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
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
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 text-green-700">
                  <ShieldCheck className="w-5 h-5 text-green-700" />
                </div>
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
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  {editAllowance ? (
                    'Batal'
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </>
                  )}
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

            {/* Info Edukasi: Perbedaan Uang Saku & Budget Limit */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-primary">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Pahami Pengelolaan Keuanganmu:</span>
              </div>
              <div className="space-y-1.5 text-gray-600 leading-relaxed text-[11px]">
                <p>
                  • <strong className="text-gray-800">Uang Saku (Pemasukan per Siklus):</strong> Nominal total kiriman yang kamu terima (dari ortu/beasiswa) dihitung dari tanggal kiriman bulan ini sampai kiriman berikutnya untuk membagi <em>Jatah Harian Aman</em>.
                </p>
                <p>
                  • <strong className="text-gray-800">Budget Limit (Batas Belanja):</strong> Target batas maksimal pengeluaran bulanan yang kamu tetapkan sendiri di tab <em>Target Batas Belanja</em> agar ada sisa uang saku untuk ditabung.
                </p>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: SIMULASI "KALAU AKU BELI..." */}
        {activeTab === 'simulation' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-white/60">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
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
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
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
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Kirim ke WhatsApp Ortu</span>
                </button>
                <button
                  onClick={handleCopyReport}
                  className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5"
                  title="Salin pesan"
                >
                  {copiedReport ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-500" />
                      <span>Salin</span>
                    </>
                  )}
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
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-sm">Target Batas Belanja Bulanan</h2>
                    <p className="text-xs text-gray-400">Atur batas pengeluaran bulanan</p>
                  </div>
                </div>
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

      {/* Modal Sesuaikan Saldo */}
      <BalanceAdjustModal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        onSaved={(newCfg) => setAllowanceConfig(newCfg)}
      />
    </div>
  );
}
