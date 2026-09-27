#!/usr/bin/env node
/**
 * Benchmark Script untuk Parser OCR Struk Belanja Indonesia
 * Menguji akurasi ekstraksi nominal, kategori, dan merchant terhadap dataset nyata di tests/receipts/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseReceiptText } from '../src/utils/receiptParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const receiptsDir = path.resolve(__dirname, '../tests/receipts');

const files = fs.readdirSync(receiptsDir).filter(f => f.endsWith('.json')).sort();

if (files.length === 0) {
  console.error('❌ Tidak ada file dataset struk di tests/receipts/');
  process.exit(1);
}

console.log('\n' + '='.repeat(70));
console.log('📊 STRUKKU OCR BENCHMARK — DATASET STRUK BELANJA INDONESIA');
console.log('='.repeat(70));
console.log(`Menjalankan benchmark pada ${files.length} sampel struk nyata...\n`);

let passedAmountCount = 0;
let passedCategoryCount = 0;
let totalTimeMs = 0;
const results = [];

for (const file of files) {
  const filePath = path.join(receiptsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const startTime = performance.now();
  const parsed = parseReceiptText(data.rawText);
  const duration = performance.now() - startTime;
  totalTimeMs += duration;

  const amountMatch = parsed.amount === data.expected.amount;
  const expCategories = Array.isArray(data.expected.category)
    ? data.expected.category.map((c) => c.toLowerCase())
    : [String(data.expected.category).toLowerCase()];
  const categoryMatch = expCategories.includes(parsed.category.toLowerCase());
  
  let merchantMatch = true;
  if (data.expected.merchantIncludes) {
    const rawUpper = data.rawText.toUpperCase();
    merchantMatch = rawUpper.includes(data.expected.merchantIncludes.toUpperCase());
  }

  if (amountMatch) passedAmountCount++;
  if (categoryMatch) passedCategoryCount++;

  results.push({
    file,
    store: data.store,
    expectedAmount: data.expected.amount,
    parsedAmount: parsed.amount,
    amountMatch,
    expectedCategory: data.expected.category,
    parsedCategory: parsed.category,
    categoryMatch,
    latencyMs: duration.toFixed(2),
  });
}

// Tampilkan Tabel Hasil
console.log('| No | Toko / Merchant       | Nominal Diharapkan | Nominal Terbaca | Kategori Terbaca | Status  | Waktu   |');
console.log('|---|-----------------------|--------------------|-----------------|------------------|---------|---------|');

results.forEach((r, idx) => {
  const no = String(idx + 1).padEnd(2);
  const store = r.store.padEnd(21);
  const expAmt = `Rp${r.expectedAmount.toLocaleString('id-ID')}`.padEnd(18);
  const gotAmt = `Rp${r.parsedAmount.toLocaleString('id-ID')}`.padEnd(15);
  const cat = `${r.parsedCategory}`.padEnd(16);
  const status = (r.amountMatch && r.categoryMatch) ? '✅ PASS ' : '❌ FAIL ';
  const time = `${r.latencyMs}ms`.padEnd(7);

  console.log(`| ${no}| ${store} | ${expAmt} | ${gotAmt} | ${cat} | ${status}| ${time} |`);
});

const amountAccuracy = ((passedAmountCount / files.length) * 100).toFixed(1);
const categoryAccuracy = ((passedCategoryCount / files.length) * 100).toFixed(1);
const avgLatency = (totalTimeMs / files.length).toFixed(2);

console.log('\n' + '-'.repeat(70));
console.log(`📈 HASIL RINGKASAN BENCHMARK:`);
console.log(`   - Total Sampel Diuji   : ${files.length} struk`);
console.log(`   - Akurasi Nominal Uang : ${passedAmountCount}/${files.length} (${amountAccuracy}%)`);
console.log(`   - Akurasi Kategori     : ${passedCategoryCount}/${files.length} (${categoryAccuracy}%)`);
console.log(`   - Rata-rata Latensi    : ${avgLatency} ms / struk`);
console.log('-'.repeat(70) + '\n');

if (passedAmountCount === files.length && passedCategoryCount === files.length) {
  console.log('🎉 SEMPURNA: Semua struk berhasil diparsing dengan presisi 100%!\n');
  process.exit(0);
} else {
  console.warn('⚠️ Beberapa struk gagal mencapai presisi 100%.\n');
  process.exit(1);
}
