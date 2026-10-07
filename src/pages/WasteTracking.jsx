/**
 * WasteTracking.jsx — Pelacakan Live Jejak Sampah Sirkular (Surabaya Live Tracker)
 * Fitur pelacakan riil posisi sampah: Titik Drop Kedai Kopi -> Armada Listrik -> Pabrik SIER -> Poin & Wakaf
 * Sesuai blueprint GreenWorth & arsitektur StrukKu (Tema Hijau + Putih + Emas).
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Search,
  Truck,
  MapPin,
  Recycle,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  ShieldCheck,
  Building2,
  Coffee,
  Package,
  Share2,
  Copy,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Coins,
  HeartHandshake,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { formatRupiah } from '../utils/prediction';

// Data simulasi batch sampah aktif di wilayah Surabaya
const SAMPLE_BATCHES = [
  {
    id: 'GW-SBY-2026-081',
    material: 'Gelas Plastik PP / rPET',
    sourceName: 'Titik Kumpul Coffee Tunjungan',
    sourceArea: 'Surabaya Pusat',
    targetFacility: 'PT Eco Plastindo Sirkular Jatim (SIER Rungkut)',
    submittedAt: '07 Okt 2026, 14:20 WIB',
    itemCount: 35,
    unit: 'Gelas',
    weightKg: 0.42,
    purityScore: '96.5%',
    earnedPoints: 36,
    earnedRupiah: 3600,
    waqfAllocation: 'Masjid & Resirkulasi Wudhu (BAZNAS Jatim)',
    currentStage: 2, // 1: Drop, 2: Transit, 3: Pabrik, 4: Poin, 5: Selesai/Wakaf
    currentStatusLabel: 'Dalam Perjalanan Armada Kargo Listrik',
    currentLocation: 'Jl. Raya Darmo (Menuju Wonokromo - Rungkut)',
    courierName: 'Pak Joko Sudarmo (Van Listrik #03)',
    eta: '25 Menit lagi ke Fasilitas SIER',
    stages: [
      {
        stage: 1,
        title: 'Disetor di Dropbox Kedai Kopi',
        desc: 'Sampah disortir bersih di Titik Kumpul Coffee, Jl. Tunjungan No. 42.',
        time: '07 Okt 2026, 14:20 WIB',
        location: 'Surabaya Pusat',
        completed: true,
      },
      {
        stage: 2,
        title: 'Pengangkutan Armada Hijau (Nol Emisi)',
        desc: 'Diangkut oleh Van Listrik #03 dengan timbangan digital terkalibrasi.',
        time: '07 Okt 2026, 15:45 WIB',
        location: 'Jl. Raya Darmo (Dalam Transit)',
        completed: true,
        active: true,
      },
      {
        stage: 3,
        title: 'Fasilitas Daur Ulang SIER Rungkut',
        desc: 'Pembersihan 85°C & pencacahan menjadi granul serpihan rPET food-grade.',
        time: 'Estimasi: 07 Okt 2026, 16:30 WIB',
        location: 'Kawasan Industri SIER Rungkut',
        completed: false,
      },
      {
        stage: 4,
        title: 'Konversi Nilai & Pencairan Poin',
        desc: '+36 Poin dikreditkan ke dompet pelanggan (1 Poin = Rp 100).',
        time: 'Menunggu proses tahap 3',
        location: 'Sistem Ledger StrukKu',
        completed: false,
      },
      {
        stage: 5,
        title: 'Penyaluran Wakaf Produktif (25%)',
        desc: 'Alokasi Rp 900 disalurkan ke proyek Resirkulasi Air Wudhu Masjid BAZNAS Jatim.',
        time: 'Menunggu penyaluran',
        location: 'BAZNAS Provinsi Jawa Timur',
        completed: false,
      },
    ],
  },
  {
    id: 'GW-SBY-2026-094',
    material: 'Kardus Boks Makanan (OCC)',
    sourceName: 'Sentra Kuliner UMKM Taman Bungkul',
    sourceArea: 'Surabaya Selatan',
    targetFacility: 'PT Surabaya Mekabox Pulp Mill',
    submittedAt: '07 Okt 2026, 10:15 WIB',
    itemCount: 18,
    unit: 'Boks Kardus',
    weightKg: 2.7,
    purityScore: '98.0%',
    earnedPoints: 76,
    earnedRupiah: 7600,
    waqfAllocation: 'Beasiswa Santri Yatim (BAZNAS Jatim)',
    currentStage: 3,
    currentStatusLabel: 'Sedang Diproses & Dicacah di Pabrik SIER',
    currentLocation: 'Kawasan Industri SIER Rungkut Surabaya',
    courierName: 'Armada Pengangkut Mitra #01',
    eta: 'Sedang Proses Pencacahan & Pengepresan',
    stages: [
      {
        stage: 1,
        title: 'Disetor di Dropbox UMKM Bungkul',
        desc: 'Kardus kemasan dipres pipih di Sentra Kuliner Bungkul.',
        time: '07 Okt 2026, 10:15 WIB',
        location: 'Surabaya Selatan',
        completed: true,
      },
      {
        stage: 2,
        title: 'Penjemputan Armada Listrik',
        desc: 'Timbangan 2.7 kg tercatat dan divalidasi barcode kurir.',
        time: '07 Okt 2026, 11:30 WIB',
        location: 'Jl. Darmo - SIER',
        completed: true,
      },
      {
        stage: 3,
        title: 'Pencacahan Bubur Kertas (Pulp)',
        desc: 'Kardus diproses hidropulper menjadi bahan daur ulang ramah lingkungan.',
        time: '07 Okt 2026, 13:00 WIB',
        location: 'Pabrik Pengolahan SIER',
        completed: true,
        active: true,
      },
      {
        stage: 4,
        title: 'Kredit Poin Otomatis',
        desc: '+76 Poin (Rp 7.600) sukses terverifikasi.',
        time: 'Estimasi: 07 Okt 2026, 17:00 WIB',
        location: 'Sistem Ledger StrukKu',
        completed: false,
      },
      {
        stage: 5,
        title: 'Alokasi Wakaf Produktif Terverifikasi',
        desc: 'Tersalurkan untuk beasiswa pendidikan santri yatim BAZNAS Jatim.',
        time: 'Estimasi: 08 Okt 2026',
        location: 'Panti Asuhan Al-Ikhlas Surabaya',
        completed: false,
      },
    ],
  },
  {
    id: 'GW-SBY-2026-072',
    material: 'Gelas Plastik Cold Brew (PP)',
    sourceName: 'Kopilur Roastery Rungkut',
    sourceArea: 'Surabaya Timur',
    targetFacility: 'PT Eco Plastindo Sirkular Jatim',
    submittedAt: '06 Okt 2026, 16:00 WIB',
    itemCount: 50,
    unit: 'Gelas',
    weightKg: 0.60,
    purityScore: '99.1%',
    earnedPoints: 51,
    earnedRupiah: 5100,
    waqfAllocation: 'Tanggap Bencana Banjir Kali Lamong',
    currentStage: 5,
    currentStatusLabel: 'Selesai Didaur Ulang & Wakaf Tersalurkan Penuh ✅',
    currentLocation: 'Proyek Selesai — Sertifikat Dampak BAZNAS Terbit',
    courierName: 'Kargo Hijau Wilayah Timur',
    eta: 'Tuntas 100% (Siklus Sirkular Ditutup)',
    stages: [
      {
        stage: 1,
        title: 'Disetor di Kopilur Roastery',
        desc: '50 cangkir bersih diterima barista Kopilur Rungkut.',
        time: '06 Okt 2026, 16:00 WIB',
        location: 'Surabaya Timur',
        completed: true,
      },
      {
        stage: 2,
        title: 'Kargo Listrik Menjemput',
        desc: 'Muatan diangkut aman menuju sentra SIER.',
        time: '06 Okt 2026, 17:10 WIB',
        location: 'SIER Rungkut',
        completed: true,
      },
      {
        stage: 3,
        title: 'Konversi Granul rPET Murni',
        desc: 'Bahan baku telah dibeli oleh pabrik botol daur ulang lokal.',
        time: '06 Okt 2026, 19:45 WIB',
        location: 'SIER Rungkut',
        completed: true,
      },
      {
        stage: 4,
        title: 'Poin Masuk ke Saldo Member',
        desc: '+51 Poin telah diterima pengguna & berhasil ditukarkan.',
        time: '06 Okt 2026, 20:00 WIB',
        location: 'Dompet Poin StrukKu',
        completed: true,
      },
      {
        stage: 5,
        title: 'Dana Wakaf Ditransfer ke BAZNAS Jatim',
        desc: 'Rp 1.275 disalurkan untuk tandon air bersih tanggap bencana.',
        time: '07 Okt 2026, 09:00 WIB',
        location: 'Sentra Logistik BAZNAS Jawa Timur',
        completed: true,
      },
    ],
  },
];

export default function WasteTracking() {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchId, setSearchId] = useState('');
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);
  const [batches, setBatches] = useState(SAMPLE_BATCHES);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeBatch = batches[activeBatchIndex];

  // Pencarian Resi / Tracking ID
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    if (!query) {
      toast.info('Masukkan kode resi tracking, contoh: GW-SBY-2026-081');
      return;
    }

    const foundIdx = batches.findIndex(
      (b) => b.id.toUpperCase().includes(query) || b.sourceName.toLowerCase().includes(query.toLowerCase())
    );

    if (foundIdx !== -1) {
      setActiveBatchIndex(foundIdx);
      toast.success(`Ditemukan data resi: ${batches[foundIdx].id}`);
    } else {
      toast.error(`Resi "${query}" tidak ditemukan. Coba pilih salah satu batch contoh di bawah.`);
    }
  };

  // Salin Resi
  const handleCopyResi = (id) => {
    navigator.clipboard?.writeText(id);
    toast.success(`Kode resi ${id} disalin ke clipboard!`);
  };

  // Bagikan Jejak ke WhatsApp
  const handleShareWa = () => {
    const text =
      `♻️ *LIVE TRACKING SAMPAH SIRKULAR (GREENWORTH SURABAYA)*\n` +
      `No. Resi: *${activeBatch.id}*\n` +
      `📦 Material: ${activeBatch.material} (${activeBatch.itemCount} ${activeBatch.unit} / ${activeBatch.weightKg} kg)\n` +
      `📍 Sumber: ${activeBatch.sourceName} (${activeBatch.sourceArea})\n` +
      `🚚 Status Saat Ini: *${activeBatch.currentStatusLabel}*\n` +
      `📍 Posisi Terkini: ${activeBatch.currentLocation}\n` +
      `🏭 Tujuan: ${activeBatch.targetFacility}\n` +
      `💰 Nilai Poin: ${activeBatch.earnedPoints} Poin (${formatRupiah(activeBatch.earnedRupiah)})\n` +
      `🕌 Alokasi Wakaf: ${activeBatch.waqfAllocation}\n\n` +
      `Lacak langsung di: https://greenworth-surabaya.vercel.app/tracking?id=${activeBatch.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Simulasi Pergerakan Tahap (Maju 1 tahap untuk demonstrasi interaktif)
  const handleSimulateNextStage = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setBatches((prev) => {
        const updated = [...prev];
        const cur = { ...updated[activeBatchIndex] };
        if (cur.currentStage < 5) {
          cur.currentStage += 1;
          const nextStageNum = cur.currentStage;
          cur.stages = cur.stages.map((st) => ({
            ...st,
            completed: st.stage <= nextStageNum,
            active: st.stage === nextStageNum,
          }));

          if (nextStageNum === 3) {
            cur.currentStatusLabel = 'Tiba di Fasilitas Daur Ulang SIER Rungkut';
            cur.currentLocation = 'Kawasan Industri SIER Rungkut (Sedang Dicuci & Dicacah)';
            cur.eta = 'Sedang diproses dalam mesin pembersih suhu 85°C';
          } else if (nextStageNum === 4) {
            cur.currentStatusLabel = 'Bahan Baku Terjual & Poin Dikreditkan!';
            cur.currentLocation = 'Sistem Ledger StrukKu (+Poin Sukses Masuk)';
            cur.eta = 'Poin siap ditukarkan voucher kopi atau e-wallet';
          } else if (nextStageNum === 5) {
            cur.currentStatusLabel = 'Selesai Didaur Ulang & Wakaf Tersalurkan Penuh ✅';
            cur.currentLocation = 'BAZNAS Jawa Timur (Proyek Bermanfaat Nyata)';
            cur.eta = 'Siklus sirkular ditutup 100%';
          }
          updated[activeBatchIndex] = cur;
          toast.success(`Status sampah berhasil diperbarui ke Tahap ${nextStageNum}! 🚀`);
        } else {
          toast.info('Batch ini sudah mencapai tahap penyaluran akhir 100%!');
        }
        return updated;
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* ── HEADER BANNER ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#059669] px-4 pt-12 pb-6 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Kembali"
              className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white hover:bg-white/25 transition-all active:scale-95 border border-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                  Surabaya Live GPS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tight mt-0.5">
                Pelacakan Sampah Sirkular
              </h1>
            </div>
          </div>

          <button
            onClick={handleShareWa}
            className="w-9 h-9 bg-white/15 hover:bg-white/25 active:scale-95 rounded-xl flex items-center justify-center text-white border border-white/20 shadow-sm"
            title="Bagikan ke WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-emerald-100 text-xs leading-relaxed max-w-sm">
          Pantau posisi sampahmu secara live: dari meja kedai kopi Surabaya, armada kargo listrik, hingga pabrik SIER Rungkut & dana wakaf.
        </p>

        {/* ── FORM PENCARIAN RESI ────────────────────────────────────────────── */}
        <form onSubmit={handleSearch} className="mt-4 relative z-10">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Cari No. Resi (contoh: GW-SBY-2026-081)..."
              className="w-full bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl pl-10 pr-24 py-2.5 text-xs text-white placeholder-emerald-100/60 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1"
            >
              <span>Lacak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* ── PILIHAN BATCH AKTIF (TABS CEPAT) ─────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Batch Aktif di Surabaya
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {batches.length} Resi Terdata
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {batches.map((batch, idx) => (
              <button
                key={batch.id}
                onClick={() => setActiveBatchIndex(idx)}
                className={`flex-shrink-0 text-left p-3 rounded-2xl border transition-all active:scale-98 max-w-[240px] ${
                  activeBatchIndex === idx
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                    activeBatchIndex === idx ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {batch.id}
                  </span>
                  <span className={`text-[10px] font-bold ${
                    activeBatchIndex === idx ? 'text-emerald-200' : 'text-emerald-600'
                  }`}>
                    Tahap {batch.currentStage}/5
                  </span>
                </div>
                <p className="text-xs font-bold truncate">{batch.sourceName}</p>
                <p className={`text-[11px] truncate mt-0.5 ${
                  activeBatchIndex === idx ? 'text-emerald-100' : 'text-slate-500'
                }`}>
                  {batch.itemCount} {batch.unit} ({batch.weightKg} kg)
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── KARTU STATUS UTAMA & LOKASI REALTIME ────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 space-y-4">
          {/* Header Resi & Salin */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400">Nomor Resi Pelacakan:</span>
                <span className="text-xs font-black text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                  {activeBatch.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyResi(activeBatch.id)}
                  className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                  title="Salin Resi"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <h2 className="text-base font-black text-slate-900 mt-1 flex items-center gap-1.5">
                {activeBatch.material.includes('Gelas') ? (
                  <Coffee className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Package className="w-5 h-5 text-amber-500 flex-shrink-0" />
                )}
                <span>{activeBatch.material}</span>
              </h2>
            </div>

            <span className={`text-[11px] font-black px-2.5 py-1 rounded-full whitespace-nowrap shadow-xs ${
              activeBatch.currentStage === 5
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
            }`}>
              {activeBatch.currentStage === 5 ? '✓ Selesai 100%' : 'Sedang Bergerak'}
            </span>
          </div>

          {/* Banner Status Posisi Saat Ini */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
                {activeBatch.currentStage >= 4 ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : activeBatch.currentStage === 3 ? (
                  <Recycle className="w-5 h-5 animate-spin" />
                ) : (
                  <Truck className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Status Terkini
                </span>
                <h3 className="text-sm font-black text-emerald-950 leading-tight mt-0.5">
                  {activeBatch.currentStatusLabel}
                </h3>
                <p className="text-xs text-emerald-800 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span className="truncate font-semibold">{activeBatch.currentLocation}</span>
                </p>
              </div>
            </div>

            {/* Info Armada / Pengemudi */}
            <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-emerald-700 block">Armada / Kurir:</span>
                <span className="font-bold text-emerald-950 truncate block">{activeBatch.courierName}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 block">Estimasi Waktu:</span>
                <span className="font-bold text-emerald-950 truncate block">{activeBatch.eta}</span>
              </div>
            </div>
          </div>

          {/* Mini Visual Peta Jalur Surabaya */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                KORIDOR SIRKULAR SURABAYA
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Peta Rute #01</span>
            </div>

            {/* Route Points Diagram */}
            <div className="relative flex items-center justify-between px-2 py-3">
              <div className="absolute left-6 right-6 h-0.5 bg-slate-700" />
              <div
                className="absolute left-6 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-700"
                style={{ width: `${Math.min(100, (activeBatch.currentStage / 5) * 100)}%` }}
              />

              {/* Point 1: Kedai */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeBatch.currentStage >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  1
                </div>
                <span className="text-[9px] text-slate-300 font-semibold mt-1">Kedai</span>
              </div>

              {/* Point 2: Armada */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeBatch.currentStage >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  2
                </div>
                <span className="text-[9px] text-slate-300 font-semibold mt-1">Armada</span>
              </div>

              {/* Point 3: SIER */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeBatch.currentStage >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  3
                </div>
                <span className="text-[9px] text-slate-300 font-semibold mt-1">Pabrik</span>
              </div>

              {/* Point 4: Poin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeBatch.currentStage >= 4 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-700 text-slate-400'
                }`}>
                  4
                </div>
                <span className="text-[9px] text-slate-300 font-semibold mt-1">Poin</span>
              </div>

              {/* Point 5: Wakaf */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeBatch.currentStage >= 5 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-700 text-slate-400'
                }`}>
                  5
                </div>
                <span className="text-[9px] text-slate-300 font-semibold mt-1">Wakaf</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Sumber: {activeBatch.sourceArea}</span>
              <span className="text-amber-300 font-semibold">Tujuan: SIER Rungkut</span>
            </div>
          </div>
        </div>

        {/* ── METRIK NILAI & DAMPAK LINGKUNGAN ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white rounded-2xl p-3 shadow-card border border-slate-100 text-center flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Volume Sampah</span>
            <div className="my-1">
              <span className="text-base font-black text-slate-900">{activeBatch.weightKg}</span>
              <span className="text-[10px] text-slate-500 block">kg (~{activeBatch.itemCount} item)</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded py-0.5">
              Skor: {activeBatch.purityScore}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow-card border border-slate-100 text-center flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Reward Didapat</span>
            <div className="my-1">
              <span className="text-base font-black text-emerald-700">+{activeBatch.earnedPoints}</span>
              <span className="text-[10px] text-slate-500 block">Poin</span>
            </div>
            <span className="text-[9px] font-bold text-amber-800 bg-amber-50 rounded py-0.5">
              {formatRupiah(activeBatch.earnedRupiah)}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow-card border border-slate-100 text-center flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Alokasi Wakaf</span>
            <div className="my-1">
              <span className="text-base font-black text-amber-600">25%</span>
              <span className="text-[10px] text-slate-500 block">Permanen</span>
            </div>
            <span className="text-[9px] font-bold text-slate-700 bg-slate-100 rounded py-0.5 truncate px-1">
              BAZNAS Jatim
            </span>
          </div>
        </div>

        {/* ── 5-STAGE TIMELINE (PERJALANAN DETAIL SAMPAH) ────────────────────── */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-sm">Jejak 5 Tahap Pengolahan</h3>
              <p className="text-[11px] text-slate-500">Transparansi penuh rantai pasok daur ulang</p>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-xl">
              Audit Verifikasi
            </span>
          </div>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activeBatch.stages.map((st) => (
              <div key={st.stage} className="relative">
                {/* Node Bullet */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    st.completed
                      ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                      : st.active
                      ? 'bg-amber-500 text-slate-950 shadow-sm ring-4 ring-amber-100 animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {st.completed ? '✓' : st.stage}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold leading-tight ${
                      st.completed ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {st.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {st.time.includes('WIB') ? st.time.split(',')[1] : st.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {st.desc}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{st.location}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOMBOL AKSI INTERAKTIF ─────────────────────────────────────────── */}
        <div className="space-y-2.5 pt-1">
          {/* Tombol Simulasikan Pergerakan (Demo Interaktif) */}
          <button
            onClick={handleSimulateNextStage}
            disabled={isSimulating || activeBatch.currentStage >= 5}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
              activeBatch.currentStage >= 5
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>
              {isSimulating
                ? 'Memperbarui Koordinat & Status...'
                : activeBatch.currentStage >= 5
                ? 'Siklus Sampah Sudah Tuntas 100%'
                : `Simulasikan Pergerakan ke Tahap ${activeBatch.currentStage + 1} 🚀`}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleCopyResi(activeBatch.id)}
              className="py-3 px-3 bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Salin No. Resi</span>
            </button>

            <button
              onClick={handleShareWa}
              className="py-3 px-3 bg-white hover:bg-emerald-50 active:scale-95 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-800 shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Kirim ke WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
