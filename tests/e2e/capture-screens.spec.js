import { test } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 }, // Mobile Viewport (iPhone 13/14)
  deviceScaleFactor: 2,
});

test('Capture authenticated mobile UI screens for UX audit', async ({ page }) => {
  const mockJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWF1ZGl0LTEyMyIsImV4cCI6MjUzNDAyMzAwNzk5fQ.mockSig';

  // 1. Intersep Auth
  await page.route(/\/auth\/v1\//, async (route) => {
    const url = route.request().url();
    if (url.includes('/token') || url.includes('/user')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: mockJwt,
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'user-audit-123',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'firzy@mahasiswa.telkom.ac.id',
            user_metadata: { full_name: 'Firzy' },
          },
        }),
      });
    }
    return route.continue();
  });

  const mockExpenses = [
    { id: '1', title: 'Nasi Padang Ayam Pop', amount: 24000, category: 'Makanan', date: '2026-09-27' },
    { id: '2', title: 'Indomaret Sabun & Kopi', amount: 38500, category: 'Belanja', date: '2026-09-26' },
    { id: '3', title: 'Bensin Pertalite Motor', amount: 30000, category: 'Transport', date: '2026-09-25' },
    { id: '4', title: 'Print Modul Kuliah & Jilid', amount: 15000, category: 'Pendidikan', date: '2026-09-24' },
    { id: '5', title: 'Es Teh Manis Jumbo', amount: 5000, category: 'Minuman', date: '2026-09-24' },
  ];

  // 2. Intersep REST
  await page.route(/\/rest\/v1\//, async (route) => {
    const url = route.request().url();
    if (url.includes('/expenses')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockExpenses),
      });
    }
    if (url.includes('/allowances')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ current_balance: 720000, next_pay_date: '2026-10-25', monthly_amount: 1500000 }]),
      });
    }
    if (url.includes('/budgets')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ monthly_budget: 1200000 }]),
      });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  // Login
  await page.goto('/login');
  await page.fill('input[type="email"]', 'firzy@mahasiswa.telkom.ac.id');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);

  // 1. Dashboard
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tests/screenshots/04_dashboard.png', fullPage: true });

  // 2. Scan (Camera / Gallery Default)
  await page.goto('/scan');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tests/screenshots/05_scan.png', fullPage: true });

  // 3. Scan (Manual Tab)
  await page.click('button:has-text("Manual")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'tests/screenshots/06_scan_manual.png', fullPage: true });

  // 4. Riwayat
  await page.goto('/history');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tests/screenshots/07_history.png', fullPage: true });

  // 5. Anggaran
  await page.goto('/budget');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tests/screenshots/08_budget.png', fullPage: true });

  // 6. Hemat & Tantangan
  await page.goto('/hemat');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tests/screenshots/09_hemat.png', fullPage: true });

  // 7. Profil & Hak Pengguna UU PDP
  await page.goto('/profile');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tests/screenshots/10_profile.png', fullPage: true });
});
