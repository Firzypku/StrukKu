/**
 * config.js — Konfigurasi Utama GREENWORTH Surabaya
 * Digunakan untuk perhitungan poin, titik kumpul, dan pos sumbangan.
 * Semua nama mitra kedai kopi dan lembaga pengelola adalah FIKTIF untuk keperluan prototipe kompetisi.
 */

// Nilai tukar: 1 Poin = Rp 100
export const NILAI_POIN = 100;

// Perolehan poin per kilogram sampah (placeholder sesuai ketentuan)
export const POIN_PER_KG = {
  gelasPlastik: 10, // 10 poin per kg gelas plastik
  kardus: 5,        // 5 poin per kg kardus
};

// Estimasi rata-rata berat per gelas plastik dalam kilogram (~12 gram)
export const BERAT_PER_GELAS_KG = 0.012;

// 4 Titik Kumpul Kedai Kopi FIKTIF di Surabaya
export const TITIK_KUMPUL_SURABAYA = [
  {
    id: 'kumpul-tunjungan',
    wilayah: 'Tunjungan',
    namaKedai: 'Kedai Kopi Sedap Tunjungan',
    alamat: 'Jl. Tunjungan No. 24, Genteng, Surabaya Pusat',
    jamBuka: 'Setiap hari, 08.00 - 22.00 WIB',
    kontak: '0812-3401-001',
    keterangan: 'Kotak setor berada tepat di samping meja kasir utama.',
  },
  {
    id: 'kumpul-gubeng',
    wilayah: 'Gubeng',
    namaKedai: 'Kopi Sahabat Gubeng',
    alamat: 'Jl. Jawa No. 15, Gubeng, Surabaya Timur',
    jamBuka: 'Senin - Sabtu, 09.00 - 23.00 WIB',
    kontak: '0812-3401-002',
    keterangan: 'Tersedia tempat pemilahan cup plastik dan kardus terpisah.',
  },
  {
    id: 'kumpul-rungkut',
    wilayah: 'Rungkut',
    namaKedai: 'Kopi Sudut Rungkut',
    alamat: 'Jl. Rungkut Madya No. 8, Rungkut, Surabaya Timur',
    jamBuka: 'Setiap hari, 08.00 - 22.00 WIB',
    kontak: '0812-3401-003',
    keterangan: 'Dekat kawasan kampus, menerima setoran cup bersih dari mahasiswa.',
  },
  {
    id: 'kumpul-wonokromo',
    wilayah: 'Wonokromo',
    namaKedai: 'Warkop Berkah Wonokromo',
    alamat: 'Jl. Wonokromo No. 45, Wonokromo, Surabaya Selatan',
    jamBuka: 'Setiap hari, 07.00 - 23.00 WIB',
    kontak: '0812-3401-004',
    keterangan: 'Kotak setor berada di area teras kedai.',
  },
];

// 3 Pos Sumbangan Sosial Syariah FIKTIF
export const POS_SUMBANGAN = [
  {
    id: 'pos-wakaf-produktif',
    kategori: 'Wakaf',
    nama: 'Wakaf Uang Produktif',
    lembagaPengelola: 'Lembaga Wakaf Amanah Surabaya (Fiktif)',
    targetDanaRupiah: 10000000, // Rp 10.000.000
    deskripsi: 'Dana wakaf produktif dikelola untuk pengadaan mesin pembersih air wudhu hemat air dan panel surya fasilitas ibadah.',
    manfaatRingkas: 'Pembangunan sarana ibadah ramah lingkungan',
    tahapPenyaluran: [
      { nomor: 1, judul: 'Penerimaan Sumbangan Poin', keterangan: 'Poin terkumpul dan dikonversi ke dana amanah' },
      { nomor: 2, judul: 'Verifikasi & Perencanaan', keterangan: 'Penetapan lokasi fasilitas ibadah penerima manfaat' },
      { nomor: 3, judul: 'Pengadaan Sarana', keterangan: 'Pembelian instalasi air hemat dan komponen alat' },
      { nomor: 4, judul: 'Pemasangan di Lokasi', keterangan: 'Pemasangan alat di lokasi masjid Surabaya' },
      { nomor: 5, judul: 'Selesai & Bermanfaat Nyata', keterangan: 'Alat beroperasi penuh dan laporan diserahkan' },
    ],
  },
  {
    id: 'pos-sedekah-pendidikan',
    kategori: 'Pendidikan',
    nama: 'Sedekah Pendidikan',
    lembagaPengelola: 'Yayasan Peduli Anak Bangsa Surabaya (Fiktif)',
    targetDanaRupiah: 5000000, // Rp 5.000.000
    deskripsi: 'Bantuan biaya sekolah dan paket perlengkapan belajar bagi anak-anak keluarga pemulah sampah di Surabaya.',
    manfaatRingkas: 'Beasiswa dan perlengkapan sekolah santri & anak dhuafa',
    tahapPenyaluran: [
      { nomor: 1, judul: 'Penerimaan Sumbangan Poin', keterangan: 'Poin terkumpul dari setoran sampah warga' },
      { nomor: 2, judul: 'Pendataan Calon Siswa', keterangan: 'Verifikasi data siswa penerima bantuan di Surabaya' },
      { nomor: 3, judul: 'Belanja Perlengkapan', keterangan: 'Penyediaan seragam, buku, dan alat tulis' },
      { nomor: 4, judul: 'Distribusi Langsung', keterangan: 'Penyaluran bantuan ke rumah dan sekolah siswa' },
      { nomor: 5, judul: 'Selesai & Laporan Terbit', keterangan: 'Semua siswa telah menerima dan belajar dengan tenang' },
    ],
  },
  {
    id: 'pos-sedekah-bencana',
    kategori: 'Kemanusiaan',
    nama: 'Sedekah Tanggap Bencana',
    lembagaPengelola: 'Posko Kemanusiaan Bersama Jatim (Fiktif)',
    targetDanaRupiah: 7500000, // Rp 7.500.000
    deskripsi: 'Dana darurat untuk bantuan sembako, obat-obatan, dan air bersih bagi warga terdampak banjir luapan dan cuaca ekstrem.',
    manfaatRingkas: 'Penyediaan tandon air bersih dan dapur umum darurat',
    tahapPenyaluran: [
      { nomor: 1, judul: 'Penerimaan Sumbangan Poin', keterangan: 'Poin dialokasikan ke dana siaga bencana' },
      { nomor: 2, judul: 'Siaga Tim Relawan', keterangan: 'Persiapan posko dan armada bantuan bergerak' },
      { nomor: 3, judul: 'Logistik Sembako & Air', keterangan: 'Pengemasan paket bantuan darurat higienis' },
      { nomor: 4, judul: 'Pengiriman ke Lokasi', keterangan: 'Penyaluran ke wilayah terdampak' },
      { nomor: 5, judul: 'Bantuan Diterima Penuh', keterangan: 'Warga terbantu dan kondisi telah pulih kembali' },
    ],
  },
];
