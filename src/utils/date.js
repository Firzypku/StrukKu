/**
 * Utilitas format tanggal lokal tanpa pergeseran zona waktu UTC (WIB/WITA/WIT).
 * Menggunakan format 'en-CA' yang menghasilkan string ISO 'YYYY-MM-DD'.
 */

export const todayLocal = () => {
  return new Date().toLocaleDateString('en-CA');
};

export const toLocalDateString = (date) => {
  if (!date) return todayLocal();
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? todayLocal() : d.toLocaleDateString('en-CA');
};

// Alias untuk kompatibilitas jika ada kode lama yang memanggil getLocalDateString
export const getLocalDateString = toLocalDateString;
