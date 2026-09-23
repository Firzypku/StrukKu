import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  deleteExpensesByMonth,
  groupByCategory,
  groupByDate,
  sumExpenses,
} from '../utils/storage';

export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export const useExpenses = () => {
  const now = useMemo(() => new Date(), []);
  const [expenses, setExpenses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getExpenses();
      setExpenses(all || []);
    } catch (error) {
      console.error('Error refreshing expenses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Filter pengeluaran untuk bulan yang sedang dipilih
  const selectedMonthExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
  }, [expenses, selectedYear, selectedMonth]);

  // Cek apakah bulan yang dipilih adalah bulan sekarang
  const isCurrentMonth = useMemo(() => {
    const cur = new Date();
    return selectedYear === cur.getFullYear() && selectedMonth === cur.getMonth();
  }, [selectedYear, selectedMonth]);

  // Navigasi bulan
  const prevMonth = useCallback(() => {
    if (selectedMonth === 0) {
      setSelectedYear((y) => y - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  }, [selectedMonth]);

  const nextMonth = useCallback(() => {
    if (selectedMonth === 11) {
      setSelectedYear((y) => y + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  }, [selectedMonth]);

  const setMonthYear = useCallback((year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  }, []);

  const goToCurrentMonth = useCallback(() => {
    const cur = new Date();
    setSelectedYear(cur.getFullYear());
    setSelectedMonth(cur.getMonth());
  }, []);

  // Daftar bulan yang tersedia di data transaksi (diurutkan dari yang terbaru)
  const availableMonths = useMemo(() => {
    const cur = new Date();
    const map = new Map();

    // Pastikan bulan sekarang selalu ada
    const currentKey = `${cur.getFullYear()}-${cur.getMonth()}`;
    map.set(currentKey, {
      year: cur.getFullYear(),
      month: cur.getMonth(),
      label: `${MONTH_NAMES[cur.getMonth()]} ${cur.getFullYear()}`,
      shortLabel: `${MONTH_SHORT_NAMES[cur.getMonth()]} ${cur.getFullYear()}`,
      total: 0,
      count: 0,
      isCurrent: true,
    });

    expenses.forEach((e) => {
      if (!e.date) return;
      const d = new Date(e.date);
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${m}`;

      const existing = map.get(key) || {
        year: y,
        month: m,
        label: `${MONTH_NAMES[m]} ${y}`,
        shortLabel: `${MONTH_SHORT_NAMES[m]} ${y}`,
        total: 0,
        count: 0,
        isCurrent: y === cur.getFullYear() && m === cur.getMonth(),
      };

      existing.total += parseFloat(e.amount) || 0;
      existing.count += 1;
      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [expenses]);

  // Action methods
  const add = async (expense) => {
    setLoading(true);
    try {
      const newExp = await addExpense(expense);
      await refresh();
      return newExp;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, updates) => {
    try {
      await updateExpense(id, updates);
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id) => {
    try {
      await deleteExpense(id);
      await refresh();
    } catch (e) {
      console.error(e);
    }
  };

  // Reset/Hapus semua transaksi pada bulan yang sedang dipilih
  const resetSelectedMonth = async (targetYear = selectedYear, targetMonth = selectedMonth) => {
    setLoading(true);
    try {
      await deleteExpensesByMonth(targetYear, targetMonth);
      await refresh();
      return true;
    } catch (e) {
      console.error('Error resetting month:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Stats berdasarkan bulan yang sedang dipilih
  const stats = useMemo(() => {
    const byCat = groupByCategory(selectedMonthExpenses);
    return {
      total: sumExpenses(expenses),
      thisMonthTotal: sumExpenses(selectedMonthExpenses),
      byCategory: byCat,
      byDate: groupByDate(selectedMonthExpenses),
      count: expenses.length,
      thisMonthCount: selectedMonthExpenses.length,
      topCategory: byCat[0]?.name || null,
      selectedMonthName: MONTH_NAMES[selectedMonth],
      selectedMonthShort: MONTH_SHORT_NAMES[selectedMonth],
      selectedYear,
    };
  }, [expenses, selectedMonthExpenses, selectedMonth, selectedYear]);

  return {
    expenses,
    thisMonth: selectedMonthExpenses, // Backward compatible: now dynamically reflects selected month!
    allExpenses: expenses,
    selectedYear,
    selectedMonth,
    selectedMonthExpenses,
    selectedMonthName: MONTH_NAMES[selectedMonth],
    selectedMonthShort: MONTH_SHORT_NAMES[selectedMonth],
    isCurrentMonth,
    availableMonths,
    loading,
    stats,
    prevMonth,
    nextMonth,
    setMonthYear,
    goToCurrentMonth,
    resetSelectedMonth,
    add,
    update,
    remove,
    refresh,
  };
};
