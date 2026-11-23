// Remembers the last public API response in the browser so returning visitors see the
// latest edited text immediately instead of the built-in defaults while the request runs.
// Only public, non-sensitive data goes here (never tokens or user data).
const PREFIX = 'kwt.public.v1.'

export const readPublicCache = (key) => {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch {
    // Storage blocked (private mode, disabled site data) or corrupt entry: behave as uncached.
    return null
  }
}

export const writePublicCache = (key, value) => {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: caching is only a speed-up, so ignore.
  }
}

// Calls the handler when another tab updates the cached value (e.g. after saving in the panel).
export const onPublicCacheChange = (key, handler) => {
  if (typeof window === 'undefined') return
  window.addEventListener('storage', (event) => {
    if (event.key !== PREFIX + key || !event.newValue) return
    try {
      handler(JSON.parse(event.newValue))
    } catch {
      // Ignore malformed values written by an older version.
    }
  })
}
