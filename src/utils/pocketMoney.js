/**
 * pocketMoney.js — Mesin perhitungan Siklus Uang Saku, Jatah Harian Aman, dan Simulasi Belanja
 * Dirancang khusus mengikuti ritme keuangan mahasiswa rantau Indonesia.
 * Mendukung Onboarding Siklus ("Berapa sisa uangmu sekarang?" & "Kapan kiriman berikutnya?"),
 * penyesuaian saldo kapan saja, sinkronisasi Supabase 'allowances', dan cache lokal localStorage.
 */

import { toLocalDateString, todayLocal } from './date';
import { supabase } from './supabase';

const STORAGE_KEY = 'strukku_allowance_config';

export const DEFAULT_ALLOWANCE_CONFIG = {
  monthlyAmount: 1500000, // Rp 1.500.000
  payDay: 25, // Tanggal 25 setiap bulan
  currentBalance: 1500000,
  balanceSetAt: todayLocal(),
  nextPayDate: null,
  isOnboarded: false,
};

/**
 * Mengambil konfigurasi uang saku dari localStorage (Sinkron, untuk render awal instan)
 */
export const getAllowanceConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ALLOWANCE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      monthlyAmount: parseFloat(parsed.monthlyAmount) || DEFAULT_ALLOWANCE_CONFIG.monthlyAmount,
      payDay: parseInt(parsed.payDay, 10) || DEFAULT_ALLOWANCE_CONFIG.payDay,
      currentBalance: parsed.currentBalance !== undefined ? parseFloat(parsed.currentBalance) : parseFloat(parsed.monthlyAmount) || DEFAULT_ALLOWANCE_CONFIG.currentBalance,
      balanceSetAt: parsed.balanceSetAt || todayLocal(),
      nextPayDate: parsed.nextPayDate || null,
      isOnboarded: !!parsed.isOnboarded,
    };
  } catch {
    return DEFAULT_ALLOWANCE_CONFIG;
  }
};

/**
 * Mengambil konfigurasi uang saku dari Supabase 'allowances' & otomatis migrasi dari localStorage
 * @param {string} userId
 */
export const fetchAllowanceConfigFromSupabase = async (userId) => {
  if (!userId) return getAllowanceConfig();

  try {
    const { data, error } = await supabase
      .from('allowances')
      .select('monthly_amount, pay_day, current_balance, balance_set_at, next_pay_date, is_onboarded')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Tabel allowances belum aktif atau error jaringan, menggunakan localStorage:', error.message);
      return getAllowanceConfig();
    }

    if (data) {
      const config = {
        monthlyAmount: parseFloat(data.monthly_amount) || DEFAULT_ALLOWANCE_CONFIG.monthlyAmount,
        payDay: parseInt(data.pay_day, 10) || DEFAULT_ALLOWANCE_CONFIG.payDay,
        currentBalance: data.current_balance !== null && data.current_balance !== undefined
          ? parseFloat(data.current_balance)
          : parseFloat(data.monthly_amount) || DEFAULT_ALLOWANCE_CONFIG.currentBalance,
        balanceSetAt: data.balance_set_at || todayLocal(),
        nextPayDate: data.next_pay_date || null,
        isOnboarded: data.is_onboarded ?? true,
      };
      // Sinkronkan ke localStorage sebagai cache offline
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      return config;
    }

    // Jika belum ada data di Supabase, simpan data lokal
    const localConfig = getAllowanceConfig();
    try {
      await supabase.from('allowances').upsert({
        user_id: userId,
        monthly_amount: localConfig.monthlyAmount,
        pay_day: localConfig.payDay,
        current_balance: localConfig.currentBalance,
        balance_set_at: localConfig.balanceSetAt,
        next_pay_date: localConfig.nextPayDate,
        is_onboarded: localConfig.isOnboarded,
      }, { onConflict: 'user_id' });
    } catch (upsertErr) {
      console.warn('Gagal migrasi otomatis uang saku ke Supabase:', upsertErr);
    }

    return localConfig;
  } catch (err) {
    console.warn('Gagal memuat uang saku dari Supabase:', err);
    return getAllowanceConfig();
  }
};

/**
 * Menyimpan penyesuaian saldo riil & tanggal kiriman berikutnya
 * Dipakai saat Onboarding Siklus atau tombol "Sesuaikan Saldo" kapan saja
 * @param {number} newBalance - Sisa uang sekarang (Rp)
 * @param {string} nextPayDate - Tanggal kiriman berikutnya (YYYY-MM-DD)
 * @param {number|null} monthlyAmount - Estimasi uang kiriman bulanan (opsional)
 * @param {string|null} userId
 */
export const adjustBalance = async (newBalance, nextPayDate, monthlyAmount = null, userId = null) => {
  const prev = getAllowanceConfig();
  const amt = Math.max(0, parseFloat(newBalance) || 0);
  const targetDateStr = nextPayDate || prev.nextPayDate;
  
  // Ambil tanggal kiriman (day of month) jika ada target date
  let derivedPayDay = prev.payDay;
  if (targetDateStr) {
    const parts = targetDateStr.split('-');
    if (parts.length === 3) {
      derivedPayDay = parseInt(parts[2], 10) || prev.payDay;
    }
  }

  const config = {
    ...prev,
    currentBalance: amt,
    balanceSetAt: todayLocal(),
    nextPayDate: targetDateStr,
    payDay: derivedPayDay,
    monthlyAmount: monthlyAmount ? Math.max(0, parseFloat(monthlyAmount)) : prev.monthlyAmount || amt,
    isOnboarded: true,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

  if (userId) {
    try {
      await supabase.from('allowances').upsert({
        user_id: userId,
        monthly_amount: config.monthlyAmount,
        pay_day: config.payDay,
        current_balance: config.currentBalance,
        balance_set_at: config.balanceSetAt,
        next_pay_date: config.nextPayDate,
        is_onboarded: true,
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.warn('Gagal menyimpan penyesuaian saldo ke Supabase:', err);
    }
  }

  return config;
};

/**
 * Menyimpan konfigurasi uang saku ke localStorage dan cloud Supabase (Legacy compatibility)
 */
export const saveAllowanceConfig = async (monthlyAmount, payDay, userId = null) => {
  const prev = getAllowanceConfig();
  const config = {
    ...prev,
    monthlyAmount: Math.max(0, parseFloat(monthlyAmount) || 0),
    payDay: Math.min(31, Math.max(1, parseInt(payDay, 10) || 1)),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

  if (userId) {
    try {
      await supabase.from('allowances').upsert({
        user_id: userId,
        monthly_amount: config.monthlyAmount,
        pay_day: config.payDay,
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.warn('Gagal menyimpan uang saku ke database cloud Supabase:', err);
    }
  }

  return config;
};

/**
 * Menghitung detail siklus uang saku & jatah harian saat ini
 * Logika:
 * Jatah harian = sisa uang saat ini dikurangi pengeluaran sejak onboarding/penyesuaian, dibagi sisa hari.
 * @param {Array} expenses - Semua data transaksi pengeluaran
 * @param {Object} config - Konfigurasi uang saku
 */
export const calculateAllowanceCycle = (expenses = [], config = null) => {
  const cfg = config || getAllowanceConfig();
  const now = new Date();
  const todayStr = todayLocal();

  let nextPayDateObj;

  if (cfg.nextPayDate) {
    // Pengguna menentukan tanggal kiriman berikutnya secara spesifik
    const [ny, nm, nd] = cfg.nextPayDate.split('-').map(Number);
    nextPayDateObj = new Date(ny, nm - 1, nd);
  } else {
    // Hitung berdasarkan payDay rutin bulanan
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (currentDay >= cfg.payDay) {
      nextPayDateObj = new Date(currentYear, currentMonth + 1, cfg.payDay);
    } else {
      nextPayDateObj = new Date(currentYear, currentMonth, cfg.payDay);
    }
  }

  // Jika nextPayDateObj sudah lewat dari hari ini, geser ke bulan depan
  const todayDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (nextPayDateObj <= todayDateObj) {
    nextPayDateObj = new Date(todayDateObj.getFullYear(), todayDateObj.getMonth() + 1, cfg.payDay || todayDateObj.getDate());
  }

  // Hitung sisa hari menuju kiriman berikutnya (inklusif hari ini)
  const oneDayMs = 1000 * 60 * 60 * 24;
  const daysLeft = Math.max(1, Math.ceil((nextPayDateObj.getTime() - todayDateObj.getTime()) / oneDayMs));

  // Tanggal mulai siklus / tanggal penyesuaian saldo terakhir
  const balanceSetAtStr = cfg.balanceSetAt || todayStr;

  // Filter pengeluaran sejak saldo terakhir diset
  const expensesSinceBalanceSet = expenses.filter((e) => {
    if (!e.date) return false;
    return e.date >= balanceSetAtStr;
  });

  const totalSpentSinceSet = expensesSinceBalanceSet.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  // Sisa uang saat ini = saldo yang diinput - pengeluaran sejak saat itu
  const initialBalance = cfg.currentBalance !== undefined ? cfg.currentBalance : cfg.monthlyAmount;
  const remainingAllowance = Math.max(0, initialBalance - totalSpentSinceSet);

  // Jatah Harian Aman (Safe Daily Spend)
  const safeDailySpend = Math.round(remainingAllowance / daysLeft);

  // Rata-rata belanja harian aktual
  // Hitung hari berlalu sejak balanceSetAt
  const [sy, sm, sd] = balanceSetAtStr.split('-').map(Number);
  const setDateObj = new Date(sy, sm - 1, sd);
  const daysPassed = Math.max(1, Math.floor((todayDateObj.getTime() - setDateObj.getTime()) / oneDayMs) + 1);
  const actualDailyAvg = Math.round(totalSpentSinceSet / daysPassed);

  // Prediksi uang habis
  let predictedDepletionDate = null;
  let daysUntilDepleted = null;
  let willRunOutEarly = false;
  let daysShortOfPayday = 0;

  if (actualDailyAvg > 0 && remainingAllowance > 0) {
    daysUntilDepleted = Math.floor(remainingAllowance / actualDailyAvg);
    if (daysUntilDepleted < daysLeft) {
      willRunOutEarly = true;
      daysShortOfPayday = daysLeft - daysUntilDepleted;
      const depDate = new Date(todayDateObj.getTime() + daysUntilDepleted * oneDayMs);
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

  const nextPayDateFormatted = nextPayDateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    monthlyAmount: cfg.monthlyAmount,
    payDay: cfg.payDay,
    currentBalance: initialBalance,
    balanceSetAt: balanceSetAtStr,
    nextPayDate: nextPayDateFormatted,
    nextPayDateRaw: toLocalDateString(nextPayDateObj),
    daysLeft,
    daysPassed,
    totalSpentInCycle: totalSpentSinceSet,
    remainingAllowance,
    safeDailySpend,
    actualDailyAvg,
    willRunOutEarly,
    predictedDepletionDate,
    daysShortOfPayday,
    isOnboarded: cfg.isOnboarded,
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
