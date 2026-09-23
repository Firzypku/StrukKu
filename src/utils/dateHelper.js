/**
 * dateHelper.js — Penanganan tanggal zona waktu lokal (WIB/WITA/WIT)
 * Mencegah transaksi tengah malam (00.00-06.59 WIB) bergeser ke hari kemarin karena konversi UTC.
 */

export const getLocalDateString = (d = new Date()) => {
  const date = typeof d === 'string' ? new Date(d) : d;
  if (!date || isNaN(date.getTime())) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
