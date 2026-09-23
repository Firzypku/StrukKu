import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useToast } from '../context/ToastContext';

export default function PwaUpdater() {
  const toast = useToast();
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Cek update service worker setiap 1 jam
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('PWA registration error:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast.info('Versi baru tersedia! Memperbarui...', 3000);
      updateServiceWorker(true);
    }
  }, [needRefresh, toast, updateServiceWorker]);

  return null;
}
