/**
 * challenges.js — Perhitungan otomatis progress tantangan hemat mahasiswa
 * Berdasarkan data riil pengeluaran (expenses) dan batas anggaran (monthly_limit).
 */

import { todayLocal, toLocalDateString } from './date';

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
 * Hitung streak hari tanpa jajan (kategori Makanan/Minuman atau jajan)
 */
export const calculateNoSnackStreak = (expenses) => {
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = toLocalDateString(d);

    const dayExpenses = expenses.filter((e) => e.date === dateStr);
    const hasSnack = dayExpenses.some((e) => {
      const cat = (e.category || '').toLowerCase();
      const title = (e.title || '').toLowerCase();
      return (
        cat === 'makanan' ||
        cat === 'minuman' ||
        title.includes('kopi') ||
        title.includes('boba') ||
        title.includes('snack') ||
        title.includes('jajan')
      );
    });

    if (!hasSnack) {
      streak++;
    } else {
      // Streak terputus
      if (i > 0) break;
    }
  }

  return streak;
};

/**
 * Hitung penghematan vs bulan lalu pada periode tanggal yang sama
 * Misal hari ini tgl 24: membandingkan tgl 1-24 bulan ini vs tgl 1-24 bulan lalu
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
 */
export const calculateBudgetMasterStreak = (expenses, monthlyBudget) => {
  if (!monthlyBudget || monthlyBudget <= 0) return 0;

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyBudget = monthlyBudget / daysInMonth;

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = toLocalDateString(d);

    const dayTotal = expenses
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

    if (dayTotal <= dailyBudget) {
      streak++;
    } else {
      if (i > 0) break;
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
      description: 'Pertahankan streak tidak jajan selama 3 hari berturut-turut',
      target: 3,
      progress: Math.min(noSnackDays, 3),
      unit: 'hari',
      badge: '🧘',
      completed: noSnackDays >= 3,
      metricLabel: `${noSnackDays}/3 hari streak`,
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
