import { useState } from 'react'
import { ArrowLeft, ArrowRight, Link2, Languages, RotateCcw, AlertTriangle } from 'lucide-react'
import { LESSON, MODULE, linkedFrom } from '../content/index.js'
import { useData, useTheoryTime } from '../lib/store.jsx'
import { BRIEF, LESSON_ES } from '../content/es.js'
import { Morph, SpeakBtn, Sheet, celebrate } from '../components.jsx'
import { Rich } from '../rich.jsx'
import { Runner, usableRun } from './Exercises.jsx'
import { loadDraft, saveDraft, clearDraft } from '../lib/drafts.js'
import { speak } from '../lib/speech.js'
import { useT } from '../lib/i18n.jsx'

export default function Lesson({ id, go }) {
  useTheoryTime()
  const lesson = LESSON[id]
  const { completeLesson, progress, lessonOpen, uid } = useData()
  const { t, help } = useT()
  const first = lesson?.read ? 'read' : 'theory'
  // The Spanish brief opens the lesson while it is fresh; later it stays one tap away (ES chip)
  const start = BRIEF[id] && help(id) ? 'brief' : first
  const draftKey = `lesson:${id}`
  const [draft] = useState(() => loadDraft(uid, draftKey)) // an interrupted session of this lesson, if any
  const savedRun = usableRun(draft?.run)
  const [resume, setResume] = useState(null)
  // brief → (read) → theory → words → practice → done; an unfinished practice offers to resume first
  const [stage, setStageRaw] = useState(() => savedRun ? 'resume' : ['read', 'theory', 'words'].includes(draft?.stage) ? draft.stage : start)
  const setStage = s => { setStageRaw(s); if (['brief', 'read', 'theory', 'words'].includes(s)) saveDraft(uid, draftKey, { stage: s }) }
  const [result, setResult] = useState(null)
  const [briefOpen, setBriefOpen] = useState(false)
  if (!lesson) return <p>{t('lesson.notFound')}</p>
  if (!lessonOpen(lesson)) return <div className="card center stack"><h3>{t('lesson.lockedH')}</h3><p className="muted">{t('lesson.lockedP')}</p><button className="btn" onClick={() => go('path')}>{t('path.back')}</button></div>
  const mod = MODULE[lesson.moduleId]

  const finish = async r => {
    const added = await completeLesson(lesson.id, r.score)
    setResult({ ...r, added })
    setResume(null)
    setStage('done')
    celebrate(r.score >= 90)
  }

  return (
    <div className="stack">
      {stage !== 'practice' && <div className="row">
        <button className="icon-btn" onClick={() => go(`module/${mod.id}`)} aria-label={t('common.back')}><ArrowLeft /></button>
        <div className="grow"><div className="eyebrow">{t('lesson.header', { n: lesson.n, topic: lesson.topic })}</div><h2>{lesson.title}</h2></div>
        {BRIEF[id] && stage !== 'brief' && <button className="chip" onClick={() => setBriefOpen(true)} aria-label={t('lesson.esAria')}>{t('lesson.esChip')}</button>}
      </div>}

      {stage === 'brief' && <Brief b={BRIEF[id]} onNext={() => setStage(first)} />}
      {briefOpen && <Sheet onClose={() => setBriefOpen(false)}><Brief b={BRIEF[id]} onNext={() => setBriefOpen(false)} cta={t('brief.back')} /></Sheet>}
      {stage === 'read' && <Story lesson={lesson} onNext={() => setStage('theory')} />}
      {stage === 'theory' && <Theory lesson={lesson} go={go} onNext={() => setStage('words')} />}
      {stage === 'words' && <Words lesson={lesson} onNext={() => setStage('practice')} />}
      {stage === 'resume' && <Resume run={savedRun} onContinue={() => { setResume(savedRun); setStageRaw('practice') }}
        onRestart={() => { clearDraft(uid, draftKey); setStageRaw(start) }} />}
      {stage === 'practice' && <Runner items={lesson.exercises} context="lesson" readText={lesson.read?.text} draftKey={draftKey} resume={resume} onFinish={finish} onExit={() => go(`module/${mod.id}`)} />}
      {stage === 'done' && <Done lesson={lesson} result={result} best={progress[lesson.id]?.best_score} go={go} again={() => setStage('practice')} />}
    </div>
  )
}

function Resume({ run, onContinue, onRestart }) {
  const { t } = useT()
  const total = run.queue.length
  return (
    <div className="card tape center stack enter" style={{ paddingTop: 32 }}>
      <span className="eyebrow">{t('resume.eyebrow')}</span>
      <h3 className="italic">{t('resume.h')}</h3>
      <p className="muted" style={{ margin: 0 }}>{t('resume.at', { i: Math.min(run.i + 1, total), n: total })}</p>
      <div className="bar rose"><i style={{ width: `${(run.i / total) * 100}%` }} /></div>
      <button className="btn" onClick={onContinue}>{t('resume.continue')} <ArrowRight /></button>
      <button className="btn ghost" onClick={onRestart}><RotateCcw /> {t('resume.restart')}</button>
    </div>
  )
}

// "Antes de empezar" — the rule, correct vs. typical mistake, and why. In Spanish on purpose.
function Brief({ b, onNext, cta }) {
  const { t } = useT()
  return (
    <div className="stack enter" lang="es">
      <section className="card tape" style={{ paddingTop: 28 }}>
        <span className="eyebrow">{t('brief.eyebrow')}</span>
        <p className="lead"><Rich text={b.idea} /></p>
      </section>
      <section className="card">
        <span className="eyebrow">{t('brief.forms')}</span>
        <div className="stack" style={{ marginTop: 12 }}>
          {b.forms.map(([right, wrong, why], i) => (
            <div key={i} className="enter" style={{ borderBottom: i < b.forms.length - 1 ? '1px solid var(--line)' : 0, paddingBottom: 14 }}>
              <div className="row" style={{ gap: 10 }}>
                <span aria-label={t('brief.right')} style={{ color: 'var(--ok)', fontWeight: 600 }}>✓</span>
                <span className="serif grow" style={{ fontSize: 21, fontWeight: 600 }} lang="en">{right}</span>
                <SpeakBtn text={right.replace(/\(.*?\)/g, '')} />
              </div>
              <div className="row" style={{ gap: 10, marginTop: 2 }}>
                <span aria-label={t('brief.wrong')} style={{ color: 'var(--bad)', fontWeight: 600 }}>✗</span>
                <span className="serif" style={{ fontSize: 18, color: 'var(--ink-3)', textDecoration: 'line-through', textDecorationColor: 'var(--rose)' }} lang="en">{wrong}</span>
              </div>
              <p className="small why-es"><Rich text={why} /></p>
            </div>
          ))}
        </div>
      </section>
      {b.ojo && <div className="callout"><AlertTriangle size={18} /><div><b>{t('brief.ojo')}</b> <Rich text={b.ojo} /></div></div>}
      <button className="btn block" onClick={onNext}>{cta || t('brief.cta')} <ArrowRight /></button>
    </div>
  )
}

function Story({ lesson, onNext }) {
  const { t, pick } = useT()
  return (
    <div className="stack enter">
      <p className="muted">{pick(lesson.intro, LESSON_ES[lesson.id], lesson.id)}</p>
      <article className="card tape gold" style={{ paddingTop: 28 }}>
        <div className="row between"><span className="eyebrow">{t('story.eyebrow')}</span><SpeakBtn text={lesson.read.text} label={t('story.aloud')} rate={0.88} /></div>
        <h3 className="italic" style={{ margin: '8px 0 12px' }}>{lesson.read.title}</h3>
        <div className="serif" style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: 1.6 }}>{lesson.read.text}</div>
      </article>
      <p className="small muted">{t('story.tip')}</p>
      <button className="btn block" onClick={onNext}>{t('story.done')} <ArrowRight /></button>
    </div>
  )
}

function Theory({ lesson, go, onNext }) {
  const { t, pick, help } = useT()
  // Spanish help is open by default while the lesson is fresh; she can always toggle it
  const [es, setEs] = useState({})
  const threads = lesson.links.map(id => LESSON[id]).filter(Boolean)
  const ahead = linkedFrom(lesson.id).filter(l => !l.story).slice(0, 3)
  const fresh = help(lesson.id)
  return (
    <div className="stack">
      {!lesson.read && <p className="muted enter">{pick(lesson.intro, LESSON_ES[lesson.id], lesson.id)}</p>}
      {threads.length > 0 && (
        <div className="card cream flat enter">
          <div className="row small"><Link2 size={16} /><b>{t('theory.threads')}</b><span className="muted">{t('theory.builds')}</span></div>
          <div className="row wrap" style={{ marginTop: 8, gap: 6 }}>
            {threads.map(th => <button key={th.id} className="chip" onClick={() => go(`lesson/${th.id}`)}>{th.n} · {th.title}</button>)}
          </div>
        </div>
      )}
      {lesson.theory.map((b, i) => {
        const showEs = !!b.es && (es[i] ?? fresh)
        const spanishFirst = showEs && fresh
        const esPanel = showEs && <div className="es" lang="es"><span className="es-tag">{t('theory.esLabel')}</span> <Rich text={b.es} /></div>
        return (
          <section key={i} className={`card theory enter ${i === 0 ? 'tape' : ''}`} style={{ paddingTop: i === 0 ? 28 : 20 }}>
            <div className="row between" style={{ alignItems: 'flex-start' }}>
              <h3>{b.h}</h3>
              {b.es && <button className="icon-btn" aria-pressed={!!showEs} aria-label={t('theory.esAria')} onClick={() => setEs(s => ({ ...s, [i]: !showEs }))}><Languages /></button>}
            </div>
            <div className="stack" style={{ marginTop: 10 }}>
              {spanishFirst && esPanel}
              <p className="rule" lang="en"><Rich text={b.p} /></p>
              {!spanishFirst && esPanel}
              {b.anim && <Morph from={b.anim[0]} to={b.anim[1]} />}
              {b.table && <table className="gram"><tbody>{b.table.map((r, j) => <tr key={j} className={j === 0 && r[0] === '' ? 'head' : ''}>{r.map((c, k) => <td key={k} style={k === 1 && r.length > 2 ? { fontWeight: 600 } : undefined}>{c}</td>)}</tr>)}</tbody></table>}
              {b.ex && <div>{b.ex.map(x => <div key={x} className="example"><SpeakBtn text={x.replace(/\(.*?\)/g, '')} /><span>{x}</span></div>)}</div>}
            </div>
          </section>
        )
      })}
      {ahead.length > 0 && <p className="small muted">{t('theory.later', { list: ahead.map(l => `${l.n} ${l.title}`).join(' · ') })}</p>}
      <button className="btn block" onClick={onNext}>{t('theory.words')} <ArrowRight /></button>
    </div>
  )
}

function Words({ lesson, onNext }) {
  const { t } = useT()
  const [flipped, setFlipped] = useState({})
  return (
    <div className="stack">
      <p className="muted">{t('words.tip')}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        {lesson.vocab.map(([en, es, example], i) => (
          <button key={en} className="card enter" style={{ textAlign: 'left', minHeight: 116, padding: 16, perspective: 600 }}
            onClick={() => { setFlipped(f => ({ ...f, [i]: !f[i] })); if (!flipped[i]) speak(en) }} aria-label={`${en}: ${flipped[i] ? es : t('words.reveal')}`}>
            {!flipped[i]
              ? <div className="stack-s"><span className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{en}</span><span className="small muted">{t('words.flip')}</span></div>
              : <div className="stack-s" style={{ animation: 'fadeUp .3s' }}><span className="small" style={{ color: 'var(--wax)' }}>{es}</span><span className="serif italic" style={{ fontSize: 16 }}>{example}</span></div>}
          </button>
        ))}
      </div>
      <button className="btn block" onClick={onNext}>{t('words.practice')} <ArrowRight /></button>
    </div>
  )
}

function Done({ lesson, result, best, go, again }) {
  const { t } = useT()
  const stars = result.score >= 90 ? 3 : result.score >= 70 ? 2 : 1
  const mod = MODULE[lesson.moduleId]
  const idx = mod.lessons.indexOf(lesson)
  const next = mod.lessons[idx + 1]
  return (
    <div className="stack center enter">
      <div className="seal" style={{ margin: '12px auto 0', animation: 'stampIn .6s' }}>{'★'.repeat(stars)}</div>
      <h2>{result.score >= 90 ? t('done.h90') : result.score >= 70 ? t('done.h70') : t('done.h')}</h2>
      <div className="row" style={{ justifyContent: 'center', gap: 24 }}>
        <div><div className="serif" style={{ fontSize: 34, fontWeight: 600 }}>{result.score}%</div><div className="small muted">{t('done.first')}</div></div>
        <div><div className="serif" style={{ fontSize: 34, fontWeight: 600, color: 'var(--gold)' }}>+{Math.round(result.points) + 20}</div><div className="small muted">{t('done.points')}</div></div>
        <div><div className="serif" style={{ fontSize: 34, fontWeight: 600, color: 'var(--wax)' }}>{result.bestCombo}</div><div className="small muted">{t('done.combo')}</div></div>
      </div>
      {result.added > 0 && <p className="muted">{t('done.words', { n: result.added })}</p>}
      {best > result.score && <p className="small muted">{t('done.best', { n: best })}</p>}
      <div className="stack-s">
        {next ? <button className="btn block" onClick={() => go(`lesson/${next.id}`)}>{t('done.next', { title: next.title })} <ArrowRight /></button>
          : <button className="btn wax block" onClick={() => go(`exam/${mod.id}`)}>{t('done.exam')} <ArrowRight /></button>}
        <button className="btn ghost block" onClick={again}><RotateCcw /> {t('done.again')}</button>
        <button className="btn ghost block" onClick={() => go('')}>{t('done.today')}</button>
      </div>
    </div>
  )
}
