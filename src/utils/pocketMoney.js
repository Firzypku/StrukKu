/**
 * pocketMoney.js — Mesin perhitungan Siklus Uang Saku, Jatah Harian Aman, dan Simulasi Belanja
 * Dirancang khusus mengikuti ritme keuangan mahasiswa rantau Indonesia.
 */

const STORAGE_KEY = 'strukku_allowance_config';

export const DEFAULT_ALLOWANCE_CONFIG = {
  monthlyAmount: 1500000, // Rp 1.500.000
  payDay: 25, // Tanggal 25 setiap bulan
};

/**
 * Mengambil konfigurasi uang saku pengguna
 */
export const getAllowanceConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ALLOWANCE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      monthlyAmount: parseFloat(parsed.monthlyAmount) || DEFAULT_ALLOWANCE_CONFIG.monthlyAmount,
      payDay: parseInt(parsed.payDay, 10) || DEFAULT_ALLOWANCE_CONFIG.payDay,
    };
  } catch {
    return DEFAULT_ALLOWANCE_CONFIG;
  }
};

/**
 * Menyimpan konfigurasi uang saku
 */
export const saveAllowanceConfig = (monthlyAmount, payDay) => {
  const config = {
    monthlyAmount: Math.max(0, parseFloat(monthlyAmount) || 0),
    payDay: Math.min(31, Math.max(1, parseInt(payDay, 10) || 1)),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  return config;
};

/**
 * Menghitung detail siklus uang saku saat ini
 * @param {Array} expenses - Semua data transaksi pengeluaran
 * @param {Object} config - Konfigurasi uang saku
 */
export const calculateAllowanceCycle = (expenses = [], config = null) => {
  const cfg = config || getAllowanceConfig();
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let cycleStartDate, nextPayDate;

  if (currentDay >= cfg.payDay) {
    // Siklus dimulai pada payDay bulan ini, berakhir sebelum payDay bulan depan
    cycleStartDate = new Date(currentYear, currentMonth, cfg.payDay);
    nextPayDate = new Date(currentYear, currentMonth + 1, cfg.payDay);
  } else {
    // Siklus dimulai pada payDay bulan lalu, berakhir sebelum payDay bulan ini
    cycleStartDate = new Date(currentYear, currentMonth - 1, cfg.payDay);
    nextPayDate = new Date(currentYear, currentMonth, cfg.payDay);
  }

  // Format ISO strings untuk perbandingan (YYYY-MM-DD)
  const formatISO = (d) => d.toISOString().split('T')[0];
  const startStr = formatISO(cycleStartDate);
  const nextPayStr = formatISO(nextPayDate);

  // Filter pengeluaran yang masuk ke siklus berjalan
  const cycleExpenses = expenses.filter((e) => {
    if (!e.date) return false;
    return e.date >= startStr && e.date < nextPayStr;
  });

  const totalSpentInCycle = cycleExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const remainingAllowance = Math.max(0, cfg.monthlyAmount - totalSpentInCycle);

  // Sisa hari menuju tanggal kiriman berikutnya (inklusif hari ini)
  const oneDayMs = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(1, Math.ceil((nextPayDate.getTime() - now.getTime()) / oneDayMs));
  const daysPassed = Math.max(1, Math.floor((now.getTime() - cycleStartDate.getTime()) / oneDayMs) + 1);

  // Jatah Harian Aman (Safe Daily Spend)
  const safeDailySpend = Math.round(remainingAllowance / daysLeft);

  // Rata-rata belanja harian aktual sejauh ini
  const actualDailyAvg = Math.round(totalSpentInCycle / daysPassed);

  // Prediksi "Uang Habis Tanggal Berapa"
  let predictedDepletionDate = null;
  let daysUntilDepleted = null;
  let willRunOutEarly = false;
  let daysShortOfPayday = 0;

  if (actualDailyAvg > 0 && remainingAllowance > 0) {
    daysUntilDepleted = Math.floor(remainingAllowance / actualDailyAvg);
    if (daysUntilDepleted < daysLeft) {
      willRunOutEarly = true;
      daysShortOfPayday = daysLeft - daysUntilDepleted;
      const depDate = new Date(now.getTime() + daysUntilDepleted * oneDayMs);
      predictedDepletionDate = depDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  } else if (remainingAllowance <= 0) {
    willRunOutEarly = true;
    daysShortOfPayday = daysLeft;
    predictedDepletionDate = 'Sudah Habis Hari Ini';
  }

  return {
    monthlyAmount: cfg.monthlyAmount,
    payDay: cfg.payDay,
    cycleStartDate: cycleStartDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    nextPayDate: nextPayDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    daysLeft,
    daysPassed,
    totalSpentInCycle,
    remainingAllowance,
    safeDailySpend,
    actualDailyAvg,
    willRunOutEarly,
    predictedDepletionDate,
    daysShortOfPayday,
    cycleExpensesCount: cycleExpenses.length,
  };
};

/**
 * Simulasi "Kalau Aku Beli..."
 * Menghitung dampak pembelian impulsif terhadap jatah harian hingga tanggal kiriman berikutnya.
 */
export const simulatePurchase = (cycleData, itemName, itemPrice) => {
  const price = parseFloat(itemPrice) || 0;
  if (!cycleData || price <= 0) return null;

  const currentSafeDaily = cycleData.safeDailySpend;
  const newRemaining = Math.max(0, cycleData.remainingAllowance - price);
  const newSafeDaily = Math.round(newRemaining / cycleData.daysLeft);
  const dailyReduction = currentSafeDaily - newSafeDaily;

  let riskLevel = 'safe';
  let message = 'Pembelian ini masih aman bagi jatah harianmu!';

  if (newRemaining <= 0) {
    riskLevel = 'danger';
    message = 'Uang sakumu akan langsung habis jika membeli barang ini!';
  } else if (newSafeDaily < 15000) {
    riskLevel = 'danger';
    message = `Jatah harianmu turun drastis jadi Rp ${newSafeDaily.toLocaleString('id-ID')}/hari. Sangat berisiko untuk makan sehari-hari!`;
  } else if (newSafeDaily < 25000) {
    riskLevel = 'warning';
    message = `Jatah harianmu berkurang Rp ${dailyReduction.toLocaleString('id-ID')}/hari. Kamu harus lebih hemat sampai tanggal kiriman.`;
  }

  return {
    itemName: itemName || 'Barang Impian',
    price,
    currentSafeDaily,
    newSafeDaily,
    dailyReduction,
    newRemaining,
    riskLevel,
    message,
    daysLeft: cycleData.daysLeft,
    nextPayDate: cycleData.nextPayDate,
  };
};
