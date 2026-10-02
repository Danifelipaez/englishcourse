// The interface starts in Spanish and turns English as she learns. Pure rules (no React), self-checked in selfcheck.test.js.
// Every UI string is [español, English, tier]; a tier opens once she has learned TIER[tier] lessons.
// Short single words flip first (tier 1); long explanations last (tier 6).
import { LESSONS } from '../content/index.js'
import { STR } from './strings.js'

export const TIER = [0, 3, 6, 10, 20, 32, 45] // lessons learned needed per tier (60 lessons in total)

// position of a lesson in the whole course (1..60): content "intro" texts follow it
export const IDX = Object.fromEntries(LESSONS.map((l, i) => [l.id, i + 1]))

export const isEnglish = (tier, n, m = 'auto') => m === 'en' || (m === 'auto' && n >= TIER[tier])
// Explanatory texts about a lesson/module stay in Spanish until she is well past it (12 lessons beyond, max 45)
export const metaEnglish = (lessonId, n, m = 'auto') => m === 'en' || (m === 'auto' && n >= Math.min(45, (IDX[lessonId] || 1) + 12))
// Spanish help on a lesson is open by default while the lesson is fresh
export const helpOpen = (lessonId, n, m = 'auto') => m === 'es' || (m === 'auto' && n < (IDX[lessonId] || 1) + 8)

const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => v?.[k] ?? '')

export function makeT(n, m) {
  const t = (key, v) => {
    const e = STR[key]
    if (!e) return key
    const [es, en, tier] = e
    const s = isEnglish(tier, n, m) ? en : es
    return typeof s === 'function' ? s(v || {}) : fill(s, v)
  }
  const percent = () => {
    const all = Object.values(STR)
    return Math.round(100 * all.filter(([, , tier]) => isEnglish(tier, n, 'auto')).length / all.length)
  }
  return {
    t, n, mode: m, percent,
    en: tier => isEnglish(tier, n, m),
    // explanatory text of a lesson: pick(en, es, lessonId)
    pick: (en, es, lessonId) => (es && !metaEnglish(lessonId, n, m) ? es : en),
    help: lessonId => helpOpen(lessonId, n, m),
    locale: isEnglish(3, n, m) ? 'en-US' : 'es-CO',
  }
}

