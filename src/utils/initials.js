/**
 * Build up to two uppercase initials from a person's name, ignoring brackets and symbols.
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) =>
  String(name || '')
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('') || '?'
