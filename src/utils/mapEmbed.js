/**
 * Accepts either a Google Maps embed URL or the whole `<iframe ...>` code copied from
 * Google Maps ("Bagikan" → "Sematkan peta" → "Salin HTML") and returns only the embed URL.
 * Any other text is returned trimmed, unchanged.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function extractMapEmbedUrl(value) {
  const text = String(value ?? '').trim()
  if (!/<iframe/i.test(text)) return text

  const match = text.match(/\bsrc\s*=\s*["']([^"']+)["']/i)
  return match ? match[1].replace(/&amp;/g, '&') : text
}
