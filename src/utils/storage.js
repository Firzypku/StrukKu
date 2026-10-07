/**
 * storage.js — Migrasi ke Supabase
 * Fungsionalitas Async CRUD untuk database Expenses, Budgets, dan Challenges
 */
import { supabase } from './supabase';
import { getLocalDateString } from './dateHelper';
import { validateAmount, MAX_AMOUNT } from './validation';

/**
 * Mendapatkan User ID dari sesi aktif
 * @returns {Promise<string|null>}
 */
const getCurrentUserId = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.user.id;
};

// ── LocalStorage Mirror & Cache Helpers ─────────────────────────────────────────

const getLocalKey = (userId) => `strukku_expenses_${userId || 'guest'}`;

export const getLocalExpenses = (userId) => {
  try {
    const raw = localStorage.getItem(getLocalKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setLocalExpenses = (userId, expenses) => {
  try {
    localStorage.setItem(getLocalKey(userId), JSON.stringify(expenses || []));
  } catch (e) {
    console.warn('Gagal menyimpan cache lokal expenses:', e);
  }
};

// ── Expenses ─────────────────────────────────────────────────────────────────

export const getExpenses = async () => {
  const userId = await getCurrentUserId();
  const localItems = getLocalExpenses(userId);

  if (!userId) {
    return localItems;
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.warn('Error fetching expenses from Supabase, using local cache:', error);
      return localItems;
    }

    if (data && data.length > 0) {
      setLocalExpenses(userId, data);
      return data;
    }

    // Jika di Supabase masih kosong tapi di localStorage ada data
    if (localItems.length > 0) {
      return localItems;
    }

    return [];
  } catch (err) {
    console.warn('Exception fetching expenses, using local cache:', err);
    return localItems;
  }
};

export const addExpense = async (expense) => {
  const validation = validateAmount(expense.amount, {
    fieldName: 'Nominal pengeluaran',
    min: 1,
    max: MAX_AMOUNT,
    required: true,
  });

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const userId = await getCurrentUserId();
  const expenseId = expense.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'exp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5));

  const newExpense = {
    id: expenseId,
    user_id: userId || 'guest',
    title: expense.title,
    amount: validation.value,
    category: expense.category || 'Lainnya',
    date: expense.date || getLocalDateString(),
    note: expense.note || null,
    image: expense.image || null,
    created_at: new Date().toISOString(),
  };

  // Simpan ke local cache terlebih dahulu agar instan dan tidak hilang
  const currentLocal = getLocalExpenses(userId);
  const updatedLocal = [newExpense, ...currentLocal.filter((e) => e.id !== newExpense.id)];
  setLocalExpenses(userId, updatedLocal);

  if (!userId) {
    return newExpense;
  }

  try {
    const payload = {
      user_id: userId,
      title: newExpense.title,
      amount: newExpense.amount,
      category: newExpense.category,
      date: newExpense.date,
      note: newExpense.note,
    };
    if (newExpense.image) {
      payload.image = newExpense.image;
    }

    let { data, error } = await supabase
      .from('expenses')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error && error.message && error.message.toLowerCase().includes('image')) {
      delete payload.image;
      const retry = await supabase
        .from('expenses')
        .insert([payload])
        .select()
        .maybeSingle();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.warn('Gagal sinkronisasi insert ke Supabase, tersimpan lokal:', error);
      return newExpense;
    }

    if (data) {
      const merged = [data, ...currentLocal.filter((e) => e.id !== newExpense.id && e.id !== data.id)];
      setLocalExpenses(userId, merged);
      return data;
    }
  } catch (err) {
    console.warn('Exception saat simpan ke Supabase, tersimpan lokal:', err);
  }

  return newExpense;
};

export const updateExpense = async (id, updates) => {
  let cleanUpdates = { ...updates };
  if (updates.amount !== undefined) {
    const validation = validateAmount(updates.amount, {
      fieldName: 'Nominal pengeluaran',
      min: 1,
      max: MAX_AMOUNT,
      required: true,
    });
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    cleanUpdates.amount = validation.value;
  }

  const userId = await getCurrentUserId();
  const currentLocal = getLocalExpenses(userId);
  const updatedLocal = currentLocal.map((e) => (e.id === id ? { ...e, ...cleanUpdates } : e));
  setLocalExpenses(userId, updatedLocal);

  if (userId) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('Gagal update ke Supabase, update lokal dipertahankan:', e);
    }
  }
  return updatedLocal.find((e) => e.id === id);
};

export const deleteExpense = async (id) => {
  const userId = await getCurrentUserId();
  const currentLocal = getLocalExpenses(userId);
  const updatedLocal = currentLocal.filter((e) => e.id !== id);
  setLocalExpenses(userId, updatedLocal);

  if (userId) {
    try {
      await supabase.from('expenses').delete().eq('id', id);
    } catch (e) {
      console.warn('Gagal hapus dari Supabase:', e);
    }
  }
};

/**
 * Menghapus seluruh pengeluaran untuk user pada bulan dan tahun tertentu
 */
export const deleteExpensesByMonth = async (year, month) => {
  const userId = await getCurrentUserId();
  const currentLocal = getLocalExpenses(userId);
  const updatedLocal = currentLocal.filter((e) => {
    if (!e.date) return false;
    const parts = e.date.split('T')[0].split('-');
    if (parts.length >= 2) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      return !(y === year && m === month);
    }
    return true;
  });
  setLocalExpenses(userId, updatedLocal);

  if (userId) {
    try {
      const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      await supabase
        .from('expenses')
        .delete()
        .eq('user_id', userId)
        .gte('date', start)
        .lte('date', end);
    } catch (e) {
      console.warn('Gagal reset bulan di Supabase:', e);
    }
  }
};

/**
 * Memuat 5 transaksi contoh mahasiswa realistis untuk menguji seluruh fitur
 */
export const seedSampleExpenses = async () => {
  const today = getLocalDateString();
  const [y, m, d] = today.split('-');
  const dayNum = parseInt(d, 10);

  const padDay = (day) => String(Math.max(1, Math.min(28, day))).padStart(2, '0');

  const samples = [
    {
      title: 'Nasi Padang Ayam Pop + Es Teh',
      amount: 24000,
      category: 'Makanan',
      date: `${y}-${m}-${padDay(dayNum)}`,
      note: 'Makan siang bareng anak kos',
    },
    {
      title: 'Indomaret Sabun, Sampo & Kopi',
      amount: 38500,
      category: 'Kebutuhan Kos',
      date: `${y}-${m}-${padDay(dayNum - 1)}`,
      note: 'Belanja bulanan kamar kos',
    },
    {
      title: 'Bensin Pertalite Motor Beat',
      amount: 30000,
      category: 'Transport',
      date: `${y}-${m}-${padDay(dayNum - 2)}`,
      note: 'Isi full tank kampus',
    },
    {
      title: 'Print Modul Kuliah & Jilid Skripsi',
      amount: 15000,
      category: 'Pendidikan',
      date: `${y}-${m}-${padDay(dayNum - 3)}`,
      note: 'Tugas mata kuliah',
    },
    {
      title: 'Es Teh Manis Jumbo Sore',
      amount: 5000,
      category: 'Minuman',
      date: `${y}-${m}-${padDay(dayNum - 3)}`,
      note: 'Haus sehabis kelas',
    },
  ];

  for (const s of samples) {
    await addExpense(s);
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
  const validation = validateAmount(amount, {
    fieldName: 'Batas budget',
    min: 1,
    max: MAX_AMOUNT,
    required: true,
  });

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase
    .from('budgets')
    .upsert(
      { user_id: userId, monthly_limit: validation.value },
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
