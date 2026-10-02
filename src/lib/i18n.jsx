// React side of the interface language: the rules live in i18n-core.js, the strings in strings.js.
// Mode override ('auto' | 'es' | 'en') lives in Me → Idioma.
import { useSyncExternalStore } from 'react'
import { useData } from './store.jsx'
import { LESSON } from '../content/index.js'
import { Rich } from '../rich.jsx'
import { makeT, IDX } from './i18n-core.js'

// ---- manual override: 'auto' | 'es' | 'en' (per device) ----
const listeners = new Set()
const read = key => { try { return localStorage.getItem(key) } catch { return null } }
const write = (key, v) => { try { localStorage.setItem(key, v) } catch { /* private mode */ } }
let mode = read('uiLang') || 'auto'
export const setUiLang = m => { mode = m; write('uiLang', m); listeners.forEach(f => f()) }
const subscribe = f => { listeners.add(f); return () => listeners.delete(f) }
const getMode = () => mode

// lessons learned, remembered so the sign-in screen speaks her current level too
export const rememberLearned = n => write('learned', String(n))
const cachedLearned = () => +read('learned') || 0

export function useT() {
  const d = useData()
  const m = useSyncExternalStore(subscribe, getMode)
  return makeT(d ? d.learnedCount : cachedLearned(), m)
}

// <T k="today.goal" v={{ n: 5 }} /> — like t(), with **bold** rendered
export function T({ k, v }) {
  const { t } = useT()
  return <Rich text={t(k, v)} />
}

// "Lección 3.3 · A small, cozy, white room": what unlocks a locked card
export const lessonRef = id => ({ n: LESSON[id]?.n || '', title: LESSON[id]?.title || '' })
export const lessonIndex = id => IDX[id] || 0
