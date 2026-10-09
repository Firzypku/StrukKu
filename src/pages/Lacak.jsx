/**
 * Lacak.jsx — Halaman Pelacakan Penyaluran Sumbangan Syariah GREENWORTH Surabaya
 * Bersih, modern, dan transparan (Hijau + Putih + Emas).
 * Menampilkan pelacakan 5 tahap penyaluran dari poin sampah menjadi dampak nyata.
 */

import { useState } from 'react';
import {
  Compass,
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
    <div className="space-y-6 animate-fade-in">
      {/* ── HEADER BANNER BERSIH ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#065F46] to-[#047857] p-5 rounded-3xl text-white shadow-lg shadow-emerald-900/10">
        <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4 text-amber-300" />
          <span>Amanah & Transparansi Syariah</span>
        </div>
        <h2 className="text-lg font-black text-white">
          Lacak Penyaluran Berkah Nyata
        </h2>
        <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
          Dari sampah menjadi berkah jariyah. Pantau 5 tahap penyaluran poin wakaf dan sedekahmu secara transparan hingga memberi dampak nyata bagi warga Surabaya.
        </p>
      </div>

      {/* ── KARTU SALDO POIN SIAP DISUMBANGKAN (PUTIH BERSIH) ───────────────── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
            Saldo Poin Tersedia
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-amber-700">
              {ringkasan.saldoPoin.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-bold text-slate-700">Poin</span>
            <span className="text-xs text-slate-400 font-semibold">
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
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs active:scale-95 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 border border-amber-300"
        >
          <HeartHandshake className="w-4 h-4 stroke-[2.5]" />
          <span>{bukaFormDonasi ? 'Tutup Form' : 'Sumbang'}</span>
        </button>
      </div>

      {/* ── NOTIFIKASI SUKSES ──────────────────────────────────────────────── */}
      {pesanSukses && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-4 text-slate-800 shadow-md">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-black text-emerald-950">
                Jazakallahu Khairan! Sumbangan Diterima
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Kamu telah menyumbangkan <strong>{pesanSukses.poin} Poin</strong> (Rp {pesanSukses.rupiah.toLocaleString('id-ID')}) ke pos <strong>{pesanSukses.namaPos}</strong>. Poin kini masuk <strong>Tahap 1 (Penerimaan Sumbangan)</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── FORMULIR SUMBANG POIN (KARTU PUTIH BERSIH) ──────────────────────── */}
      {bukaFormDonasi && (
        <form
          onSubmit={handleDonasiSubmit}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xl space-y-4 animate-fade-in"
        >
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Sumbangkan Poin Sampah
              </h3>
              <p className="text-xs text-slate-500">
                1 Poin bernilai Rp {NILAI_POIN} dana sosial syariah
              </p>
            </div>
            <Gift className="w-5 h-5 text-amber-600" />
          </div>

          {errorDonasi && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorDonasi}</span>
            </div>
          )}

          {/* 1. Pilih Pos Sumbangan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Pilih Pos Sumbangan
            </label>
            <div className="space-y-2">
              {posSumbanganList.map((pos) => (
                <div
                  key={pos.id}
                  onClick={() => setPosTerpilihId(pos.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    posTerpilihId === pos.id
                      ? 'bg-emerald-50 border-2 border-emerald-600 ring-2 ring-emerald-500/10'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300">
                      {pos.kategori}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Pengelola: {pos.lembagaPengelola.split('(')[0]}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-1">
                    {pos.nama}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {pos.manfaatRingkas}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Jumlah Poin yang Disumbangkan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Jumlah Poin yang Disumbangkan
              </label>
              <span className="text-xs font-bold text-emerald-800">
                Saldo: {ringkasan.saldoPoin} Poin
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.max(1, (Number(prev) || 0) - 5))}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-black text-lg active:scale-95 transition-all"
              >
                -5
              </button>
              <input
                type="number"
                min="1"
                max={ringkasan.saldoPoin}
                value={poinDonasi}
                onChange={(e) => setPoinDonasi(Math.max(1, parseInt(e.target.value) || 0))}
                className="flex-1 bg-slate-50 border border-slate-200 text-center text-slate-900 text-xl font-black rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setPoinDonasi((prev) => Math.min(ringkasan.saldoPoin, (Number(prev) || 0) + 5))}
                className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-black text-lg active:scale-95 transition-all"
              >
                +5
              </button>
            </div>

            {/* Opsi Cepat */}
            <div className="flex items-center gap-2 pt-1">
              {[5, 10, 25].map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={ringkasan.saldoPoin < p}
                  onClick={() => setPoinDonasi(p)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                    poinDonasi === p
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 disabled:opacity-40'
                  }`}
                >
                  {p} Poin
                </button>
              ))}
              <button
                type="button"
                disabled={ringkasan.saldoPoin <= 0}
                onClick={() => setPoinDonasi(ringkasan.saldoPoin)}
                className="flex-1 py-1.5 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 disabled:opacity-40"
              >
                Semua ({ringkasan.saldoPoin})
              </button>
            </div>

            {/* Nilai Bantuan Rupiah */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-500">Nilai Bantuan:</span>
              <span className="text-sm font-black text-emerald-800">
                Rp {((Number(poinDonasi) || 0) * NILAI_POIN).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* 3. Pesan / Niat Doa */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Pesan atau Niat Doa (Opsional)
            </label>
            <input
              type="text"
              value={pesanDoa}
              onChange={(e) => setPesanDoa(e.target.value)}
              placeholder="Contoh: Semoga berkah dan bermanfaat bagi sesama"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-2xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={ringkasan.saldoPoin <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-98 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-300 disabled:opacity-50"
          >
            <HeartHandshake className="w-5 h-5 stroke-[2.5]" />
            <span>Kirim Sumbangan Sekarang</span>
          </button>
        </form>
      )}

      {/* ── DAFTAR SUMBANGAN & STEPPER 5 TAHAP (KARTU PUTIH BERSIH) ─────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Riwayat Penyaluran ({sumbanganList.length})
            </h3>
            <p className="text-xs text-slate-500">
              Pantau progres nyata dari poin yang disumbangkan
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
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
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4"
            >
              {/* Header Kartu */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
                      {posData.kategori}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.id}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 mt-1">
                    {item.namaPos}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lembaga: {item.lembagaPengelola}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-amber-700 block">
                    {item.jumlahPoin} Poin
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    Rp {item.nilaiRupiah.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Status Badge Saat Ini */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                      item.tahapSaatIni === 5
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {item.tahapSaatIni}/5
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Status Saat Ini:
                    </span>
                    <span className="text-sm font-black text-slate-900 block">
                      {item.judulTahap}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all"
                  aria-label="Lihat Rincian 5 Tahap"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {item.pesanDoa && (
                <p className="text-xs text-slate-600 italic bg-slate-50/80 border border-slate-100 px-3 py-2 rounded-xl">
                  "{item.pesanDoa}"
                </p>
              )}

              {/* ── STEPPER 5 TAHAP VISUAL (ELEGAN) ─────────────────────────── */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Alur 5 Tahap Penyaluran
                    </span>
                    {item.tahapSaatIni === 5 ? (
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Selesai 100%
                      </span>
                    ) : (
                      <span className="text-xs font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300">
                        Progres Tahap {item.tahapSaatIni}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:pointer-events-none">
                    {tahapConfig.map((thp) => {
                      const isPast = thp.nomor < item.tahapSaatIni;
                      const isCurrent = thp.nomor === item.tahapSaatIni;

                      return (
                        <div key={thp.nomor} className="relative flex items-start gap-3 pl-1">
                          {/* Lingkaran Stepper */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black z-10 flex-shrink-0 transition-all ${
                              isPast
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : isCurrent
                                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20'
                                : 'bg-white border-2 border-slate-300 text-slate-400'
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
                                ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                                : isPast
                                ? 'bg-slate-50 border-slate-200'
                                : 'bg-slate-50/40 border-slate-100 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <h5
                                className={`text-sm font-black ${
                                  isCurrent
                                    ? 'text-amber-900'
                                    : isPast
                                    ? 'text-slate-900'
                                    : 'text-slate-400'
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

                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {thp.keterangan}
                            </p>

                            {isCurrent && item.keteranganTahap && (
                              <div className="mt-2 pt-2 border-t border-amber-200 text-xs text-amber-900 bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                                <strong>Pembaruan:</strong> {item.keteranganTahap}
                              </div>
                            )}

                            {isPast && thp.nomor === 5 && item.tanggalPenyaluranAkhir && (
                              <span className="text-[11px] text-emerald-800 font-bold block mt-1">
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

      {/* ── KOMITMEN AMANAH SYARIAH ────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Komitmen Transparansi Amanah Syariah</span>
        </div>
        <p className="leading-relaxed">
          Semua dana hasil konversi poin sampah disalurkan dengan prinsip <em>tabarru'</em> tanpa potongan tersembunyi langsung ke penerima manfaat yang berhak di Surabaya.
        </p>
      </div>
    </div>
  );
}
