// npm test — the smallest checks that fail if the game rules break
import assert from 'node:assert/strict'
import { computeStreak, isMet, multiplier, nextCard, accepts, similarity, addDays, level } from './logic.js'

const day = (d, t, f, target = 15) => ({ day: d, theory_sec: t * 60, free_sec: f * 60, theory_target: target })

// isMet: theory must reach her target and total 20
assert.equal(isMet(day('x', 15, 5)), true)
assert.equal(isMet(day('x', 12, 10)), false) // theory under her 15 target
assert.equal(isMet(day('x', 20, 0, 20)), true)
assert.equal(isMet(day('x', 10, 9, 10)), false) // 19 min total

// 7 met days -> 1 protector; one missed day consumes it and keeps the streak
const start = '2026-01-01'
const seven = Array.from({ length: 7 }, (_, i) => day(addDays(start, i), 15, 5))
let s = computeStreak(seven, [], 0, addDays(start, 6))
assert.deepEqual([s.current, s.freezes, s.todayMet], [7, 1, true])
s = computeStreak([...seven, day(addDays(start, 8), 15, 5)], [], 0, addDays(start, 8))
assert.deepEqual([s.current, s.freezes, s.frozenDays], [8, 0, [addDays(start, 7)]])

// no protector -> streak resets; today pending never breaks it
s = computeStreak([day(start, 15, 5), day(addDays(start, 2), 15, 5)], [], 0, addDays(start, 3))
assert.deepEqual([s.current, s.longest, s.todayMet], [1, 1, false])

// admin override counts as met
s = computeStreak([day(start, 15, 5), day(addDays(start, 2), 15, 5)], [addDays(start, 1)], 0, addDays(start, 2))
assert.equal(s.current, 3)

// combo multiplier
assert.deepEqual([1, 2, 3, 5, 6, 12, 40].map(multiplier), [1, 1, 2, 2, 3, 5, 5])

// memory box
const c = nextCard({ box: 2, reps: 0, lapses: 0 }, true, '2026-01-01')
assert.deepEqual([c.box, c.due], [3, '2026-01-05'])
assert.equal(nextCard(c, false, '2026-01-05').box, 1)

// answers
assert.ok(accepts("am|'m", ' AM '))
assert.ok(accepts("I'm happy", 'I’m happy.'))
assert.ok(similarity('Nice to meet you', 'nice to meet you') === 1)
assert.ok(similarity('Nice to meet you', 'nice to see you') >= 0.7)
assert.equal(level(0).n, 1)

console.log('selfcheck OK')

// ---------- interface language: Spanish first, English as she learns ----------
import { STR } from './strings.js'
import { TIER, isEnglish, metaEnglish, helpOpen, makeT } from './i18n-core.js'
import { LESSON } from '../content/index.js'
import { LIBRARY, ART, POEMS, TIPS, PROMPTS } from '../content/library.js'
import { loadDraft, saveDraft, clearDraft, listRuns } from './drafts.js'

const t0 = makeT(0, 'auto'), t60 = makeT(60, 'auto')
assert.equal(t0.t('nav.today'), 'Hoy')
assert.equal(t60.t('nav.today'), 'Today')
assert.equal(makeT(3, 'auto').t('nav.today'), 'Today')          // single words flip after 3 lessons
assert.equal(makeT(3, 'auto').t('path.intro').startsWith('Doce'), true) // long text still Spanish
assert.equal(makeT(60, 'es').t('nav.today'), 'Hoy')             // manual override wins
assert.equal(makeT(0, 'en').t('nav.today'), 'Today')
assert.equal(t0.t('today.protectors', { n: 1 }), '1 protector')
assert.equal(t0.t('today.protectors', { n: 2 }), '2 protectores')
assert.equal(t0.t('lock.lesson', { n: '1.2', title: 'X' }), 'Se abre al terminar la lección 1.2 · X')
// English only ever grows with progress, never goes back
for (const [k, [, , tier]] of Object.entries(STR)) {
  assert.ok(Number.isInteger(tier) && tier >= 0 && tier < TIER.length, `tier of ${k}`)
  assert.ok(!isEnglish(tier, TIER[tier] - 1 < 0 ? 99 : TIER[tier] - 1) || tier === 0, `${k} too early`)
}
assert.ok(t0.percent() < makeT(20, 'auto').percent() && makeT(20, 'auto').percent() < t60.percent())
assert.equal(t60.percent(), 100)
// lesson texts: Spanish while the lesson is recent, English once she is 12 lessons past it; Spanish help open while fresh
assert.equal(metaEnglish('m1l1', 5), false); assert.equal(metaEnglish('m1l1', 13), true)
assert.equal(helpOpen('m1l1', 5), true); assert.equal(helpOpen('m1l1', 30), false)

// supplementary content only points at real lessons (that is what unlocks it)
for (const x of [...LIBRARY, ...ART, ...POEMS, ...TIPS, ...PROMPTS]) assert.ok(LESSON[x.needs], `unknown needs: ${x.needs}`)
assert.ok(PROMPTS.some(p => p.needs === 'm1l1'), 'there is something to write after the very first lesson')
assert.ok(ART.every(a => a.task_es) && LIBRARY.every(x => x.why_es && x.mission_es))
// nothing supplementary is open before lesson 1.1 is learned
assert.ok([...LIBRARY, ...ART, ...POEMS, ...TIPS, ...PROMPTS].every(x => x.needs !== undefined))

// ---------- interrupted sessions are kept ----------
const store = {}
globalThis.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: k => { delete store[k] }, key: i => Object.keys(store)[i], get length() { return Object.keys(store).length } }
saveDraft('u1', 'lesson:m1l1', { stage: 'theory' })
saveDraft('u1', 'lesson:m1l1', { run: { queue: ['a', 'b', 'c'], i: 1, n0: 3, combo: 1, stats: {} } })
assert.equal(loadDraft('u1', 'lesson:m1l1').stage, 'theory')    // patches merge
assert.equal(loadDraft('u2', 'lesson:m1l1'), null)              // per user
assert.deepEqual(listRuns('u1').map(r => r.key), ['lesson:m1l1'])
saveDraft('u1', 'exam:m1', { stage: 'intro' })                  // a draft without a run is not an "unfinished session"
assert.equal(listRuns('u1').length, 1)
store['draft:u1:lesson:m9l9'] = JSON.stringify({ at: Date.now() - 20 * 86400000, run: { queue: ['x'] } })
assert.equal(loadDraft('u1', 'lesson:m9l9'), null)              // stale drafts expire
clearDraft('u1', 'lesson:m1l1')
assert.equal(listRuns('u1').length, 0)

console.log('selfcheck (language, unlocks, drafts) OK')
