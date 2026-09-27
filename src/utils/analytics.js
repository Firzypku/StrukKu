/**
 * analytics.js — Integrasi PostHog Product Analytics & Session Replay untuk StrukKu
 * Dikonfigurasi dengan masking privasi: Semua elemen bertanda .ph-no-capture
 * akan disamarkan secara otomatis di Session Replay PostHog.
 */
import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let isInitialized = false;

export function initPostHog() {
  if (isInitialized) return;

  if (!POSTHOG_KEY) {
    if (import.meta.env.DEV) {
      console.info('ℹ️ [PostHog] VITE_POSTHOG_KEY belum di-set. Event analytics akan dicatat di konsol browser.');
    }
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    // Konfigurasi privasi session replay
    session_recording: {
      maskAllInputs: true,
      // Elemen bertanda .ph-no-capture disamarkan teksnya
      maskTextSelector: '.ph-no-capture',
    },
    loaded: () => {
      isInitialized = true;
    },
  });
}

/**
 * Kirim event ke PostHog (atau console log jika di dev tanpa key)
 */
export function trackEvent(eventName, properties = {}) {
  // Pastikan properti tidak membocorkan angka nominal langsung
  const sanitizedProps = { ...properties };
  if ('amount' in sanitizedProps) {
    // Ganti amount dengan range bracket demi privasi (misal: "under_50k", "50k_100k", "above_500k")
    const amt = parseFloat(sanitizedProps.amount) || 0;
    sanitizedProps.amount_range =
      amt < 50000 ? '<50k' : amt < 150000 ? '50k-150k' : amt < 500000 ? '150k-500k' : '>500k';
    delete sanitizedProps.amount;
  }

  if (POSTHOG_KEY && typeof posthog.capture === 'function') {
    posthog.capture(eventName, sanitizedProps);
  } else if (import.meta.env.DEV) {
    console.debug(`📊 [PostHog Event] ${eventName}:`, sanitizedProps);
  }
}

/**
 * Event-event spesifik sesuai spesifikasi fondasi produksi StrukKu:
 */
export const analytics = {
  // 1. Registrasi Akun
  signup: (method = 'email') => trackEvent('signup', { method }),

  // 2. Selesai Onboarding / Set Siklus Uang Saku
  onboardingDone: () => trackEvent('onboarding_done'),

  // 3. Transaksi Pertama Tercatat
  firstExpense: (category) => trackEvent('first_expense', { category }),

  // 4. Mulai Scan Struk
  scanStarted: (source = 'camera') => trackEvent('scan_started', { source }),

  // 5. Scan Berhasil (OCR Selesai)
  scanSuccess: (meta = {}) => trackEvent('scan_success', meta),

  // 6. Pengguna Mengubah Nominal Hasil OCR
  scanEditedAmount: () => trackEvent('scan_edited_amount'),

  // 7. Split Bill / Patungan Dibuat
  splitCreated: (type = 'itemized', peopleCount = 2) =>
    trackEvent('split_created', { split_type: type, people_count: peopleCount }),

  // 8. Tampilan Paywall Dilihat
  paywallViewed: (plan = 'pro_monthly', source = 'feature_gate') =>
    trackEvent('paywall_viewed', { plan, source }),

  // 9. Checkout Pembayaran Dimulai
  checkoutStarted: (plan = 'pro_monthly') => trackEvent('checkout_started', { plan }),

  // 10. Pembayaran Sukses Berlangganan
  paymentSuccess: (plan = 'pro_monthly') => trackEvent('payment_success', { plan }),

  // Identifikasi Pengguna setelah Login
  identify: (userId) => {
    if (POSTHOG_KEY && typeof posthog.identify === 'function') {
      posthog.identify(userId);
    }
  },

  // Reset sesi saat Logout
  reset: () => {
    if (POSTHOG_KEY && typeof posthog.reset === 'function') {
      posthog.reset();
    }
  },
};

export { posthog };
