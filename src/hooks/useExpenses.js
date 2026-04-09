import { useState, useEffect, useCallback } from 'react';
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  groupByCategory,
  groupByDate,
  sumExpenses,
} from '../utils/storage';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [thisMonth, setThisMonth] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getExpenses();
      setExpenses(all);
      
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      
      const monthData = all.filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      setThisMonth(monthData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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

  const stats = {
    total: sumExpenses(expenses),
    thisMonthTotal: sumExpenses(thisMonth),
    byCategory: groupByCategory(thisMonth),
    byDate: groupByDate(thisMonth),
    count: expenses.length,
    thisMonthCount: thisMonth.length,
    topCategory: groupByCategory(thisMonth)[0]?.name || null,
  };

  return {
    expenses,
    thisMonth,
    loading,
    stats,
    add,
    update,
    remove,
    refresh,
  };
};
