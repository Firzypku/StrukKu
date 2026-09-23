import { lazy } from 'react';

/**
 * lazyWithRetry — Membungkus React.lazy() agar saat ada update versi deploy
 * baru di server dan browser memuat hash chunk lama, browser mencoba reload
 * satu kali secara mulus tanpa loop.
 */
export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const hasReloadedKey = `retry_import_${componentImport.toString()}`;
    const pageHasBeenForceRefreshed = (() => {
      try {
        return JSON.parse(window.sessionStorage.getItem(hasReloadedKey) || 'false');
      } catch {
        return false;
      }
    })();

    try {
      const component = await componentImport();
      try {
        window.sessionStorage.setItem(hasReloadedKey, 'false');
      } catch {}
      return component;
    } catch (error) {
      if (!pageHasBeenForceRefreshed) {
        try {
          window.sessionStorage.setItem(hasReloadedKey, 'true');
        } catch {}
        window.location.reload();
        return new Promise(() => {}); // tahan render saat reload berlangsung
      }
      throw error;
    }
  });
