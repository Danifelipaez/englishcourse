import { useEffect, useMemo, useRef, useState } from 'react'
import { Mic, Volume2, X, Turtle, Check, Sparkles } from 'lucide-react'
import { accepts, normalize, shuffle, similarity, multiplier, BASE_POINTS } from '../lib/logic.js'
import { speak, listen, canListen } from '../lib/speech.js'
import { useData } from '../lib/store.jsx'
import { ask, levelOf } from '../lib/tutor.js'
import { Sheet, SpeakBtn } from '../components.jsx'
import { Why } from '../rich.jsx'
import { useT } from '../lib/i18n.jsx'
import { EXERCISE } from '../content/index.js'
import { saveDraft, clearDraft } from '../lib/drafts.js'

/** One exercise. Calls onAnswer(correct, given) exactly once. `quiet` hides feedback (exams). */
export function Exercise({ ex, onAnswer, onSkip, quiet, readText }) {
  const { t } = useT()
  const [done, setDone] = useState(null) // { correct, given }
  const submit = (correct, given) => { if (done) return; setDone({ correct, given }); onAnswer(correct, given) }
  const props = { ex, submit, done, quiet, onSkip }
  return (
    <div className="stack">
      <span className="eyebrow">{t(`ex.${ex.type}`)}</span>
      {ex.type === 'read' && readText && <details className="card cream flat"><summary className="small muted">{t('ex.reread')}</summary><p className="serif" style={{ whiteSpace: 'pre-line', fontSize: 18 }}>{readText}</p></details>}
      {(ex.type === 'mc' || ex.type === 'read' || ex.type === 'card') && <Choice {...props} />}
      {(ex.type === 'fill' || ex.type === 'fix' || ex.type === 'type') && <Typed {...props} />}
      {(ex.type === 'order' || ex.type === 'listen') && <Order {...props} />}
      {ex.type === 'speak' && <Speak {...props} />}
      {ex.type === 'match' && <Match {...props} />}
      {done && !quiet && (
        <div className={`why ${done.correct ? '' : 'no'}`} role="status">
          {done.correct ? <b>{t(`praise.${(ex.id.length + (done.given?.length || 0)) % 7}`)} </b> : <b>{t('ex.notQuite')} </b>}
          {!done.correct && ex.answer && <>{t('ex.answer')} <b>{ex.answer.split('|')[0]}</b>. </>}
          <Why text={ex.why} />
        </div>
      )}
      {done && !quiet && !done.correct && ex.answer && ex.type !== 'speak' && <Explain ex={ex} given={done.given} />}
    </div>
  )
}

/** "✨ Explícame": Gemini explains in Spanish why her answer was wrong */
export function Explain({ ex, given }) {
  const { currentModule, knownTopics } = useData()
  const { t } = useT()
  const [state, setState] = useState(null) // null | 'busy' | { explicacion, ejemplo, truco } | { error }
  const go = async () => {
    setState('busy')
    try {
      setState(await ask({ mode: 'explain', level: levelOf(currentModule), topic: ex.topic || '', prompt: ex.prompt || ex.es || '(listening)', answer: ex.answer.split('|')[0], given: String(given ?? ''), known: knownTopics }))
    } catch (e) { setState({ error: e.message }) }
  }
  if (!state) return <button className="btn ghost sm" style={{ justifySelf: 'start' }} onClick={go}><Sparkles /> {t('ex.explain')}</button>
  if (state === 'busy') return <div className="small muted italic" role="status">{t('ex.thinking')}</div>
  if (state.error) return <div className="small muted" role="alert">{state.error}</div>
  return (
    <div className="card cream flat stack-s enter" lang="es" role="status">
      <div className="row small"><Sparkles size={16} /><b>{t('ex.tutorSays')}</b></div>
      <p style={{ margin: 0 }}>{state.explicacion}</p>
      {state.ejemplo && <div className="row" style={{ gap: 8 }}><SpeakBtn text={state.ejemplo} /><span className="serif italic" style={{ fontSize: 18 }} lang="en">{state.ejemplo}</span></div>}
      {state.truco && <p className="small" style={{ margin: 0 }}><b>{t('ex.trick')}</b> {state.truco}</p>}
    </div>
  )
}

function Choice({ ex, submit, done, quiet }) {
  const { t } = useT()
  const options = useMemo(() => shuffle(ex.options), [ex.id])
  const [picked, setPicked] = useState(null)
  return (
    <>
      {ex.type === 'card'
        ? <div className="center stack-s"><div className="prompt" style={{ fontSize: 34 }}>{ex.prompt}</div>{ex.speak && <div><button className="btn ghost sm" onClick={() => speak(ex.speak)}><Volume2 /> {t('ex.listenBtn')}</button></div>}</div>
        : <div className="prompt">{renderBlank(ex.prompt)}</div>}
      <div className="stack-s">
        {options.map(o => {
          const cls = !done ? '' : quiet ? (o === picked ? 'picked' : '') : o === ex.answer ? 'right' : o === picked ? 'wrong' : ''
          return <button key={o} className={`option ${cls}`} disabled={!!done} onClick={() => { setPicked(o); submit(o === ex.answer, o) }}>{o}</button>
        })}
      </div>
    </>
  )
}

const renderBlank = s => s.split('___').flatMap((p, i) => i ? [<span key={i} className="blank">&nbsp;</span>, p] : [p])

function Typed({ ex, submit, done }) {
  const { t } = useT()
  const [v, setV] = useState(ex.type === 'fix' ? ex.prompt : '')
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus({ preventScroll: true }) }, [ex.id])
  const check = () => v.trim() && submit(accepts(ex.answer, v), v)
  return (
    <>
      {ex.type === 'fix'
        ? <div className="prompt" style={{ textDecoration: 'line-through', textDecorationColor: 'var(--rose)', textDecorationThickness: 2 }}>{ex.prompt}</div>
        : <div className="prompt">{renderBlank(ex.prompt)}</div>}
      {ex.hint && <div className="small muted">{ex.hint}</div>}
      <input ref={ref} className="input" value={v} onChange={e => setV(e.target.value)} disabled={!!done} autoCapitalize="off" autoCorrect="off" spellCheck={false}
        placeholder={ex.type === 'fix' ? t('ex.rewrite') : t('ex.missing')} onKeyDown={e => e.key === 'Enter' && !done && check()} aria-label={t('ex.yourAnswer')} />
      {!done && <button className="btn" onClick={check} disabled={!v.trim()}>{t('ex.check')}</button>}
    </>
  )
}

function Order({ ex, submit, done }) {
  const { t } = useT()
  const words = useMemo(() => {
    const w = ex.answer.replace(/[?.!]$/, '').split(' ').map((t, i) => ({ t, i }))
    let s = shuffle(w)
    for (let k = 0; k < 5 && s.every((x, j) => x.i === j) && w.length > 2; k++) s = shuffle(w)
    return s
  }, [ex.id])
  const [built, setBuilt] = useState([])
  const listenMode = ex.type === 'listen'
  useEffect(() => { if (listenMode) setTimeout(() => speak(ex.answer), 350) }, [ex.id])
  const used = new Set(built.map(w => w.i))
  const check = () => submit(normalize(built.map(w => w.t).join(' ')) === normalize(ex.answer), built.map(w => w.t).join(' '))
  return (
    <>
      {listenMode
        ? <div className="row" style={{ justifyContent: 'center' }}>
            <button className="speaker" onClick={() => speak(ex.answer)} aria-label={t('ex.play')}><Volume2 /></button>
            <button className="icon-btn" onClick={() => speak(ex.answer, .6)} aria-label={t('ex.slow')}><Turtle /></button>
          </div>
        : ex.es && <div className="prompt" style={{ fontSize: 20 }}><span className="muted italic">“{ex.es}”</span></div>}
      <div className="tiles answer" aria-label={t('ex.yourSentence')}>
        {built.map(w => <button key={w.i} className="tile" disabled={!!done} onClick={() => setBuilt(b => b.filter(x => x.i !== w.i))}>{w.t}</button>)}
      </div>
      <div className="tiles">
        {words.map(w => <button key={w.i} className={`tile ${used.has(w.i) ? 'used' : ''}`} disabled={!!done || used.has(w.i)} onClick={() => setBuilt(b => [...b, w])}>{w.t}</button>)}
      </div>
      {!done && <button className="btn" onClick={check} disabled={built.length !== words.length}>{t('ex.check')}</button>}
    </>
  )
}

function Speak({ ex, submit, done, onSkip }) {
  const { t } = useT()
  const [state, setState] = useState('idle') // idle | live | heard | blocked
  const [heard, setHeard] = useState('')
  const go = async () => {
    setState('live')
    try {
      const alts = await listen()
      const best = alts.sort((a, b) => similarity(ex.answer, b) - similarity(ex.answer, a))[0] || ''
      setHeard(best); setState(best ? 'heard' : 'idle')
      if (similarity(ex.answer, best) >= .75) submit(true, best)
    } catch { setState('blocked') }
  }
  const selfCheck = !canListen || state === 'blocked'
  return (
    <>
      <div className="prompt">{ex.answer} <button className="icon-btn" onClick={() => speak(ex.answer)} aria-label={t('ex.listenFirst')}><Volume2 /></button></div>
      {!selfCheck ? (
        <div className="center stack-s">
          <button className={`speaker ${state === 'live' ? 'live' : ''}`} onClick={go} disabled={!!done || state === 'live'} aria-label={t('ex.startSpeak')}><Mic /></button>
          <span className="small muted">{state === 'live' ? t('ex.listening') : done ? '' : state === 'heard' ? t('ex.almost') : t('ex.tapMic')}</span>
          {heard && <div className="small">{t('ex.heard')} <i>“{heard}”</i></div>}
        </div>
      ) : (
        <div className="stack-s">
          <span className="small muted">{state === 'blocked' ? `${t('ex.noMic')} ` : ''}{t('ex.selfCheck')}</span>
          {!done && <button className="btn" onClick={() => submit(true, '(self-check)')}><Check /> {t('ex.said')}</button>}
        </div>
      )}
      {!done && state !== 'live' && <button className="btn ghost sm" style={{ justifySelf: 'center' }} onClick={onSkip}>{t('ex.cantSpeak')}</button>}
    </>
  )
}

function Match({ ex, submit, done }) {
  const left = useMemo(() => shuffle(ex.pairs.map(p => p[0])), [ex.id])
  const right = useMemo(() => shuffle(ex.pairs.map(p => p[1])), [ex.id])
  const [sel, setSel] = useState(null)
  const [ok, setOk] = useState([])
  const [bad, setBad] = useState(null)
  const misses = useRef(0)
  const pick = (side, v) => {
    if (side === 'l') { setSel(v); speak(v); return }
    if (!sel) return
    const pair = ex.pairs.find(p => p[0] === sel)
    if (pair[1] === v) {
      const next = [...ok, sel]; setOk(next); setSel(null)
      if (next.length === ex.pairs.length) submit(misses.current <= 1, `${misses.current} misses`)
    } else { misses.current++; setBad(v); setTimeout(() => setBad(null), 450) }
  }
  const okEs = new Set(ex.pairs.filter(p => ok.includes(p[0])).map(p => p[1]))
  return (
    <div className="match">
      <div className="stack-s">{left.map(v => <button key={v} className={`option ${ok.includes(v) ? 'done' : ''} ${sel === v ? 'picked' : ''}`} disabled={!!done} onClick={() => pick('l', v)}>{v}</button>)}</div>
      <div className="stack-s">{right.map(v => <button key={v} className={`option ${okEs.has(v) ? 'done' : ''} ${bad === v ? 'wrong' : ''}`} disabled={!!done} onClick={() => pick('r', v)}>{v}</button>)}</div>
    </div>
  )
}

/** A saved run is usable only if every exercise in it still exists */
export function usableRun(run, resolve = id => EXERCISE[id]) {
  if (!run?.queue?.length || run.queue.some(id => !resolve(id))) return null
  return run
}

/**
 * Runs a list of exercises with combo multiplier, floating points and logging.
 * Lessons/reviews re-queue missed items once at the end. Exams are quiet (no feedback until the end).
 * With `draftKey`, the run is saved after every answer; pass the saved run as `resume` to continue where it stopped.
 */
export function Runner({ items, context, onFinish, onExit, exam = false, readText, onCard, draftKey, resume, resolve = id => EXERCISE[id] }) {
  const { logAnswer, uid } = useData()
  const { t } = useT()
  const [queue, setQueue] = useState(() => resume ? resume.queue.map(resolve) : items)
  const [i, setI] = useState(resume?.i ?? 0)
  const [answered, setAnswered] = useState(null) // null | { correct }
  const [combo, setCombo] = useState(resume?.combo ?? 0)
  const [bump, setBump] = useState(0)
  const [float, setFloat] = useState(null)
  const [leaving, setLeaving] = useState(false)
  const stats = useRef(resume
    ? { points: resume.stats.points, best: resume.stats.best, first: { ...resume.stats.first }, results: resume.stats.results.map(r => ({ ex: resolve(r.id), correct: r.correct, given: r.given })) }
    : { points: 0, best: 0, first: {}, results: [] })
  const n0 = useRef(resume?.n0 ?? items.length)
  const finished = useRef(false)
  const ex = queue[i]
  const retry = i >= n0.current

  const persist = (q, nextI, c) => {
    if (!draftKey) return
    const s = stats.current
    saveDraft(uid, draftKey, { run: { queue: q.map(e => e.id), n0: n0.current, i: nextI, combo: c,
      stats: { points: s.points, best: s.best, first: s.first, results: s.results.map(r => ({ id: r.ex.id, correct: r.correct, given: String(r.given ?? '').slice(0, 300) })) } } })
  }
  const finish = () => {
    if (finished.current) return
    finished.current = true
    const s = stats.current
    if (draftKey) clearDraft(uid, draftKey)
    const firstTry = Object.values(s.first)
    onFinish({ points: s.points, bestCombo: s.best, score: Math.round(100 * firstTry.filter(Boolean).length / Math.max(1, firstTry.length)), results: s.results })
  }

  const onAnswer = (correct, given) => {
    const c = exam ? 0 : correct ? combo + 1 : 0
    const pts = exam || !correct ? 0 : BASE_POINTS * multiplier(c) * (retry ? 0.5 : 1)
    setCombo(c)
    setAnswered({ correct })
    const s = stats.current
    s.points += pts
    s.best = Math.max(s.best, c)
    if (!(ex.id in s.first)) { s.first[ex.id] = correct; s.results.push({ ex, correct, given }) }
    const requeue = !correct && !exam && !retry && ex.type !== 'speak'
    if (requeue) setQueue(q => [...q, ex])
    persist(requeue ? [...queue, ex] : queue, i + 1, c)
    if (pts) { setFloat({ k: Date.now(), t: `+${pts}${multiplier(c) > 1 ? ` ×${multiplier(c)}` : ''}` }); setBump(b => b + 1) }
    if (ex.cardId) onCard?.(ex.cardId, correct)
    logAnswer({ context, lesson_id: ex.lessonId, item_id: ex.cardId || ex.id, skill: ex.skill, topic: ex.topic, correct, given: String(given ?? ''), combo: c, points: pts })
    if (exam) setTimeout(next, 250)
  }
  const next = () => {
    setAnswered(null)
    if (i + 1 >= queue.length) finish()
    else setI(n => n + 1)
  }
  // she left right after the last answer: the run was already complete
  useEffect(() => { if (resume && !ex) finish() }, [])
  useEffect(() => {
    const k = e => { if (e.key === 'Enter' && answered && !exam && document.activeElement?.tagName !== 'INPUT') next() }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  })

  if (!ex) return null
  const mult = multiplier(combo)
  return (
    <div className="stack">
      <div className="row">
        <button className="icon-btn" onClick={() => setLeaving(true)} aria-label={t('run.leaveAria')}><X /></button>
        <div className="grow"><div className="bar rose"><i style={{ width: `${(i / queue.length) * 100}%` }} /></div></div>
        {!exam && <span key={bump} className={`combo ${bump ? 'bump' : ''}`} title={t('run.comboTip')} aria-label={`Combo ${combo}, multiplier ${mult}`}>
          <span className="small muted">{combo}🔥</span><span className="x">×{mult}</span>
        </span>}
      </div>
      {!exam && <div className="ink" style={{ width: `${Math.min(100, ((combo % 3) / 3) * 100 + (mult >= 5 ? 100 : 0))}%` }} title={t('run.inkTip')} />}
      {retry && !exam && <div className="small muted italic">{t('run.second')}</div>}
      <div className="card" key={ex.id + i}>
        <Exercise ex={ex} onAnswer={onAnswer} onSkip={next} quiet={exam} readText={readText} />
        {answered && !exam && <span className={`stamp ${answered.correct ? 'ok' : 'no'}`}>{answered.correct ? t('run.correct') : t('run.oops')}</span>}
      </div>
      {answered && !exam && <button className="btn block" onClick={next} autoFocus>{t('common.continue')}</button>}
      {float && <div key={float.k} className="float-xp" aria-hidden="true">{float.t}</div>}
      {leaving && <Sheet onClose={() => setLeaving(false)}>
        <div className="stack center">
          <h3>{t('run.leaveH')}</h3>
          <p className="muted">{t('run.leaveP')}</p>
          <button className="btn" onClick={() => setLeaving(false)}>{t('run.keep')}</button>
          <button className="btn ghost" onClick={onExit}>{t('run.exit')}</button>
        </div>
      </Sheet>}
    </div>
  )
}
