/**
 * challenges.js — Perhitungan otomatis progress tantangan hemat mahasiswa
 * Berdasarkan data riil pengeluaran (expenses) dan batas anggaran (monthly_limit).
 * 
 * Aturan Streak:
 * Hari tanpa catatan TIDAK dihitung sukses.
 * Streak hanya dihitung pada hari ketika pengguna mencatat minimal 1 transaksi
 * ATAU menekan tombol "Hari ini aku tidak belanja" (check-in no-spend day).
 */

import { todayLocal, toLocalDateString } from './date';

const NO_SPEND_STORAGE_KEY = 'strukku_no_spend_days';

/**
 * Mengambil daftar tanggal "Hari ini aku tidak belanja" yang telah dicatat
 * @returns {string[]} array format YYYY-MM-DD
 */
export const getNoSpendDays = () => {
  try {
    const raw = localStorage.getItem(NO_SPEND_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Mencatat tanggal hari ini (atau tanggal tertentu) sebagai hari hemat tanpa belanja
 * @param {string} dateStr - YYYY-MM-DD (default hari ini)
 * @returns {boolean} true jika baru dicatat, false jika sudah pernah dicatat
 */
export const markNoSpendDay = (dateStr = todayLocal()) => {
  try {
    const list = getNoSpendDays();
    if (!list.includes(dateStr)) {
      list.push(dateStr);
      localStorage.setItem(NO_SPEND_STORAGE_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Cek apakah tanggal tertentu sudah dicatat sebagai hari tanpa belanja
 */
export const isNoSpendDay = (dateStr = todayLocal()) => {
  const list = getNoSpendDays();
  return list.includes(dateStr);
};

// Kata kunci belanja bahan masakan / masak sendiri (mudah ditambah/diubah)
export const COOKING_KEYWORDS = [
  'sayur', 'beras', 'telur', 'ayam mentah', 'daging', 'ikan',
  'bumbu', 'minyak', 'pasar', 'tempe', 'tahu', 'bawang', 'cabai',
  'supermarket', 'sayuran', 'buah', 'toko bahan', 'groceries', 'belanja dapur'
];

/**
 * Cek apakah sebuah transaksi masuk kategori masak sendiri
 */
export const isCookingExpense = (expense) => {
  const text = `${expense.title || ''} ${expense.note || ''}`.toLowerCase();
  return COOKING_KEYWORDS.some((kw) => text.includes(kw));
};

/**
 * Hitung streak hari tanpa jajan
 * Syarat sukses per hari:
 * - Pengguna mencatat "Hari ini aku tidak belanja", ATAU
 * - Pengguna mencatat transaksi, dan TIDAK ADA transaksi berkategori Makanan/Minuman/Jajan.
 * Hari tanpa catatan APAPUN dianggap absen (streak terputus).
 */
export const calculateNoSnackStreak = (expenses) => {
  const today = new Date();
  const noSpendDays = getNoSpendDays();
  let streak = 0;

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = toLocalDateString(d);

    const dayExpenses = expenses.filter((e) => e.date === dateStr);
    const hasExpenses = dayExpenses.length > 0;
    const checkedInNoSpend = noSpendDays.includes(dateStr);

    // Jika tidak ada transaksi DAN tidak check-in no-spend
    if (!hasExpenses && !checkedInNoSpend) {
      // Jika ini hari ini (i === 0) dan belum ada catatan hari ini, jangan langsung putus streak kemarin
      if (i === 0) {
        continue;
      }
      break; // Hari kosong tanpa catatan memutus streak
    }

    // Jika pengguna check-in "tidak belanja hari ini", hari ini sukses
    if (checkedInNoSpend && !hasExpenses) {
      streak++;
      continue;
    }

    // Jika ada pengeluaran, cek apakah ada jajan/makanan/minuman
    const hasSnack = dayExpenses.some((e) => {
      const cat = (e.category || '').toLowerCase();
      const title = (e.title || '').toLowerCase();
      return (
        cat === 'makanan' ||
        cat === 'minuman' ||
        title.includes('kopi') ||
        title.includes('coffee') ||
        title.includes('boba') ||
        title.includes('snack') ||
        title.includes('jajan') ||
        title.includes('kafe') ||
        title.includes('cafe')
      );
    });

    if (!hasSnack) {
      streak++;
    } else {
      break; // Ada jajan, streak putus
    }
  }

  return streak;
};

/**
 * Hitung penghematan vs bulan lalu pada periode tanggal yang sama
 */
export const calculateSavingVsLastMonth = (expenses) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // Pengeluaran bulan ini s.d hari ini
  const thisMonthExpenses = expenses.filter((e) => {
    if (!e.date) return false;
    const parts = e.date.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return y === currentYear && m === currentMonth && d <= currentDay;
  });

  // Pengeluaran bulan lalu s.d tanggal yang sama
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastYear = lastMonthDate.getFullYear();
  const lastMonth = lastMonthDate.getMonth();

  const lastMonthExpenses = expenses.filter((e) => {
    if (!e.date) return false;
    const parts = e.date.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return y === lastYear && m === lastMonth && d <= currentDay;
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalLastMonth = lastMonthExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  if (totalLastMonth <= 0) {
    return 0; // Belum ada data pembanding bulan lalu
  }

  const savingPercent = Math.round(((totalLastMonth - totalThisMonth) / totalLastMonth) * 100);
  return Math.max(0, savingPercent);
};

/**
 * Hitung berapa kali masak sendiri bulan ini
 */
export const countCookingThisMonth = (expenses) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return expenses.filter((e) => {
    if (!e.date) return false;
    const parts = e.date.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    return y === currentYear && m === currentMonth && isCookingExpense(e);
  }).length;
};

/**
 * Hitung hari berturut-turut di bawah budget harian (Budget Master)
 * Syarat sukses per hari:
 * - Pengguna mencatat "Hari ini aku tidak belanja" (Rp 0 <= dailyBudget), ATAU
 * - Pengguna mencatat transaksi dan total hari tersebut <= dailyBudget.
 * Hari tanpa catatan APAPUN dianggap tidak ada aktivitas (streak putus).
 */
export const calculateBudgetMasterStreak = (expenses, monthlyBudget) => {
  if (!monthlyBudget || monthlyBudget <= 0) return 0;

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyBudget = monthlyBudget / daysInMonth;
  const noSpendDays = getNoSpendDays();

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = toLocalDateString(d);

    const dayExpenses = expenses.filter((e) => e.date === dateStr);
    const hasExpenses = dayExpenses.length > 0;
    const checkedInNoSpend = noSpendDays.includes(dateStr);

    if (!hasExpenses && !checkedInNoSpend) {
      if (i === 0) {
        continue;
      }
      break; // Hari kosong tanpa catatan memutus streak
    }

    const dayTotal = dayExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

    if (dayTotal <= dailyBudget) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Mengembalikan daftar tantangan beserta progres otomatis
 */
export const getAutomaticChallenges = (expenses = [], monthlyBudget = 0) => {
  const noSnackDays = calculateNoSnackStreak(expenses);
  const savingPercent = calculateSavingVsLastMonth(expenses);
  const cookingCount = countCookingThisMonth(expenses);
  const budgetMasterStreak = calculateBudgetMasterStreak(expenses, monthlyBudget);

  return [
    {
      id: 'ch_1',
      title: 'Tidak Jajan 3 Hari',
      description: 'Pertahankan streak tidak jajan dengan check-in tanpa belanja atau tanpa beli camilan/kopi',
      target: 3,
      progress: Math.min(noSnackDays, 3),
      unit: 'hari',
      badge: '🧘',
      completed: noSnackDays >= 3,
      metricLabel: `${noSnackDays}/3 hari aktif`,
    },
    {
      id: 'ch_2',
      title: 'Hemat 20% vs Bulan Lalu',
      description: 'Kurangi pengeluaran 20% dibanding periode tanggal yang sama bulan lalu',
      target: 20,
      progress: Math.min(savingPercent, 20),
      unit: '%',
      badge: '💚',
      completed: savingPercent >= 20,
      metricLabel: `${savingPercent}% lebih hemat`,
    },
    {
      id: 'ch_3',
      title: 'Masak Sendiri 5x',
      description: 'Catat 5 pengeluaran belanja bahan masakan (sayur, telur, pasar, dll)',
      target: 5,
      progress: Math.min(cookingCount, 5),
      unit: 'kali',
      badge: '🍳',
      completed: cookingCount >= 5,
      metricLabel: `${cookingCount}/5 kali tercatat`,
    },
    {
      id: 'ch_4',
      title: 'Budget Master',
      description: 'Pengeluaran harian tidak melebihi batas budget harian selama 7 hari berturut-turut',
      target: 7,
      progress: Math.min(budgetMasterStreak, 7),
      unit: 'hari',
      badge: '🏆',
      completed: budgetMasterStreak >= 7,
      metricLabel: `${budgetMasterStreak}/7 hari disiplin`,
    },
  ];
};
