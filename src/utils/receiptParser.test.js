import { describe, it, expect } from 'vitest';
import { parseReceiptText } from './receiptParser';

describe('receiptParser — Precision Tests', () => {
  it('1. ignores TUNAI and KEMBALI and picks TOTAL correctly', () => {
    const rawText = `
      WARUNG MAKAN SEDAP
      Jl. Kampus No. 12
      Nasi Ayam Bakar   25.000
      Es Teh Manis       5.000
      Kerupuk           10.000
      TOTAL             40.000
      TUNAI             50.000
      KEMBALI           10.000
      Terima Kasih
    `;
    const result = parseReceiptText(rawText);
    expect(result.amount).toBe(40000);
    expect(result.fieldConfidence.amount).toBe('high');
  });

  it('2. handles Indonesian decimal comma (,00) correctly without multiplying by 100', () => {
    const rawText = `
      MINIMARKET KAMPUS
      Biskuit Roma       15.000,00
      Susu UHT           10.000,00
      Subtotal Rp 25.000,00
      Total Rp 25.000,00
    `;
    const result = parseReceiptText(rawText);
    expect(result.amount).toBe(25000);
    expect(result.fieldConfidence.amount).toBe('high');
  });

  it('3. parses QRIS / e-wallet receipt with merchant and date correctly', () => {
    const rawText = `
      Pembayaran Berhasil
      Rp25.000
      24 Sep 2026, 13:05
      Merchant: Kantin FT
      ID Transaksi 2609241305778
    `;
    const result = parseReceiptText(rawText);
    expect(result.amount).toBe(25000);
    expect(result.date).toBe('2026-09-24');
    expect(result.merchant).toBe('Kantin FT');
    expect(result.fieldConfidence.merchant).toBe('high');
  });

  it('4. ignores receipt / transaction numbers (No: 00012345) and picks valid item amount', () => {
    const rawText = `
      No: 00012345
      Nasi Ayam 30.000
    `;
    const result = parseReceiptText(rawText);
    expect(result.amount).toBe(30000);
  });

  it('5. handles GRAND TOTAL with PPN correctly', () => {
    const rawText = `
      CAFE MAHASISWA
      Kopi Susu Gula Aren   25.000
      Croissant Almond      35.000
      Spaghetti Bolognese   52.500
      Subtotal             112.500
      PPN 11.000
      GRAND TOTAL          123.500
      BCA Debit            123.500
    `;
    const result = parseReceiptText(rawText);
    expect(result.amount).toBe(123500);
    expect(result.fieldConfidence.amount).toBe('high');
  });
});
