/**
 * prediction.js — Prediksi pengeluaran & rule-based tips
 */

import { groupByCategory } from './storage';

/**
 * Prediksi total pengeluaran akhir bulan
 * @param {Array} expenses - pengeluaran bulan ini
 * @returns {Object} prediksi data
 */
export const predictEndOfMonth = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return { predicted: 0, dailyAvg: 0, daysLeft: 0, confidence: 'low' };
  }

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  const daysLeft = daysInMonth - daysPassed;

  const totalSoFar = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const dailyAvg = totalSoFar / daysPassed;
  const predicted = totalSoFar + dailyAvg * daysLeft;

  // Confidence: lebih tinggi jika data lebih banyak
  const confidence = expenses.length >= 10 ? 'high' : expenses.length >= 5 ? 'medium' : 'low';

  return {
    predicted: Math.round(predicted),
    dailyAvg: Math.round(dailyAvg),
    daysLeft,
    daysPassed,
    totalSoFar,
    daysInMonth,
    confidence,
  };
};

/**
 * Cek apakah akan over budget
 * @param {number} predicted
 * @param {number} budget
 * @returns {Object}
 */
export const checkBudgetStatus = (predicted, budget) => {
  if (!budget || budget === 0) return { status: 'no-budget', percent: 0 };
  const percent = (predicted / budget) * 100;
  if (percent >= 100) return { status: 'danger', percent, overBy: predicted - budget };
  if (percent >= 80) return { status: 'warning', percent };
  return { status: 'safe', percent };
};

// ── Tips Engine ───────────────────────────────────────────────────────────────

const TIPS_DATABASE = {
  Makanan: [
    { tip: 'Coba masak sendiri 3x seminggu, bisa hemat Rp 150.000/bulan! 🍳', icon: '🍳' },
    { tip: 'Beli bahan makanan di pasar tradisional lebih murah 20-30% dari supermarket', icon: '🛒' },
    { tip: 'Batch cooking di hari Minggu bisa hemat waktu dan uang sekaligus', icon: '🥗' },
    { tip: 'Bawa bekal ke kampus bisa hemat hingga Rp 50.000/hari!', icon: '🍱' },
  ],
  Transport: [
    { tip: 'Gunakan KRL/MRT daripada ojol, bisa hemat Rp 30.000/hari!', icon: '🚇' },
    { tip: 'Naik sepeda ke kampus jika jarak < 5km, hemat dan sehat', icon: '🚲' },
    { tip: 'Gabung perjalanan dengan teman (share ojol) untuk hemat ongkos', icon: '🤝' },
    { tip: 'Manfaatkan promo GoPay/OVO untuk cashback transportasi', icon: '💰' },
  ],
  Belanja: [
    { tip: 'Buat daftar belanja sebelum ke toko, hindari impulsif buying', icon: '📝' },
    { tip: 'Belanja di akhir bulan sering ada diskon clearance', icon: '🏷️' },
    { tip: 'Bandingkan harga di 2-3 toko sebelum memutuskan beli', icon: '🔍' },
    { tip: 'Manfaatkan cashback kartu kredit/e-wallet saat belanja', icon: '💳' },
  ],
  Hiburan: [
    { tip: 'Nonton film gunakan voucher/promo hari Selasa yang lebih murah', icon: '🎬' },
    { tip: 'Gabung Netflix/Spotify dengan teman, bagi biaya langganan', icon: '📺' },
    { tip: 'Cari event/pameran gratis di kotamu untuk hiburan murah', icon: '🎪' },
  ],
  default: [
    { tip: '📊 Catat setiap pengeluaran agar lebih sadar pola belanjamu', icon: '📊' },
    { tip: '🎯 Set budget harian Rp 50.000 dan coba patuhi seminggu', icon: '🎯' },
    { tip: '💡 Aturan 50-30-20: 50% kebutuhan, 30% keinginan, 20% tabungan', icon: '💡' },
    { tip: '🏆 Bergabung tantangan hemat untuk motivasi lebih!', icon: '🏆' },
  ],
};

/**
 * Generate tip berdasarkan pola pengeluaran
 * @param {Array} expenses
 * @returns {Object} { tip, icon, category }
 */
export const generateTip = (expenses) => {
  if (!expenses || expenses.length === 0) {
    const tips = TIPS_DATABASE.default;
    const tip = tips[Math.floor(Math.random() * tips.length)];
    return { ...tip, category: 'Umum' };
  }

  // Temukan kategori terbesar
  const grouped = groupByCategory(expenses);
  const topCategory = grouped[0]?.name;

  const categoryTips = TIPS_DATABASE[topCategory] || TIPS_DATABASE.default;
  const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];

  return { ...randomTip, category: topCategory || 'Umum' };
};

/**
 * Generate beberapa tips sekaligus
 * @param {Array} expenses
 * @param {number} count
 * @returns {Array}
 */
export const generateMultipleTips = (expenses, count = 3) => {
  const tips = [];
  const grouped = groupByCategory(expenses);
  const seenTips = new Set();

  // Tip dari kategori terbesar
  grouped.slice(0, 2).forEach(({ name }) => {
    const catTips = TIPS_DATABASE[name] || [];
    catTips.forEach((t) => {
      if (!seenTips.has(t.tip) && tips.length < count) {
        tips.push({ ...t, category: name });
        seenTips.add(t.tip);
      }
    });
  });

  // Tambahkan tip default jika kurang
  while (tips.length < count) {
    const defaultTips = TIPS_DATABASE.default;
    const t = defaultTips[Math.floor(Math.random() * defaultTips.length)];
    if (!seenTips.has(t.tip)) {
      tips.push({ ...t, category: 'Umum' });
      seenTips.add(t.tip);
    }
    if (seenTips.size >= TIPS_DATABASE.default.length) break;
  }

  return tips.slice(0, count);
};

// ── Resep Rekomendasi ─────────────────────────────────────────────────────────

export const RECIPE_RECOMMENDATIONS = [
  {
    name: 'Nasi Goreng Sederhana',
    bahan: ['Nasi sisa', 'Telur', 'Kecap', 'Bawang'],
    estimasi: 8000,
    waktu: '10 menit',
    emoji: '🍳',
  },
  {
    name: 'Mie Goreng Spesial',
    bahan: ['Indomie', 'Telur', 'Sayuran', 'Sosis'],
    estimasi: 6000,
    waktu: '8 menit',
    emoji: '🍜',
  },
  {
    name: 'Tumis Kangkung',
    bahan: ['Kangkung', 'Bawang putih', 'Cabai', 'Terasi'],
    estimasi: 7000,
    waktu: '10 menit',
    emoji: '🥬',
  },
  {
    name: 'Sup Ayam Sederhana',
    bahan: ['Ayam', 'Wortel', 'Kentang', 'Daun bawang'],
    estimasi: 15000,
    waktu: '25 menit',
    emoji: '🍲',
  },
  {
    name: 'Sandwich Telur',
    bahan: ['Roti tawar', 'Telur', 'Mentega', 'Garam'],
    estimasi: 5000,
    waktu: '5 menit',
    emoji: '🥪',
  },
  {
    name: 'Oatmeal Pisang',
    bahan: ['Oatmeal', 'Pisang', 'Madu', 'Susu'],
    estimasi: 8000,
    waktu: '5 menit',
    emoji: '🍌',
  },
];

/**
 * Format angka ke Rupiah
 * @param {number} amount
 * @returns {string}
 */
export const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return 'Rp -';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format tanggal ke bahasa Indonesia
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Parse voice input menjadi expense
 * "makan siang 15000" → { title: 'makan siang', amount: 15000 }
 */
const VOICE_KEYWORDS = {
  Makanan: ['makan', 'nasi', 'ayam', 'bakso', 'mie', 'soto', 'warteg', 'cafe', 'kopi', 'snack', 'indomie', 'burger', 'gorengan'],
  Transport: ['grab', 'gojek', 'ojek', 'bensin', 'parkir', 'busway', 'kereta', 'krl'],
  Belanja: ['indomaret', 'alfamart', 'minimarket', 'supermarket', 'toko', 'beli'],
  Hiburan: ['cinema', 'bioskop', 'netflix', 'game', 'tiket'],
  Kesehatan: ['apotek', 'obat', 'klinik', 'dokter', 'vitamin'],
};

const detectVoiceCategory = (text) => {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(VOICE_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return 'Lainnya';
};

export const parseVoiceInput = (transcript) => {
  if (!transcript) return { title: 'Pengeluaran', amount: null, category: 'Lainnya' };
  const text = transcript.toLowerCase().trim();

  let amount = null;
  let matchedSnippet = '';

  // 1. Prioritas Utama: Cari angka yang secara eksplisit diikuti satuan mata uang: juta, jt, ribu, rb, k, rupiah
  // atau diawali rp (misal: "1,5 juta", "30 ribu", "25rb", "Rp 50.000")
  const unitRegex = /(?:rp\.?\s*)?(\d+(?:[.,]\d+)?)\s*(juta|jt|ribu|rb|k|rupiah|perak)\b/gi;
  const unitMatches = [...text.matchAll(unitRegex)];

  if (unitMatches.length > 0) {
    // Ambil match terakhir yang memiliki satuan (misal "beli 2 nasi ayam 30 ribu" -> pilih 30 ribu)
    const targetMatch = unitMatches[unitMatches.length - 1];
    matchedSnippet = targetMatch[0];
    const numPart = targetMatch[1].replace(',', '.');
    const unitPart = (targetMatch[2] || '').toLowerCase();
    let val = parseFloat(numPart);

    if (unitPart.startsWith('j')) {
      // juta / jt
      val = Math.round(val * 1000000);
    } else if (unitPart.startsWith('r') || unitPart === 'k') {
      // ribu / rb / k
      val = Math.round(val * 1000);
    }

    if (!isNaN(val) && val > 0) {
      amount = val;
    }
  }

  // 2. Prioritas Kedua: Jika tidak ada satuan, cari nominal angka uang realistis (misal "makan 25000" atau "rp 25000")
  if (!amount) {
    const rawNumRegex = /(?:rp\.?\s*)?(\b\d{1,3}(?:[.,]\d{3})+\b|\b\d{4,}\b)/gi;
    const rawMatches = [...text.matchAll(rawNumRegex)];
    if (rawMatches.length > 0) {
      const targetMatch = rawMatches[rawMatches.length - 1];
      matchedSnippet = targetMatch[0];
      const cleanNum = targetMatch[1].replace(/[.,]/g, '');
      const val = parseInt(cleanNum, 10);
      if (!isNaN(val) && val >= 100) {
        amount = val;
      }
    }
  }

  // Bersihkan judul transaksi dari potongan angka/uang yang cocok
  let title = text;
  if (matchedSnippet) {
    title = title.replace(matchedSnippet, '').trim();
  }

  // Bersihkan kata-kata pengantar suara umum seperti "beli", "tadi", "bayar", "buat" di awal
  title = title
    .replace(/^(?:beli|bayar|tadi beli|buat|untuk)\s+/i, '')
    .replace(/[.,]$/, '')
    .trim();

  // Kapitalisasi huruf pertama
  if (title) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  } else {
    title = 'Pengeluaran';
  }

  const category = detectVoiceCategory(title);
  return { title, amount, category };
};
