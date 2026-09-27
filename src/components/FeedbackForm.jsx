import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function FeedbackForm({ onClose }) {
  const { user } = useAuth() || {};
  const toast = useToast();
  
  const [type, setType] = useState('Keluhan');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Pesan masukan tidak boleh kosong');
      return;
    }

    setIsSubmitting(true);
    try {
      const isUuid =
        user?.id &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);

      const payload = {
        user_id: isUuid ? user.id : null,
        type,
        message: message.trim(),
        contact: contact.trim() || null,
        created_at: new Date().toISOString(),
      };

      // Simpan salinan masukan di cache lokal browser
      try {
        const localFeedback = JSON.parse(localStorage.getItem('strukku_feedbacks') || '[]');
        localFeedback.unshift({ ...payload, id: 'fb-' + Date.now() });
        localStorage.setItem('strukku_feedbacks', JSON.stringify(localFeedback.slice(0, 50)));
      } catch (_e) {
        // Abaikan kegagalan local storage
      }

      // Coba kirim ke Supabase
      try {
        const { error } = await supabase.from('feedback').insert({
          user_id: payload.user_id,
          type: payload.type,
          message: payload.message,
          contact: payload.contact,
        });

        if (error) {
          console.warn('Info pengiriman feedback Supabase:', error.message);
        }
      } catch (sbErr) {
        console.warn('Network error pengiriman feedback:', sbErr);
      }

      toast.success('Masukan berhasil dikirim! Terima kasih 🙏');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Gagal mengirim masukan. Silakan coba beberapa saat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 space-y-4">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <span>📝</span> Kirim Masukan
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="type" className="block text-xs font-medium text-slate-700">
            Jenis Masukan
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors"
          >
            <option value="Keluhan">Keluhan</option>
            <option value="Ide Fitur">Ide Fitur</option>
            <option value="Bug / Error">Bug / Error</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="message" className="block text-xs font-medium text-slate-700">
            Pesan <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows="4"
            placeholder="Ceritakan masalahmu atau ide fitur baru..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact" className="block text-xs font-medium text-slate-700">
            Kontak (Opsional)
          </label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email atau no WA (opsional)"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Masukan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function FeedbackModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md">
        <FeedbackForm onClose={onClose} />
      </div>
    </div>
  );
}
