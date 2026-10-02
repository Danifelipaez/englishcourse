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
