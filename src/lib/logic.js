// Pure game logic — no React, no Supabase. Self-checked in selfcheck.test.js

export const DAY_GOAL_SEC = 20 * 60
const DAY_MS = 86400000

export const ymd = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
// Day math in UTC on 'YYYY-MM-DD' strings so DST never shifts a day
export const addDays = (day, n) => new Date(Date.parse(day + 'T00:00:00Z') + n * DAY_MS).toISOString().slice(0, 10)
export const daysBetween = (a, b) => Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / DAY_MS)

// A day counts when theory >= her chosen target (10–20) and theory + free >= 20 min
export const isMet = d => !!d && d.theory_sec >= d.theory_target * 60 && d.theory_sec + d.free_sec >= DAY_GOAL_SEC

/**
 * Walks every day from the first record to today.
 * - met (or admin override) -> streak +1; every 7th streak day earns a protector (max 2 earned)
 * - missed day with a protector -> protector used, streak kept
 * - today not met yet -> pending, never breaks the streak
 */
export function computeStreak(days, overrides = [], bonusFreezes = 0, today = ymd()) {
  const byDay = new Map(days.map(d => [d.day, d]))
  const forced = new Set(overrides)
  const first = [...byDay.keys(), ...forced].sort()[0]
  const res = { current: 0, longest: 0, freezes: bonusFreezes, frozenDays: [], metDays: [], todayMet: false }
  if (!first) return res
  for (let d = first; d <= today; d = addDays(d, 1)) {
    const met = isMet(byDay.get(d)) || forced.has(d)
    if (met) {
      res.current++
      res.metDays.push(d)
      if (res.current % 7 === 0 && res.freezes < 2) res.freezes++
      res.longest = Math.max(res.longest, res.current)
      if (d === today) res.todayMet = true
    } else if (d === today) {
      // pending
    } else if (res.current > 0 && res.freezes > 0) {
      res.freezes--
      res.frozenDays.push(d)
    } else {
      res.current = 0
    }
  }
  return res
}

// Combo multiplier: x1 (1-2 in a row), x2 (3-5), x3 (6-8), x4 (9-11), x5 (12+)
export const multiplier = combo => Math.min(5, 1 + Math.floor(combo / 3))
export const BASE_POINTS = 10

// Leitner memory box: box 1..6, interval in days after a correct answer
const INTERVALS = [0, 1, 2, 4, 8, 16, 32]
export function nextCard(card, correct, today = ymd()) {
  const box = correct ? Math.min(6, card.box + 1) : 1
  return {
    ...card,
    box,
    due: addDays(today, correct ? INTERVALS[box] : 1),
    reps: card.reps + 1,
    lapses: card.lapses + (correct ? 0 : 1),
    last_day: today,
  }
}

// Levels — stationery titles
export const LEVEL_TITLES = ['Blank Page', 'Pencil Sketch', 'Love Letter', 'Pressed Flower', 'Ink & Quill', 'Poetry Corner',
  'Gallery Muse', 'Paris Notebook', 'Manhattan Editor', 'Brand Storyteller', 'Creative Director', 'Muse of Words']
export function level(xp) {
  const n = Math.floor(Math.sqrt(xp / 60)) + 1
  const floor = 60 * (n - 1) ** 2, next = 60 * n ** 2
  return { n, title: LEVEL_TITLES[Math.min(n - 1, LEVEL_TITLES.length - 1)], progress: (xp - floor) / (next - floor), next }
}

// Answer checking: case, punctuation, curly quotes and extra spaces never matter
export const normalize = s => (s || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"¿¡]/g, '').replace(/\s+/g, ' ').trim()
export const accepts = (answers, given) => answers.split('|').some(a => normalize(a) === normalize(given))

// Word-level similarity for speaking practice (0..1)
export function similarity(target, said) {
  const a = normalize(target).split(' '), b = normalize(said).split(' ')
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return 1 - dp[a.length][b.length] / Math.max(a.length, b.length)
}

export const shuffle = arr => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
