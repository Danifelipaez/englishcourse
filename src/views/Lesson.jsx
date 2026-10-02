import { useState } from 'react'
import { ArrowLeft, ArrowRight, Link2, Languages, RotateCcw } from 'lucide-react'
import { LESSON, MODULE, linkedFrom } from '../content/index.js'
import { useData, useTheoryTime } from '../lib/store.jsx'
import { BRIEF } from '../content/es.js'
import { Morph, SpeakBtn, Sheet, celebrate } from '../components.jsx'
import { Runner } from './Exercises.jsx'
import { speak } from '../lib/speech.js'

export default function Lesson({ id, go }) {
  useTheoryTime()
  const lesson = LESSON[id]
  const { completeLesson, progress, lessonOpen } = useData()
  const first = lesson?.read ? 'read' : 'theory'
  const [stage, setStage] = useState(BRIEF[id] ? 'brief' : first) // brief → (read) → theory → words → practice → done
  const [result, setResult] = useState(null)
  const [briefOpen, setBriefOpen] = useState(false)
  if (!lesson) return <p>Lesson not found.</p>
  if (!lessonOpen(lesson)) return <div className="card center stack"><h3>This drawer is still locked</h3><p className="muted">Finish the lesson before it — or pass the previous module’s exam.</p><button className="btn" onClick={() => go('path')}>Back to the path</button></div>
  const mod = MODULE[lesson.moduleId]

  const finish = async r => {
    const added = await completeLesson(lesson.id, r.score)
    setResult({ ...r, added })
    setStage('done')
    celebrate(r.score >= 90)
  }

  return (
    <div className="stack">
      {stage !== 'practice' && <div className="row">
        <button className="icon-btn" onClick={() => go(`module/${mod.id}`)} aria-label="Back to module"><ArrowLeft /></button>
        <div className="grow"><div className="eyebrow">Lesson {lesson.n} · {lesson.topic}</div><h2>{lesson.title}</h2></div>
        {BRIEF[id] && stage !== 'brief' && <button className="chip" onClick={() => setBriefOpen(true)} aria-label="Ver la explicación en español">ES · Explicación</button>}
      </div>}

      {stage === 'brief' && <Brief b={BRIEF[id]} onNext={() => setStage(first)} />}
      {briefOpen && <Sheet onClose={() => setBriefOpen(false)}><Brief b={BRIEF[id]} onNext={() => setBriefOpen(false)} cta="Volver a la lección" /></Sheet>}
      {stage === 'read' && <Story lesson={lesson} onNext={() => setStage('theory')} />}
      {stage === 'theory' && <Theory lesson={lesson} go={go} onNext={() => setStage('words')} />}
      {stage === 'words' && <Words lesson={lesson} onNext={() => setStage('practice')} />}
      {stage === 'practice' && <Runner items={lesson.exercises} context="lesson" readText={lesson.read?.text} onFinish={finish} onExit={() => go(`module/${mod.id}`)} />}
      {stage === 'done' && <Done lesson={lesson} result={result} best={progress[lesson.id]?.best_score} go={go} again={() => setStage('practice')} />}
    </div>
  )
}

// "Antes de empezar" — the rule, correct vs. typical mistake, and why. In Spanish on purpose.
function Brief({ b, onNext, cta = 'Entendido, empecemos' }) {
  return (
    <div className="stack enter" lang="es">
      <section className="card tape" style={{ paddingTop: 28 }}>
        <span className="eyebrow">Antes de empezar</span>
        <p style={{ margin: '10px 0 0', fontSize: 17 }}>{b.idea}</p>
      </section>
      <section className="card">
        <span className="eyebrow">Forma correcta · error típico · por qué</span>
        <div className="stack" style={{ marginTop: 12 }}>
          {b.forms.map(([right, wrong, why], i) => (
            <div key={i} className="enter" style={{ borderBottom: i < b.forms.length - 1 ? '1px solid var(--line)' : 0, paddingBottom: 14 }}>
              <div className="row" style={{ gap: 10 }}>
                <span aria-label="Correcto" style={{ color: 'var(--ok)', fontWeight: 600 }}>✓</span>
                <span className="serif grow" style={{ fontSize: 21, fontWeight: 600 }} lang="en">{right}</span>
                <SpeakBtn text={right.replace(/\(.*?\)/g, '')} />
              </div>
              <div className="row" style={{ gap: 10, marginTop: 2 }}>
                <span aria-label="Incorrecto" style={{ color: 'var(--bad)', fontWeight: 600 }}>✗</span>
                <span className="serif" style={{ fontSize: 18, color: 'var(--ink-3)', textDecoration: 'line-through', textDecorationColor: 'var(--rose)' }} lang="en">{wrong}</span>
              </div>
              <p className="small" style={{ margin: '6px 0 0 22px', color: 'var(--ink-2)' }}>{why}</p>
            </div>
          ))}
        </div>
      </section>
      {b.ojo && <div className="card cream flat"><b>Ojo: </b>{b.ojo}</div>}
      <button className="btn block" onClick={onNext}>{cta} <ArrowRight /></button>
    </div>
  )
}

function Story({ lesson, onNext }) {
  return (
    <div className="stack enter">
      <p className="muted">{lesson.intro}</p>
      <article className="card tape gold" style={{ paddingTop: 28 }}>
        <div className="row between"><span className="eyebrow">Letters from New York</span><SpeakBtn text={lesson.read.text} label="Read aloud" rate={0.88} /></div>
        <h3 className="italic" style={{ margin: '8px 0 12px' }}>{lesson.read.title}</h3>
        <div className="serif" style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: 1.6 }}>{lesson.read.text}</div>
      </article>
      <p className="small muted">Tip: read it once alone, then tap 🔊 and read along. Tap any sentence you like and say it out loud.</p>
      <button className="btn block" onClick={onNext}>I’ve read it <ArrowRight /></button>
    </div>
  )
}

function Theory({ lesson, go, onNext }) {
  const [es, setEs] = useState({})
  const threads = lesson.links.map(id => LESSON[id]).filter(Boolean)
  const ahead = linkedFrom(lesson.id).filter(l => !l.story).slice(0, 3)
  return (
    <div className="stack">
      {!lesson.read && <p className="muted enter">{lesson.intro}</p>}
      {threads.length > 0 && (
        <div className="card cream flat enter">
          <div className="row small"><Link2 size={16} /><b>Threads</b><span className="muted">— this lesson builds on</span></div>
          <div className="row wrap" style={{ marginTop: 8, gap: 6 }}>
            {threads.map(t => <button key={t.id} className="chip" onClick={() => go(`lesson/${t.id}`)}>{t.n} · {t.title}</button>)}
          </div>
        </div>
      )}
      {lesson.theory.map((b, i) => (
        <section key={i} className={`card theory enter ${i === 0 ? 'tape' : ''}`} style={{ paddingTop: i === 0 ? 28 : 20 }}>
          <div className="row between" style={{ alignItems: 'flex-start' }}>
            <h3>{b.h}</h3>
            {b.es && <button className="icon-btn" aria-pressed={!!es[i]} aria-label="Ver en español" onClick={() => setEs(s => ({ ...s, [i]: !s[i] }))}><Languages /></button>}
          </div>
          <div className="stack" style={{ marginTop: 10 }}>
            <p style={{ margin: 0 }}>{b.p}</p>
            {es[i] && <div className="es">{b.es}</div>}
            {b.anim && <Morph from={b.anim[0]} to={b.anim[1]} />}
            {b.table && <table className="gram"><tbody>{b.table.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k} style={k === 1 && r.length > 2 ? { fontWeight: 600 } : undefined}>{c}</td>)}</tr>)}</tbody></table>}
            {b.ex && <div>{b.ex.map(x => <div key={x} className="example"><SpeakBtn text={x.replace(/\(.*?\)/g, '')} /><span>{x}</span></div>)}</div>}
          </div>
        </section>
      ))}
      {ahead.length > 0 && <p className="small muted">Coming later, this idea returns in: {ahead.map(l => `${l.n} ${l.title}`).join(' · ')}</p>}
      <button className="btn block" onClick={onNext}>New words <ArrowRight /></button>
    </div>
  )
}

function Words({ lesson, onNext }) {
  const [flipped, setFlipped] = useState({})
  return (
    <div className="stack">
      <p className="muted">Tap a card to see its meaning. These words go into your memory box when you finish.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        {lesson.vocab.map(([en, es, example], i) => (
          <button key={en} className="card enter" style={{ textAlign: 'left', minHeight: 116, padding: 16, perspective: 600 }}
            onClick={() => { setFlipped(f => ({ ...f, [i]: !f[i] })); if (!flipped[i]) speak(en) }} aria-label={`${en}: ${flipped[i] ? es : 'tap to reveal'}`}>
            {!flipped[i]
              ? <div className="stack-s"><span className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{en}</span><span className="small muted">tap to flip</span></div>
              : <div className="stack-s" style={{ animation: 'fadeUp .3s' }}><span className="small" style={{ color: 'var(--wax)' }}>{es}</span><span className="serif italic" style={{ fontSize: 16 }}>{example}</span></div>}
          </button>
        ))}
      </div>
      <button className="btn block" onClick={onNext}>Start practice <ArrowRight /></button>
    </div>
  )
}

function Done({ lesson, result, best, go, again }) {
  const stars = result.score >= 90 ? 3 : result.score >= 70 ? 2 : 1
  const mod = MODULE[lesson.moduleId]
  const idx = mod.lessons.indexOf(lesson)
  const next = mod.lessons[idx + 1]
  return (
    <div className="stack center enter">
      <div className="seal" style={{ margin: '12px auto 0', animation: 'stampIn .6s' }}>{'★'.repeat(stars)}</div>
      <h2>{result.score >= 90 ? 'Exquisite.' : result.score >= 70 ? 'Beautifully done.' : 'Done — and that counts.'}</h2>
      <div className="row" style={{ justifyContent: 'center', gap: 24 }}>
        <div><div className="serif" style={{ fontSize: 34, fontWeight: 600 }}>{result.score}%</div><div className="small muted">first try</div></div>
        <div><div className="serif" style={{ fontSize: 34, fontWeight: 600, color: 'var(--gold)' }}>+{Math.round(result.points) + 20}</div><div className="small muted">points</div></div>
        <div><div className="serif" style={{ fontSize: 34, fontWeight: 600, color: 'var(--wax)' }}>{result.bestCombo}</div><div className="small muted">best combo</div></div>
      </div>
      {result.added > 0 && <p className="muted">🗝️ {result.added} new words went into your memory box. They’ll come back tomorrow.</p>}
      {best > result.score && <p className="small muted">Your best on this lesson is still {best}%.</p>}
      <div className="stack-s">
        {next ? <button className="btn block" onClick={() => go(`lesson/${next.id}`)}>Next: {next.title} <ArrowRight /></button>
          : <button className="btn wax block" onClick={() => go(`exam/${mod.id}`)}>Take the module exam <ArrowRight /></button>}
        <button className="btn ghost block" onClick={again}><RotateCcw /> Practice again</button>
        <button className="btn ghost block" onClick={() => go('')}>Back to today</button>
      </div>
    </div>
  )
}
