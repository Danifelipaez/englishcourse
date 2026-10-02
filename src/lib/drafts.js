// Interrupted sessions: lesson stage + practice run are kept in localStorage (per user) so leaving never loses progress.
// Keys: `lesson:<id>` · `exam:<moduleId>` · `review`
const MAX_AGE = 14 * 86400000
const k = (uid, key) => `draft:${uid}:${key}`

export function loadDraft(uid, key) {
  try {
    const d = JSON.parse(localStorage.getItem(k(uid, key)) || 'null')
    if (!d) return null
    if (Date.now() - (d.at || 0) > MAX_AGE) { localStorage.removeItem(k(uid, key)); return null }
    return d
  } catch { return null }
}

// Merges `patch` into the stored record (so the lesson stage and the practice run can be saved independently)
export function saveDraft(uid, key, patch) {
  try { localStorage.setItem(k(uid, key), JSON.stringify({ ...loadDraft(uid, key), ...patch, at: Date.now() })) } catch { /* storage full or blocked */ }
}

export function clearDraft(uid, key) {
  try { localStorage.removeItem(k(uid, key)) } catch { /* ignore */ }
}

// Every draft with a practice run in progress, newest first
export function listRuns(uid) {
  const out = []
  try {
    const prefix = `draft:${uid}:`
    for (let i = 0; i < localStorage.length; i++) {
      const name = localStorage.key(i)
      if (!name?.startsWith(prefix)) continue
      const key = name.slice(prefix.length)
      const d = loadDraft(uid, key)
      if (d?.run?.queue?.length) out.push({ key, ...d })
    }
  } catch { /* ignore */ }
  return out.sort((a, b) => b.at - a.at)
}
