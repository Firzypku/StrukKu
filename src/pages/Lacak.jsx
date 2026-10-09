/**
 * Lacak.jsx — Halaman Pelacakan Penyaluran Sumbangan Syariah GREENWORTH Surabaya
 * Estetika Hijau Putih Seimbang & Clear (Vibe Design Standard):
 * Timeline 5 tahap dengan garis terhubung presisi, status aktif jelas, dan form donasi taktis.
 */

import { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Gift,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

export default function Lacak({ onPindahMenu }) {
  const { sumbanganList, ringkasan, posSumbanganList, tambahSumbangan } = useGreenworth();

  // State untuk form donasi
  const [bukaFormDonasi, setBukaFormDonasi] = useState(false);
  const [posTerpilihId, setPosTerpilihId] = useState(posSumbanganList[0]?.id || 'pos-wakaf-produktif');
  const [poinDonasi, setPoinDonasi] = useState(10);
  const [pesanDoa, setPesanDoa] = useState('');
  const [pesanSukses, setPesanSukses] = useState(null);
  const [errorDonasi, setErrorDonasi] = useState('');

  // State untuk detail tahap yang di-expand
  const [expandedId, setExpandedId] = useState(sumbanganList[0]?.id || null);

  const handleDonasiSubmit = (e) => {
    e.preventDefault();
    setErrorDonasi('');

    const poin = Number(poinDonasi) || 0;
    if (poin <= 0) {
      setErrorDonasi('Masukkan jumlah poin yang ingin disumbangkan (minimal 1 poin).');
      return;
    }
    if (poin > ringkasan.saldoPoin) {
      setErrorDonasi(`Saldo poinmu saat ini hanya ${ringkasan.saldoPoin} Poin.`);
      return;
    }

    try {
      const donasiBaru = tambahSumbangan({
        posId: posTerpilihId,
        jumlahPoin: poin,
        pesanDoa,
      });

      setPesanSukses({
        namaPos: donasiBaru.namaPos,
        poin: donasiBaru.jumlahPoin,
        rupiah: donasiBaru.nilaiRupiah,
      });

      setExpandedId(donasiBaru.id);
      setBukaFormDonasi(false);
      setPesanDoa('');
    } catch (err) {
      setErrorDonasi(err.message || 'Gagal memproses sumbangan.');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in pb-3">
      {/* ── HEADER HALAMAN (PUTIH BERSIH) ──────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#064E3B] bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
            Jejak Transparansi Syariah
          </span>
          <span className="text-[11px] font-mono text-slate-500 font-bold">Surabaya</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Lacak Penyaluran Berkah
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Pantau 5 tahap penyaluran dari poin hasil setoran sampah menjadi manfaat nyata bagi warga dan kemaslahatan kota Surabaya.
        </p>
      </div>

      {/* ── KARTU SALDO POIN TERSEDIA & TRIGGER SUMBANG (PUTIH BERSIH) ──────── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
            Saldo Poin Aktif
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-600 font-mono tracking-tight">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-bold text-slate-600 uppercase">Poin</span>
            <span className="text-xs text-[#064E3B] font-mono ml-1 font-semibold">
              ≈ Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setBukaFormDonasi(!bukaFormDonasi);
            setPesanSukses(null);
            setErrorDonasi('');
          }}
          className="px-4 py-2.5 rounded-2xl bg-[#064E3B] hover:bg-[#043E2E] text-white font-black text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
        >
          <HeartHandshake className="w-4 h-4 stroke-[2.4]" />
          <span>{bukaFormDonasi ? 'Tutup' : 'Sumbang'}</span>
        </button>
      </div>

      {/* ── NOTIFIKASI SUKSES ──────────────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-slate-900 flex items-start gap-3 shadow-2xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#064E3B] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-black text-[#064E3B] uppercase tracking-wider">
              Sumbangan Berhasil Dicatat
            </h4>
            <p className="text-xs text-slate-700 mt-1">
              Tersalurkan <strong className="text-amber-700">{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}) ke {pesanSukses.namaPos}. Saat ini berada di Tahap 1.
            </p>
          </div>
        </div>
      )}

      {/* ── FORMULIR SUMBANG POIN (PUTIH BERSIH) ───────────────────────────── */}
      {bukaFormDonasi && (
        <form
          onSubmit={handleDonasiSubmit}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-4 animate-fade-in"
        >
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Penyaluran Poin Sampah
              </h3>
              <p className="text-[11px] text-amber-700 font-mono font-semibold">1 Poin = Rp {NILAI_POIN}</p>
            </div>
            <Gift className="w-5 h-5 text-[#064E3B]" />
          </div>

          {errorDonasi && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorDonasi}</span>
            </div>
          )}

          {/* Opsi Pos */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Pilih Pos Sumbangan Syariah
            </label>
            <div className="space-y-2">
              {posSumbanganList.map((pos) => (
                <div
                  key={pos.id}
                  onClick={() => setPosTerpilihId(pos.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    posTerpilihId === pos.id
                      ? 'bg-emerald-50/70 border-[#064E3B] shadow-2xs'
                      : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                      {pos.kategori}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Target: Rp {(pos.targetDanaRupiah / 1000000).toFixed(1)} Jt
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mt-1">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {pos.manfaatRingkas}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nominal Poin */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700">Jumlah Poin Disalurkan</span>
              <span className="text-amber-700 font-mono font-bold">Tersedia: {ringkasan.saldoPoin} Poin</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black active:scale-95 transition-all text-base hover:bg-slate-200"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                max={ringkasan.saldoPoin}
                value={poinDonasi}
                onChange={(e) => setPoinDonasi(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-[#064E3B] font-mono font-black text-2xl rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.min(ringkasan.saldoPoin, (Number(prev) || 0) + 5))}
                className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black active:scale-95 transition-all text-base hover:bg-slate-200"
              >
                +5
              </button>
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              {[5, 10, 25].map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={ringkasan.saldoPoin < p}
                  onClick={() => setPoinDonasi(p)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    poinDonasi === p
                      ? 'bg-[#064E3B] text-white border-[#064E3B]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-40'
                  }`}
                >
                  {p} pt
                </button>
              ))}
              <button
                type="button"
                disabled={ringkasan.saldoPoin <= 0}
                onClick={() => setPoinDonasi(ringkasan.saldoPoin)}
                className="flex-1 py-1.5 rounded-xl text-xs font-black bg-amber-400 text-slate-950 border border-amber-300 hover:bg-amber-300 disabled:opacity-40"
              >
                Semua
              </button>
            </div>
          </div>

          {/* Pesan Doa */}
          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Pesan atau Niat Doa (Opsional)
            </label>
            <input
              type="text"
              value={pesanDoa}
              onChange={(e) => setPesanDoa(e.target.value)}
              placeholder="Contoh: Semoga berkah dan bermanfaat bagi sesama"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-[#064E3B] placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={ringkasan.saldoPoin <= 0}
            className="w-full py-3.5 bg-[#064E3B] hover:bg-[#043E2E] active:scale-95 text-white font-black text-xs rounded-2xl transition-all shadow-sm disabled:opacity-40"
          >
            Kirim Sumbangan ({poinDonasi} Poin = Rp {(poinDonasi * NILAI_POIN).toLocaleString('id-ID')})
          </button>
        </form>
      )}

      {/* ── DAFTAR SUMBANGAN & TIMELINE 5 TAHAP (PUTIH BERSIH) ───────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-slate-900">
            Riwayat Penyaluran ({sumbanganList.length})
          </h3>
          <span className="text-[11px] font-mono text-[#064E3B] font-bold">Jejak 5 Tahap</span>
        </div>

        <div className="space-y-2.5">
          {sumbanganList.map((item) => {
            const isExpanded = expandedId === item.id;
            const posData = posSumbanganList.find((p) => p.id === item.posId) || posSumbanganList[0];
            const tahapConfig = posData.tahapPenyaluran;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        {posData.kategori}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.id}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5">
                      {item.namaPos}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {item.lembagaPengelola}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-700 font-mono block">
                      {item.jumlahPoin} Poin
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Rp {item.nilaiRupiah.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black font-mono ${
                      item.tahapSaatIni === 5
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-[#064E3B] text-white'
                    }`}>
                      Tahap {item.tahapSaatIni}/5
                    </span>
                    <span className="font-bold text-slate-800">
                      {item.judulTahap}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="text-slate-400 hover:text-slate-700 p-1"
                    aria-label="Detail Tahap"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {item.pesanDoa && (
                  <p className="text-[11px] text-slate-600 italic bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
                    "{item.pesanDoa}"
                  </p>
                )}

                {/* Timeline 5 Tahap (Bersih & Jelas) */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 space-y-2.5 animate-fade-in">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Alur Penyaluran Terverifikasi
                    </span>

                    <div className="space-y-2 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 before:pointer-events-none">
                      {tahapConfig.map((thp) => {
                        const isPast = thp.nomor < item.tahapSaatIni;
                        const isCurrent = thp.nomor === item.tahapSaatIni;

                        return (
                          <div key={thp.nomor} className="relative flex items-start gap-2.5 pl-0.5">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black z-10 flex-shrink-0 ${
                                isPast
                                  ? 'bg-[#064E3B] text-white'
                                  : isCurrent
                                  ? 'bg-amber-400 text-slate-950 ring-3 ring-amber-400/30'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}
                            >
                              {isPast ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.8]" /> : thp.nomor}
                            </div>

                            <div
                              className={`flex-1 rounded-xl p-3 border text-xs ${
                                isCurrent
                                  ? 'bg-amber-50/80 border-amber-300 text-slate-900'
                                  : isPast
                                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                                  : 'bg-slate-50/40 border-slate-150 opacity-60 text-slate-500'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h5 className={`font-black ${isCurrent ? 'text-amber-950' : 'text-slate-900'}`}>
                                  {thp.nomor}. {thp.judul}
                                </h5>
                                {isCurrent && (
                                  <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded uppercase">
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                {thp.keterangan}
                              </p>

                              {isCurrent && item.keteranganTahap && (
                                <div className="mt-2 pt-2 border-t border-amber-200 text-[11px] text-amber-900 font-medium">
                                  <strong>Keterangan Terkini:</strong> {item.keteranganTahap}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Komitmen Syariah Singkat */}
      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-[#064E3B] flex-shrink-0" />
        <p className="text-[11px] leading-tight">
          Penyaluran menganut akad <em>tabarru'</em> tanpa potongan tersembunyi ke warga penerima manfaat di Surabaya.
        </p>
      </div>
    </div>
  );
}
