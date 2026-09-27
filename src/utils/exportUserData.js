/**
 * exportUserData.js — Utilitas Portabilitas Data Pribadi (UU PDP No. 27/2022)
 * Memungkinkan pengguna mengunduh 100% data pribadi mereka dalam format JSON dan Excel (.xlsx).
 */

import { formatRupiah } from './prediction';

/**
 * Unduh seluruh data pengguna dalam format JSON terstruktur
 */
export function downloadUserDataJson({ user, expenses = [], budget = 0, allowanceConfig = {}, challenges = [] }) {
  const exportPayload = {
    exportMetadata: {
      platform: 'StrukKu App',
      exportDate: new Date().toISOString(),
      legalBasis: 'UU Pelindungan Data Pribadi No. 27 Tahun 2022 Pasal 13 (Hak Portabilitas Data)',
      totalTransactions: expenses.length,
    },
    userProfile: {
      id: user?.id,
      email: user?.email,
      fullName: user?.user_metadata?.full_name,
      createdAt: user?.created_at,
    },
    allowanceCycleConfig: allowanceConfig,
    monthlyBudgetLimit: budget,
    challengesProgress: challenges,
    expenses: expenses.map((e) => ({
      id: e.id,
      title: e.title,
      amount: parseFloat(e.amount) || 0,
      category: e.category,
      date: e.date,
      note: e.note || null,
      imageUrl: e.image || null,
      createdAt: e.created_at,
    })),
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `strukku-arsip-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Unduh seluruh data pengguna dalam format Spreadsheet Excel multi-sheet (.xlsx)
 */
export async function downloadUserDataExcel({ user, expenses = [], budget = 0, allowanceConfig = {}, challenges = [] }) {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  // Sheet 1: Transaksi Pengeluaran
  const expenseRows = expenses.map((e, idx) => ({
    No: idx + 1,
    Tanggal: e.date,
    Keterangan: e.title,
    Kategori: e.category,
    'Nominal (Rp)': parseFloat(e.amount) || 0,
    Catatan: e.note || '-',
    'Lampiran Gambar': e.image ? 'Ada (Cloud)' : 'Tidak Ada',
  }));
  const wsExpenses = XLSX.utils.json_to_sheet(expenseRows);
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Daftar Pengeluaran');

  // Sheet 2: Konfigurasi Keuangan & Anggaran
  const budgetRows = [
    { Parameter: 'User ID', Nilai: user?.id || '-' },
    { Parameter: 'Nama Pengguna', Nilai: user?.user_metadata?.full_name || '-' },
    { Parameter: 'Email', Nilai: user?.email || '-' },
    { Parameter: 'Batas Belanja Bulanan (Budget)', Nilai: budget ? formatRupiah(budget) : 'Rp 0' },
    { Parameter: 'Nominal Uang Saku per Siklus', Nilai: allowanceConfig.monthlyAmount ? formatRupiah(allowanceConfig.monthlyAmount) : 'Rp 0' },
    { Parameter: 'Tanggal Kiriman Uang Saku', Nilai: allowanceConfig.payDay ? `Setiap tanggal ${allowanceConfig.payDay}` : '-' },
    { Parameter: 'Sisa Saldo Terakhir', Nilai: allowanceConfig.currentBalance ? formatRupiah(allowanceConfig.currentBalance) : '-' },
  ];
  const wsBudget = XLSX.utils.json_to_sheet(budgetRows);
  XLSX.utils.book_append_sheet(wb, wsBudget, 'Profil & Anggaran');

  // Sheet 3: Tantangan Hemat
  const challengeRows = (challenges || []).map((ch, idx) => ({
    No: idx + 1,
    'Nama Tantangan': ch.title,
    Target: `${ch.target} ${ch.unit}`,
    'Progres Saat Ini': `${ch.progress} ${ch.unit}`,
    Status: ch.completed ? 'Selesai 🏆' : 'Sedang Berjalan 🏃',
  }));
  const wsChallenges = XLSX.utils.json_to_sheet(challengeRows);
  XLSX.utils.book_append_sheet(wb, wsChallenges, 'Tantangan Hemat');

  // Tulis file Excel
  const fileName = `strukku-laporan-keuangan-lengkap-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
