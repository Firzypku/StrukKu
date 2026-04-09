/**
 * Scan.jsx — Scan struk dengan OCR Tesseract.js + input manual + input suara
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { scanReceipt, detectCategory, CATEGORY_ICONS } from '../utils/ocr';
import { useExpenses } from '../hooks/useExpenses';
import { formatRupiah } from '../utils/prediction';

const CATEGORIES = ['Makanan', 'Minuman', 'Transport', 'Belanja', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Fashion', 'Lainnya'];

const INITIAL_FORM = {
  title: '',
  amount: '',
  category: 'Makanan',
  date: new Date().toISOString().split('T')[0],
  note: '',
};

export default function Scan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { add } = useExpenses();

  const [mode, setMode] = useState(searchParams.get('mode') === 'manual' ? 'manual' : 'scan');
  const [scanning, setScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saved, setSaved] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  const fileInputRef = useRef(null);
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
        alert(`Mic Error: ${e.error}. Pastikan izin (permission) mikrofon aktif di browser Anda.`);
      };
      recognitionRef.current.onend = () => setListening(false);
    }
  }, []);

  const parseVoice = (transcript) => {
    const text = transcript.toLowerCase().trim();
    const amountMatch = text.match(/(\d[\d.,]*)\s*(?:ribu|rb|k|juta)?/);
    let amount = '';
    let title = text;

    if (amountMatch) {
      let raw = parseFloat(amountMatch[1].replace(/[.,]/g, ''));
      if (text.includes('ribu') || text.includes(' rb') || text.endsWith('k')) raw *= 1000;
      if (text.includes('juta')) raw *= 1000000;
      amount = raw.toString();
      title = text.replace(amountMatch[0], '').trim();
    }

    setForm((f) => ({
      ...f,
      title: title || f.title,
      amount: amount || f.amount,
      category: detectCategory(title),
    }));
    setMode('manual');
  };

  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Maaf, browser Anda (misalnya Safari/iPhone jadul) tidak mendukung API Perekam Suara ini. Harap gunakan Chrome atau Android.');
      return;
    }
    if (recognitionRef.current) {
      setListening(true);
      setVoiceText('');
      recognitionRef.current.start();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScanning(true);
    setOcrProgress(0);
    setOcrResult(null);
    setSaved(false);

    try {
      const result = await scanReceipt(file, (p) => setOcrProgress(p));
      setOcrResult(result);

      // Pre-fill form
      setForm({
        title: result.storeName || 'Struk Belanja',
        amount: result.amount?.toString() || '',
        category: result.category || 'Lainnya',
        date: result.date || new Date().toISOString().split('T')[0],
        note: `OCR confidence: ${result.confidence}%`,
      });
      setMode('manual');
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.amount) return;

    try {
      setSaved(null); // Loading state if you will
      await add({
        title: form.title,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        note: form.note,
        image: previewUrl || null,
      });

      setSaved(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan pengeluaran. Pastikan koneksi dan database Anda aktif.');
    }
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all">
            ←
          </button>
          <h1 className="text-xl font-bold text-white">Catat Pengeluaran</h1>
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
              onClick={() => setMode(tab.id)}
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
        {/* Scan Mode */}
        {mode === 'scan' && (
          <div className="space-y-4">
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-white rounded-2xl border-2 border-dashed border-primary/30 p-10 flex flex-col items-center gap-4 cursor-pointer hover:border-primary/60 hover:bg-blue-50/50 transition-all duration-200 active:scale-95"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-4xl">
                  📸
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-700">Upload atau Foto Struk</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG, HEIC — max 10MB</p>
                </div>
                <div className="flex gap-3">
                  <span className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold">Pilih File</span>
                  <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold">Kamera</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden shadow-card">
                <img src={previewUrl} alt="Preview struk" className="w-full max-h-64 object-contain bg-gray-50" />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* OCR Progress */}
            {scanning && (
              <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <p className="font-semibold text-gray-700">Memproses struk... {ocrProgress}%</p>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">AI sedang membaca strukmu 🤖</p>
              </div>
            )}

            {/* OCR Success Info */}
            {ocrResult && !scanning && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-bold text-success text-sm">Struk berhasil dibaca!</p>
                    <p className="text-xs text-gray-500 mt-1">Confidence: {ocrResult.confidence}% — Periksa data di bawah</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voice Mode */}
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

        {/* Manual Form (always shown after OCR or in manual mode) */}
        {(mode === 'manual' || (ocrResult && mode === 'scan')) && (
          <div className="bg-white rounded-2xl p-4 shadow-card border border-white/60 space-y-4">
            <h2 className="font-bold text-gray-800 text-base">Detail Pengeluaran</h2>

            {/* Judul */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Keterangan *</label>
              <input
                id="input-title"
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Nama toko / keterangan"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50"
              />
            </div>

            {/* Jumlah */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Jumlah (Rp) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">Rp</span>
                <input
                  id="input-amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50 font-bold text-gray-800"
                />
              </div>
              {form.amount && (
                <p className="text-xs text-primary font-semibold mt-1 ml-1">
                  {formatRupiah(parseFloat(form.amount))}
                </p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Kategori</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
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
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Tanggal</label>
              <input
                id="input-date"
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50"
              />
            </div>

            {/* Catatan */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">Catatan (opsional)</label>
              <textarea
                id="input-note"
                value={form.note}
                onChange={(e) => handleChange('note', e.target.value)}
                placeholder="Tambah catatan..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-gray-50 resize-none"
              />
            </div>

            {/* Save Button */}
            {saved ? (
              <div className="bg-success rounded-2xl p-4 text-white text-center font-bold animate-bounce-in">
                ✅ Tersimpan! Kembali ke dashboard...
              </div>
            ) : (
              <button
                id="btn-simpan"
                onClick={handleSave}
                disabled={!form.title || !form.amount}
                className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-200 active:scale-95 ${
                  form.title && form.amount
                    ? 'bg-primary text-white shadow-md hover:bg-primary-dark'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                💾 Simpan Pengeluaran
              </button>
            )}
          </div>
        )}

        {/* Jika scan mode dan belum ada gambar, tampilkan tips */}
        {mode === 'scan' && !previewUrl && !scanning && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-primary mb-2">💡 Tips Scan Terbaik</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Pastikan struk terlihat jelas dan tidak buram</li>
              <li>• Ambil di tempat dengan cahaya cukup</li>
              <li>• Seluruh struk terlihat dalam foto</li>
              <li>• Hindari pantulan cahaya di struk</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
