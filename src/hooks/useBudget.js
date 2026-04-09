import { useState, useEffect, useCallback } from 'react';
import { getBudget, setBudget } from '../utils/storage';

export const useBudget = () => {
  const [budget, setBudgetState] = useState(0);

  useEffect(() => {
    const fetchBudget = async () => {
      const b = await getBudget();
      setBudgetState(b);
    };
    fetchBudget();
  }, []);

  const updateBudget = useCallback(async (amount) => {
    const val = parseFloat(amount) || 0;
    try {
      await setBudget(val);
      setBudgetState(val);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getStatus = useCallback(
    (spent) => {
      if (!budget || budget === 0) {
        return { status: 'no-budget', percent: 0, remaining: 0, label: 'Budget belum diset' };
      }
      const percent = Math.min((spent / budget) * 100, 100);
      const remaining = budget - spent;

      if (percent >= 100) {
        return {
          status: 'danger',
          percent: 100,
          remaining,
          overBy: Math.abs(remaining),
          label: `Over budget Rp ${Math.abs(remaining).toLocaleString('id-ID')}`,
          color: 'text-danger',
          bg: 'bg-danger',
        };
      }
      if (percent >= 80) {
        return {
          status: 'warning',
          percent,
          remaining,
          label: `Sisa Rp ${remaining.toLocaleString('id-ID')} — Hampir habis!`,
          color: 'text-warn',
          bg: 'bg-warn',
        };
      }
      return {
        status: 'safe',
        percent,
        remaining,
        label: `Sisa Rp ${remaining.toLocaleString('id-ID')}`,
        color: 'text-success',
        bg: 'bg-success',
      };
    },
    [budget]
  );

  return { budget, updateBudget, getStatus };
};
