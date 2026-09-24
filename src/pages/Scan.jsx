/**
 * Scan.jsx — Scan struk dengan OCR Tesseract.js singleton + input manual + input suara
 * Dilengkapi konversi HEIC otomatis, preprocessing gambar canvas (grayscale + kontras),
 * validasi ukuran file, pemisahan input Kamera & Galeri, deteksi confidence field,
 * dan penyimpanan gambar struk terkompresi ke Supabase Storage.
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { scanReceipt, detectCategory, CATEGORY_ICONS } from '../utils/ocr';
import { useExpenses } from '../hooks/useExpenses';
import { useAuth } from '../context/AuthContext';
import { formatRupiah, parseVoiceInput } from '../utils/prediction';
import { todayLocal } from '../utils/date';
import { useToast } from '../context/ToastContext';
import { preprocessImageForOcr, uploadReceiptToStorage } from '../utils/imageProcess';

const CATEGORIES = ['Makanan', 'Minuman', 'Transport', 'Belanja', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Fashion', 'Lainnya'];

const INITIAL_FORM = {
  title: '',
  amount: '',
  category: 'Makanan',
  date: todayLocal(),
  note: '',
};

export default function Scan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { add } = useExpenses();
  const { user } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState(searchParams.get('mode') === 'manual' ? 'manual' : 'scan');
  const [scanning, setScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrFailed, setOcrFailed] = useState(false);
  const [fieldConfidence, setFieldConfidence] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  // Dua input terpisah untuk Kamera dan Galeri / Screenshot
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Setup Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'id-ID';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setVoiceText(transcript);
        parseVoice(transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = (e) => {
        setListening(false);
        toast.error(`Mic Error: ${e.error}. Pastikan izin mikrofon aktif.`);
      };
      recognitionRef.current.onend = () => setListening(false);
    }
  }, []);

  const parseVoice = (transcript) => {
    const parsed = parseVoiceInput(transcript);
    setForm((f) => ({
      ...f,
      title: parsed.title || f.title,
      amount: parsed.amount ? parsed.amount.toString() : f.amount,
      category: parsed.category || f.category,
    }));
    setFieldConfidence({});
    setMode('manual');
  };

  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      toast.error('Browser ini belum mendukung Speech Recognition. Harap gunakan Chrome atau Android.');
      return;
    }
    if (recognitionRef.current) {
      setListening(true);
      setVoiceText('');
      recognitionRef.current.start();
    }
  };

  const resetScan = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setRawFile(null);
    setOcrResult(null);
    setOcrFailed(false);
    setFieldConfidence({});
    setOcrProgress(0);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleFileSelected = async (file) => {
    if (!file) return;

    // 1. Validasi ukuran file (maksimal 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB ya! Mohon pilih foto lain.');
      return;
    }

    resetScan();
    setScanning(true);
    setOcrProgress(5);

    let processedBlob = file;

    // 2. Dukungan format HEIC/HEIF dari iPhone
    const isHeic =
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';

    if (isHeic) {
      try {
        toast.info('Mengonversi foto iPhone (HEIC)...');
        const heic2any = (await import('heic2any')).default;
        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.85,
        });
        processedBlob = Array.isArray(converted) ? converted[0] : converted;
      } catch (err) {
        console.error('Gagal membaca format HEIC:', err);
        setScanning(false);
        toast.error('Gagal memproses format HEIC. Coba gunakan foto berformat JPG atau PNG.');
        return;
      }
    }

    // Buat URL pratinjau
    const localUrl = URL.createObjectURL(processedBlob);
    setPreviewUrl(localUrl);
    setRawFile(processedBlob);

    try {
      setOcrProgress(15);
      // 3. Pre-process gambar di canvas (resize max 1600px, grayscale, kontras diperjelas)
      const optimizedImage = await preprocessImageForOcr(processedBlob);
      setOcrProgress(30);

      // 4. OCR dengan Tesseract singleton
      const result = await scanReceipt(optimizedImage, (p) => {
        // Skala 30% ke 95%
        const normalized = 30 + Math.round(p * 0.65);
        setOcrProgress(Math.min(95, normalized));
      });

      setOcrProgress(100);

      // 5. Cek apakah hasil pembacaan masuk akal
      const hasContent = result.success && (result.amount > 0 || (result.text && result.text.trim().length >= 10));

      if (!hasContent) {
        setOcrFailed(true);
        setOcrResult(null);
      } else {
        setOcrFailed(false);
        setOcrResult(result);
        setFieldConfidence(result.fieldConfidence || {});

        // Pre-fill form (Catatan dibiarkan kosong, BUKAN teks OCR confidence!)
        setForm({
          title: result.storeName && result.storeName !== 'Toko / Resto' && result.storeName !== 'Toko'
            ? result.storeName
            : 'Struk Belanja',
          amount: result.amount ? result.amount.toString() : '',
          category: result.category || 'Makanan',
          date: result.date || todayLocal(),
          note: '',
        });
      }
    } catch (err) {
      console.error('OCR scanning error:', err);
      setOcrFailed(true);
    } finally {
      setScanning(false);
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    const parsedAmount = parseFloat(form.amount);

    if (!form.title.trim()) {
      newErrors.title = 'Keterangan pengeluaran wajib diisi.';
    }

    if (!form.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Nominal harus berupa angka lebih besar dari 0.';
    }

    const todayStr = todayLocal();
    if (form.date && form.date > todayStr) {
      newErrors.date = 'Tanggal transaksi tidak boleh melebihi hari ini.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Mohon periksa kembali kolom yang bertanda merah.');
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      // Unggah gambar struk ke Supabase Storage (jika ada file struk)
      let storageImageUrl = null;
      if (rawFile && user?.id) {
        try {
          storageImageUrl = await uploadReceiptToStorage(rawFile, user.id);
        } catch (uploadErr) {
          console.warn('Lewati upload gambar struk:', uploadErr);
        }
      }

      await add({
        title: form.title.trim(),
        amount: parsedAmount,
        category: form.category,
        date: form.date || todayStr,
        note: form.note || null,
        image: storageImageUrl || null,
      });

      setSaved(true);
      toast.success('Pengeluaran berhasil disimpan!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan pengeluaran. Periksa koneksi internet Anda.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Jika pengguna sudah mengedit, hilangkan peringatan 'Cek lagi ya' untuk field tersebut
    if (fieldConfidence[field]) {
      setFieldConfidence((prev) => ({ ...prev, [field]: 'high' }));
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B1E36] via-[#123E6B] to-[#1E40AF] px-4 pt-12 pb-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-400/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white hover:bg-white/25 transition-all active:scale-95 border border-white/20"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Catat Pengeluaran</h1>
            <p className="text-white/60 text-xs mt-0.5">Scan struk fisik, QRIS, atau catat manual</p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-white/15 rounded-2xl p-1 gap-1">
          {[
            { id: 'scan', label: '📸 Scan Struk' },
            { id: 'manual', label: '✏️ Manual' },
            { id: 'voice', label: '🎙️ Suara' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => {
                setMode(tab.id);
                setOcrFailed(false);
              }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === tab.id ? 'bg-white text-primary shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* SCAN MODE */}
        {mode === 'scan' && (
          <div className="space-y-4">
            {/* Hidden Inputs Terpisah: Kamera & Galeri */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0])}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0])}
            />

            {!previewUrl ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-primary/30 p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">
                  🧾
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">Ambil Foto atau Upload Struk</h3>
                  <p className="text-gray-400 text-xs mt-1">Mendukung format JPG, PNG, HEIC iPhone (maks. 10MB)</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-3 px-2 sm:px-4 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm shadow-sm hover:bg-primary-dark active:scale-95 transition-all"
                  >
                    <span>📸</span> <span>Foto Struk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-3 px-2 sm:px-4 rounded-xl bg-blue-50 text-primary border border-primary/20 font-semibold text-xs sm:text-sm hover:bg-blue-100 active:scale-95 transition-all"
                  >
                    <span>🖼️</span> <span>Galeri / File</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-3 shadow-card border border-white/60 space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-gray-900/5 max-h-60 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview struk"
                    className="w-full max-h-60 object-contain"
                  />
                  {!scanning && (
                    <button
                      onClick={resetScan}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1.5 rounded-lg backdrop-blur-sm transition-all"
                    >
                      Ganti Foto ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Loading / OCR Progress */}
            {scanning && (
              <div className="bg-white rounded-2xl p-4 shadow-card border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {ocrProgress < 25 ? 'Menyiapkan gambar...' : ocrProgress < 40 ? 'Menganalisis teks...' : 'Mengekstrak total & rincian...'}
                    </p>
                    <p className="text-xs text-primary font-medium">{ocrProgress}% selesai</p>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* OCR GAGAL — Pesan Ramah & 2 Tombol Tindakan */}
            {ocrFailed && !scanning && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3 text-center animate-fade-in">
                <span className="text-3xl block">🔍</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Struk kurang jelas terbaca</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Struk kurang jelas, coba foto ulang dengan pencahayaan cukup atau isi manual ya.
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={resetScan}
                    className="flex-1 py-2.5 px-3 bg-white border border-amber-300 text-amber-900 rounded-xl text-xs font-semibold hover:bg-amber-100/50 transition-all active:scale-95"
                  >
                    🔄 Scan Ulang
                  </button>
                  <button
                    onClick={() => {
                      setOcrFailed(false);
                      setMode('manual');
                    }}
                    className="flex-1 py-2.5 px-3 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-all active:scale-95"
                  >
                    ✏️ Isi Manual
                  </button>
                </div>
              </div>
            )}

            {/* OCR Berhasil Info */}
            {ocrResult && !scanning && !ocrFailed && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="font-bold text-emerald-800 text-xs">Struk berhasil dibaca!</p>
                    <p className="text-[11px] text-emerald-600">Periksa detail di bawah sebelum menyimpan.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetScan}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 bg-emerald-100/60 rounded-lg"
                >
                  Scan Lain
                </button>
              </div>
            )}
          </div>
        )}

        {/* VOICE MODE */}
        {mode === 'voice' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-8 shadow-card border border-white/60 text-center">
              <button
                id="btn-start-voice"
                onClick={startVoice}
                disabled={listening}
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-4xl mx-auto mb-4 transition-all duration-300 shadow-lg active:scale-95 ${
                  listening
                    ? 'bg-red-100 border-4 border-danger animate-pulse-soft'
                    : 'bg-primary/10 border-4 border-primary hover:bg-primary/20'
                }`}
              >
                🎙️
              </button>
              <p className="font-bold text-gray-700">
                {listening ? 'Mendengarkan...' : 'Tekan untuk bicara'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Contoh: <em>"Makan siang 15000"</em> atau <em>"Grab 25 ribu"</em>
              </p>
              {voiceText && (
                <div className="mt-4 bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-600 font-medium">"{voiceText}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FORM DETAIL PENGELUARAN */}
        {(mode === 'manual' || (ocrResult && mode === 'scan' && !ocrFailed)) && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 text-sm">Rincian Pengeluaran</h2>
              {mode === 'scan' && (
                <span className="text-[11px] text-gray-400 font-medium">Hasil Pembacaan Struk</span>
              )}
            </div>

            {/* Keterangan / Merchant */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">Keterangan / Toko *</label>
                {fieldConfidence.merchant === 'low' && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                    ⚠️ Cek lagi ya
                  </span>
                )}
              </div>
              <input
                id="input-title"
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Contoh: Warung Bu Sri, Indomaret"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all bg-gray-50 ${
                  errors.title
                    ? 'border-danger focus:ring-2 focus:ring-danger/30'
                    : fieldConfidence.merchant === 'low'
                    ? 'border-amber-300 focus:ring-2 focus:ring-amber-200'
                    : 'border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-danger font-medium mt-1.5 flex items-center gap-1">
                  ⚠️ {errors.title}
                </p>
              )}
            </div>

            {/* Nominal / Jumlah */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">Total Pengeluaran (Rp) *</label>
                {fieldConfidence.amount === 'low' && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                    ⚠️ Cek lagi ya
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">Rp</span>
                <input
                  id="input-amount"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={form.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0"
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all bg-gray-50 font-bold text-gray-800 ${
                    errors.amount
                      ? 'border-danger focus:ring-2 focus:ring-danger/30'
                      : fieldConfidence.amount === 'low'
                      ? 'border-amber-300 focus:ring-2 focus:ring-amber-200'
                      : 'border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary'
                  }`}
                />
              </div>
              {errors.amount ? (
                <p className="text-xs text-danger font-medium mt-1.5 flex items-center gap-1">
                  ⚠️ {errors.amount}
                </p>
              ) : form.amount ? (
                <p className="text-xs text-primary font-semibold mt-1 ml-1">
                  {formatRupiah(parseFloat(form.amount) || 0)}
                </p>
              ) : null}
            </div>

            {/* Kategori */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">Kategori</label>
                {fieldConfidence.category === 'low' && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                    ⚠️ Cek lagi ya
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    id={`cat-${cat.toLowerCase()}`}
                    onClick={() => handleChange('category', cat)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all duration-150 active:scale-95 ${
                      form.category === cat
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-primary/30'
                    }`}
                  >
                    {CATEGORY_ICONS[cat] || '💳'} {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600">Tanggal Transaksi</label>
                {fieldConfidence.date === 'low' && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                    ⚠️ Cek lagi ya
                  </span>
                )}
              </div>
              <input
                id="input-date"
                type="date"
                max={todayLocal()}
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all bg-gray-50 ${
                  errors.date
                    ? 'border-danger focus:ring-2 focus:ring-danger/30'
                    : fieldConfidence.date === 'low'
                    ? 'border-amber-300 focus:ring-2 focus:ring-amber-200'
                    : 'border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary'
                }`}
              />
              {errors.date && (
                <p className="text-xs text-danger font-medium mt-1.5 flex items-center gap-1">
                  ⚠️ {errors.date}
                </p>
              )}
            </div>

            {/* Catatan (Hanya catatan asli pengguna, TIDAK dicemari teks OCR confidence) */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Catatan Tambahan (opsional)</label>
              <textarea
                id="input-note"
                value={form.note}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="Catatan kecil pengeluaran ini..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50 resize-none"
              />
            </div>

            {/* Tombol Simpan */}
            {saved ? (
              <div className="bg-success rounded-2xl p-4 text-white text-center font-bold animate-bounce-in">
                ✅ Pengeluaran tersimpan! Mengalihkan...
              </div>
            ) : (
              <button
                id="btn-simpan"
                type="button"
                onClick={handleSave}
                disabled={saving || !form.title || !form.amount}
                className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
                  form.title && form.amount && !saving
                    ? 'bg-primary text-white shadow-md hover:bg-primary-dark'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Simpan Pengeluaran</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Tips Scan Mahasiswa */}
        {mode === 'scan' && !previewUrl && !scanning && (
          <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
              <span>💡</span> Tips Scan Struk Jernih
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>• Letakkan struk di permukaan datar dengan pencahayaan terang.</li>
              <li>• Pastikan bagian TOTAL atau rincian harga tidak terpotong.</li>
              <li>• Untuk struk e-wallet (GoPay, OVO, ShopeePay), gunakan screenshot penuh.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
