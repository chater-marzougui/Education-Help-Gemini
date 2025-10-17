import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getApiKey(): string | null {
  const encrypted = localStorage.getItem("gemini_api_key");
  if (!encrypted) return null;

  const bytes = CryptoJS.AES.decrypt(encrypted, "apiKey");
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted || null;
}