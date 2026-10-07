/**
 * Lacak.jsx — Halaman Pelacakan Penyaluran Sumbangan Syariah GREENWORTH Surabaya
 * Menampilkan pelacakan 5 tahap penyaluran dari poin sampah menjadi dampak nyata.
 * Memuat 2 data demo (Tahap 2 dan Tahap 5) serta formulir donasi poin baru.
 */

import { useState } from 'react';
import {
  Compass,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  GraduationCap,
  AlertTriangle,
  Gift,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useGreenworth } from '../context/GreenworthContext';
import { NILAI_POIN } from '../config';

export default function Lacak() {
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

  const posAktif = posSumbanganList.find((p) => p.id === posTerpilihId) || posSumbanganList[0];

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
    <div className="space-y-6">
      {/* ── HEADER HALAMAN ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#064E3B] to-emerald-900 p-4 rounded-3xl border border-emerald-600/40">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Amanah & Transparan</span>
        </div>
        <h2 className="text-lg font-black text-white">
          Lacak Penyaluran Sumbangan
        </h2>
        <p className="text-sm text-emerald-200 mt-1 leading-relaxed">
          Setiap poin sampah yang kamu wakafkan atau sedekahkan dapat dilacak secara transparan melalui 5 tahap penyaluran resmi.
        </p>
      </div>

      {/* ── KARTU SALDO POIN SIAP DISUMBANGKAN ───────────────────────────────── */}
      <div className="bg-[#042614] rounded-3xl p-4 border border-emerald-800/80 shadow-md flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-emerald-300 block uppercase tracking-wider">
            Saldo Poin Tersedia
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-amber-300">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-sm font-bold text-emerald-200">Poin</span>
            <span className="text-xs text-emerald-400/90 font-medium">
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
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-sm active:scale-95 transition-all shadow-md flex items-center gap-1.5"
        >
          <HeartHandshake className="w-4 h-4 stroke-[2.5]" />
          <span>{bukaFormDonasi ? 'Tutup Form' : 'Sumbang'}</span>
        </button>
      </div>

      {/* ── NOTIFIKASI SUKSES ──────────────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-900/90 border-2 border-amber-400 rounded-2xl p-4 text-white shadow-xl">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-black text-amber-300">
                Jazakallahu Khairan! Sumbangan Diterima
              </h3>
              <p className="text-sm text-emerald-100 mt-0.5 leading-relaxed">
                Kamu telah menyumbangkan <strong>{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}) ke pos <strong>{pesanSukses.namaPos}</strong>. Poin kini masuk <strong>Tahap 1 (Penerimaan Sumbangan)</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── FORMULIR SUMBANG POIN ───────────────────────────────────────────── */}
      {bukaFormDonasi && (
        <form
          onSubmit={handleDonasiSubmit}
          className="bg-[#042614] rounded-3xl p-5 border border-emerald-600/80 shadow-2xl space-y-4 animate-fade-in"
        >
          <div className="border-b border-emerald-900/80 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">
                Sumbangkan Poin Sampah
              </h3>
              <p className="text-xs text-emerald-300">
                1 Poin bernilai Rp {NILAI_POIN} dana sosial
              </p>
            </div>
            <Gift className="w-5 h-5 text-amber-300" />
          </div>

          {errorDonasi && (
            <div className="bg-rose-950/80 border border-rose-600/60 p-3 rounded-xl text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorDonasi}</span>
            </div>
          )}

          {/* 1. Pilih Pos Sumbangan */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-emerald-100">
              Pilih Pos Sumbangan Sosial Syariah
            </label>
            <div className="space-y-2">
              {posSumbanganList.map((pos) => (
                <div
                  key={pos.id}
                  onClick={() => setPosTerpilihId(pos.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    posTerpilihId === pos.id
                      ? 'bg-emerald-900/90 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-[#05371a] border-emerald-800/80 hover:border-emerald-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {pos.kategori}
                    </span>
                    <span className="text-xs text-emerald-300 font-medium">
                      Pengelola: {pos.lembagaPengelola.split('(')[0]}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-0.5">
                    {pos.nama}
                  </h4>
                  <p className="text-xs text-emerald-200/90 mt-1">
                    {pos.manfaatRingkas}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Jumlah Poin yang Disumbangkan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-emerald-100">
                Jumlah Poin yang Disumbangkan
              </label>
              <span className="text-xs font-semibold text-emerald-300">
                Saldo: {ringkasan.saldoPoin} Poin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-12 h-12 rounded-2xl bg-[#05371a] hover:bg-emerald-800 border border-emerald-700 text-white font-black text-lg active:scale-95 transition-all"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                max={ringkasan.saldoPoin}
                value={poinDonasi}
                onChange={(e) => setPoinDonasi(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-[#05371a] border border-emerald-700 text-center text-white text-lg font-black rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.min(ringkasan.saldoPoin, (Number(prev) || 0) + 5))}
                className="w-12 h-12 rounded-2xl bg-[#05371a] hover:bg-emerald-800 border border-emerald-700 text-white font-black text-lg active:scale-95 transition-all"
              >
                +5
              </button>
            </div>

            {/* Tombol Opsi Cepat */}
            <div className="flex items-center gap-2 pt-1">
              {[5, 10, 25].map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={ringkasan.saldoPoin < p}
                  onClick={() => setPoinDonasi(p)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    poinDonasi === p
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-[#05371a] text-emerald-200 border-emerald-800 hover:border-emerald-600 disabled:opacity-40'
                  }`}
                >
                  {p} Poin
                </button>
              ))}
              <button
                type="button"
                disabled={ringkasan.saldoPoin <= 0}
                onClick={() => setPoinDonasi(ringkasan.saldoPoin)}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-[#05371a] text-amber-300 border border-amber-500/50 hover:bg-emerald-800 disabled:opacity-40"
              >
                Semua ({ringkasan.saldoPoin})
              </button>
            </div>

            {/* Konversi Nilai Rupiah */}
            <div className="bg-[#05371a] rounded-xl p-3 border border-emerald-800 text-xs flex items-center justify-between">
              <span className="text-emerald-300">Setara Nilai Bantuan:</span>
              <span className="text-base font-black text-amber-300">
                Rp {((Number(poinDonasi) || 0) * NILAI_POIN).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* 3. Pesan atau Doa */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-emerald-100">
              Pesan atau Niat Doa (Opsional)
            </label>
            <input
              type="text"
              value={pesanDoa}
              onChange={(e) => setPesanDoa(e.target.value)}
              placeholder="Contoh: Semoga berkah dan bermanfaat bagi sesama"
              className="w-full bg-[#05371a] border border-emerald-700 text-white text-sm rounded-2xl px-4 py-3 placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={ringkasan.saldoPoin <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 active:scale-98 text-slate-950 font-black text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <HeartHandshake className="w-5 h-5 stroke-[2.5]" />
            <span>Kirim Sumbangan Sekarang</span>
          </button>
        </form>
      )}

      {/* ── DAFTAR SUMBANGAN & STEPPER 5 TAHAP ──────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">
              Riwayat & Status Penyaluran ({sumbanganList.length})
            </h3>
            <p className="text-xs text-emerald-300">
              Pantau progres nyata dari poin yang disumbangkan
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-300 bg-[#042614] border border-emerald-800 px-2.5 py-1 rounded-xl">
            Amanah
          </span>
        </div>

        {sumbanganList.map((item) => {
          const isExpanded = expandedId === item.id;
          const posData = posSumbanganList.find((p) => p.id === item.posId) || posSumbanganList[0];
          const tahapConfig = posData.tahapPenyaluran;

          return (
            <div
              key={item.id}
              className="bg-[#042614] rounded-3xl p-5 border border-emerald-800/80 shadow-md space-y-4"
            >
              {/* Header Kartu Sumbangan */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded-lg">
                      {posData.kategori}
                    </span>
                    <span className="text-xs text-emerald-300 font-mono">
                      {item.id}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white mt-1">
                    {item.namaPos}
                  </h4>
                  <p className="text-xs text-emerald-300 mt-0.5">
                    Lembaga: {item.lembagaPengelola}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-amber-300 block">
                    {item.jumlahPoin} Poin
                  </span>
                  <span className="text-xs font-semibold text-emerald-200">
                    Rp {item.nilaiRupiah.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-emerald-400/80 block mt-0.5">
                    {item.tanggal.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Status Badge Saat Ini */}
              <div className="bg-[#05371a] rounded-2xl p-3.5 border border-emerald-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    item.tahapSaatIni === 5
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {item.tahapSaatIni}/5
                  </div>
                  <div>
                    <span className="text-xs text-emerald-300 block font-medium">
                      Status Saat Ini:
                    </span>
                    <span className="text-sm font-black text-white block">
                      {item.judulTahap}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 transition-all"
                  aria-label="Lihat Rincian 5 Tahap"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Pesan Doa / Niat */}
              {item.pesanDoa && (
                <p className="text-xs text-emerald-200/90 italic bg-emerald-950/70 border border-emerald-900 px-3 py-2 rounded-xl">
                  "{item.pesanDoa}"
                </p>
              )}

              {/* ── STEPPER 5 TAHAP VISUAL ─────────────────────────────────── */}
              {isExpanded && (
                <div className="pt-3 border-t border-emerald-900/80 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Alur 5 Tahap Penyaluran Amanah
                    </span>
                    {item.tahapSaatIni === 5 ? (
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                        Selesai 100%
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-600/40">
                        Progres Tahap {item.tahapSaatIni}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-800 before:pointer-events-none">
                    {tahapConfig.map((thp) => {
                      const isPast = thp.nomor < item.tahapSaatIni;
                      const isCurrent = thp.nomor === item.tahapSaatIni;
                      const isUpcoming = thp.nomor > item.tahapSaatIni;

                      return (
                        <div key={thp.nomor} className="relative flex items-start gap-3 pl-1">
                          {/* Lingkaran Stepper */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 flex-shrink-0 transition-all ${
                              isPast
                                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                : isCurrent
                                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 font-black'
                                : 'bg-emerald-950 border border-emerald-800 text-emerald-500'
                            }`}
                          >
                            {isPast ? (
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              thp.nomor
                            )}
                          </div>

                          {/* Konten Tahap */}
                          <div
                            className={`flex-1 rounded-2xl p-3 border transition-all ${
                              isCurrent
                                ? 'bg-emerald-900/70 border-amber-400/80 shadow-md'
                                : isPast
                                ? 'bg-[#05371a]/80 border-emerald-800/80 opacity-90'
                                : 'bg-[#052e16]/40 border-emerald-900/40 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <h5
                                className={`text-sm font-extrabold ${
                                  isCurrent
                                    ? 'text-amber-300'
                                    : isPast
                                    ? 'text-white'
                                    : 'text-emerald-400'
                                }`}
                              >
                                {thp.nomor}. {thp.judul}
                              </h5>

                              {isCurrent && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono">
                                  Aktif
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                              {thp.keterangan}
                            </p>

                            {isCurrent && item.keteranganTahap && (
                              <div className="mt-2 pt-2 border-t border-emerald-700/60 text-xs text-amber-200 bg-emerald-950/60 p-2 rounded-xl">
                                <strong>Pembaruan Terkini:</strong> {item.keteranganTahap}
                              </div>
                            )}

                            {isPast && thp.nomor === 5 && item.tanggalPenyaluranAkhir && (
                              <span className="text-[11px] text-emerald-300 block mt-1">
                                Diserahkan pada: {item.tanggalPenyaluranAkhir}
                              </span>
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

      {/* ── PRINSIP KEADILAN & TRANSPARANSI SYARIAH ────────────────────────── */}
      <div className="bg-[#042614] rounded-3xl p-4 border border-emerald-900/80 space-y-2 text-xs text-emerald-300">
        <div className="flex items-center gap-2 text-white font-extrabold text-sm">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Komitmen Transparansi Amanah Syariah</span>
        </div>
        <p className="leading-relaxed">
          Semua dana hasil konversi poin sampah dicatat dengan prinsip <em>tabarru'</em> (kebajikan bersama) tanpa potongan tersembunyi. Pengadaan dan penyaluran disalurkan langsung ke penerima manfaat yang berhak di wilayah Surabaya.
        </p>
      </div>
    </div>
  );
}
