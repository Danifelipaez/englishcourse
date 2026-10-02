import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { Volume2 } from 'lucide-react'
import { speak } from './lib/speech.js'
import { addDays, ymd } from './lib/logic.js'
import { useT } from './lib/i18n.jsx'

export const fmt = sec => {
  const s = Math.floor(sec), m = Math.floor(s / 60)
  return m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m}:${String(s % 60).padStart(2, '0')}`
}
export const mins = sec => Math.floor(sec / 60)
// totals: "12 min" under an hour, "2h 05m" after
export const hm = sec => (sec >= 3600 ? fmt(sec) : `${mins(sec)} min`)

const PALETTE = ['#d29a94', '#973a49', '#b48f55', '#f4ecdf', '#7f9274', '#ffffff']
export function celebrate(big = false) {
  const petal = confetti.shapeFromPath ? confetti.shapeFromPath({ path: 'M0 6 C 0 0, 8 0, 8 6 C 8 10, 4 12, 4 14 C 4 12, 0 10, 0 6 z' }) : undefined
  confetti({ particleCount: big ? 160 : 70, spread: big ? 100 : 70, origin: { y: .7 }, colors: PALETTE, shapes: petal ? [petal, 'circle'] : undefined, scalar: 1.1, ticks: 220, disableForReducedMotion: true })
}

export function SpeakBtn({ text, label = 'Listen', rate }) {
  return <button className="icon-btn" aria-label={`${label}: ${text}`} onClick={e => { e.stopPropagation(); speak(text, rate) }}><Volume2 /></button>
}

// Two arcs: outer = theory vs her target, inner = total vs 20 min
export function GoalRing({ theory, free, target, size = 132 }) {
  const r1 = size / 2 - 8, r2 = size / 2 - 22, c1 = 2 * Math.PI * r1, c2 = 2 * Math.PI * r2
  const p1 = Math.min(1, theory / (target * 60)), p2 = Math.min(1, (theory + free) / 1200)
  const { t } = useT()
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r1} stroke="var(--rose-soft)" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r1} stroke="var(--wax)" strokeWidth="8" strokeDasharray={c1} strokeDashoffset={c1 * (1 - p1)} />
        <circle cx={size / 2} cy={size / 2} r={r2} stroke="var(--sage-soft)" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r2} stroke="var(--sage)" strokeWidth="8" strokeDasharray={c2} strokeDashoffset={c2 * (1 - p2)} />
      </svg>
      <div className="label"><div><b>{mins(theory + free)}</b><span className="small muted">{t('ring.of')}</span></div></div>
    </div>
  )
}

export function Candle({ lit = true }) {
  return <span className="candle" aria-hidden="true"><span className={`flame ${lit ? '' : 'off'}`} /><span className="wax-stick" /></span>
}

// Pressed flowers for the last 7 days
export function Week({ metDays, frozenDays, today }) {
  const met = new Set(metDays), frozen = new Set(frozenDays)
  const { t, locale } = useT()
  return (
    <div className="week" aria-label={t('week.aria')}>
      {Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)).map((d, i) => (
        <div className="d" key={d}>
          <span className={`bloom ${met.has(d) ? 'met' : ''} ${frozen.has(d) ? 'frozen' : ''} ${d === today ? 'today' : ''}`} style={{ animationDelay: `${i * 60}ms` }}
            title={met.has(d) ? t('week.met') : frozen.has(d) ? t('week.frozen') : ''}>
            {met.has(d) ? '🌸' : frozen.has(d) ? '🔖' : ''}
          </span>
          {new Date(d + 'T12:00').toLocaleDateString(locale, { weekday: 'narrow' })}
        </div>
      ))}
    </div>
  )
}

/**
 * Teaching animation: words of sentence A glide to their new places in sentence B (FLIP).
 * New words ink in, removed words fade out. Shows *how* grammar moves.
 */
export function Morph({ from, to }) {
  const { t } = useT()
  const [phase, setPhase] = useState(0) // 0 = from, 1 = to
  const box = useRef(null), rects = useRef({})
  const tokens = s => {
    const seen = {}
    return s.split(' ').map(w => { const k = w.toLowerCase().replace(/[?.!,]/g, ''); seen[k] = (seen[k] || 0) + 1; return { w, key: k + seen[k] } })
  }
  const a = tokens(from), b = tokens(to)
  const shown = phase ? b : a
  const fromKeys = new Set(a.map(t => t.key))

  const measure = () => { rects.current = {}; box.current?.querySelectorAll('[data-k]').forEach(el => { rects.current[el.dataset.k] = el.getBoundingClientRect() }) }
  useLayoutEffect(() => {
    box.current?.querySelectorAll('[data-k]').forEach(el => {
      const prev = rects.current[el.dataset.k]
      if (!prev) { el.animate([{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 250, fill: 'backwards', easing: 'cubic-bezier(.2,.8,.2,1)' }); return }
      const now = el.getBoundingClientRect()
      const dx = prev.left - now.left, dy = prev.top - now.top
      if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' })
    })
  }, [phase])
  useEffect(() => { const t = setTimeout(() => { measure(); setPhase(1) }, 900); return () => clearTimeout(t) }, [from, to])

  return (
    <div className="stack-s">
      <div className="morph" ref={box} aria-label={`${from} becomes ${to}`}>
        {shown.map(t => <span key={t.key} data-k={t.key} className={phase && !fromKeys.has(t.key) ? 'new' : ''}>{t.w}</span>)}
      </div>
      <div className="row">
        <button className="btn ghost sm" onClick={() => { measure(); setPhase(p => 1 - p) }}>{phase ? t('morph.back') : t('morph.go')}</button>
        <SpeakBtn text={phase ? to : from} />
      </div>
    </div>
  )
}

export function Sheet({ onClose, children }) {
  useEffect(() => { const k = e => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  return <div className="overlay" onClick={onClose}><div className="sheet" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>{children}</div></div>
}

export function Bar({ value, tone = '' }) {
  return <div className={`bar ${tone}`}><i style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }} /></div>
}

export const levelClass = l => (l.startsWith('B') ? 'b1' : l.startsWith('A2') ? 'a2' : '')
export const greeting = t => { const h = new Date().getHours(); return t(h < 12 ? 'greet.morning' : h < 18 ? 'greet.afternoon' : 'greet.evening') }
export const todayLabel = locale => new Date().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })
export { ymd }
