/**
 * Setor.jsx — Halaman Setor Sampah GREENWORTH Surabaya
 * Memungkinkan pengguna menyetor cup plastik atau kardus di titik kumpul kedai kopi Surabaya.
 * Dilengkapi kalkulator poin real-time dinamis dan riwayat setoran terverifikasi.
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
  Info,
  Scale,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN, POIN_PER_KG, BERAT_PER_GELAS_KG } from '../config';

export default function Setor({ onPindahMenu }) {
  const { titikKumpulList, setoranList, tambahSetoran } = useGreenworth();

  // Form states
  const [titikKumpulId, setTitikKumpulId] = useState(titikKumpulList[0]?.id || 'kumpul-tunjungan');
  const [jenisSampah, setJenisSampah] = useState('gelasPlastik'); // 'gelasPlastik' | 'kardus'
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

    // Reset form ringan
    setCatatan('');
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER HALAMAN ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#064E3B] to-emerald-900 p-4 rounded-3xl border border-emerald-600/40">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Setor Sampah Berkah</span>
        </div>
        <h2 className="text-lg font-black text-white">
          Ubah Sampah Jadi Poin Berkah
        </h2>
        <p className="text-sm text-emerald-200 mt-1 leading-relaxed">
          Pilah cup kopi dan kardus dari kedaimu atau rumah. Bawa ke titik kumpul terdekat di Surabaya, dapatkan poin untuk disumbangkan.
        </p>
      </div>

      {/* ── NOTIFIKASI SUKSES SETELAH SETOR ─────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-900/90 border-2 border-amber-400/80 rounded-2xl p-4 text-white shadow-xl animate-fade-in relative">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-black text-amber-300">
                Alhamdulillah! Setoran Berhasil Dicatat
              </h3>
              <p className="text-sm text-emerald-100 mt-1">
                Kamu menyetor <strong>{pesanSukses.label}</strong> ({pesanSukses.berat} kg) di <strong>{pesanSukses.kedai}</strong>.
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1.5 rounded-xl">
                <span className="text-sm text-emerald-200">Tambahan Poin:</span>
                <span className="text-base font-black text-amber-300">
                  +{pesanSukses.poin} Poin
                </span>
                <span className="text-xs text-emerald-300 font-semibold">
                  (Rp {pesanSukses.rupiah.toLocaleString('id-ID')})
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPesanSukses(null)}
            className="mt-3 w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-xs font-bold text-white rounded-xl transition-all"
          >
            Tutup Pemberitahuan
          </button>
        </div>
      )}

      {/* ── FORMULIR SETOR SAMPAH ───────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#042614] rounded-3xl p-5 border border-emerald-800/80 shadow-lg space-y-4"
      >
        <div className="border-b border-emerald-900/80 pb-3">
          <h3 className="text-base font-extrabold text-white">
            Formulir Setor Sampah Baru
          </h3>
          <p className="text-xs text-emerald-300">
            Isi data setoran dengan jujur dan sesuai sampah yang dibawa
          </p>
        </div>

        {/* 1. Pilih Titik Kumpul */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-emerald-100">
            Pilih Titik Kumpul Kedai Kopi
          </label>
          <div className="relative">
            <select
              value={titikKumpulId}
              onChange={(e) => setTitikKumpulId(e.target.value)}
              className="w-full bg-[#05371a] border border-emerald-700 text-white rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all appearance-none pr-10"
            >
              {titikKumpulList.map((kedai) => (
                <option key={kedai.id} value={kedai.id} className="bg-[#052E16] text-white py-2">
                  {kedai.namaKedai} ({kedai.wilayah})
                </option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-amber-300 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Info Lokasi Terpilih */}
          <div className="bg-[#05371a]/70 rounded-xl p-3 border border-emerald-800/60 text-xs space-y-1 mt-1.5">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>{kedaiTerpilih.alamat}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{kedaiTerpilih.jamBuka}</span>
            </div>
            <p className="text-amber-200/90 pt-0.5 italic">
              Petunjuk: {kedaiTerpilih.keterangan}
            </p>
          </div>
        </div>

        {/* 2. Pilih Jenis Sampah */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-emerald-100">
            Pilih Jenis Sampah
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setJenisSampah('gelasPlastik')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                jenisSampah === 'gelasPlastik'
                  ? 'bg-emerald-800/90 border-amber-400 text-white shadow-md ring-2 ring-amber-400/30'
                  : 'bg-[#05371a] border-emerald-800/80 text-emerald-300 hover:border-emerald-700'
              }`}
            >
              <Coffee className="w-6 h-6 mb-1 text-amber-300" />
              <span className="text-sm font-black">Cup Gelas Plastik</span>
              <span className="text-xs text-emerald-200 mt-0.5">
                10 Poin / kg (~12g/cup)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setJenisSampah('kardus')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                jenisSampah === 'kardus'
                  ? 'bg-emerald-800/90 border-amber-400 text-white shadow-md ring-2 ring-amber-400/30'
                  : 'bg-[#05371a] border-emerald-800/80 text-emerald-300 hover:border-emerald-700'
              }`}
            >
              <Package className="w-6 h-6 mb-1 text-amber-300" />
              <span className="text-sm font-black">Kardus Boks</span>
              <span className="text-xs text-emerald-200 mt-0.5">
                5 Poin / kg
              </span>
            </button>
          </div>
        </div>

        {/* 3. Input Kuantitas */}
        {jenisSampah === 'gelasPlastik' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-emerald-100">
                Jumlah Gelas Cup (buah)
              </label>
              <span className="text-xs font-semibold text-emerald-300">
                Rata-rata 1 cup ≈ 12 gram
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-12 h-12 rounded-2xl bg-[#05371a] hover:bg-emerald-800 border border-emerald-700 text-white font-black text-lg active:scale-95 transition-all"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={jumlahGelas}
                onChange={(e) => setJumlahGelas(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-[#05371a] border border-emerald-700 text-center text-white text-lg font-black rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => (Number(prev) || 0) + 5)}
                className="w-12 h-12 rounded-2xl bg-[#05371a] hover:bg-emerald-800 border border-emerald-700 text-white font-black text-lg active:scale-95 transition-all"
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
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    jumlahGelas === jml
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-[#05371a] text-emerald-200 border-emerald-800 hover:border-emerald-600'
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
              <label className="text-sm font-bold text-emerald-100">
                Perkiraan Berat Kardus (Kilogram)
              </label>
              <span className="text-xs font-semibold text-emerald-300">
                1 kg kardus = 5 Poin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Math.max(0.5, Number(((Number(prev) || 0) - 0.5).toFixed(1))))}
                className="w-12 h-12 rounded-2xl bg-[#05371a] hover:bg-emerald-800 border border-emerald-700 text-white font-black text-lg active:scale-95 transition-all"
              >
                -
              </button>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={beratKardusKg}
                onChange={(e) => setBeratKardusKg(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-[#05371a] border border-emerald-700 text-center text-white text-lg font-black rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Number(((Number(prev) || 0) + 0.5).toFixed(1)))}
                className="w-12 h-12 rounded-2xl bg-[#05371a] hover:bg-emerald-800 border border-emerald-700 text-white font-black text-lg active:scale-95 transition-all"
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
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    beratKardusKg === kg
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-[#05371a] text-emerald-200 border-emerald-800 hover:border-emerald-600'
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
          <label className="block text-sm font-bold text-emerald-100">
            Catatan Kondisi Sampah (Opsional)
          </label>
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Cup sudah dibilas bersih dan kering"
            className="w-full bg-[#05371a] border border-emerald-700 text-white text-sm rounded-2xl px-4 py-3 placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* ── KOTAK PREVIEW PERHITUNGAN REAL-TIME ──────────────────────────── */}
        <div className="bg-emerald-950/90 rounded-2xl p-4 border border-emerald-700/60 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
            Pratinjau Perolehan Poin
          </span>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#05371a] p-2.5 rounded-xl border border-emerald-800/80">
              <span className="text-xs text-emerald-300 block">Estimasi Berat</span>
              <span className="text-base font-black text-white block mt-0.5">
                {estimasiBeratKg} kg
              </span>
            </div>

            <div className="bg-[#05371a] p-2.5 rounded-xl border border-emerald-800/80">
              <span className="text-xs text-emerald-300 block">Perolehan Poin</span>
              <span className="text-base font-black text-amber-300 block mt-0.5">
                +{estimasiPoin} Poin
              </span>
            </div>

            <div className="bg-[#05371a] p-2.5 rounded-xl border border-emerald-800/80">
              <span className="text-xs text-emerald-300 block">Nilai Rupiah</span>
              <span className="text-base font-black text-emerald-200 block mt-0.5">
                Rp {estimasiRupiah.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-300/80 leading-normal">
            Poin akan langsung ditambahkan ke akunmu dan bisa segera disumbangkan ke pos wakaf atau sedekah syariah.
          </p>
        </div>

        {/* Tombol Simpan Setoran */}
        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 active:scale-98 text-slate-950 font-black text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span>Kirim Setoran Sampah</span>
        </button>
      </form>

      {/* ── DAFTAR RIWAYAT SETORAN ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">
              Riwayat Setoranmu ({setoranList.length})
            </h3>
            <p className="text-xs text-emerald-300">
              Tercatat otomatis di akun GREENWORTH Surabaya
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-300 bg-[#042614] border border-emerald-800 px-2.5 py-1 rounded-xl">
            Semua Terverifikasi
          </span>
        </div>

        <div className="space-y-2.5">
          {setoranList.map((item) => (
            <div
              key={item.id}
              className="bg-[#042614] rounded-2xl p-4 border border-emerald-900/80 hover:border-emerald-700 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-amber-300">
                    {item.jenisSampah === 'gelasPlastik' ? (
                      <Coffee className="w-4 h-4" />
                    ) : (
                      <Package className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">
                      {item.labelSampah}
                    </h4>
                    <span className="text-xs text-emerald-300">
                      {item.namaKedai} ({item.wilayah})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-amber-300 block">
                    +{item.poinDidapat} Poin
                  </span>
                  <span className="text-xs text-emerald-300 font-medium">
                    Rp {(item.poinDidapat * NILAI_POIN).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60 text-xs text-emerald-200/90">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.tanggal}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  {item.jumlahGelas > 0 && (
                    <span>{item.jumlahGelas} Cup</span>
                  )}
                  <span className="bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-emerald-300">
                    {item.beratKg} kg
                  </span>
                </div>
              </div>

              {item.catatan && (
                <p className="text-xs text-emerald-300/80 italic bg-[#05371a]/50 px-2.5 py-1 rounded-lg">
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
