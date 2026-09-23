/**
 * storage.js — Migrasi ke Supabase
 * Fungsionalitas Async CRUD untuk database Expenses, Budgets, dan Challenges
 */
import { supabase } from './supabase';
import { getLocalDateString } from './dateHelper';

/**
 * Mendapatkan User ID dari sesi aktif
 * @returns {Promise<string|null>}
 */
const getCurrentUserId = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.user.id;
};

// ── Expenses ─────────────────────────────────────────────────────────────────

export const getExpenses = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
  return data || [];
};

export const addExpense = async (expense) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  const newExpense = {
    user_id: userId,
    title: expense.title,
    amount: expense.amount,
    category: expense.category || 'Lainnya',
    date: expense.date || getLocalDateString(),
    note: expense.note || null,
  };

  const { data, error } = await supabase
    .from('expenses')
    .insert([newExpense])
    .select()
    .single();

  if (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
  return data;
};

export const updateExpense = async (id, updates) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
  return data;
};

export const deleteExpense = async (id) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

/**
 * Menghapus seluruh pengeluaran untuk user pada bulan dan tahun tertentu
 * @param {number} year - contoh 2026
 * @param {number} month - 0 untuk Jan, 11 untuk Des
 */
export const deleteExpensesByMonth = async (year, month) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('user_id', userId)
    .gte('date', start)
    .lte('date', end);

  if (error) {
    console.error('Error deleting expenses by month:', error);
    throw error;
  }
};

export const getThisMonthExpenses = async () => {
  const expenses = await getExpenses();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

export const getExpensesByDate = async (dateStr) => {
  const expenses = await getExpenses();
  return expenses.filter((e) => e.date === dateStr);
};

// ── Budget ────────────────────────────────────────────────────────────────────

export const getBudget = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return 0;

  const { data, error } = await supabase
    .from('budgets')
    .select('monthly_limit')
    .eq('user_id', userId)
    .maybeSingle();

  // Jika tidak ketemu/belum diset
  if (error || !data) return 0;
  return data.monthly_limit;
};

export const setBudget = async (amount) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from('budgets')
    .upsert(
      { user_id: userId, monthly_limit: amount },
      { onConflict: 'user_id' }
    );
  if (error) throw error;
};

// ── Challenges ────────────────────────────────────────────────────────────────

const getDefaultChallenges = () => [
  { id: 'ch_1', title: 'Tidak Jajan 3 Hari', description: 'Hindari pengeluaran jajan selama 3 hari berturut-turut', target: 3, progress: 0, unit: 'hari', badge: '🧘', completed: false, category: 'streak' },
  { id: 'ch_2', title: 'Hemat 20% Bulan Ini', description: 'Kurangi total pengeluaran 20% dibanding bulan lalu', target: 20, progress: 0, unit: '%', badge: '💚', completed: false, category: 'saving' },
  { id: 'ch_3', title: 'Masak Sendiri 5x', description: 'Catat 5 pengeluaran bahan masakan, bukan beli makanan jadi', target: 5, progress: 0, unit: 'kali', badge: '🍳', completed: false, category: 'cooking' },
  { id: 'ch_4', title: 'Budget Master', description: 'Tetap dalam budget selama 7 hari', target: 7, progress: 0, unit: 'hari', badge: '🏆', completed: false, category: 'budget' },
];

export const getChallenges = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return getDefaultChallenges();

  const { data, error } = await supabase
    .from('challenges_progress')
    .select('*')
    .eq('user_id', userId);

  const defaults = getDefaultChallenges();

  if (error || !data || data.length === 0) {
    return defaults;
  }

  // Gabungkan defaults UI dengan progress tersimpan di DB
  return defaults.map((ch) => {
    const savedProgress = data.find((d) => d.challenge_id === ch.id);
    if (savedProgress) {
      return {
        ...ch,
        progress: savedProgress.progress,
        completed: savedProgress.progress >= ch.target
      };
    }
    return ch;
  });
};

export const updateChallenge = async (id, updates) => {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('challenges_progress')
    .upsert(
      { user_id: userId, challenge_id: id, progress: updates.progress },
      { onConflict: 'user_id,challenge_id' }
    );
  if (error) console.error("Error updating challenge progress:", error);
};

// ── Stats helpers (Synchronous) ──────────────────────────────────────────────

export const sumExpenses = (expenses) =>
  expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

export const groupByCategory = (expenses) => {
  const map = {};
  expenses.forEach((e) => {
    const cat = e.category || 'Lainnya';
    map[cat] = (map[cat] || 0) + (parseFloat(e.amount) || 0);
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const groupByDate = (expenses) => {
  const map = {};
  expenses.forEach((e) => {
    map[e.date] = (map[e.date] || 0) + (parseFloat(e.amount) || 0);
  });
  return map;
};
