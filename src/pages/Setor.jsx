/**
 * Setor.jsx — Halaman Setor Sampah GREENWORTH Surabaya
 * Vibe Design Framework & Cyber-Emerald Dark Luxury:
 * Segmented control responsif, kalkulasi instan ala digital receipt, dan riwayat terstruktur.
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
  Sparkles,
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
      <div className="bg-[#042416]/90 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/25 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-400/30 px-2.5 py-1 rounded-full">
            Penukaran Poin Sampah
          </span>
          <span className="text-[11px] font-mono text-amber-300 font-bold">1 Poin = Rp 100</span>
        </div>
        <h2 className="text-xl font-black text-white tracking-tight">
          Setor Sampah Kedai Kopi
        </h2>
        <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
          Pilah cup plastik dan kardus, bawa ke titik kumpul Surabaya untuk diverifikasi dan langsung mendapatkan poin reward syariah.
        </p>
      </div>

      {/* ── NOTIFIKASI SUKSES DISKRIT ──────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-950/90 border border-emerald-400/40 rounded-2xl p-4 text-white flex items-start gap-3 shadow-lg shadow-emerald-950/60 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
              Setoran Berhasil Dicatat
            </h4>
            <p className="text-xs text-emerald-100/90 mt-1">
              {pesanSukses.label} ({pesanSukses.berat} kg) di {pesanSukses.kedai}. Mendapatkan <strong className="text-amber-300">+{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPesanSukses(null)}
            className="text-xs text-amber-300 font-bold hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ── FORMULIR SETOR UTAMA (DARK LUXURY GLASS) ───────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#042416]/90 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/25 shadow-xl space-y-4 text-white"
      >
        {/* 1. Pilih Titik Kumpul */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
            Lokasi Titik Kumpul Surabaya
          </label>
          <div className="relative">
            <select
              value={titikKumpulId}
              onChange={(e) => setTitikKumpulId(e.target.value)}
              className="w-full bg-[#02180e] border border-emerald-500/30 text-white rounded-xl px-3.5 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none pr-8"
            >
              {titikKumpulList.map((kedai) => (
                <option key={kedai.id} value={kedai.id} className="bg-[#02180e] text-white">
                  {kedai.namaKedai} ({kedai.wilayah})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-200/75 pt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{kedaiTerpilih.alamat}</span>
            </span>
          </div>
        </div>

        {/* 2. Segmented Control: Jenis Sampah (Sleek Tactile Segment) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
            Pilih Kategori Sampah
          </label>
          <div className="bg-[#02180e] p-1 rounded-2xl flex gap-1 border border-emerald-500/30">
            <button
              type="button"
              onClick={() => setJenisSampah('gelasPlastik')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                jenisSampah === 'gelasPlastik'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md'
                  : 'text-emerald-200/80 hover:text-white'
              }`}
            >
              <Coffee className="w-4 h-4 stroke-[2.3]" />
              <span>Cup Plastik</span>
              <span className="text-[10px] opacity-80">(10 pt/kg)</span>
            </button>

            <button
              type="button"
              onClick={() => setJenisSampah('kardus')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                jenisSampah === 'kardus'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md'
                  : 'text-emerald-200/80 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4 stroke-[2.3]" />
              <span>Kardus Boks</span>
              <span className="text-[10px] opacity-80">(5 pt/kg)</span>
            </button>
          </div>
        </div>

        {/* 3. Input Kuantitas */}
        {jenisSampah === 'gelasPlastik' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-200">Jumlah Cup Gelas</span>
              <span className="text-emerald-300/70 font-mono">1 cup ≈ 12 gram</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/30 text-amber-300 font-black active:scale-95 transition-all text-base hover:bg-emerald-900"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={jumlahGelas}
                onChange={(e) => setJumlahGelas(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-[#02180e] border border-emerald-500/30 text-center text-amber-300 font-mono font-black text-2xl rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => (Number(prev) || 0) + 5)}
                className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/30 text-amber-300 font-black active:scale-95 transition-all text-base hover:bg-emerald-900"
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
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    jumlahGelas === jml
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : 'bg-emerald-950/70 text-emerald-200/80 border-emerald-800 hover:bg-emerald-900'
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
              <span className="font-extrabold text-emerald-200">Berat Kardus (kg)</span>
              <span className="text-emerald-300/70 font-mono">1 kg = 5 Poin</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Math.max(0.5, Number(((Number(prev) || 0) - 0.5).toFixed(1))))}
                className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/30 text-amber-300 font-black active:scale-95 transition-all text-base hover:bg-emerald-900"
              >
                -
              </button>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={beratKardusKg}
                onChange={(e) => setBeratKardusKg(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-[#02180e] border border-emerald-500/30 text-center text-amber-300 font-mono font-black text-2xl rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Number(((Number(prev) || 0) + 0.5).toFixed(1)))}
                className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/30 text-amber-300 font-black active:scale-95 transition-all text-base hover:bg-emerald-900"
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
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    beratKardusKg === kg
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : 'bg-emerald-950/70 text-emerald-200/80 border-emerald-800 hover:bg-emerald-900'
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
          <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Cup sudah dibilas bersih dan dipilah"
            className="w-full bg-[#02180e] border border-emerald-500/30 text-white text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-emerald-600/60"
          />
        </div>

        {/* 5. Pratinjau Perhitungan (Digital Receipt Style dengan Perforasi Taktil) */}
        <div className="bg-[#02180e] rounded-2xl p-4 border border-dashed border-emerald-500/40 space-y-2 font-mono relative overflow-hidden">
          {/* Perforated ticket side notches */}
          <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-[#042416] rounded-full -translate-y-1/2 border-r border-emerald-500/40" />
          <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-[#042416] rounded-full -translate-y-1/2 border-l border-emerald-500/40" />

          <div className="flex items-center justify-between text-[11px] text-emerald-300/80 font-bold uppercase tracking-wider px-1">
            <span>Struk Estimasi Konversi</span>
            <span className="text-amber-400 font-mono">● SURABAYA LIVE</span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-100 px-1">
            <span>Estimasi Bobot:</span>
            <strong className="text-white font-mono">{estimasiBeratKg} kg</strong>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-100 px-1">
            <span>Perolehan Poin:</span>
            <strong className="text-amber-300 font-mono text-sm">+{estimasiPoin} Poin</strong>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-200/80 px-1">
            <span>Reduksi Emisi:</span>
            <span className="text-emerald-300 font-mono text-[11px]">~{(estimasiBeratKg * 1.45).toFixed(2)} kg CO2e</span>
          </div>
          <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs font-bold px-1">
            <span className="text-emerald-200">Setara Nilai Rupiah:</span>
            <span className="text-amber-300 font-mono text-base drop-shadow-[0_0_8px_rgba(252,211,77,0.3)]">
              Rp {estimasiRupiah.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Tombol Setor */}
        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 border border-amber-200"
        >
          <PlusCircle className="w-4.5 h-4.5 stroke-[2.8]" />
          <span>Kirim Setoran Sampah</span>
        </button>
      </form>

      {/* ── DAFTAR RIWAYAT SETORAN ─────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-white">
            Riwayat Setoran ({setoranList.length})
          </h3>
          <span className="text-[11px] font-mono text-emerald-400">Terverifikasi</span>
        </div>

        <div className="space-y-2">
          {setoranList.map((item) => (
            <div
              key={item.id}
              className="bg-[#042416]/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 shadow-md hover:border-emerald-400/40 transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold">
                    {item.jenisSampah === 'gelasPlastik' ? (
                      <Coffee className="w-4.5 h-4.5 text-emerald-300" />
                    ) : (
                      <Package className="w-4.5 h-4.5 text-amber-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">
                      {item.labelSampah}
                    </h4>
                    <span className="text-[11px] text-emerald-200/70 font-medium">
                      {item.namaKedai} ({item.wilayah})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-amber-300 block">
                    +{item.poinDidapat} Poin
                  </span>
                  <span className="text-[10px] text-emerald-300/80 font-mono">
                    Rp {(item.poinDidapat * NILAI_POIN).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40 text-[11px] text-emerald-200/70 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{item.tanggal}</span>
                </span>
                <span className="font-bold text-white">
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
