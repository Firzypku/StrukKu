/**
 * receiptParser.js — Parser presisi untuk teks struk belanja & bukti e-wallet Indonesia
 * Menangani format angka Indonesia (titik ribuan, koma desimal),
 * prioritas baris TOTAL vs TUNAI/KEMBALI, ekstraksi tanggal lokal, merchant, dan kategori.
 */

import { todayLocal } from './date';

// Bulan Indonesia ke angka (01-12)
const MONTH_MAP = {
  jan: '01', januari: '01', january: '01',
  feb: '02', februari: '02', february: '02',
  mar: '03', maret: '03', march: '03',
  apr: '04', april: '04',
  mei: '05', may: '05',
  jun: '06', juni: '06', june: '06',
  jul: '07', juli: '07', july: '07',
  agu: '08', agust: '08', agustus: '08', aug: '08', august: '08',
  sep: '09', sept: '09', september: '09',
  okt: '10', oktober: '10', oct: '10', october: '10',
  nov: '11', november: '11',
  des: '12', desember: '12', dec: '12', december: '12',
};

/**
 * Normalisasi string angka format Indonesia/Inggris menjadi integer rupiah
 * Contoh: "25.000,00" -> 25000, "1,5 jt" -> 1500000, "Rp25.000" -> 25000
 */
export function normalizeAmount(rawStr) {
  if (!rawStr) return 0;
  let str = rawStr.toString().trim();

  // Handle shorthand juta / jt / rb / k
  const lower = str.toLowerCase();
  const jtMatch = lower.match(/^([\d.,]+)\s*(?:juta|jt)/);
  if (jtMatch) {
    const val = parseFloat(jtMatch[1].replace(',', '.'));
    return Math.round(val * 1000000);
  }

  const rbMatch = lower.match(/^([\d.,]+)\s*(?:ribu|rb|k)/);
  if (rbMatch) {
    const val = parseFloat(rbMatch[1].replace(',', '.'));
    return Math.round(val * 1000);
  }

  // Bersihkan karakter non-angka kecuali titik dan koma
  str = str.replace(/[^0-9.,]/g, '');
  if (!str) return 0;

  // Jika diakhiri dengan koma dan tepat 2 digit desimal (misal ,00 atau ,50) -> hapus desimal
  if (/,(\d{2})$/.test(str)) {
    str = str.replace(/,(\d{2})$/, '');
  }
  // Jika diakhiri dengan titik dan tepat 2 digit desimal (misal .00)
  else if (/\.(\d{2})$/.test(str) && (str.match(/\./g) || []).length === 1 && !str.includes(',')) {
    // Hanya jika ada satu titik dan 2 angka di belakangnya (format desimal US: 250.00)
    str = str.replace(/\.(\d{2})$/, '');
  }

  // Bersihkan semua sisa titik atau koma pemisah ribuan
  const cleanNumber = str.replace(/[.,]/g, '');
  const parsed = parseInt(cleanNumber, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Ekstraksi nominal utama belanja dari baris teks struk
 */
export function extractAmountFromLines(lines) {
  let bestAmount = 0;
  let confidence = 'low';

  const ignoreKeywords = [
    'tunai', 'cash', 'kembali', 'change', 'kembalian', 'kembal',
    'dibayar', 'bayar tunai', 'diskon', 'discount', 'potongan', 'promo'
  ];

  const primaryKeywords = [
    'grand total', 'total bayar', 'total pembayaran', 'pembayaran berhasil',
    'total belanja', 'jumlah bayar', 'total tagihan', 'total'
  ];

  const subtotalKeywords = ['subtotal', 'sub total', 'sub-total'];

  // 1. Prioritas Utama: Cari baris TOTAL dari bawah ke atas (bottom-up)
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Lewati baris yang mengandung keyword tunai / kembali / diskon
    const hasIgnore = ignoreKeywords.some((kw) => lower.includes(kw));
    if (hasIgnore) continue;

    const hasPrimary = primaryKeywords.some((kw) => lower.includes(kw));
    if (hasPrimary) {
      // Ambil angka uang di baris ini
      const matches = line.match(/(?:rp\.?|idr)?\s*[\d.,]{3,}/gi);
      if (matches && matches.length > 0) {
        // Ambil match paling kanan/terakhir di baris tersebut
        const candidate = normalizeAmount(matches[matches.length - 1]);
        if (candidate > 0) {
          return { amount: candidate, confidence: 'high' };
        }
      }
    }
  }

  // 2. Prioritas Kedua: Baris SUBTOTAL jika tidak ada TOTAL
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const lower = line.toLowerCase();
    const hasIgnore = ignoreKeywords.some((kw) => lower.includes(kw));
    if (hasIgnore) continue;

    const hasSubtotal = subtotalKeywords.some((kw) => lower.includes(kw));
    if (hasSubtotal) {
      const matches = line.match(/(?:rp\.?|idr)?\s*[\d.,]{3,}/gi);
      if (matches && matches.length > 0) {
        const candidate = normalizeAmount(matches[matches.length - 1]);
        if (candidate > 0) {
          return { amount: candidate, confidence: 'medium' };
        }
      }
    }
  }

  // 3. Fallback: Cari angka berformat uang valid (diawali Rp atau berpemisah ribuan 1.000 / 10,000)
  // Abaikan baris nomor nota, no telp, id transaksi
  const moneyCandidates = [];
  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (
      lower.includes('id transaksi') ||
      lower.includes('no:') ||
      lower.includes('no.') ||
      lower.includes('nota') ||
      lower.includes('telp') ||
      lower.includes('phone') ||
      lower.includes('tanggal') ||
      lower.includes('jam') ||
      ignoreKeywords.some((kw) => lower.includes(kw))
    ) {
      return;
    }

    // Cocokkan pola angka uang: Rp 25.000 atau angka berpemisah ribuan (30.000 / 30,000)
    const matches = line.match(/(?:rp\.?\s*[\d.,]+|\b\d{1,3}(?:[.,]\d{3})+\b)/gi);
    if (matches) {
      matches.forEach((m) => {
        const val = normalizeAmount(m);
        // Nominal realistis belanja mahasiswa (Rp 1.000 s/d Rp 20.000.000)
        // Dan abaikan jika angka terlihat seperti tahun (2024, 2025, 2026)
        if (val >= 1000 && val <= 20000000 && val !== 2024 && val !== 2025 && val !== 2026) {
          moneyCandidates.push(val);
        }
      });
    }
  });

  if (moneyCandidates.length > 0) {
    // Ambil angka terbesar di antara kandidat uang yang valid
    bestAmount = Math.max(...moneyCandidates);
    confidence = 'low';
  }

  return { amount: bestAmount, confidence };
}

/**
 * Ekstraksi Tanggal Transaksi
 */
export function extractDateFromText(text) {
  const today = todayLocal();
  if (!text) return { date: today, confidence: 'low' };

  // 1. Format teks: "24 Sep 2026", "24 September 2026"
  const textDateMatch = text.match(
    /\b(\d{1,2})\s+([a-zA-Z]{3,10})\s+(\d{4})\b/i
  );
  if (textDateMatch) {
    const day = textDateMatch[1].padStart(2, '0');
    const monthKey = textDateMatch[2].toLowerCase();
    const year = textDateMatch[3];
    const month = MONTH_MAP[monthKey] || Object.keys(MONTH_MAP).find((k) => monthKey.startsWith(k)) && MONTH_MAP[Object.keys(MONTH_MAP).find((k) => monthKey.startsWith(k))];

    if (month && parseInt(year, 10) >= 2020) {
      const dateStr = `${year}-${month}-${day}`;
      if (dateStr <= today) {
        return { date: dateStr, confidence: 'high' };
      }
      return { date: today, confidence: 'medium' };
    }
  }

  // 2. Format numerik: DD/MM/YYYY atau DD-MM-YYYY
  const numDateMatch = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b/);
  if (numDateMatch) {
    let day = parseInt(numDateMatch[1], 10);
    let month = parseInt(numDateMatch[2], 10);
    let year = parseInt(numDateMatch[3], 10);

    if (year < 100) year += 2000;

    // Deteksi jika terbalik MM/DD/YYYY
    if (day > 12 && month <= 12) {
      // Benar day = day
    } else if (month > 12 && day <= 12) {
      const temp = day;
      day = month;
      month = temp;
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dateStr <= today) {
        return { date: dateStr, confidence: 'high' };
      }
      return { date: today, confidence: 'medium' };
    }
  }

  // 3. Format ISO: YYYY-MM-DD
  const isoMatch = text.match(/\b(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    const dateStr = isoMatch[0];
    if (dateStr <= today) {
      return { date: dateStr, confidence: 'high' };
    }
  }

  return { date: today, confidence: 'low' };
}

/**
 * Ekstraksi Nama Toko / Merchant
 */
export function extractMerchantFromLines(lines) {
  if (!lines || lines.length === 0) return { merchant: 'Toko', confidence: 'low' };

  // 1. Format e-wallet: "Merchant: Kantin FT", "Ke: Warung Bu Sri", "Nama Toko: ..."
  for (const line of lines) {
    const match = line.match(/(?:merchant|nama\s*toko|ke|penerima)\s*[:=]\s*(.+)/i);
    if (match && match[1]) {
      const name = match[1].replace(/[^a-zA-Z0-9\s.&'-]/g, '').trim();
      if (name.length >= 2) {
        return { merchant: name, confidence: 'high' };
      }
    }
  }

  // 2. Baris atas struk biasa (lewati header umum)
  const skipWords = [
    'pembayaran berhasil', 'transaksi berhasil', 'struk', 'receipt',
    'nota', 'bukti pembayaran', 'bukti transaksi', 'selamat datang',
    'jl.', 'jalan', 'telp', 'phone', 'kasir', 'cashier', 'qris',
    'order id', 'order #', 'no.'
  ];

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i].trim();
    const lower = line.toLowerCase();

    if (line.length < 3) continue;
    const shouldSkip = skipWords.some((w) => lower.includes(w));
    if (shouldSkip) continue;

    // Bersihkan karakter aneh
    const clean = line.replace(/[^a-zA-Z0-9\s.&'-]/g, '').trim();
    if (clean.length >= 3) {
      return { merchant: clean, confidence: 'medium' };
    }
  }

  return { merchant: 'Toko / Resto', confidence: 'low' };
}

/**
 * Deteksi Kategori Belanja dengan Pencocokan Kata Utuh (Word Boundary)
 */
export function detectCategoryFromText(text) {
  const content = text.toLowerCase();

  const rules = [
    {
      category: 'Makanan',
      pattern: /\b(makan|makanan|nasi|ayam|goreng|mie|bakso|soto|kantin|warung|cafe|kafe|resto|restoran|dapur|snack|roti|burger|pizza|geprek|pecel|sayur|sambal|bebek|sate|padang)\b/i,
    },
    {
      category: 'Minuman',
      pattern: /\b(minum|minuman|kopi|coffee|tea|teh|boba|jus|juice|es|air|mineral|latte|cappuccino|drink|susu|chatime|haus|janji jiwa)\b/i,
    },
    {
      category: 'Transport',
      pattern: /\b(gojek|gofood|goride|gocar|grab|grabfood|maxim|ojol|bensin|pertalite|pertamax|spbu|parkir|krl|mrt|bus|angkot|tol|kereta|kai)\b/i,
    },
    {
      category: 'Belanja',
      pattern: /\b(indomaret|alfamart|superindo|transmart|hypermart|minimarket|pasar|toko|belanja|groceries|sabun|shampoo|odol|deterjen|tisu)\b/i,
    },
    {
      category: 'Pendidikan',
      pattern: /\b(buku|fotocopy|foto copy|print|kuliah|kampus|alat tulis|atk|modul|spp|telkom|ujian|skripsi|jilid)\b/i,
    },
    {
      category: 'Kesehatan',
      pattern: /\b(obat|apotek|dokter|klinik|puskesmas|vitamin|perban|masker|paracetamol|tolak angin|panadol)\b/i,
    },
    {
      category: 'Fashion',
      pattern: /\b(baju|celana|kaos|sepatu|sandal|jaket|laundry|cuci baju|setrika|kiloan)\b/i,
    },
    {
      category: 'Hiburan',
      pattern: /\b(nonton|bioskop|cinema|xxi|game|steam|spotify|netflix|karaoke|billiard|wisata)\b/i,
    },
  ];

  for (const { category, pattern } of rules) {
    if (pattern.test(content)) {
      return { category, confidence: 'high' };
    }
  }

  return { category: 'Lainnya', confidence: 'low' };
}

/**
 * Master parser fungsi utama
 */
export function parseReceiptText(rawText) {
  if (!rawText || !rawText.trim()) {
    return {
      text: '',
      amount: 0,
      date: todayLocal(),
      merchant: '',
      category: 'Lainnya',
      confidence: 0,
      fieldConfidence: {
        amount: 'low',
        date: 'low',
        merchant: 'low',
        category: 'low',
      },
    };
  }

  // Pecah teks menjadi baris-baris bersih
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const amountResult = extractAmountFromLines(lines);
  const dateResult = extractDateFromText(rawText);
  const merchantResult = extractMerchantFromLines(lines);
  const categoryResult = detectCategoryFromText(rawText + ' ' + merchantResult.merchant);

  return {
    text: rawText,
    amount: amountResult.amount,
    date: dateResult.date,
    merchant: merchantResult.merchant,
    category: categoryResult.category,
    confidence: amountResult.confidence === 'high' ? 90 : 60,
    fieldConfidence: {
      amount: amountResult.confidence,
      date: dateResult.confidence,
      merchant: merchantResult.confidence,
      category: categoryResult.confidence,
    },
  };
}
