/**
 * Setor.jsx — Halaman Setor Sampah GREENWORTH Surabaya
 * Estetika Hijau Putih Seimbang & Clear (Vibe Design Standard):
 * Kontrol tersegmentasi rapi, pratinjau kalkulator ala receipt digital, dan riwayat terstruktur.
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
      {/* ── HEADER HALAMAN (PUTIH BERSIH) ──────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#064E3B] bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
            Penukaran Poin Sampah
          </span>
          <span className="text-[11px] font-mono text-amber-700 font-bold">1 Poin = Rp 100</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Setor Sampah Kedai Kopi
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Pilah cup plastik dan kardus, bawa ke titik kumpul Surabaya untuk diverifikasi dan langsung mendapatkan poin reward syariah.
        </p>
      </div>

      {/* ── NOTIFIKASI SUKSES DISKRIT ──────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-slate-900 flex items-start gap-3 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#064E3B] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-black text-[#064E3B] uppercase tracking-wider">
              Setoran Berhasil Dicatat
            </h4>
            <p className="text-xs text-slate-700 mt-1">
              {pesanSukses.label} ({pesanSukses.berat} kg) di {pesanSukses.kedai}. Mendapatkan <strong className="text-amber-800">+{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}).
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

      {/* ── FORMULIR SETOR UTAMA (PUTIH BERSIH) ────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4"
      >
        {/* 1. Pilih Titik Kumpul */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Lokasi Titik Kumpul Surabaya
          </label>
          <div className="relative">
            <select
              value={titikKumpulId}
              onChange={(e) => setTitikKumpulId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#064E3B] appearance-none pr-8"
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

        {/* 2. Segmented Control: Jenis Sampah */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Pilih Kategori Sampah
          </label>
          <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setJenisSampah('gelasPlastik')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                jenisSampah === 'gelasPlastik'
                  ? 'bg-white text-[#064E3B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coffee className="w-4 h-4 stroke-[2.3]" />
              <span>Cup Plastik</span>
              <span className="text-[10px] text-slate-400 font-normal">(10 pt/kg)</span>
            </button>

            <button
              type="button"
              onClick={() => setJenisSampah('kardus')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                jenisSampah === 'kardus'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 stroke-[2.3]" />
              <span>Kardus Boks</span>
              <span className="text-[10px] text-slate-400 font-normal">(5 pt/kg)</span>
            </button>
          </div>
        </div>

        {/* 3. Input Kuantitas */}
        {jenisSampah === 'gelasPlastik' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700">Jumlah Cup Gelas</span>
              <span className="text-slate-400 font-mono">1 cup ≈ 12 gram</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black active:scale-95 transition-all text-base hover:bg-slate-200"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={jumlahGelas}
                onChange={(e) => setJumlahGelas(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-[#064E3B] font-mono font-black text-2xl rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              <button
                type="button"
                onClick={() => setJumlahGelas((prev) => (Number(prev) || 0) + 5)}
                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black active:scale-95 transition-all text-base hover:bg-slate-200"
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
                      ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-2xs'
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
              <span className="font-extrabold text-slate-700">Berat Kardus (kg)</span>
              <span className="text-slate-400 font-mono">1 kg = 5 Poin</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Math.max(0.5, Number(((Number(prev) || 0) - 0.5).toFixed(1))))}
                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black active:scale-95 transition-all text-base hover:bg-slate-200"
              >
                -
              </button>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={beratKardusKg}
                onChange={(e) => setBeratKardusKg(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-amber-800 font-mono font-black text-2xl rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setBeratKardusKg((prev) => Number(((Number(prev) || 0) + 0.5).toFixed(1)))}
                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black active:scale-95 transition-all text-base hover:bg-slate-200"
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
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-2xs'
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
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Cup sudah dibilas bersih dan dipilah"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-[#064E3B] placeholder-slate-400"
          />
        </div>

        {/* 5. Pratinjau Perhitungan (Digital Receipt Style - Hijau Putih) */}
        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-dashed border-emerald-300 space-y-2 font-mono relative overflow-hidden">
          {/* Perforated ticket side notches */}
          <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-white rounded-full -translate-y-1/2 border-r border-emerald-300" />
          <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-white rounded-full -translate-y-1/2 border-l border-emerald-300" />

          <div className="flex items-center justify-between text-[11px] text-[#064E3B] font-bold uppercase tracking-wider px-1">
            <span>Struk Estimasi Konversi</span>
            <span className="text-amber-700 font-mono">● SURABAYA LIVE</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-700 px-1">
            <span>Estimasi Bobot:</span>
            <strong className="text-slate-900 font-mono">{estimasiBeratKg} kg</strong>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-700 px-1">
            <span>Perolehan Poin:</span>
            <strong className="text-amber-800 font-mono text-sm">+{estimasiPoin} Poin</strong>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>Reduksi Emisi:</span>
            <span className="text-[#064E3B] font-mono text-[11px]">~{(estimasiBeratKg * 1.45).toFixed(2)} kg CO2e</span>
          </div>
          <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs font-bold px-1">
            <span className="text-slate-700">Setara Nilai Rupiah:</span>
            <span className="text-[#064E3B] font-mono text-base font-black">
              Rp {estimasiRupiah.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Tombol Setor */}
        <button
          type="submit"
          className="w-full py-3.5 bg-[#064E3B] hover:bg-[#043E2E] active:scale-95 text-white font-black text-xs rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4.5 h-4.5 stroke-[2.8]" />
          <span>Kirim Setoran Sampah</span>
        </button>
      </form>

      {/* ── DAFTAR RIWAYAT SETORAN (PUTIH BERSIH) ───────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-slate-900">
            Riwayat Setoran ({setoranList.length})
          </h3>
          <span className="text-[11px] font-mono text-[#064E3B] font-bold">Terverifikasi</span>
        </div>

        <div className="space-y-2">
          {setoranList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold">
                    {item.jenisSampah === 'gelasPlastik' ? (
                      <Coffee className="w-4.5 h-4.5 text-[#064E3B]" />
                    ) : (
                      <Package className="w-4.5 h-4.5 text-amber-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      {item.labelSampah}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.namaKedai} ({item.wilayah})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-amber-700 block">
                    +{item.poinDidapat} Poin
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Rp {(item.poinDidapat * NILAI_POIN).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{item.tanggal}</span>
                </span>
                <span className="font-bold text-slate-700">
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
