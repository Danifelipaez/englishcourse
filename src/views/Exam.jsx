import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MODULE, MODULES } from '../content/index.js'
import { useData, useTheoryTime } from '../lib/store.jsx'
import { shuffle } from '../lib/logic.js'
import { celebrate } from '../components.jsx'
import { Runner, Explain } from './Exercises.jsx'

export default function Exam({ id, go }) {
  useTheoryTime()
  const m = MODULE[id]
  const { saveExam, moduleOpen, passed } = useData()
  const [stage, setStage] = useState('intro')
  const [res, setRes] = useState(null)
  const items = useMemo(() => shuffle([
    ...m.examItems,
    ...shuffle(m.lessons.flatMap(l => l.exercises.filter(e => ['mc', 'fill', 'fix', 'order', 'listen'].includes(e.type)))).slice(0, 5),
  ]), [id, stage === 'run'])

  if (!moduleOpen(m)) return <div className="card center stack"><h3>Locked</h3><p className="muted">Pass the previous module first.</p><button className="btn" onClick={() => go('path')}>Back</button></div>

  const finish = async r => {
    const ok = r.score >= 70
    await saveExam(m.id, r.score, ok, { wrong: r.results.filter(x => !x.correct).map(x => ({ id: x.ex.id, given: x.given })) })
    setRes({ ...r, ok })
    setStage('done')
    if (ok) setTimeout(() => celebrate(true), 500)
  }
  const nextMod = MODULES[m.n]

  if (stage === 'run') return <Runner items={items} context="exam" exam onFinish={finish} onExit={() => setStage('intro')} />

  if (stage === 'done') return (
    <div className="stack center enter">
      <div className={`seal ${res.ok ? '' : 'gray'}`} style={{ width: 96, height: 96, fontSize: 36, margin: '16px auto 0', animation: 'stampIn .8s var(--ease)' }}>{res.ok ? m.n : '·'}</div>
      <span className="eyebrow">Module {m.n} exam</span>
      <h1>{res.score}%</h1>
      <h3 className="italic">{res.ok ? `“${m.title}” is sealed.` : 'Not sealed yet — and that’s okay.'}</h3>
      <p className="muted">{res.ok ? (nextMod ? `Module ${nextMod.n}, “${nextMod.title}”, is now open.` : 'You finished the whole path. That’s B1. 🗼') : 'You need 70%. Review the threads below and try again tomorrow — the questions change every time.'}</p>
      {res.results.some(x => !x.correct) && (
        <div className="card" style={{ textAlign: 'left' }}>
          <span className="eyebrow">Review your mistakes</span>
          <div className="stack-s" style={{ marginTop: 10 }}>
            {res.results.filter(x => !x.correct).map(({ ex, given }) => (
              <div key={ex.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
                <div className="serif" style={{ fontSize: 18 }}>{ex.prompt || ex.es || '(listening)'}</div>
                <div className="small"><span style={{ color: 'var(--bad)' }}>You: {given || '—'}</span> · <span style={{ color: 'var(--ok)' }}>Answer: {ex.answer?.split('|')[0]}</span></div>
                {ex.why && <div className="small muted">{ex.why}</div>}
                {ex.type !== 'speak' && <div style={{ marginTop: 6 }}><Explain ex={ex} given={given} /></div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {res.ok && nextMod ? <button className="btn wax block" onClick={() => go(`module/${nextMod.id}`)}>Open module {nextMod.n} <ArrowRight /></button>
        : <button className="btn block" onClick={() => go('review')}>Review the threads</button>}
      <button className="btn ghost block" onClick={() => go(`module/${m.id}`)}>Back to the module</button>
    </div>
  )

  return (
    <div className="stack">
      <div className="row"><button className="icon-btn" onClick={() => go(`module/${m.id}`)} aria-label="Back"><ArrowLeft /></button>
        <div className="grow"><span className="eyebrow">Module {m.n} · exam</span><h2>{m.title}</h2></div></div>
      <div className="card center stack tape" style={{ paddingTop: 32 }}>
        <div className="seal" style={{ margin: '0 auto' }}>{passed.has(m.id) ? '✓' : m.n}</div>
        <h3 className="italic">Seal this drawer</h3>
        <ul className="small muted" style={{ textAlign: 'left', margin: '0 auto', lineHeight: 1.9 }}>
          <li>{items.length} questions from the whole module</li>
          <li>No hints and no combo — just you</li>
          <li>70% opens the next module (+150 points)</li>
          <li>The questions change on every attempt</li>
        </ul>
        <button className="btn wax" onClick={() => setStage('run')}>Begin <ArrowRight /></button>
      </div>
    </div>
  )
}
