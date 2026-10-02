import m01 from './m01.js'
import m02 from './m02.js'
import m03 from './m03.js'
import m04 from './m04.js'
import m05 from './m05.js'
import m06 from './m06.js'
import m07 from './m07.js'
import m08 from './m08.js'
import m09 from './m09.js'
import m10 from './m10.js'
import m11 from './m11.js'
import m12 from './m12.js'

const SKILL = { mc: 'grammar', fill: 'grammar', fix: 'grammar', order: 'grammar', listen: 'listening', speak: 'speaking', read: 'reading', match: 'vocab', card: 'vocab' }

// Tuple -> exercise object
export function toExercise(t, id, lesson) {
  const [type, a, b, c] = t
  const ex = { id, type, skill: SKILL[type], topic: lesson?.topic, lessonId: lesson?.id }
  if (type === 'mc' || type === 'read') Object.assign(ex, { prompt: a, options: b.split('|'), answer: b.split('|')[0], why: c })
  else if (type === 'fill' || type === 'fix') Object.assign(ex, { prompt: a, answer: b, why: c })
  else if (type === 'order') Object.assign(ex, { answer: a, es: b })
  else if (type === 'listen' || type === 'speak') Object.assign(ex, { answer: a })
  else if (type === 'match') Object.assign(ex, { pairs: a })
  return ex
}

export const MODULES = [m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12].map((m, mi) => ({
  ...m,
  n: mi + 1,
  lessons: m.lessons.map((l, li) => ({
    ...l,
    n: `${mi + 1}.${li + 1}`,
    moduleId: m.id,
    exercises: [
      ...l.ex.slice(0, 4).map((t, i) => toExercise(t, `${l.id}-e${i}`, l)),
      // vocabulary match goes after the first block of grammar so the session breathes
      { id: `${l.id}-match`, type: 'match', skill: 'vocab', topic: l.topic, lessonId: l.id, pairs: l.vocab.slice(0, 5).map(([en, es]) => [en, es]) },
      ...l.ex.slice(4).map((t, i) => toExercise(t, `${l.id}-e${i + 4}`, l)),
    ],
  })),
  examItems: m.exam.map((t, i) => toExercise(t, `${m.id}-x${i}`, { id: `${m.id}-exam`, topic: `${m.title} exam` })),
}))

export const LESSONS = MODULES.flatMap(m => m.lessons)
export const LESSON = Object.fromEntries(LESSONS.map(l => [l.id, l]))
export const MODULE = Object.fromEntries(MODULES.map(m => [m.id, m]))
export const EXERCISE = Object.fromEntries([...LESSONS.flatMap(l => l.exercises), ...MODULES.flatMap(m => m.examItems)].map(e => [e.id, e]))

// Memory-box cards: every vocab word of a lesson
export const CARDS = Object.fromEntries(LESSONS.flatMap(l => l.vocab.map(([en, es, example], i) =>
  [`${l.id}:v${i}`, { id: `${l.id}:v${i}`, en, es, example, lessonId: l.id, topic: l.topic }])))
export const cardsOf = lessonId => Object.values(CARDS).filter(c => c.lessonId === lessonId)

// Lessons that link back to a given lesson (the reverse threads)
export const linkedFrom = id => LESSONS.filter(l => l.links.includes(id))
