/**
 * GreenworthContext.jsx — Store Data Terpusat GREENWORTH Surabaya
 * Mengelola akun, riwayat setoran, dan riwayat sumbangan.
 * Semua angka (total poin, rupiah, berat, progres) dihitung dinamis dari data ini.
 * Tersimpan di state dan disinkronkan ke localStorage.
 */

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  NILAI_POIN,
  POIN_PER_KG,
  BERAT_PER_GELAS_KG,
  TITIK_KUMPUL_SURABAYA,
  POS_SUMBANGAN,
} from '../config';

const STORAGE_KEY = 'greenworth_surabaya_data_v1';
const SESSION_KEY = 'greenworth_surabaya_session_v1';

// Data Akun Awal Demo
const INITIAL_AKUN = {
  id: 'GW-SBY-042',
  nama: 'Ahmad Rizky Pratama',
  email: 'rizky.surabaya@gmail.com',
  telepon: '0812-3456-7890',
  wilayahDomisili: 'Surabaya Timur',
  tanggalBergabung: '28 September 2026',
  bonusPendaftaranPoin: 100, // Bonus sambutan anggota baru
};

// 5 Riwayat Setoran Demo
const INITIAL_SETORAN = [
  {
    id: 'setor-001',
    tanggal: '01 Okt 2026, 14:30 WIB',
    titikKumpulId: 'kumpul-tunjungan',
    namaKedai: 'Kedai Kopi Sedap Tunjungan',
    wilayah: 'Tunjungan',
    jenisSampah: 'gelasPlastik', // 'gelasPlastik' | 'kardus'
    labelSampah: 'Cup Gelas Plastik',
    jumlahGelas: 25,
    beratKg: 0.30, // 25 * 0.012 kg
    poinDidapat: 3, // Math.round(0.30 * 10)
    catatan: 'Cup es kopi susu sudah dibilas bersih dan kering.',
  },
  {
    id: 'setor-002',
    tanggal: '03 Okt 2026, 16:15 WIB',
    titikKumpulId: 'kumpul-gubeng',
    namaKedai: 'Kopi Sahabat Gubeng',
    wilayah: 'Gubeng',
    jenisSampah: 'gelasPlastik',
    labelSampah: 'Cup Gelas Plastik',
    jumlahGelas: 40,
    beratKg: 0.48, // 40 * 0.012 kg
    poinDidapat: 5, // Math.round(0.48 * 10)
    catatan: 'Setoran cup kopi mingguan dari kantor.',
  },
  {
    id: 'setor-003',
    tanggal: '04 Okt 2026, 10:45 WIB',
    titikKumpulId: 'kumpul-wonokromo',
    namaKedai: 'Warkop Berkah Wonokromo',
    wilayah: 'Wonokromo',
    jenisSampah: 'kardus',
    labelSampah: 'Kardus Boks Kemasan',
    jumlahGelas: 0,
    beratKg: 2.40,
    poinDidapat: 12, // Math.round(2.40 * 5)
    catatan: 'Kardus boks makanan sudah dilipat rapi dan bersih.',
  },
  {
    id: 'setor-004',
    tanggal: '06 Okt 2026, 17:20 WIB',
    titikKumpulId: 'kumpul-rungkut',
    namaKedai: 'Kopi Sudut Rungkut',
    wilayah: 'Rungkut',
    jenisSampah: 'gelasPlastik',
    labelSampah: 'Cup Gelas Plastik',
    jumlahGelas: 50,
    beratKg: 0.60,
    poinDidapat: 6, // Math.round(0.60 * 10)
    catatan: 'Cup kopi dari kumpul komunitas mahasiswa.',
  },
  {
    id: 'setor-005',
    tanggal: '07 Okt 2026, 11:10 WIB',
    titikKumpulId: 'kumpul-tunjungan',
    namaKedai: 'Kedai Kopi Sedap Tunjungan',
    wilayah: 'Tunjungan',
    jenisSampah: 'kardus',
    labelSampah: 'Kardus Boks Kemasan',
    jumlahGelas: 0,
    beratKg: 3.00,
    poinDidapat: 15, // Math.round(3.00 * 5)
    catatan: 'Kardus makanan sisa acara syukuran keluarga.',
  },
];

// 2 Riwayat Sumbangan Demo (satu di Tahap 2, satu di Tahap 5)
const INITIAL_SUMBANGAN = [
  {
    id: 'donasi-001',
    tanggal: '02 Okt 2026, 09:15 WIB',
    posId: 'pos-sedekah-pendidikan',
    namaPos: 'Sedekah Pendidikan',
    lembagaPengelola: 'Yayasan Peduli Anak Bangsa Surabaya (Fiktif)',
    jumlahPoin: 50,
    nilaiRupiah: 5000, // 50 * 100
    tahapSaatIni: 5, // TAHAP 5 (Selesai disalurkan)
    judulTahap: 'Selesai & Laporan Terbit',
    keteranganTahap: 'Paket seragam dan buku tulis telah diterima siswa binaan di Semampir, Surabaya.',
    tanggalPenyaluranAkhir: '04 Okt 2026',
    pesanDoa: 'Semoga adik-adik semakin semangat belajarnya.',
  },
  {
    id: 'donasi-002',
    tanggal: '05 Okt 2026, 13:00 WIB',
    posId: 'pos-wakaf-produktif',
    namaPos: 'Wakaf Uang Produktif',
    lembagaPengelola: 'Lembaga Wakaf Amanah Surabaya (Fiktif)',
    jumlahPoin: 25,
    nilaiRupiah: 2500, // 25 * 100
    tahapSaatIni: 2, // TAHAP 2 (Sedang dalam verifikasi & perencanaan)
    judulTahap: 'Verifikasi & Perencanaan',
    keteranganTahap: 'Tim sedang menyurvei dan memverifikasi lokasi masjid Surabaya yang membutuhkan instalasi air hemat wudhu.',
    tanggalPenyaluranAkhir: null,
    pesanDoa: 'Semoga menjadi amal jariyah yang terus mengalir pahalanya.',
  },
];

const GreenworthContext = createContext(null);

export function GreenworthProvider({ children }) {
  // State tersimpan dengan backup localStorage
  const [akun, setAkun] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.akun) return parsed.akun;
      }
    } catch {
      // Abaikan jika parsing gagal
    }
    return INITIAL_AKUN;
  });

  const [setoranList, setSetoranList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.setoranList) && parsed.setoranList.length > 0) {
          return parsed.setoranList;
        }
      }
    } catch {
      // Abaikan jika parsing gagal
    }
    return INITIAL_SETORAN;
  });

  const [sumbanganList, setSumbanganList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.sumbanganList) && parsed.sumbanganList.length > 0) {
          return parsed.sumbanganList;
        }
      }
    } catch {
      // Abaikan jika parsing gagal
    }
    return INITIAL_SUMBANGAN;
  });

  // State Sesi Login (Disimpan di localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const sess = localStorage.getItem(SESSION_KEY);
      if (sess !== null) return sess === 'true';
    } catch {}
    return true;
  });

  // Simpan ke localStorage setiap kali ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ akun, setoranList, sumbanganList })
      );
    } catch (err) {
      console.warn('Gagal menyimpan ke localStorage:', err);
    }
  }, [akun, setoranList, sumbanganList]);

  // =========================================================================
  // PERHITUNGAN TERPUSAT (SEMUA ANGKA DIHITUNG, TIDAK BOLEH MANUAL)
  // =========================================================================

  const ringkasan = useMemo(() => {
    // 1. Total poin dari setoran
    const totalPoinDariSetoran = setoranList.reduce(
      (sum, item) => sum + (Number(item.poinDidapat) || 0),
      0
    );

    // 2. Total poin pernah didapat (termasuk bonus pendaftaran awal)
    const totalPoinPernahDidapat = (akun.bonusPendaftaranPoin || 0) + totalPoinDariSetoran;

    // 3. Total poin yang telah disumbangkan
    const totalPoinDisumbangkan = sumbanganList.reduce(
      (sum, item) => sum + (Number(item.jumlahPoin) || 0),
      0
    );

    // 4. Saldo poin aktif saat ini
    const saldoPoin = Math.max(0, totalPoinPernahDidapat - totalPoinDisumbangkan);

    // 5. Saldo dalam bentuk rupiah
    const saldoRupiah = saldoPoin * NILAI_POIN;

    // 6. Total rupiah yang pernah disumbangkan
    const totalRupiahDisumbangkan = totalPoinDisumbangkan * NILAI_POIN;

    // 7. Rincian sampah plastik
    const setoranPlastik = setoranList.filter((s) => s.jenisSampah === 'gelasPlastik');
    const totalGelasPlastik = setoranPlastik.reduce(
      (sum, item) => sum + (Number(item.jumlahGelas) || 0),
      0
    );
    const totalBeratPlastikKg = setoranPlastik.reduce(
      (sum, item) => sum + (Number(item.beratKg) || 0),
      0
    );

    // 8. Rincian sampah kardus
    const setoranKardus = setoranList.filter((s) => s.jenisSampah === 'kardus');
    const totalBeratKardusKg = setoranKardus.reduce(
      (sum, item) => sum + (Number(item.beratKg) || 0),
      0
    );

    // 9. Total keseluruhan berat sampah yang dipilah
    const totalBeratSampahKg = totalBeratPlastikKg + totalBeratKardusKg;

    // 10. Jumlah transaksi setoran dan sumbangan
    const totalTransaksiSetor = setoranList.length;
    const totalTransaksiSumbang = sumbanganList.length;

    // 11. Perhitungan dana terkumpul per pos sumbangan
    // (Berasal dari sumbangan pengguna ini ditambah simulasi akumulasi publik)
    const ringkasanPosSumbangan = POS_SUMBANGAN.map((pos) => {
      // Sumbangan pengguna ini ke pos ini
      const sumbanganSaya = sumbanganList
        .filter((s) => s.posId === pos.id)
        .reduce((sum, item) => sum + (Number(item.nilaiRupiah) || 0), 0);

      // Simulasi dana dari warga Surabaya lainnya (berdasarkan target dan id pos)
      const danaAwalSimulasi =
        pos.id === 'pos-wakaf-produktif'
          ? 3850000
          : pos.id === 'pos-sedekah-pendidikan'
          ? 4200000
          : 2150000;

      const totalTerkumpul = danaAwalSimulasi + sumbanganSaya;
      const persentaseTarget = Math.min(
        100,
        Math.round((totalTerkumpul / pos.targetDanaRupiah) * 100)
      );

      return {
        ...pos,
        sumbanganSayaRupiah: sumbanganSaya,
        totalTerkumpulRupiah: totalTerkumpul,
        persentaseTarget,
      };
    });

      // 12. Poin Tertunda (simulasi setoran cup terbaru yang sedang ditimbang/diverifikasi mitra kedai)
      const poinTertunda = 15;
      const poinTertundaRupiah = poinTertunda * NILAI_POIN;

      return {
        saldoPoin,
        saldoRupiah,
        poinTertunda,
        poinTertundaRupiah,
        totalPoinPernahDidapat,
        totalPoinDisumbangkan,
        totalRupiahDisumbangkan,
        totalGelasPlastik,
        totalBeratPlastikKg: Number(totalBeratPlastikKg.toFixed(2)),
        totalBeratKardusKg: Number(totalBeratKardusKg.toFixed(2)),
        totalBeratSampahKg: Number(totalBeratSampahKg.toFixed(2)),
        totalTransaksiSetor,
        totalTransaksiSumbang,
        ringkasanPosSumbangan,
      };
    }, [akun, setoranList, sumbanganList]);

  // =========================================================================
  // FUNGSI AKSI
  // =========================================================================

  // 1. Tambah Setoran Sampah Baru
  const tambahSetoran = ({ titikKumpulId, jenisSampah, jumlahGelas, beratManualKg, catatan }) => {
    const kedai = TITIK_KUMPUL_SURABAYA.find((k) => k.id === titikKumpulId) || TITIK_KUMPUL_SURABAYA[0];
    let finalBeratKg = 0;
    let poin = 0;
    let label = '';
    const jGelas = Number(jumlahGelas) || 0;

    if (jenisSampah === 'gelasPlastik') {
      label = 'Cup Gelas Plastik';
      finalBeratKg = Number((jGelas * BERAT_PER_GELAS_KG).toFixed(2));
      poin = Math.max(1, Math.round(finalBeratKg * POIN_PER_KG.gelasPlastik));
    } else {
      label = 'Kardus Boks Kemasan';
      finalBeratKg = Number((Number(beratManualKg) || 1).toFixed(2));
      poin = Math.max(1, Math.round(finalBeratKg * POIN_PER_KG.kardus));
    }

    const now = new Date();
    const tglStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const setoranBaru = {
      id: `setor-${Date.now().toString().slice(-4)}`,
      tanggal: tglStr,
      titikKumpulId: kedai.id,
      namaKedai: kedai.namaKedai,
      wilayah: kedai.wilayah,
      jenisSampah,
      labelSampah: label,
      jumlahGelas: jenisSampah === 'gelasPlastik' ? jGelas : 0,
      beratKg: finalBeratKg,
      poinDidapat: poin,
      catatan: catatan?.trim() || 'Setoran sampah terverifikasi.',
    };

    setSetoranList((prev) => [setoranBaru, ...prev]);
    return setoranBaru;
  };

  // 1b. Hapus Riwayat Setoran Tertentu
  const hapusSetoran = (id) => {
    const itemDihapus = setoranList.find((s) => s.id === id);
    if (!itemDihapus) return null;
    setSetoranList((prev) => prev.filter((s) => s.id !== id));
    return itemDihapus;
  };

  // 2. Tambah Sumbangan Poin Baru
  const tambahSumbangan = ({ posId, jumlahPoin, pesanDoa }) => {
    const poin = Number(jumlahPoin) || 0;
    if (poin <= 0) {
      throw new Error('Jumlah poin yang disumbangkan minimal 1 poin.');
    }
    if (poin > ringkasan.saldoPoin) {
      throw new Error(`Saldo poinmu tidak mencukupi (Tersedia ${ringkasan.saldoPoin} Poin).`);
    }

    const pos = POS_SUMBANGAN.find((p) => p.id === posId) || POS_SUMBANGAN[0];
    const now = new Date();
    const tglStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const sumbanganBaru = {
      id: `donasi-${Date.now().toString().slice(-4)}`,
      tanggal: tglStr,
      posId: pos.id,
      namaPos: pos.nama,
      lembagaPengelola: pos.lembagaPengelola,
      jumlahPoin: poin,
      nilaiRupiah: poin * NILAI_POIN,
      tahapSaatIni: 1, // Baru disumbangkan, masuk Tahap 1
      judulTahap: pos.tahapPenyaluran[0].judul,
      keteranganTahap: pos.tahapPenyaluran[0].keterangan,
      tanggalPenyaluranAkhir: null,
      pesanDoa: pesanDoa?.trim() || 'Semoga berkah dan bermanfaat bagi sesama.',
    };

    setSumbanganList((prev) => [sumbanganBaru, ...prev]);
    return sumbanganBaru;
  };

  // 3. Perbarui Profil Akun Sederhana
  const perbaruiAkun = (dataBaru) => {
    setAkun((prev) => ({ ...prev, ...dataBaru }));
  };

  // 4. Masuk Akun (Login / Register Simpel)
  const login = ({ nama, email, telepon, wilayahDomisili }) => {
    const dataBaru = {
      ...akun,
      nama: nama?.trim() || akun.nama,
      email: email !== undefined ? email.trim() : akun.email,
      telepon: telepon?.trim() || akun.telepon,
      wilayahDomisili: wilayahDomisili?.trim() || akun.wilayahDomisili || 'Surabaya',
    };
    setAkun(dataBaru);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(SESSION_KEY, 'true');
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ akun: dataBaru, setoranList, sumbanganList })
      );
    } catch (e) {
      console.warn(e);
    }
  };

  // 5. Keluar Akun (Logout)
  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem(SESSION_KEY, 'false');
    } catch (e) {
      console.warn(e);
    }
  };

  // 6. Reset ke Data Awal Demo
  const resetKeDataAwal = () => {
    setAkun(INITIAL_AKUN);
    setSetoranList(INITIAL_SETORAN);
    setSumbanganList(INITIAL_SUMBANGAN);
    setIsAuthenticated(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(SESSION_KEY, 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const value = {
    akun,
    isAuthenticated,
    setoranList,
    sumbanganList,
    ringkasan,
    titikKumpulList: TITIK_KUMPUL_SURABAYA,
    posSumbanganList: POS_SUMBANGAN,
    login,
    logout,
    tambahSetoran,
    hapusSetoran,
    tambahSumbangan,
    perbaruiAkun,
    resetKeDataAwal,
  };

  return (
    <GreenworthContext.Provider value={value}>
      {children}
    </GreenworthContext.Provider>
  );
}

export function useGreenworth() {
  const context = useContext(GreenworthContext);
  if (!context) {
    throw new Error('useGreenworth harus digunakan di dalam GreenworthProvider');
  }
  return context;
}
