/**
 * Lacak.jsx — Halaman Pelacakan Penyaluran Sumbangan Syariah GREENWORTH Surabaya
 * Tema: Hijau-Putih Segar & Bersih (Non-Gelap, Rapi, Seimbang & Terstruktur).
 */

import { useState, useEffect } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Gift,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

export default function Lacak({ onPindahMenu, navParams = {} }) {
  const { sumbanganList, ringkasan, posSumbanganList, tambahSumbangan } = useGreenworth();

  // State untuk form donasi
  const [bukaFormDonasi, setBukaFormDonasi] = useState(Boolean(navParams?.posId));
  const [posTerpilihId, setPosTerpilihId] = useState(navParams?.posId || posSumbanganList[0]?.id || 'pos-wakaf-produktif');
  const [poinDonasi, setPoinDonasi] = useState(10);
  const [pesanDoa, setPesanDoa] = useState('');
  const [pesanSukses, setPesanSukses] = useState(null);
  const [errorDonasi, setErrorDonasi] = useState('');

  // Sinkronisasi otomatis saat parameter posId berubah dari halaman Beranda
  useEffect(() => {
    if (navParams?.posId) {
      setPosTerpilihId(navParams.posId);
      setBukaFormDonasi(true);
    }
  }, [navParams]);

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
    <div className="space-y-4 animate-fade-in pb-4">
      {/* ── HEADER HALAMAN ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1.5">
          Jejak Transparansi
        </span>
        <h2 className="text-base font-extrabold text-slate-900">
          Lacak Penyaluran Berkah
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pantau 5 tahap penyaluran dari poin hasil setoran sampah menjadi manfaat nyata di Surabaya.
        </p>
      </div>

      {/* ── KARTU SALDO POIN TERSEDIA & TRIGGER SUMBANG ────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Saldo Poin Aktif
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-emerald-700">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-semibold text-slate-600">Poin</span>
            <span className="text-[11px] text-slate-400 ml-1">
              (Rp {ringkasan.saldoRupiah.toLocaleString('id-ID')})
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
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>{bukaFormDonasi ? 'Tutup' : 'Sumbang'}</span>
        </button>
      </div>

      {/* ── NOTIFIKASI SUKSES ──────────────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-50/60 to-white border-2 border-emerald-300 rounded-2xl p-4 text-slate-800 flex items-start justify-between gap-2.5 shadow-md animate-slide-down">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Sumbangan Berhasil Dicatat!
                </h4>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                  Tahap 1
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Tersalurkan <strong className="text-emerald-700 font-bold">+{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}) ke <strong>{pesanSukses.namaPos}</strong>. Tim pengelola akan memverifikasi alokasi dana ke tahap berikutnya.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPesanSukses(null)}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all flex-shrink-0"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── FORMULIR SUMBANG POIN ───────────────────────────────────────────── */}
      {bukaFormDonasi && (
        <form
          onSubmit={handleDonasiSubmit}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md space-y-3.5 animate-fade-in"
        >
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Penyaluran Poin Sampah
              </h3>
              <p className="text-[11px] text-slate-400">1 Poin = Rp {NILAI_POIN}</p>
            </div>
            <Gift className="w-4 h-4 text-emerald-600" />
          </div>

          {errorDonasi && (
            <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-700 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorDonasi}</span>
            </div>
          )}

          {/* Opsi Pos */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Pilih Pos Sumbangan
            </label>
            <div className="space-y-1.5">
              {posSumbanganList.map((pos) => (
                <div
                  key={pos.id}
                  onClick={() => setPosTerpilihId(pos.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    posTerpilihId === pos.id
                      ? 'bg-emerald-50 border-emerald-600'
                      : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                      {pos.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Target: Rp {(pos.targetDanaRupiah / 1000000).toFixed(1)} Jt
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                    {pos.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {pos.manfaatRingkas}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nominal Poin */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Jumlah Poin</span>
              <span className="text-slate-400">Tersedia: {ringkasan.saldoPoin} Poin</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-95 transition-all text-sm"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                max={ringkasan.saldoPoin}
                value={poinDonasi}
                onChange={(e) => setPoinDonasi(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-slate-900 font-bold text-lg rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.min(ringkasan.saldoPoin, (Number(prev) || 0) + 5))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold active:scale-95 transition-all text-sm"
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
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    poinDonasi === p
                      ? 'bg-emerald-600 text-white border-emerald-600'
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
                className="flex-1 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 disabled:opacity-40"
              >
                Semua
              </button>
            </div>
          </div>

          {/* Pesan Doa */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Pesan atau Niat Doa (Opsional)
            </label>
            <input
              type="text"
              value={pesanDoa}
              onChange={(e) => setPesanDoa(e.target.value)}
              placeholder="Contoh: Semoga berkah dan bermanfaat bagi sesama"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={ringkasan.saldoPoin <= 0}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-xs disabled:opacity-40"
          >
            Kirim Sumbangan ({poinDonasi} Poin = Rp {(poinDonasi * NILAI_POIN).toLocaleString('id-ID')})
          </button>
        </form>
      )}

      {/* ── DAFTAR SUMBANGAN & TIMELINE 5 TAHAP ─────────────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900">
            Riwayat Penyaluran ({sumbanganList.length})
          </h3>
          <span className="text-[11px] text-slate-400">Jejak 5 Tahap</span>
        </div>

        <div className="space-y-2.5">
          {sumbanganList.map((item) => {
            const isExpanded = expandedId === item.id;
            const posData = posSumbanganList.find((p) => p.id === item.posId) || posSumbanganList[0];
            const tahapConfig = posData.tahapPenyaluran;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                        {posData.kategori}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.id}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {item.namaPos}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {item.lembagaPengelola}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-700 block">
                      {item.jumlahPoin} Poin
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Rp {item.nilaiRupiah.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.tahapSaatIni === 5
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      Tahap {item.tahapSaatIni}/5
                    </span>
                    <span className="font-semibold text-slate-800">
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
                  <p className="text-[11px] text-slate-500 italic bg-slate-50/60 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    "{item.pesanDoa}"
                  </p>
                )}

                {/* Timeline 5 Tahap (Bersih) */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 space-y-2.5 animate-fade-in">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Alur Penyaluran Terverifikasi
                    </span>

                    <div className="space-y-2 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 before:pointer-events-none">
                      {tahapConfig.map((thp) => {
                        const isPast = thp.nomor < item.tahapSaatIni;
                        const isCurrent = thp.nomor === item.tahapSaatIni;

                        return (
                          <div key={thp.nomor} className="relative flex items-start gap-2.5 pl-0.5">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 flex-shrink-0 ${
                                isPast
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-amber-400 text-slate-950 ring-3 ring-amber-400/20'
                                  : 'bg-white border-2 border-slate-200 text-slate-400'
                              }`}
                            >
                              {isPast ? <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> : thp.nomor}
                            </div>

                            <div
                              className={`flex-1 rounded-xl p-2.5 border text-xs ${
                                isCurrent
                                  ? 'bg-amber-50/70 border-amber-300'
                                  : isPast
                                  ? 'bg-slate-50 border-slate-150'
                                  : 'bg-slate-50/40 border-slate-100 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h5 className={`font-bold ${isCurrent ? 'text-amber-950' : 'text-slate-800'}`}>
                                  {thp.nomor}. {thp.judul}
                                </h5>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1 py-0.2 rounded uppercase">
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {thp.keterangan}
                              </p>

                              {isCurrent && item.keteranganTahap && (
                                <div className="mt-1.5 pt-1.5 border-t border-amber-200 text-[11px] text-amber-900 font-medium">
                                  <strong>Keterangan:</strong> {item.keteranganTahap}
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
      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <p className="text-[11px] leading-tight">
          Penyaluran menganut akad <em>tabarru'</em> tanpa potongan tersembunyi ke warga penerima manfaat di Surabaya.
        </p>
      </div>
    </div>
  );
}
