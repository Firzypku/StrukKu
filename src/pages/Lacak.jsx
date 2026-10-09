/**
 * Lacak.jsx — Halaman Pelacakan Penyaluran Sumbangan Syariah GREENWORTH Surabaya
 * Vibe Design Framework & Cyber-Emerald Dark Luxury:
 * Timeline 5 tahap dengan garis terhubung presisi, status aktif bercahaya, dan form donasi taktis.
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
      {/* ── HEADER HALAMAN ─────────────────────────────────────────────────── */}
      <div className="bg-[#042416]/90 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/25 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-400/30 px-2.5 py-1 rounded-full">
            Jejak Transparansi Syariah
          </span>
          <span className="text-[11px] font-mono text-amber-300 font-bold">Surabaya</span>
        </div>
        <h2 className="text-xl font-black text-white tracking-tight">
          Lacak Penyaluran Berkah
        </h2>
        <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
          Pantau 5 tahap penyaluran dari poin hasil setoran sampah menjadi manfaat nyata bagi warga dan kemaslahatan kota Surabaya.
        </p>
      </div>

      {/* ── KARTU SALDO POIN TERSEDIA & TRIGGER SUMBANG ────────────────────── */}
      <div className="bg-[#042416]/90 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/25 shadow-xl flex items-center justify-between gap-3 text-white">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80 block">
            Saldo Poin Aktif
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-bold text-emerald-200 uppercase">Poin</span>
            <span className="text-xs text-emerald-300 font-mono ml-1 font-semibold">
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
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-105 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-amber-500/25 border border-amber-200"
        >
          <HeartHandshake className="w-4 h-4 stroke-[2.4]" />
          <span>{bukaFormDonasi ? 'Tutup' : 'Sumbang'}</span>
        </button>
      </div>

      {/* ── NOTIFIKASI SUKSES ──────────────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-950/90 border border-emerald-400/40 rounded-2xl p-4 text-white flex items-start gap-3 shadow-lg shadow-emerald-950/60 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
              Sumbangan Berhasil Dicatat
            </h4>
            <p className="text-xs text-emerald-100/90 mt-1">
              Tersalurkan <strong className="text-amber-300">{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}) ke {pesanSukses.namaPos}. Saat ini berada di Tahap 1.
            </p>
          </div>
        </div>
      )}

      {/* ── FORMULIR SUMBANG POIN (DARK LUXURY GLASS) ───────────────────────── */}
      {bukaFormDonasi && (
        <form
          onSubmit={handleDonasiSubmit}
          className="bg-[#042416]/95 backdrop-blur-md rounded-3xl p-5 border border-amber-400/40 shadow-2xl space-y-4 text-white animate-fade-in"
        >
          <div className="border-b border-emerald-800/60 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">
                Penyaluran Poin Sampah
              </h3>
              <p className="text-[11px] text-amber-300 font-mono font-semibold">1 Poin = Rp {NILAI_POIN}</p>
            </div>
            <Gift className="w-5 h-5 text-amber-400" />
          </div>

          {errorDonasi && (
            <div className="bg-rose-950/80 border border-rose-500/50 p-3 rounded-2xl text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorDonasi}</span>
            </div>
          )}

          {/* Opsi Pos */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
              Pilih Pos Sumbangan Syariah
            </label>
            <div className="space-y-2">
              {posSumbanganList.map((pos) => (
                <div
                  key={pos.id}
                  onClick={() => setPosTerpilihId(pos.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    posTerpilihId === pos.id
                      ? 'bg-emerald-950 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                      : 'bg-[#02180e] border-emerald-500/25 hover:border-emerald-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                      {pos.kategori}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300/80">
                      Target: Rp {(pos.targetDanaRupiah / 1000000).toFixed(1)} Jt
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white mt-1">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-emerald-200/70 mt-0.5 leading-relaxed">
                    {pos.manfaatRingkas}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nominal Poin */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-emerald-200">Jumlah Poin Disalurkan</span>
              <span className="text-amber-300 font-mono font-bold">Tersedia: {ringkasan.saldoPoin} Poin</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/30 text-amber-300 font-black active:scale-95 transition-all text-base hover:bg-emerald-900"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                max={ringkasan.saldoPoin}
                value={poinDonasi}
                onChange={(e) => setPoinDonasi(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-[#02180e] border border-emerald-500/30 text-center text-amber-300 font-mono font-black text-2xl rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.min(ringkasan.saldoPoin, (Number(prev) || 0) + 5))}
                className="w-11 h-11 rounded-xl bg-emerald-950 border border-emerald-500/30 text-amber-300 font-black active:scale-95 transition-all text-base hover:bg-emerald-900"
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
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                      : 'bg-emerald-950/70 text-emerald-200/80 border-emerald-800 hover:bg-emerald-900 disabled:opacity-40'
                  }`}
                >
                  {p} pt
                </button>
              ))}
              <button
                type="button"
                disabled={ringkasan.saldoPoin <= 0}
                onClick={() => setPoinDonasi(ringkasan.saldoPoin)}
                className="flex-1 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 border border-amber-200 hover:brightness-105 disabled:opacity-40"
              >
                Semua
              </button>
            </div>
          </div>

          {/* Pesan Doa */}
          <div className="space-y-1">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-emerald-200">
              Pesan atau Niat Doa (Opsional)
            </label>
            <input
              type="text"
              value={pesanDoa}
              onChange={(e) => setPesanDoa(e.target.value)}
              placeholder="Contoh: Semoga berkah dan bermanfaat bagi sesama"
              className="w-full bg-[#02180e] border border-emerald-500/30 text-white text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-emerald-600/60"
            />
          </div>

          <button
            type="submit"
            disabled={ringkasan.saldoPoin <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-amber-500/25 disabled:opacity-40 border border-amber-200"
          >
            Kirim Sumbangan ({poinDonasi} Poin = Rp {(poinDonasi * NILAI_POIN).toLocaleString('id-ID')})
          </button>
        </form>
      )}

      {/* ── DAFTAR SUMBANGAN & TIMELINE 5 TAHAP ─────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-white">
            Riwayat Penyaluran ({sumbanganList.length})
          </h3>
          <span className="text-[11px] font-mono text-emerald-400">Jejak 5 Tahap</span>
        </div>

        <div className="space-y-2.5">
          {sumbanganList.map((item) => {
            const isExpanded = expandedId === item.id;
            const posData = posSumbanganList.find((p) => p.id === item.posId) || posSumbanganList[0];
            const tahapConfig = posData.tahapPenyaluran;

            return (
              <div
                key={item.id}
                className="bg-[#042416]/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/20 shadow-md space-y-3 text-white"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                        {posData.kategori}
                      </span>
                      <span className="text-[11px] text-emerald-300/80 font-mono">
                        {item.id}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1.5">
                      {item.namaPos}
                    </h4>
                    <p className="text-[11px] text-emerald-200/70 font-medium">
                      {item.lembagaPengelola}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-300 font-mono block">
                      {item.jumlahPoin} Poin
                    </span>
                    <span className="text-[11px] text-emerald-300/80 font-mono">
                      Rp {item.nilaiRupiah.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-[#02180e] rounded-xl p-2.5 flex items-center justify-between text-xs border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black font-mono ${
                      item.tahapSaatIni === 5
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-emerald-500 text-slate-950'
                    }`}>
                      Tahap {item.tahapSaatIni}/5
                    </span>
                    <span className="font-bold text-white">
                      {item.judulTahap}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="text-emerald-400 hover:text-white p-1"
                    aria-label="Detail Tahap"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {item.pesanDoa && (
                  <p className="text-[11px] text-emerald-200/80 italic bg-[#02180e]/60 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                    "{item.pesanDoa}"
                  </p>
                )}

                {/* Timeline 5 Tahap (Luminous Connected) */}
                {isExpanded && (
                  <div className="pt-2 border-t border-emerald-800/40 space-y-2.5 animate-fade-in">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/80 block">
                      Alur Penyaluran Terverifikasi
                    </span>

                    <div className="space-y-2 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-emerald-800/60 before:pointer-events-none">
                      {tahapConfig.map((thp) => {
                        const isPast = thp.nomor < item.tahapSaatIni;
                        const isCurrent = thp.nomor === item.tahapSaatIni;

                        return (
                          <div key={thp.nomor} className="relative flex items-start gap-2.5 pl-0.5">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black z-10 flex-shrink-0 ${
                                isPast
                                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                                  : isCurrent
                                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 shadow-md'
                                  : 'bg-[#02180e] border border-emerald-700 text-emerald-500'
                              }`}
                            >
                              {isPast ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.8]" /> : thp.nomor}
                            </div>

                            <div
                              className={`flex-1 rounded-xl p-3 border text-xs ${
                                isCurrent
                                  ? 'bg-amber-400/10 border-amber-400/50 text-white'
                                  : isPast
                                  ? 'bg-[#02180e] border-emerald-500/20 text-emerald-100'
                                  : 'bg-[#02180e]/40 border-emerald-900/40 opacity-50 text-emerald-400'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h5 className={`font-black ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
                                  {thp.nomor}. {thp.judul}
                                </h5>
                                {isCurrent && (
                                  <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded uppercase">
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
                                {thp.keterangan}
                              </p>

                              {isCurrent && item.keteranganTahap && (
                                <div className="mt-2 pt-2 border-t border-amber-400/30 text-[11px] text-amber-200 font-medium">
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
      <div className="bg-[#02180e] rounded-2xl p-3.5 border border-emerald-500/25 flex items-center gap-2.5 text-xs text-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-[11px] leading-tight">
          Penyaluran menganut akad <em>tabarru'</em> tanpa potongan tersembunyi ke warga penerima manfaat di Surabaya.
        </p>
      </div>
    </div>
  );
}
