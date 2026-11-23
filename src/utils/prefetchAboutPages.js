import {
  getPublicVisionMission,
  getPublicHistory,
  getPublicStructure,
  getPublicStructureMembers,
} from '@/services/publicApi'
import { writePublicCache } from '@/utils/publicCache'

// Loads the "Tentang" pages' data in the background when the visitor points at (or taps) the
// "Tentang" menu, so Visi & Misi, Sejarah, and Struktur open instantly from the browser cache.
// Cache keys and shapes match useVisionMission, useHistory, and useStructure.

// Do not refetch more often than this (each page still refreshes itself silently when opened).
export const PREFETCH_INTERVAL_MS = 60 * 1000

let lastStartedAt = 0
let inFlight = null

const prefetchStructure = async () => {
  const [heading, membersRes] = await Promise.all([getPublicStructure(), getPublicStructureMembers(1)])
  writePublicCache('structure', {
    heading,
    members: Array.isArray(membersRes?.data) ? membersRes.data : [],
    meta: membersRes?.meta || null,
  })
}

export function prefetchAboutPages() {
  if (inFlight || Date.now() - lastStartedAt < PREFETCH_INTERVAL_MS) return inFlight || Promise.resolve()
  lastStartedAt = Date.now()

  // Failures are silent: the pages simply load normally when opened.
  inFlight = Promise.allSettled([
    getPublicVisionMission().then((res) => writePublicCache('vision-mission', res)),
    getPublicHistory().then((res) => writePublicCache('history', res)),
    prefetchStructure(),
  ]).finally(() => {
    inFlight = null
  })

  return inFlight
}

// For tests.
export function resetAboutPrefetch() {
  lastStartedAt = 0
  inFlight = null
}
