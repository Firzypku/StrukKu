/**
 * Setor.jsx — Halaman Setor Sampah GREENWORTH Surabaya
 * Copywriting kuat, bersih, modern, dan bernuansa syariah (Hijau + Putih + Emas).
 * Memungkinkan pengguna menyetor cup plastik atau kardus dengan kalkulator poin real-time.
 */

import { useState } from 'react';
import {
  PlusCircle,
  Coffee,
  Package,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN, POIN_PER_KG, BERAT_PER_GELAS_KG } from '../config';

export default function Setor() {
  const { titikKumpulList, setoranList, tambahSetoran } = useGreenworth();

  // Form states
  const [titikKumpulId, setTitikKumpulId] = useState(titikKumpulList[0]?.id || 'kumpul-tunjungan');
  const [jenisSampah, setJenisSampah] = useState('gelasPlastik');
  const [jumlahGelas, setJumlahGelas] = useState(25);
  const [beratKardusKg, setBeratKardusKg] = useState(2.0);
  const [catatan, setCatatan] = useState('');
  const [pesanSukses, setPesanSukses] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (jenisSampah === 'gelasPlastik' && (!jumlahGelas || jumlahGelas <= 0)) {
      alert('Masukkan jumlah gelas plastik yang disetor (minimal 1).');
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

    setPesanSukses({
      label: setoranBaru.labelSampah,
      poin: setoranBaru.poinDidapat,
      rupiah: setoranBaru.poinDidapat * NILAI_POIN,
      kedai: setoranBaru.namaKedai,
      berat: setoranBaru.beratKg,
    });

    setCatatan('');
  };

  return (
    <div className="space-y-5 animate-fade-in pb-2">
      {/* ── HEADER BANNER BERSIH ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#065F46] to-[#047857] p-5 rounded-3xl text-white shadow-lg shadow-emerald-900/10">
        <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ekonomi Sirkular Kedai Kopi</span>
        </div>
        <h2 className="text-lg font-black text-white">
          Setor Sampah, Raih Poin Berkah
        </h2>
        <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
          Setiap cup kopi dan kardus yang kamu pilah dan setor bernilai <strong>1 Poin = Rp 100</strong>. Poin langsung masuk ke akunmu dan siap disedekahkan atau diwakafkan untuk kebaikan bersama.
        </p>
      </div>

      {/* ── NOTIFIKASI SUKSES ──────────────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-4 text-slate-800 shadow-md">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-black text-emerald-900">
                Alhamdulillah! Setoran Berhasil Dicatat
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Kamu menyetor <strong>{pesanSukses.label}</strong> ({pesanSukses.berat} kg) di <strong>{pesanSukses.kedai}</strong>.
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 bg-white border border-emerald-300 px-3 py-1.5 rounded-xl shadow-xs">
                <span className="text-xs text-slate-600">Perolehan:</span>
                <span className="text-sm font-black text-amber-700">
                  +{pesanSukses.poin} Poin
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  (Rp {pesanSukses.rupiah.toLocaleString('id-ID')})
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPesanSukses(null)}
            className="mt-3 w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-xs font-bold text-emerald-900 rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ── FORMULIR SETOR SAMPAH (KARTU PUTIH BERSIH) ──────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4"
      >
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Formulir Setor Sampah Kedai Kopi
          </h3>
          <p className="text-xs text-slate-500">
            Pilih titik kumpul terdekat di Surabaya dan masukkan jumlah sampah yang dibawa
          </p>
        </div>

        {/* 1. Pilih Titik Kumpul */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Pilih Titik Kumpul Kedai Kopi
          </label>
          <div className="relative">
            <select
              value={titikKumpulId}
              onChange={(e) => setTitikKumpulId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none pr-10"
            >
              {titikKumpulList.map((kedai) => (
                <option key={kedai.id} value={kedai.id} className="text-slate-900 py-2">
                  {kedai.namaKedai} ({kedai.wilayah})
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-emerald-700 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Info Lokasi Terpilih */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1 mt-1">
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>{kedaiTerpilih.alamat}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{kedaiTerpilih.jamBuka}</span>
            </div>
          </div>
        </div>

        {/* 2. Pilih Jenis Sampah */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Jenis Sampah
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setJenisSampah('gelasPlastik')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                jenisSampah === 'gelasPlastik'
                  ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-xs ring-2 ring-emerald-500/10'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Coffee className="w-6 h-6 mb-1 text-emerald-700" />
              <span className="text-sm font-black">Cup Gelas Plastik</span>
              <span className="text-[11px] text-emerald-700 font-bold mt-0.5">
                10 Poin / kg (~12g/cup)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setJenisSampah('kardus')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                jenisSampah === 'kardus'
                  ? 'bg-amber-50 border-2 border-amber-500 text-amber-950 shadow-xs ring-2 ring-amber-500/10'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Package className="w-6 h-6 mb-1 text-amber-600" />
              <span className="text-sm font-black">Kardus Boks</span>
              <span className="text-[11px] text-amber-700 font-bold mt-0.5">
                5 Poin / kg
              </span>
            </button>
          </div>
        </div>

        {/* 3. Input Kuantitas */}
        {jenisSampah === 'gelasPlastik' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Jumlah Gelas Cup (buah)
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                1 cup ≈ 12 gram
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-black text-lg active:scale-95 transition-all"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={jumlahGelas}
                onChange={(e) => setJumlahGelas(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-slate-900 text-xl font-black rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => (Number(prev) || 0) + 5)}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-black text-lg active:scale-95 transition-all"
              >
                +5
              </button>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-2 pt-1">
              {[10, 25, 50, 100].map((jml) => (
                <button
                  key={jml}
                  type="button"
                  onClick={() => setJumlahGelas(jml)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                    jumlahGelas === jml
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {jml} Cup
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Berat Kardus (Kilogram)
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                1 kg = 5 Poin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Math.max(0.5, Number(((Number(prev) || 0) - 0.5).toFixed(1))))}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-black text-lg active:scale-95 transition-all"
              >
                -
              </button>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={beratKardusKg}
                onChange={(e) => setBeratKardusKg(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-slate-900 text-xl font-black rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Number(((Number(prev) || 0) + 0.5).toFixed(1)))}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-black text-lg active:scale-95 transition-all"
              >
                +
              </button>
            </div>

            {/* Quick weights */}
            <div className="flex items-center gap-2 pt-1">
              {[1.0, 2.0, 3.5, 5.0].map((kg) => (
                <button
                  key={kg}
                  type="button"
                  onClick={() => setBeratKardusKg(kg)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                    beratKardusKg === kg
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {kg} kg
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Catatan Opsional */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Catatan Kondisi Sampah (Opsional)
          </label>
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Cup sudah dibilas bersih dan kering"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-2xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* ── KOTAK PREVIEW PERHITUNGAN REAL-TIME ──────────────────────────── */}
        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
            Pratinjau Perolehan Poin Berkah
          </span>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Estimasi Berat</span>
              <span className="text-base font-black text-slate-900 block mt-0.5">
                {estimasiBeratKg} kg
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Poin Didapat</span>
              <span className="text-base font-black text-amber-700 block mt-0.5">
                +{estimasiPoin} Poin
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">Nilai Rupiah</span>
              <span className="text-base font-black text-emerald-800 block mt-0.5">
                Rp {estimasiRupiah.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Tombol Simpan Setoran */}
        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-98 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-200"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span>Kirim Setoran Sampah (Raih Poin)</span>
        </button>
      </form>

      {/* ── DAFTAR RIWAYAT SETORAN (KARTU PUTIH BERSIH) ─────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Riwayat Setoranmu ({setoranList.length})
            </h3>
            <p className="text-xs text-slate-500">
              Tercatat otomatis di akun GREENWORTH Surabaya
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
            Terverifikasi
          </span>
        </div>

        <div className="space-y-2.5">
          {setoranList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    {item.jenisSampah === 'gelasPlastik' ? (
                      <Coffee className="w-4 h-4" />
                    ) : (
                      <Package className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {item.labelSampah}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {item.namaKedai} ({item.wilayah})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-amber-700 block">
                    +{item.poinDidapat} Poin
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Rp {(item.poinDidapat * NILAI_POIN).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.tanggal}</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  {item.jumlahGelas > 0 && <span>{item.jumlahGelas} Cup</span>}
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg">
                    {item.beratKg} kg
                  </span>
                </div>
              </div>

              {item.catatan && (
                <p className="text-xs text-slate-500 italic bg-slate-50 px-2.5 py-1 rounded-xl">
                  "{item.catatan}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
