/**
 * sentry.js — Integrasi Monitoring Sentry untuk StrukKu
 * Dilengkapi filter privasi ketat: Nominal uang dan email TIDAK AKAN PERNAH terkirim ke server Sentry.
 */
import * as Sentry from '@sentry/react';

// Regex untuk mendeteksi email
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

// Regex untuk mendeteksi nominal Rupiah dan angka uang (contoh: Rp150.000, Rp 50,000, 1500000)
const CURRENCY_REGEX = /(?:Rp\.?\s*[\d.,]+|\b\d{4,}\b)/gi;

/**
 * Membersihkan teks dari informasi sensitif (email & nominal)
 */
function sanitizeSensitiveString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(EMAIL_REGEX, '[EMAIL_DISAMARKAN]')
    .replace(CURRENCY_REGEX, '[NOMINAL_DISAMARKAN]');
}

/**
 * Membersihkan objek secara rekursif
 */
function sanitizeObject(obj, depth = 0) {
  if (!obj || depth > 4) return obj;
  if (typeof obj === 'string') return sanitizeSensitiveString(obj);
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, depth + 1));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    // Samarkan jika key mengandung kata kunci sensitif
    if (
      lowerKey.includes('email') ||
      lowerKey.includes('amount') ||
      lowerKey.includes('nominal') ||
      lowerKey.includes('saldo') ||
      lowerKey.includes('price') ||
      lowerKey.includes('budget') ||
      lowerKey.includes('password') ||
      lowerKey.includes('token')
    ) {
      sanitized[key] = '[SENSITIF_DISAMARKAN]';
    } else {
      sanitized[key] = sanitizeObject(value, depth + 1);
    }
  }
  return sanitized;
}

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('ℹ️ [Sentry] VITE_SENTRY_DSN belum di-set. Error logging lokal aktif di konsol browser.');
    }
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || 'production',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true, // Semua teks default disamarkan pada replay
        blockAllMedia: true,
        maskAllInputs: true,
      }),
    ],
    // Tracing sample rate: 10% untuk produksi guna efisiensi kuota
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Replay sample rate
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,

    // Filter ketat sebelum event dikirim ke Sentry
    beforeSend(event) {
      // 1. Pastikan User Object tidak menyertakan email atau IP
      if (event.user) {
        event.user = {
          id: event.user.id || 'anonymous',
          // Email, username, dan ip_address sengaja dihilangkan
        };
      }

      // 2. Bersihkan message dan exceptions
      if (event.message) {
        event.message = sanitizeSensitiveString(event.message);
      }

      if (event.exception && event.exception.values) {
        event.exception.values = event.exception.values.map((val) => ({
          ...val,
          value: sanitizeSensitiveString(val.value),
        }));
      }

      // 3. Bersihkan breadcrumbs dan extra context
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((b) => ({
          ...b,
          message: sanitizeSensitiveString(b.message),
          data: sanitizeObject(b.data),
        }));
      }

      if (event.extra) {
        event.extra = sanitizeObject(event.extra);
      }

      return event;
    },

    // Filter breadcrumbs sebelum disimpan di memori klien
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.category === 'xhr' || breadcrumb.category === 'fetch') {
        if (breadcrumb.data?.url) {
          // Bersihkan parameter query yang mungkin membawa nilai uang/email
          try {
            const urlObj = new URL(breadcrumb.data.url, window.location.origin);
            urlObj.searchParams.forEach((val, key) => {
              urlObj.searchParams.set(key, '[PARAM]');
            });
            breadcrumb.data.url = urlObj.toString();
          } catch {
            // Abaikan jika bukan URL valid
          }
        }
      }

      if (breadcrumb.message) {
        breadcrumb.message = sanitizeSensitiveString(breadcrumb.message);
      }

      return breadcrumb;
    },
  });
}

export { Sentry };
