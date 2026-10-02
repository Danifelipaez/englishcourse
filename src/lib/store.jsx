import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { computeStreak, isMet, level, nextCard, ymd, addDays } from './logic.js'
import { LESSONS, MODULES, cardsOf } from '../content/index.js'

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

// PostgREST caps responses at 1000 rows — page through
async function all(table, col, uid) {
  let out = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select('*').eq(col, uid).range(from, from + 999)
    if (error) throw error
    out = out.concat(data)
    if (data.length < 1000) return out
  }
}

export async function loadUser(uid) {
  const [profiles, days, progress, exams, cards, daily, rewards, notes, overrides, writings, hours] = await Promise.all([
    all('profiles', 'id', uid), all('study_days', 'user_id', uid), all('lesson_progress', 'user_id', uid), all('exam_results', 'user_id', uid),
    all('cards', 'user_id', uid), all('v_answer_daily', 'user_id', uid), all('rewards', 'user_id', uid), all('notes', 'user_id', uid),
    all('day_overrides', 'user_id', uid), all('writings', 'user_id', uid), all('v_hours', 'user_id', uid),
  ])
  return {
    profile: profiles[0], days, exams, daily, rewards, notes, overrides, writings, hours,
    progress: Object.fromEntries(progress.map(p => [p.lesson_id, p])),
    cards: Object.fromEntries(cards.map(c => [c.card_id, c])),
  }
}

// Everything the student view and the admin dashboard derive from raw data
export function derive(d, today = ymd()) {
  const streak = computeStreak(d.days, d.overrides.map(o => o.day), d.profile?.bonus_freezes || 0, today)
  const passed = new Set(d.exams.filter(e => e.passed).map(e => e.module_id))
  const completed = new Set(Object.values(d.progress).filter(p => p.completed_at).map(p => p.lesson_id))
  const answerPts = d.daily.reduce((s, r) => s + r.pts, 0)
  const xp = answerPts + streak.metDays.length * 50 + completed.size * 20 + passed.size * 150
  const answers = d.daily.reduce((s, r) => s + r.n, 0)
  const correct = d.daily.reduce((s, r) => s + r.ok, 0)
  const bestCombo = d.daily.reduce((m, r) => Math.max(m, r.best_combo), 0)
  const theorySec = d.days.reduce((s, r) => s + r.theory_sec, 0)
  const freeSec = d.days.reduce((s, r) => s + r.free_sec, 0)

  const moduleOpen = m => m.n === 1 || passed.has(MODULES[m.n - 2].id)
  const lessonOpen = l => {
    const m = MODULES.find(x => x.id === l.moduleId)
    if (!moduleOpen(m)) return false
    const i = m.lessons.indexOf(l)
    return i === 0 || completed.has(m.lessons[i - 1].id)
  }
  const nextLesson = LESSONS.find(l => lessonOpen(l) && !completed.has(l.id))
  const currentModule = MODULES.find(m => moduleOpen(m) && !passed.has(m.id)) || MODULES[MODULES.length - 1]
  const due = Object.values(d.cards).filter(c => c.due <= today)

  const ctx = { streak, xp, passed, completed, answers, correct, bestCombo, theorySec, freeSec, cardsCount: Object.keys(d.cards).length,
    reviews: d.daily.filter(r => r.context === 'review').reduce((s, r) => s + r.n, 0), hours: d.hours, writings: d.writings.length }
  return {
    ...ctx, level: level(xp), moduleOpen, lessonOpen, nextLesson, currentModule, due,
    accuracy: answers ? correct / answers : 0,
    achievements: ACHIEVEMENTS.map(a => ({ ...a, got: a.test(ctx) })),
  }
}

export const ACHIEVEMENTS = [
  { id: 'first', em: '✒️', title: 'First page', desc: 'Complete your first lesson', test: c => c.completed.size >= 1 },
  { id: 's3', em: '🕯️', title: 'Three candles', desc: '3-day streak', test: c => c.streak.longest >= 3 },
  { id: 's7', em: '💌', title: 'One week of love', desc: '7-day streak', test: c => c.streak.longest >= 7 },
  { id: 's30', em: '🌹', title: 'A month of roses', desc: '30-day streak', test: c => c.streak.longest >= 30 },
  { id: 's100', em: '👑', title: 'One hundred days', desc: '100-day streak', test: c => c.streak.longest >= 100 },
  { id: 'c10', em: '✨', title: 'On fire', desc: '10 correct in a row', test: c => c.bestCombo >= 10 },
  { id: 'c25', em: '🎻', title: 'Symphony', desc: '25 correct in a row', test: c => c.bestCombo >= 25 },
  { id: 'exam1', em: '🏛️', title: 'Sealed', desc: 'Pass your first module exam', test: c => c.passed.size >= 1 },
  { id: 'a2', em: '🗽', title: 'Hello A2', desc: 'Pass module 4', test: c => c.passed.has('m4') },
  { id: 'b1', em: '🗼', title: 'B1 at last', desc: 'Pass module 12', test: c => c.passed.has('m12') },
  { id: 'w100', em: '📚', title: 'Hundred words', desc: '100 words in your memory box', test: c => c.cardsCount >= 100 },
  { id: 'r100', em: '🗝️', title: 'Memory keeper', desc: '100 review answers', test: c => c.reviews >= 100 },
  { id: 'free10', em: '🎬', title: 'Movie night', desc: '10 hours of free English', test: c => c.freeSec >= 36000 },
  { id: 'theory20', em: '📖', title: 'Scholar', desc: '20 hours of theory', test: c => c.theorySec >= 72000 },
  { id: 'owl', em: '🦉', title: 'Night owl', desc: 'Study after 10 p.m.', test: c => c.hours.some(h => h.local_hour >= 22) },
  { id: 'bird', em: '🐦', title: 'Early bird', desc: 'Study before 7 a.m.', test: c => c.hours.some(h => h.local_hour < 7) },
  { id: 'pen', em: '🖋️', title: 'Writer', desc: 'Send 5 texts to your tutor', test: c => c.writings >= 5 },
  { id: 'story', em: '✉️', title: 'Letters from New York', desc: 'Read 6 story chapters', test: c => [...c.completed].filter(id => id.endsWith('l5')).length >= 6 },
]

const DataCtx = createContext(null)
const TimerCtx = createContext(null)
export const useData = () => useContext(DataCtx)
export const useTimer = () => useContext(TimerCtx)

export function StoreProvider({ session, children }) {
  const uid = session.user.id
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const reload = useCallback(() => loadUser(uid).then(setData).catch(e => setError(e.message)), [uid])
  useEffect(() => { reload() }, [reload])

  const today = ymd()
  const view = useMemo(() => data && derive(data, today), [data, today])

  const notify = useCallback((t) => { setToast(t); setTimeout(() => setToast(null), 3800) }, [])

  // ---- actions ----
  const actions = useMemo(() => ({
    async logAnswer(a) {
      const now = new Date()
      const row = { day: ymd(now), local_hour: now.getHours(), ...a, given: a.given?.slice(0, 300) }
      supabase.from('answers').insert(row).then(({ error }) => error && console.error(error))
      setData(d => ({ ...d,
        daily: [...d.daily, { day: row.day, context: a.context, skill: a.skill, topic: a.topic, n: 1, ok: a.correct ? 1 : 0, pts: a.points, best_combo: a.combo }],
        hours: [...d.hours, { local_hour: row.local_hour, n: 1 }] }))
    },
    async completeLesson(lessonId, score) {
      const prev = data.progress[lessonId]
      const row = { user_id: uid, lesson_id: lessonId, best_score: Math.max(score, prev?.best_score || 0), attempts: (prev?.attempts || 0) + 1, completed_at: prev?.completed_at || new Date().toISOString() }
      await supabase.from('lesson_progress').upsert(row)
      const newCards = cardsOf(lessonId).filter(c => !data.cards[c.id])
        .map(c => ({ user_id: uid, card_id: c.id, box: 1, due: addDays(ymd(), 1), reps: 0, lapses: 0 }))
      if (newCards.length) await supabase.from('cards').upsert(newCards, { ignoreDuplicates: true })
      setData(d => ({ ...d, progress: { ...d.progress, [lessonId]: row }, cards: { ...d.cards, ...Object.fromEntries(newCards.map(c => [c.card_id, c])) } }))
      return newCards.length
    },
    async reviewCard(cardId, correct) {
      const card = nextCard(data.cards[cardId] || { box: 1, reps: 0, lapses: 0 }, correct)
      const row = { user_id: uid, card_id: cardId, box: card.box, due: card.due, reps: card.reps, lapses: card.lapses, last_day: card.last_day }
      supabase.from('cards').upsert(row).then(({ error }) => error && console.error(error))
      setData(d => ({ ...d, cards: { ...d.cards, [cardId]: row } }))
    },
    async saveExam(moduleId, score, passed, details) {
      const row = { module_id: moduleId, score, passed, details }
      const { data: saved } = await supabase.from('exam_results').insert(row).select().single()
      setData(d => ({ ...d, exams: [...d.exams, saved || { ...row, created_at: new Date().toISOString() }] }))
    },
    async openReward(id) {
      const opened_at = new Date().toISOString()
      await supabase.from('rewards').update({ opened_at }).eq('id', id)
      setData(d => ({ ...d, rewards: d.rewards.map(r => r.id === id ? { ...r, opened_at } : r) }))
    },
    async readNote(id) {
      const read_at = new Date().toISOString()
      await supabase.from('notes').update({ read_at }).eq('id', id)
      setData(d => ({ ...d, notes: d.notes.map(n => n.id === id ? { ...n, read_at } : n) }))
    },
    async saveWriting(w) {
      const { data: saved } = await supabase.from('writings').insert(w).select().single()
      if (saved) setData(d => ({ ...d, writings: [...d.writings, saved] }))
    },
    async setDefaultTarget(min) {
      await supabase.from('profiles').update({ theory_target: min }).eq('id', uid)
      setData(d => ({ ...d, profile: { ...d.profile, theory_target: min } }))
    },
    upsertDay(row) { setData(d => ({ ...d, days: [...d.days.filter(x => x.day !== row.day), row] })) },
  }), [data, uid])

  if (error) return <div className="main"><div className="card">Couldn’t load your notebook: {error}</div></div>
  if (!data) return <Splash />
  return (
    <DataCtx.Provider value={{ ...data, ...view, ...actions, uid, today, reload, notify, session }}>
      <TimerProvider data={data} upsertDay={actions.upsertDay}>{children}</TimerProvider>
      {toast && <div className="toast" role="status">{toast}</div>}
    </DataCtx.Provider>
  )
}

export function Splash() {
  return <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
    <div className="center stack-s"><div className="seal" style={{ margin: '0 auto', animation: 'pulse 1.4s infinite' }}>M</div><span className="eyebrow">opening your notebook</span></div>
  </div>
}

/**
 * Study timer. Theory runs automatically while a learning view is mounted (and visible).
 * Free English runs by hand and keeps counting in the background (she may be watching Netflix in another app).
 * Saves deltas to Supabase every 15 s via add_study_time, so two devices add up.
 */
function TimerProvider({ data, upsertDay, children }) {
  const todayRow = () => {
    const day = ymd()
    return data.days.find(d => d.day === day) || { day, theory_sec: 0, free_sec: 0, theory_target: data.profile.theory_target, free_log: [] }
  }
  const [row, setRow] = useState(todayRow)
  const [mode, setModeState] = useState(null)
  const [freeMeta, setFreeMeta] = useState({ kind: 'series', title: '' })
  const modeRef = useRef(null), last = useRef(Date.now()), pending = useRef({ theory: 0, free: 0, log: [] }), freeRun = useRef(0)
  const theoryHolders = useRef(0)
  const rowRef = useRef(row); rowRef.current = row

  const flush = useCallback(async (target) => {
    const p = pending.current
    const t = Math.floor(p.theory), f = Math.floor(p.free)
    if (!t && !f && !p.log.length && target === undefined) return
    pending.current = { theory: p.theory - t, free: p.free - f, log: [] }
    const { data: saved, error } = await supabase.rpc('add_study_time', {
      p_day: rowRef.current.day, p_theory: t, p_free: f, p_target: target ?? rowRef.current.theory_target, p_log: p.log,
    })
    if (error) { pending.current.theory += t; pending.current.free += f; pending.current.log.push(...p.log); return console.error(error) }
    // server total + whatever accumulated while the request was in flight
    const merged = { ...saved, theory_sec: saved.theory_sec + Math.floor(pending.current.theory), free_sec: saved.free_sec + Math.floor(pending.current.free) }
    setRow(merged)
    upsertDay(saved)
  }, [upsertDay])

  useEffect(() => {
    const tick = () => {
      const now = Date.now(), delta = (now - last.current) / 1000
      last.current = now
      const m = modeRef.current
      if (ymd() !== rowRef.current.day) { flush(); setRow({ day: ymd(), theory_sec: 0, free_sec: 0, theory_target: rowRef.current.theory_target, free_log: [] }); return }
      if (!m || (m === 'theory' && document.hidden)) return
      const add = Math.min(delta, m === 'free' ? 3600 : 5) // a sleeping tab never inflates theory
      pending.current[m] += add
      if (m === 'free') freeRun.current += add
      setRow(r => ({ ...r, [m + '_sec']: r[m + '_sec'] + add }))
    }
    const id = setInterval(tick, 1000)
    const save = setInterval(() => flush(), 15000)
    const onVis = () => { if (document.hidden) flush(); else if (modeRef.current === 'theory') last.current = Date.now() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', () => flush())
    return () => { clearInterval(id); clearInterval(save); document.removeEventListener('visibilitychange', onVis) }
  }, [flush])

  const setMode = useCallback(m => {
    if (m === null && theoryHolders.current > 0) m = 'theory' // pausing free inside a lesson hands time back to theory
    if (modeRef.current === 'free' && m !== 'free' && freeRun.current > 30) {
      pending.current.log.push({ ...freeMeta, sec: Math.round(freeRun.current), at: new Date().toISOString() })
      freeRun.current = 0
    }
    last.current = Date.now()
    modeRef.current = m
    setModeState(m)
  }, [freeMeta])

  // Learning views call this: theory runs while at least one is mounted, unless free is running
  const holdTheory = useCallback(() => {
    theoryHolders.current++
    if (modeRef.current !== 'free') setMode('theory')
    return () => {
      theoryHolders.current--
      setTimeout(() => { if (theoryHolders.current === 0 && modeRef.current === 'theory') setMode(null) }, 50)
    }
  }, [setMode])

  const setTarget = useCallback(min => { setRow(r => ({ ...r, theory_target: min })); rowRef.current = { ...rowRef.current, theory_target: min }; flush(min) }, [flush])

  const value = { row, mode, setMode, holdTheory, setTarget, freeMeta, setFreeMeta, met: isMet(row), flush }
  return <TimerCtx.Provider value={value}>{children}</TimerCtx.Provider>
}

export function useTheoryTime() {
  const { holdTheory } = useTimer()
  useEffect(() => holdTheory(), [holdTheory])
}
