"use client";

import { useEffect, useState } from "react";

const KEY = "thequuk_profile_photo";
const EVT = "thequuk:profile-photo";
const MAX_SIZE = 256; // Target square dimension for stored avatar
const JPEG_QUALITY = 0.86;

export function loadProfilePhoto(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveProfilePhoto(dataUrl: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, dataUrl);
  } catch {
    /* quota exceeded — ignore in prototype */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: dataUrl }));
}

export function clearProfilePhoto() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: null }));
}

/**
 * Subscribes to the in-memory profile photo. Renders null during SSR and on
 * the first client render, then settles to the stored value. Updates whenever
 * `saveProfilePhoto`/`clearProfilePhoto` fires the custom event.
 */
export function useProfilePhoto(): string | null {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    setPhoto(loadProfilePhoto());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string | null>).detail;
      setPhoto(detail ?? null);
    };
    window.addEventListener(EVT, handler as EventListener);
    return () => window.removeEventListener(EVT, handler as EventListener);
  }, []);

  return photo;
}

/**
 * Reads a user-selected image file, center-crops it to a square, scales to
 * MAX_SIZE×MAX_SIZE on a canvas, and returns a JPEG data URL. Keeps the
 * stored payload around 10-30KB so localStorage stays usable.
 */
export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Yalnızca görsel dosyaları kabul edilir."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.onload = () => {
      const src = reader.result;
      if (typeof src !== "string") {
        reject(new Error("Görsel verisi alınamadı."));
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error("Görsel yüklenemedi."));
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = MAX_SIZE;
          canvas.height = MAX_SIZE;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas oluşturulamadı."));
            return;
          }
          // Center-crop to square
          const min = Math.min(img.width, img.height);
          const sx = (img.width - min) / 2;
          const sy = (img.height - min) / 2;
          ctx.drawImage(img, sx, sy, min, min, 0, 0, MAX_SIZE, MAX_SIZE);
          resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Sıkıştırma hatası."));
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
