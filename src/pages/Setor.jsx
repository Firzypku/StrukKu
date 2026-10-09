/**
 * Setor.jsx — Halaman Setor Sampah GREENWORTH Surabaya
 * Fitur Lengkap:
 * 1. Formulir Setor Sampah Pintar (Cup Plastik & Kardus Boks)
 * 2. Notifikasi Berhasil Input yang Jelas & Aplikatif (dengan aksi instan Salurkan Poin & Batal)
 * 3. Fitur Hapus Riwayat Setoran dengan Modal Konfirmasi Aman (Saldo Poin diperbarui otomatis)
 * 4. Filter Riwayat Setoran (Semua, Cup Plastik, Kardus) & Empty State yang rapi
 * 5. Desain Hijau-Putih Segar, Seimbang & Bebas Bug
 */

import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Coffee,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Trash2,
  AlertTriangle,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN, POIN_PER_KG, BERAT_PER_GELAS_KG } from '../config';

export default function Setor({ onPindahMenu, navParams = {} }) {
  const { titikKumpulList, setoranList, tambahSetoran, hapusSetoran } = useGreenworth();

  // Form states
  const [titikKumpulId, setTitikKumpulId] = useState(navParams?.titikKumpulId || titikKumpulList[0]?.id || 'kumpul-tunjungan');
  const [jenisSampah, setJenisSampah] = useState(navParams?.jenisSampah || 'gelasPlastik');
  const [jumlahGelas, setJumlahGelas] = useState(25);
  const [beratKardusKg, setBeratKardusKg] = useState(2.0);
  const [catatan, setCatatan] = useState('');

  // Notifikasi & Modal States
  const [pesanSukses, setPesanSukses] = useState(null);
  const [pesanHapus, setPesanHapus] = useState(null);
  const [itemMauDihapus, setItemMauDihapus] = useState(null);
  const [filterRiwayat, setFilterRiwayat] = useState('semua');

  // Sinkronisasi otomatis saat parameter dari halaman lain berubah
  useEffect(() => {
    if (navParams?.jenisSampah) {
      setJenisSampah(navParams.jenisSampah);
    }
    if (navParams?.titikKumpulId) {
      setTitikKumpulId(navParams.titikKumpulId);
    }
  }, [navParams]);

  // Perhitungan Real-time
  const estimasiBeratKg =
    jenisSampah === 'gelasPlastik'
      ? Number((Number(jumlahGelas || 0) * BERAT_PER_GELAS_KG).toFixed(2))
      : Number(Number(beratKardusKg || 0).toFixed(2));

  const estimasiPoin =
    jenisSampah === 'gelasPlastik'
      ? Math.max(1, Math.round(estimasiBeratKg * POIN_PER_KG.gelasPlastik))
      : Math.max(1, Math.round(estimasiBeratKg * POIN_PER_KG.kardus));

  const estimasiRupiah = estimasiPoin * NILAI_POIN;

  const kedaiTerpilih = titikKumpulList.find((k) => k.id === titikKumpulId) || titikKumpulList[0];

  // Submit Setoran
  const handleSubmit = (e) => {
    e.preventDefault();

    if (jenisSampah === 'gelasPlastik' && (!jumlahGelas || jumlahGelas <= 0)) {
      alert('Masukkan jumlah gelas plastik yang disetor (minimal 1 cup).');
      return;
    }
    if (jenisSampah === 'kardus' && (!beratKardusKg || beratKardusKg <= 0)) {
      alert('Masukkan perkiraan berat kardus dalam kg (minimal 0.1 kg).');
      return;
    }

    const setoranBaru = tambahSetoran({
      titikKumpulId,
      jenisSampah,
      jumlahGelas: Number(jumlahGelas),
      beratManualKg: Number(beratKardusKg),
      catatan,
    });

    setPesanHapus(null);
    setPesanSukses({
      id: setoranBaru.id,
      label: setoranBaru.labelSampah,
      poin: setoranBaru.poinDidapat,
      rupiah: setoranBaru.poinDidapat * NILAI_POIN,
      kedai: setoranBaru.namaKedai,
      berat: setoranBaru.beratKg,
    });

    setCatatan('');
    // Auto-scroll halus ke notifikasi
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Konfirmasi Eksekusi Hapus Setoran
  const handleKonfirmasiHapus = () => {
    if (!itemMauDihapus) return;
    const itemDihapus = hapusSetoran(itemMauDihapus.id);
    setItemMauDihapus(null);

    // Jika yang dihapus adalah setoran yang baru saja ditampilkan di pesanSukses, tutup notifnya
    if (pesanSukses && pesanSukses.id === itemMauDihapus.id) {
      setPesanSukses(null);
    }

    if (itemDihapus) {
      setPesanHapus(`Setoran ${itemDihapus.labelSampah} (+${itemDihapus.poinDidapat} Poin) berhasil dihapus.`);
      setTimeout(() => setPesanHapus(null), 4000);
    }
  };

  // Batalkan langsung setoran yang baru saja dibuat
  const handleBatalkanSetoranBaru = () => {
    if (!pesanSukses) return;
    hapusSetoran(pesanSukses.id);
    const label = pesanSukses.label;
    setPesanSukses(null);
    setPesanHapus(`Setoran ${label} berhasil dibatalkan.`);
    setTimeout(() => setPesanHapus(null), 4000);
  };

  // Filter List Riwayat
  const riwayatTersaring = setoranList.filter((item) => {
    if (filterRiwayat === 'gelasPlastik') return item.jenisSampah === 'gelasPlastik';
    if (filterRiwayat === 'kardus') return item.jenisSampah === 'kardus';
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      {/* ── HEADER HALAMAN ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1.5">
          Penukaran Poin Sampah
        </span>
        <h2 className="text-base font-extrabold text-slate-900">
          Setor Sampah Kedai Kopi
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilah cup plastik dan kardus, bawa ke titik kumpul Surabaya untuk mendapatkan poin (1 Poin = Rp 100).
        </p>
      </div>

      {/* ── 1. NOTIFIKASI BERHASIL INPUT (LENGKAP & INTERAKTIF) ─────────────── */}
      {pesanSukses && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-50/60 to-white border-2 border-emerald-300 rounded-2xl p-4 text-slate-800 shadow-md animate-slide-down space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Setoran Berhasil Dicatat!
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                    Sukses
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Kamu mendapatkan <strong className="text-emerald-700 font-black">+{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}) dari setoran <strong>{pesanSukses.label}</strong> ({pesanSukses.berat} kg) di {pesanSukses.kedai}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPesanSukses(null)}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all flex-shrink-0"
              aria-label="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tombol Aksi Cepat Pasca-Setor */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 text-xs">
            <button
              type="button"
              onClick={handleBatalkanSetoranBaru}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Salah Input? Batalkan</span>
            </button>

            {onPindahMenu && (
              <button
                type="button"
                onClick={() => onPindahMenu('lacak')}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 text-xs"
              >
                <span>Salurkan Poin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 2. NOTIFIKASI BERHASIL DIHAPUS ─────────────────────────────────── */}
      {pesanHapus && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-amber-900 text-xs flex items-center justify-between gap-2 shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span className="font-medium">{pesanHapus}</span>
          </div>
          <button
            type="button"
            onClick={() => setPesanHapus(null)}
            className="text-amber-700 hover:text-amber-900 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 3. FORMULIR SETOR UTAMA ─────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4"
      >
        {/* 1. Pilih Titik Kumpul */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Lokasi Titik Kumpul
          </label>
          <div className="relative">
            <select
              value={titikKumpulId}
              onChange={(e) => setTitikKumpulId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 appearance-none pr-8"
            >
              {titikKumpulList.map((kedai) => (
                <option key={kedai.id} value={kedai.id}>
                  {kedai.namaKedai} ({kedai.wilayah})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{kedaiTerpilih.alamat}</span>
            </span>
          </div>
        </div>

        {/* 2. Segmented Control: Jenis Sampah */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Jenis Sampah
          </label>
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => setJenisSampah('gelasPlastik')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                jenisSampah === 'gelasPlastik'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cup Plastik</span>
              <span className="text-[10px] text-slate-400 font-normal">(10 pt/kg)</span>
            </button>

            <button
              type="button"
              onClick={() => setJenisSampah('kardus')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                jenisSampah === 'kardus'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-600" />
              <span>Kardus Boks</span>
              <span className="text-[10px] text-slate-400 font-normal">(5 pt/kg)</span>
            </button>
          </div>
        </div>

        {/* 3. Input Kuantitas */}
        {jenisSampah === 'gelasPlastik' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Jumlah Cup Gelas</span>
              <span className="text-slate-400 font-mono">1 cup ≈ 12 gram</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-95 transition-all text-sm"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={jumlahGelas}
                onChange={(e) => setJumlahGelas(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-slate-900 font-bold text-lg rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => (Number(prev) || 0) + 5)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-95 transition-all text-sm"
              >
                +5
              </button>
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              {[10, 25, 50, 100].map((jml) => (
                <button
                  key={jml}
                  type="button"
                  onClick={() => setJumlahGelas(jml)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    jumlahGelas === jml
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {jml}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Berat Kardus (kg)</span>
              <span className="text-slate-400 font-mono">1 kg = 5 Poin</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Math.max(0.5, Number(((Number(prev) || 0) - 0.5).toFixed(1))))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-95 transition-all text-sm"
              >
                -
              </button>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={beratKardusKg}
                onChange={(e) => setBeratKardusKg(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-slate-900 font-bold text-lg rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Number(((Number(prev) || 0) + 0.5).toFixed(1)))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-95 transition-all text-sm"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              {[1.0, 2.0, 3.5, 5.0].map((kg) => (
                <button
                  key={kg}
                  type="button"
                  onClick={() => setBeratKardusKg(kg)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    beratKardusKg === kg
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {kg}kg
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Catatan Tambahan */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Cup sudah dibilas bersih dan kering"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-slate-400"
          />
        </div>

        {/* 5. Pratinjau Perhitungan */}
        <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-200/80 space-y-1.5 font-mono">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Rincian Estimasi Poin
          </span>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Estimasi Bobot:</span>
            <span className="font-bold text-slate-900">{estimasiBeratKg} kg</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Perolehan Poin:</span>
            <span className="font-extrabold text-emerald-800">+{estimasiPoin} Poin</span>
          </div>
          <div className="pt-1.5 border-t border-emerald-200 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-800">Setara Nilai:</span>
            <span className="text-emerald-700">Rp {estimasiRupiah.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Tombol Setor */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:scale-98 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Kirim Setoran Sampah</span>
        </button>
      </form>

      {/* ── 4. DAFTAR RIWAYAT SETORAN DENGAN FITUR HAPUS ─────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Riwayat Setoran ({setoranList.length})
            </h3>
            <p className="text-[11px] text-slate-400">Pilah & dapatkan poin</p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[11px]">
            <button
              type="button"
              onClick={() => setFilterRiwayat('semua')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterRiwayat === 'semua' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setFilterRiwayat('gelasPlastik')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterRiwayat === 'gelasPlastik' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Cup
            </button>
            <button
              type="button"
              onClick={() => setFilterRiwayat('kardus')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                filterRiwayat === 'kardus' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Kardus
            </button>
          </div>
        </div>

        {/* Empty State jika belum ada riwayat */}
        {riwayatTersaring.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">
              Belum Ada Riwayat Setoran
            </h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              {filterRiwayat === 'semua'
                ? 'Mulai setor sampah cup plastik atau kardus di kedai mitra Surabaya untuk mengumpulkan poin pertamamu!'
                : 'Tidak ada riwayat setoran untuk filter ini.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {riwayatTersaring.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center flex-shrink-0">
                      {item.jenisSampah === 'gelasPlastik' ? (
                        <Coffee className="w-4.5 h-4.5 text-emerald-600" />
                      ) : (
                        <Package className="w-4.5 h-4.5 text-amber-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.labelSampah}
                      </h4>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {item.namaKedai} ({item.wilayah})
                      </span>
                    </div>
                  </div>

                  {/* Nilai Poin & Tombol Hapus */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-700 block">
                        +{item.poinDidapat} Poin
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Rp {(item.poinDidapat * NILAI_POIN).toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Tombol Hapus Setoran */}
                    <button
                      type="button"
                      onClick={() => setItemMauDihapus(item)}
                      title="Hapus setoran ini"
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.tanggal}</span>
                  </span>
                  <span className="font-semibold text-slate-600">
                    {item.jumlahGelas > 0 ? `${item.jumlahGelas} Cup · ` : ''}{item.beratKg} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. MODAL KONFIRMASI HAPUS SETORAN ──────────────────────────────── */}
      {itemMauDihapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-5 text-slate-900 shadow-2xl relative space-y-3.5 animate-scale-up">
            <div className="flex items-center gap-2.5 text-rose-600 border-b border-slate-100 pb-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Hapus Riwayat Setoran?
                </h4>
                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                  Konfirmasi Penghapusan
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Setoran <strong>{itemMauDihapus.labelSampah}</strong> di <strong>{itemMauDihapus.namaKedai}</strong> sebesar <strong className="text-rose-600">+{itemMauDihapus.poinDidapat} Poin</strong> akan dihapus permanen. Saldo poin aktif akunmu akan otomatis disesuaikan kembali.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setItemMauDihapus(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleKonfirmasiHapus}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
