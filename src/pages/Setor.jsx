/**
 * Setor.jsx — Halaman Setor Sampah GREENWORTH Surabaya
 * Vibe Design Framework: kontrol tersegmentasi rapi, pratinjau kalkulator ala receipt digital,
 * dan riwayat transaksi yang terstruktur bersih tanpa elemen berlebihan.
 */

import { useState } from 'react';
import {
  PlusCircle,
  Coffee,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronDown,
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
    <div className="space-y-4 animate-fade-in pb-3">
      {/* ── HEADER HALAMAN ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
          Penukaran Poin Sampah
        </span>
        <h2 className="text-base font-extrabold text-slate-900">
          Setor Sampah Kedai Kopi
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilah cup plastik dan kardus, bawa ke titik kumpul untuk dikonversi menjadi poin (1 Poin = Rp 100).
        </p>
      </div>

      {/* ── NOTIFIKASI SUKSES DISKRIT ──────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-slate-800 flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-emerald-900">
              Setoran Berhasil Dicatat
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {pesanSukses.label} ({pesanSukses.berat} kg) di {pesanSukses.kedai}. Mendapatkan <strong>+{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPesanSukses(null)}
            className="text-xs text-emerald-800 font-bold hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ── FORMULIR SETOR UTAMA ───────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-4"
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
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>{kedaiTerpilih.alamat}</span>
            </span>
          </div>
        </div>

        {/* 2. Segmented Control: Jenis Sampah (Sleek Native Style) */}
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
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cup Plastik</span>
              <span className="text-[10px] text-slate-400 font-normal">(10 pt/kg)</span>
            </button>

            <button
              type="button"
              onClick={() => setJenisSampah('kardus')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                jenisSampah === 'kardus'
                  ? 'bg-white text-amber-950 shadow-xs'
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
              <span className="text-slate-400">1 cup ≈ 12 gram</span>
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
                      ? 'bg-[#0B3B24] text-white border-[#0B3B24]'
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
              <span className="text-slate-400">1 kg = 5 Poin</span>
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
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {kg}kg
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Catatan Kondisi */}
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

        {/* 5. Pratinjau Perhitungan (Ala Digital Receipt) */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Rincian Estimasi Poin
          </span>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Estimasi Bobot:</span>
            <span className="font-bold text-slate-800">{estimasiBeratKg} kg</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Perolehan Poin:</span>
            <span className="font-extrabold text-amber-700">+{estimasiPoin} Poin</span>
          </div>
          <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-800">Setara Nilai:</span>
            <span className="text-emerald-800">Rp {estimasiRupiah.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Tombol Setor */}
        <button
          type="submit"
          className="w-full py-3 bg-[#0B3B24] hover:bg-[#072818] active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Kirim Setoran Sampah</span>
        </button>
      </form>

      {/* ── DAFTAR RIWAYAT SETORAN ─────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900">
            Riwayat Setoran ({setoranList.length})
          </h3>
          <span className="text-[11px] text-slate-400">Terverifikasi</span>
        </div>

        <div className="space-y-2">
          {setoranList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs hover:border-slate-200 transition-all space-y-1.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    {item.jenisSampah === 'gelasPlastik' ? (
                      <Coffee className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <Package className="w-4 h-4 text-amber-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.labelSampah}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {item.namaKedai} ({item.wilayah})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-amber-700 block">
                    +{item.poinDidapat} Poin
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Rp {(item.poinDidapat * NILAI_POIN).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 text-[11px] text-slate-400">
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
      </div>
    </div>
  );
}
