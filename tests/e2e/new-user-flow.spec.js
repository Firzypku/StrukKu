import { test, expect } from '@playwright/test';

test.describe('Alur Pengguna Baru StrukKu (End-to-End)', () => {
  test.beforeEach(async ({ page }) => {
    // Simpan mock in-memory state agar interaksi database virtual berjalan konsisten
    let mockExpenses = [];
    let mockAllowance = {
      current_balance: 800000,
      next_pay_date: '2026-10-25',
      monthly_amount: 1500000,
    };

    // 1. Intersep Supabase Auth
    await page.route(/\/auth\/v1\//, async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (url.includes('/signup')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'user-budi-123',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'budi@telkom.ac.id',
            user_metadata: {
              full_name: 'Budi Santoso',
              terms_accepted: true,
              terms_version: 'v1.0-sep2026',
            },
            created_at: new Date().toISOString(),
          }),
        });
      }

      if (url.includes('/token')) {
        const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWJ1ZGktMTIzIiwiZXhwIjoyNTM0MDIzMDA3OTl9.mockSignature';
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: mockJwt,
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'mock-refresh-token',
            user: {
              id: 'user-budi-123',
              aud: 'authenticated',
              role: 'authenticated',
              email: 'budi@telkom.ac.id',
              user_metadata: { full_name: 'Budi Santoso' },
            },
          }),
        });
      }

      if (url.includes('/user')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'user-budi-123',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'budi@telkom.ac.id',
            user_metadata: { full_name: 'Budi Santoso' },
          }),
        });
      }

      return route.continue();
    });

    page.on('console', (msg) => console.log('PLAYWRIGHT BROWSER LOG:', msg.type(), msg.text()));
    page.on('pageerror', (err) => console.log('PLAYWRIGHT BROWSER ERR:', err));

    // 2. Intersep Supabase REST API
    await page.route(/\/rest\/v1\//, async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      // Mock expenses
      if (url.includes('/expenses')) {
        if (method === 'GET') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockExpenses),
          });
        }
        if (method === 'POST') {
          const postData = route.request().postDataJSON();
          const item = Array.isArray(postData) ? postData[0] : postData;
          const newExp = {
            id: 'exp-' + Date.now(),
            user_id: 'user-budi-123',
            created_at: new Date().toISOString(),
            ...item,
          };
          mockExpenses.unshift(newExp);
          const accept = route.request().headers()['accept'] || '';
          const isSingle = accept.includes('vnd.pgrst.object+json');
          return route.fulfill({
            status: 201,
            contentType: isSingle ? 'application/vnd.pgrst.object+json' : 'application/json',
            body: JSON.stringify(isSingle ? newExp : [newExp]),
          });
        }
      }

      // Mock allowance config
      if (url.includes('/allowances')) {
        if (method === 'GET') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([mockAllowance]),
          });
        }
        if (method === 'POST' || method === 'PATCH') {
          const postData = route.request().postDataJSON();
          mockAllowance = { ...mockAllowance, ...postData };
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([mockAllowance]),
          });
        }
      }

      // Default mock untuk tabel lainnya (budgets, challenges, feedback)
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
  });

  test('Pendaftaran Pengguna Baru -> Onboarding Saldo -> Tambah Pengeluaran Manual -> Tampil di Dashboard', async ({ page }) => {
    // 1. Kunjungi Halaman Registrasi
    await page.goto('/register');
    await expect(page).toHaveTitle(/StrukKu/i);

    // Isi formulir pendaftaran
    await page.fill('input[placeholder*="Andi"]', 'Budi Santoso');
    await page.fill('input[placeholder*="nama@email.com"]', 'budi@telkom.ac.id');
    await page.fill('input[placeholder*="Kombinasi rahasia"]', 'rahasia12345');

    // Centang persetujuan Kebijakan Privasi & Syarat Ketentuan (UU PDP)
    const termsCheckbox = page.locator('#agreed-terms');
    await termsCheckbox.check();
    await expect(termsCheckbox).toBeChecked();

    // Klik tombol submit pendaftaran
    await page.click('button[type="submit"]');

    // Pengguna dialihkan ke halaman login dengan pesan sukses
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('text=Pendaftaran sukses!')).toBeVisible();

    // 2. Login dengan akun yang baru dibuat
    await page.fill('input[type="email"]', 'budi@telkom.ac.id');
    await page.fill('input[type="password"]', 'rahasia12345');
    await page.click('button[type="submit"]');

    // Dialihkan ke Beranda / Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Budi Santoso')).toBeVisible();

    // 3. Selesaikan Onboarding / Penyesuaian Saldo Awal
    // Klik tombol "Sesuaikan Saldo" pada kartu Jatah Harian
    const adjustButton = page.locator('button:has-text("Sesuaikan Saldo")');
    await expect(adjustButton).toBeVisible();
    await adjustButton.click();

    // Modal Sesuaikan Saldo terbuka
    await expect(page.locator('text=Sesuaikan Saldo Saat Ini')).toBeVisible();
    const balanceInput = page.locator('#input-current-balance');
    if (await balanceInput.isVisible()) {
      await balanceInput.fill('750000');
    }
    // Klik simpan perubahan saldo
    const saveBalanceBtn = page.locator('button:has-text("Simpan Perubahan")');
    await saveBalanceBtn.click();

    // 4. Tambah Pengeluaran Manual
    // Klik menu "Scan" pada bottom bar navigasi
    await page.click('a[href="/scan"]');
    await expect(page).toHaveURL(/.*scan/);

    // Beralih ke tab Manual
    const manualTab = page.locator('button:has-text("Manual")');
    await manualTab.click();

    // Isi rincian pengeluaran manual
    await page.fill('#input-title', 'Nasi Padang Ayam Pop');
    await page.fill('#input-amount', '27000');

    // Klik Simpan Pengeluaran
    const simpanBtn = page.locator('#btn-simpan');
    await expect(simpanBtn).toBeEnabled();
    await simpanBtn.click();

    // Konfirmasi toast sukses muncul
    await expect(page.locator('text=Pengeluaran berhasil disimpan!')).toBeVisible();

    // 5. Otomatis dialihkan kembali ke Dashboard & Verifikasi Data Tercatat
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Verifikasi bahwa transaksi tercatat di Dashboard
    // 1 transaksi tercatat (1x)
    await expect(page.locator('text=1x')).toBeVisible();

    // Top Kategori menampilkan Makanan dan nominal Rp 27.000
    await expect(page.locator('text=Makanan').first()).toBeVisible();
    await expect(page.locator('text=/Rp\\s*27\\.000/').first()).toBeVisible();
  });
});
