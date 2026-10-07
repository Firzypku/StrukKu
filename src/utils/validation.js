/**
 * validation.js — Validasi terpusat input nominal uang di aplikasi StrukKu
 * Memastikan batas realistis maksimal Rp999.999.999, pencegahan nilai negatif,
 * penolakan karakter tidak valid, dan pesan kesalahan yang ramah pengguna.
 */

export const MAX_AMOUNT = 999999999; // Rp999.999.999
export const MIN_AMOUNT = 1;

/**
 * Validasi nominal uang
 * @param {string|number} rawValue - Nilai yang dimasukkan pengguna
 * @param {Object} [options]
 * @param {boolean} [options.required=true] - Apakah input wajib diisi
 * @param {number} [options.min=1] - Nilai minimum yang diperbolehkan
 * @param {number} [options.max=999999999] - Nilai maksimum yang diperbolehkan (default Rp999.999.999)
 * @param {string} [options.fieldName='Nominal'] - Nama field untuk pesan error
 * @returns {{ isValid: boolean, error: string|null, value: number }}
 */
export const validateAmount = (rawValue, options = {}) => {
  const {
    required = true,
    min = MIN_AMOUNT,
    max = MAX_AMOUNT,
    fieldName = 'Nominal',
  } = options;

  // 1. Cek input kosong
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    if (required) {
      return {
        isValid: false,
        valid: false,
        error: `${fieldName} wajib diisi.`,
        value: 0,
      };
    }
    return { isValid: true, valid: true, error: null, value: 0 };
  }

  // 2. Cek karakter tanda minus / negatif
  const strVal = String(rawValue).trim();
  if (strVal.startsWith('-') || strVal.includes('-')) {
    return {
      isValid: false,
      valid: false,
      error: `${fieldName} tidak boleh bernilai negatif.`,
      value: 0,
    };
  }

  // 3. Bersihkan pemisah angka (titik ribuan, koma, spasi, prefix Rp)
  let parsed;
  if (typeof rawValue === 'number') {
    parsed = rawValue;
  } else {
    // Cek jika terdapat karakter huruf selain 'r', 'p' (misal: "abc")
    const withoutCurrency = strVal.replace(/^rp\s*/i, '').trim();
    if (/[^\d.,\s]/.test(withoutCurrency)) {
      return {
        isValid: false,
        valid: false,
        error: `${fieldName} hanya boleh berupa angka.`,
        value: 0,
      };
    }
    // Jika format rupiah dengan titik ribuan (misal: 1.500.000 atau 50.000)
    let cleaned = withoutCurrency.replace(/\s+/g, '');
    if ((cleaned.match(/\./g) || []).length > 1 || /\.\d{3}$/.test(cleaned)) {
      cleaned = cleaned.replace(/\./g, '');
    }
    cleaned = cleaned.replace(/,/g, '.');
    parsed = parseFloat(cleaned);
  }

  // 4. Cek karakter tidak valid (NaN)
  if (isNaN(parsed)) {
    return {
      isValid: false,
      valid: false,
      error: `${fieldName} hanya boleh berupa angka.`,
      value: 0,
    };
  }

  // 5. Cek nilai negatif hasil parsing
  if (parsed < 0) {
    return {
      isValid: false,
      valid: false,
      error: `${fieldName} tidak boleh bernilai negatif.`,
      value: 0,
    };
  }

  // 6. Cek nilai minimum jika wajib diisi
  if (required && parsed < min) {
    return {
      isValid: false,
      valid: false,
      error: `${fieldName} minimal adalah Rp${min.toLocaleString('id-ID')}.`,
      value: parsed,
    };
  }

  // 7. Cek batas maksimum realistis (maksimal Rp999.999.999)
  if (parsed > max) {
    return {
      isValid: false,
      valid: false,
      error: `Nominal terlalu besar. Masukkan nominal maksimal Rp${max.toLocaleString('id-ID')}.`,
      value: parsed,
    };
  }

  return { isValid: true, valid: true, error: null, value: parsed };
};

/**
 * Filter karakter input hanya angka dan batasi maksimal digit
 * @param {string|number} val
 * @param {number} [max=999999999]
 * @returns {string}
 */
export const sanitizeNumericInput = (val, max = MAX_AMOUNT) => {
  if (val === null || val === undefined || val === '') return '';
  const digits = String(val).replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10);
  if (num > max) return String(max);
  return digits;
};
