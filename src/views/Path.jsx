import { useState } from 'react'
import { ArrowLeft, Lock, Check, BookOpen, Mail } from 'lucide-react'
import { MODULES, MODULE, LESSONS, LESSON } from '../content/index.js'
import { useData } from '../lib/store.jsx'
import { Bar, levelClass } from '../components.jsx'

export function Path({ go }) {
  const { moduleOpen, completed, passed, exams } = useData()
  const [view, setView] = useState('list')
  return (
    <div className="stack">
      <div><span className="eyebrow">Your path · A1 → B1</span><h1>The cabinet</h1>
        <p className="muted">Twelve drawers, one story. Pass each module’s exam to open the next one — or test out early if you already know it.</p></div>
      <div className="seg" role="tablist">
        <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>Modules</button>
        <button className={view === 'map' ? 'on' : ''} onClick={() => setView('map')}>Thread map</button>
      </div>
      {view === 'map' ? <ThreadMap go={go} completed={completed} /> : MODULES.map((m, i) => {
        const open = moduleOpen(m)
        const done = m.lessons.filter(l => completed.has(l.id)).length
        const best = Math.max(0, ...exams.filter(e => e.module_id === m.id).map(e => e.score))
        return (
          <button key={m.id} className={`card link enter ${open ? '' : 'locked'}`} style={{ textAlign: 'left' }} onClick={() => go(`module/${m.id}`)} disabled={!open}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className={`seal sm ${passed.has(m.id) ? '' : open ? 'gold' : 'gray'}`}>{passed.has(m.id) ? <Check size={18} /> : m.n}</div>
              <div className="grow stack-s">
                <div className="row between"><span className={`level-tag ${levelClass(m.level)}`}>{m.level}</span>{!open && <Lock size={16} className="muted" />}</div>
                <h3>{m.title}</h3>
                <span className="small muted">{m.subtitle}</span>
                <Bar value={done / m.lessons.length} />
                <span className="small muted">{done}/{m.lessons.length} lessons{best ? ` · exam best ${best}%` : ''}</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export function Module({ id, go }) {
  const m = MODULE[id]
  const { lessonOpen, completed, progress, exams, passed } = useData()
  const best = Math.max(0, ...exams.filter(e => e.module_id === m.id).map(e => e.score))
  const allDone = m.lessons.every(l => completed.has(l.id))
  return (
    <div className="stack">
      <div className="row"><button className="icon-btn" onClick={() => go('path')} aria-label="Back"><ArrowLeft /></button>
        <div className="grow"><span className="eyebrow">Module {m.n} · {m.level}</span><h2>{m.title}</h2></div></div>
      <p className="muted">{m.goal}</p>
      <div className="thread">
        {m.lessons.map((l, i) => {
          const open = lessonOpen(l), done = completed.has(l.id)
          const now = open && !done
          return (
            <div key={l.id} style={{ position: 'relative', marginBottom: 12 }} className="enter">
              <span className={`thread-dot ${done ? 'done' : now ? 'now' : ''}`} />
              <button className={`card link ${open ? '' : 'locked'}`} style={{ textAlign: 'left', width: '100%' }} onClick={() => go(`lesson/${l.id}`)} disabled={!open}>
                <div className="row">
                  <div className="grow">
                    <span className="eyebrow">{l.story ? <><Mail size={11} style={{ verticalAlign: -1 }} /> Story chapter</> : `Lesson ${l.n}`}</span>
                    <h3 style={{ fontSize: 20, marginTop: 4 }}>{l.title}</h3>
                    <span className="small muted">{l.topic}</span>
                  </div>
                  {done ? <span className="small" style={{ color: 'var(--sage)' }}>{progress[l.id]?.best_score}%</span> : !open ? <Lock size={16} /> : <BookOpen size={18} />}
                </div>
              </button>
            </div>
          )
        })}
        <div style={{ position: 'relative' }} className="enter">
          <span className={`thread-dot ${passed.has(m.id) ? 'done' : ''}`} />
          <button className="card link" style={{ textAlign: 'left', width: '100%', background: 'var(--cream)' }} onClick={() => go(`exam/${m.id}`)}>
            <div className="row">
              <div className="seal sm">{passed.has(m.id) ? <Check size={16} /> : 'E'}</div>
              <div className="grow"><span className="eyebrow">Module exam · pass with 70%</span>
                <h3 style={{ fontSize: 20, marginTop: 4 }}>{passed.has(m.id) ? 'Sealed ✓' : allDone ? 'You’re ready' : 'Test out early'}</h3>
                <span className="small muted">{best ? `Best: ${best}%` : `${m.examItems.length + 5} questions, no hints`}</span></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// 60 lessons as a constellation; threads show how lessons feed each other
function ThreadMap({ go, completed }) {
  const [sel, setSel] = useState(null)
  const W = 340, pos = {}
  MODULES.forEach((m, mi) => m.lessons.forEach((l, li) => { pos[l.id] = [36 + li * 67, 30 + mi * 54] }))
  const H = 30 + MODULES.length * 54
  const edges = LESSONS.flatMap(l => l.links.map(k => [k, l.id]))
  const active = sel ? new Set([sel, ...LESSON[sel].links, ...LESSONS.filter(l => l.links.includes(sel)).map(l => l.id)]) : null
  return (
    <div className="card" style={{ padding: 12 }}>
      <p className="small muted" style={{ margin: '4px 8px 8px' }}>Each dot is a lesson; each line, an idea that comes back. Tap a dot to see its threads, tap again to open it.</p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Map of linked lessons">
        {MODULES.map((m, mi) => <text key={m.id} x="4" y={34 + mi * 54} fontSize="9" fill="var(--ink-3)" fontFamily="Jost">{mi + 1}</text>)}
        {edges.map(([a, b], i) => {
          const [x1, y1] = pos[a], [x2, y2] = pos[b]
          const on = active && (a === sel || b === sel)
          const cx = (x1 + x2) / 2 + (y1 === y2 ? 0 : 30), cy = (y1 + y2) / 2 - (y1 === y2 ? 18 : 0)
          return <path key={i} d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={on ? 'var(--wax)' : 'var(--line)'} strokeWidth={on ? 1.6 : .8}
            strokeDasharray={on ? '300' : '2 3'} strokeDashoffset={on ? 300 : 0} style={on ? { animation: 'draw .9s forwards' } : undefined} />
        })}
        {LESSONS.map(l => {
          const [x, y] = pos[l.id], done = completed.has(l.id)
          const dim = active && !active.has(l.id)
          return (
            <g key={l.id} onClick={() => (sel === l.id ? go(`lesson/${l.id}`) : setSel(l.id))} style={{ cursor: 'pointer', opacity: dim ? .25 : 1, transition: 'opacity .3s' }}>
              <circle cx={x} cy={y} r={l.story ? 9 : 7} fill={done ? 'var(--sage)' : 'var(--paper)'} stroke={l.story ? 'var(--wax)' : done ? 'var(--sage)' : 'var(--ink-3)'} strokeWidth="1.5" />
              {sel === l.id && <circle cx={x} cy={y} r="13" fill="none" stroke="var(--wax)" strokeWidth="1" />}
            </g>
          )
        })}
      </svg>
      {sel && <div className="row between" style={{ padding: '8px' }}>
        <div><span className="eyebrow">Lesson {LESSON[sel].n}</span><div className="serif" style={{ fontSize: 20 }}>{LESSON[sel].title}</div></div>
        <button className="btn sm" onClick={() => go(`lesson/${sel}`)}>Open</button>
      </div>}
    </div>
  )
}
