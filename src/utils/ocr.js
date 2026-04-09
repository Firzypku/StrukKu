/**
 * ocr.js — OCR wrapper menggunakan Tesseract.js
 * Extract teks dari gambar struk belanja
 */

import Tesseract from 'tesseract.js';

/**
 * Kategori sederhana berdasarkan keyword
 */
export const CATEGORIES = {
  makanan: ['makan', 'nasi', 'ayam', 'bakso', 'mie', 'soto', 'warteg', 'restoran', 'cafe', 'kopi', 'minuman', 'snack', 'indomie', 'burger', 'pizza', 'gorengan', 'pecel'],
  minuman: ['aqua', 'air', 'teh', 'kopi', 'jus', 'susu', 'boba', 'thai tea'],
  transport: ['grab', 'gojek', 'ojek', 'bensin', 'parkir', 'busway', 'kereta', 'krl', 'mrt', 'bbm', 'pertamax', 'pertalite'],
  belanja: ['indomaret', 'alfamart', 'minimarket', 'supermarket', 'hypermart', 'giant', 'carrefour', 'toko'],
  hiburan: ['cinema', 'bioskop', 'netflix', 'spotify', 'game', 'tiket', 'konser'],
  kesehatan: ['apotek', 'obat', 'klinik', 'dokter', 'vitamin', 'masker', 'kimia farma'],
  pendidikan: ['buku', 'fotokopi', 'print', 'atk', 'alat tulis', 'kampus'],
  fashion: ['baju', 'celana', 'sepatu', 'tas', 'pakaian', 'distro'],
};

/**
 * Deteksi kategori dari teks OCR atau judul
 * @param {string} text
 * @returns {string} kategori
 */
export const detectCategory = (text) => {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  }
  return 'Lainnya';
};

/**
 * Extract harga dari teks (cari angka terbesar sebagai total)
 * @param {string} text
 * @returns {number|null}
 */
export const extractAmount = (text) => {
  // Pattern: Rp 15.000, 15000, 15,000, Total: 85000
  const patterns = [
    /(?:total|jumlah|bayar|tunai|grand total)[^\d]*(\d[\d.,]+)/gi,
    /rp\.?\s*(\d[\d.,]+)/gi,
    /(\d{4,})/g,
  ];

  for (const pattern of patterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 0) {
      // Ambil nilai terbesar dari match pattern ini
      const values = matches.map((m) => {
        const raw = m[1].replace(/[.,]/g, '').replace(/\./g, '');
        return parseInt(raw, 10);
      }).filter((v) => !isNaN(v) && v >= 100 && v <= 100_000_000);

      if (values.length > 0) {
        return Math.max(...values);
      }
    }
  }
  return null;
};

/**
 * Extract tanggal dari teks struk
 * @param {string} text
 * @returns {string|null} format YYYY-MM-DD
 */
export const extractDate = (text) => {
  // Pattern: DD/MM/YYYY, DD-MM-YYYY, DD MM YYYY
  const patterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        let year, month, day;
        if (match[3] && match[3].length === 4) {
          // DD-MM-YYYY
          day = parseInt(match[1]);
          month = parseInt(match[2]);
          year = parseInt(match[3]);
        } else {
          // YYYY-MM-DD
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        }
        if (year > 2000 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
      } catch {
        continue;
      }
    }
  }
  return new Date().toISOString().split('T')[0];
};

/**
 * Extract nama toko dari baris pertama struk
 * @param {string} text
 * @returns {string}
 */
export const extractStoreName = (text) => {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 2);
  // Biasanya nama toko ada di 3 baris pertama
  if (lines.length > 0) {
    return lines[0].replace(/[^a-zA-Z\s]/g, '').trim() || 'Toko';
  }
  return 'Toko';
};

/**
 * Main OCR function — scan gambar struk
 * @param {File|string} imageSource - File object atau URL
 * @param {Function} onProgress - callback progress (0-100)
 * @returns {Promise<{text, amount, date, category, storeName, confidence}>}
 */
export const scanReceipt = async (imageSource, onProgress = () => {}) => {
  try {
    const result = await Tesseract.recognize(imageSource, 'ind+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });

    const text = result.data.text;
    const confidence = result.data.confidence;

    const amount = extractAmount(text);
    const date = extractDate(text);
    const storeName = extractStoreName(text);
    const category = detectCategory(text + ' ' + storeName);

    return {
      text,
      amount,
      date,
      category,
      storeName,
      confidence: Math.round(confidence),
      success: true,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      text: '',
      amount: null,
      date: new Date().toISOString().split('T')[0],
      category: 'Lainnya',
      storeName: '',
      confidence: 0,
      success: false,
      error: error.message,
    };
  }
};

/**
 * Icon per kategori
 */
export const CATEGORY_ICONS = {
  Makanan: '🍽️',
  Minuman: '🥤',
  Transport: '🚗',
  Belanja: '🛒',
  Hiburan: '🎬',
  Kesehatan: '💊',
  Pendidikan: '📚',
  Fashion: '👕',
  Lainnya: '💳',
};

/**
 * Warna per kategori
 */
export const CATEGORY_COLORS = {
  Makanan: '#FF6B6B',
  Minuman: '#4ECDC4',
  Transport: '#45B7D1',
  Belanja: '#96CEB4',
  Hiburan: '#FECA57',
  Kesehatan: '#FF9FF3',
  Pendidikan: '#54A0FF',
  Fashion: '#5F27CD',
  Lainnya: '#C8D6E5',
};
