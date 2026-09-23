/**
 * imageProcess.js — Utilitas pemrosesan gambar & canvas untuk OCR dan Supabase Storage
 * Mengoptimalkan kecepatan Tesseract (downscale <= 1600px, grayscale, kontras)
 * dan mengompresi struk (max 1200px JPEG) sebelum diunggah ke storage.
 */

import { supabase } from './supabase';

/**
 * Membaca File / Blob / dataURL menjadi HTMLImageElement
 */
export function loadImageElement(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Gagal memuat gambar untuk diproses.'));

    if (typeof source === 'string') {
      img.src = source;
    } else if (source instanceof Blob || source instanceof File) {
      img.src = URL.createObjectURL(source);
    } else {
      reject(new Error('Format sumber gambar tidak valid.'));
    }
  });
}

/**
 * Pre-process gambar untuk Tesseract OCR di <canvas>:
 * - Resize dimensi maksimal 1600px (menjaga rasio)
 * - Konversi warna ke Grayscale
 * - Peningkatan kontras teks
 * @param {File|Blob|string} imageSource
 * @returns {Promise<string>} Data URL gambar yang telah dioptimalkan
 */
export async function preprocessImageForOcr(imageSource) {
  const img = await loadImageElement(imageSource);
  const MAX_DIM = 1600;

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > MAX_DIM || height > MAX_DIM) {
    if (width > height) {
      height = Math.round((height * MAX_DIM) / width);
      width = MAX_DIM;
    } else {
      width = Math.round((width * MAX_DIM) / height);
      height = MAX_DIM;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // Gambar gambar asli dengan dimensi baru
  ctx.drawImage(img, 0, 0, width, height);

  // Ambil data piksel untuk grayscale & kontras
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Tingkatkan kontras (+30)
    const contrast = 30;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      // Bobot standar persepsi mata manusia untuk grayscale
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Kontras
      const enhanced = factor * (gray - 128) + 128;
      const clamped = Math.max(0, Math.min(255, enhanced));

      data[i] = clamped;     // R
      data[i + 1] = clamped; // G
      data[i + 2] = clamped; // B
    }

    ctx.putImageData(imageData, 0, 0);
  } catch (err) {
    console.warn('Canvas pixel manipulation error (CORS/memory), using original canvas:', err);
  }

  return canvas.toDataURL('image/jpeg', 0.85);
}

/**
 * Kompresi gambar struk untuk diunggah ke storage (max 1200px, JPEG 0.8)
 * @param {File|Blob|string} imageSource
 * @param {number} maxDimension
 * @param {number} quality
 * @returns {Promise<Blob>}
 */
export async function compressImageForUpload(imageSource, maxDimension = 1200, quality = 0.8) {
  const img = await loadImageElement(imageSource);

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Gagal menghasilkan blob kompresi gambar.'));
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * Unggah struk ke Supabase Storage (bucket 'receipts', folder {userId}/{timestamp}.jpg)
 * @param {File|Blob} fileOrBlob
 * @param {string} userId
 * @returns {Promise<string|null>} Signed URL gambar atau path storage
 */
export async function uploadReceiptToStorage(fileOrBlob, userId) {
  if (!fileOrBlob || !userId) return null;

  try {
    const compressedBlob = await compressImageForUpload(fileOrBlob, 1200, 0.8);
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`;

    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, compressedBlob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn('Gagal upload ke Supabase Storage:', error.message);
      return null;
    }

    // Buat URL yang dapat diakses (signed URL 1 tahun)
    const { data: signedData, error: signedErr } = await supabase.storage
      .from('receipts')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365);

    if (signedErr || !signedData?.signedUrl) {
      // Fallback ke getPublicUrl jika private policy tidak terpasang
      const { data: pubData } = supabase.storage.from('receipts').getPublicUrl(fileName);
      return pubData?.publicUrl || fileName;
    }

    return signedData.signedUrl;
  } catch (err) {
    console.warn('Exception upload gambar struk:', err);
    return null;
  }
}
