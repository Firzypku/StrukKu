/**
 * ocr.js — OCR engine menggunakan Tesseract.js (Singleton Worker)
 * Terintegrasi dengan receiptParser presisi tinggi untuk data struk Indonesia
 */

import Tesseract from 'tesseract.js';
import { parseReceiptText, detectCategoryFromText } from './receiptParser';
import { todayLocal } from './date';

// Singleton worker instance & callback listener
let workerInstance = null;
let currentProgressCallback = null;

/**
 * Inisialisasi atau ambil instance worker Tesseract singleton
 */
export async function getTesseractWorker() {
  if (!workerInstance) {
    workerInstance = await Tesseract.createWorker(['ind', 'eng'], Tesseract.OEM.LSTM_ONLY, {
      logger: (m) => {
        if (m.status === 'recognizing text' && typeof currentProgressCallback === 'function') {
          currentProgressCallback(Math.round(m.progress * 100));
        }
      },
    });
  }
  return workerInstance;
}

/**
 * Hentikan worker Tesseract jika diperlukan (misal saat unmount)
 */
export async function terminateTesseractWorker() {
  if (workerInstance) {
    try {
      await workerInstance.terminate();
    } catch (e) {
      console.warn('Error terminating Tesseract worker:', e);
    }
    workerInstance = null;
    currentProgressCallback = null;
  }
}

/**
 * Wrapper scanReceipt — memproses gambar struk dengan Tesseract.js
 * @param {string|File|Blob|HTMLCanvasElement} imageSource - Gambar terproses atau Canvas
 * @param {Function} onProgress - Callback persentase progress (0-100)
 * @returns {Promise<object>} Hasil parse terstruktur
 */
export const scanReceipt = async (imageSource, onProgress = () => {}) => {
  try {
    currentProgressCallback = onProgress;
    const worker = await getTesseractWorker();

    const result = await worker.recognize(imageSource);
    const rawText = result?.data?.text || '';
    const parsed = parseReceiptText(rawText);

    return {
      text: rawText,
      amount: parsed.amount,
      date: parsed.date || todayLocal(),
      category: parsed.category,
      storeName: parsed.merchant,
      confidence: parsed.confidence,
      fieldConfidence: parsed.fieldConfidence,
      success: parsed.amount > 0 || (rawText.trim().length > 10),
    };
  } catch (error) {
    console.error('OCR Error:', error);
    // Reset worker jika terjadi error fatal
    terminateTesseractWorker();
    return {
      text: '',
      amount: null,
      date: todayLocal(),
      category: 'Lainnya',
      storeName: '',
      confidence: 0,
      fieldConfidence: { amount: 'low', date: 'low', merchant: 'low', category: 'low' },
      success: false,
      error: error.message,
    };
  }
};

/**
 * Helper deteksi kategori (backward compatible)
 */
export const detectCategory = (text) => {
  return detectCategoryFromText(text).category;
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
