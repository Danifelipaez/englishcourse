import { useEffect, useMemo, useRef, useState } from 'react'
import { Mic, Volume2, X, Turtle, Check, Sparkles } from 'lucide-react'
import { accepts, normalize, shuffle, similarity, multiplier, BASE_POINTS } from '../lib/logic.js'
import { speak, listen, canListen } from '../lib/speech.js'
import { useData } from '../lib/store.jsx'
import { ask, levelOf } from '../lib/tutor.js'
import { Sheet, SpeakBtn } from '../components.jsx'

const PRAISE = ['Lovely!', 'Perfect!', 'Brilliant!', 'Yes!', 'Beautiful!', 'Exactly!', 'Chic!']
const LABEL = { mc: 'Choose the right answer', read: 'Reading', fill: 'Fill in the blank', fix: 'Find and fix the mistake', order: 'Put the words in order',
  listen: 'Listen and build the sentence', speak: 'Say it out loud', match: 'Match the pairs', card: 'Memory box' }

/** One exercise. Calls onAnswer(correct, given) exactly once. `quiet` hides feedback (exams). */
export function Exercise({ ex, onAnswer, onSkip, quiet, readText }) {
  const [done, setDone] = useState(null) // { correct, given }
  const submit = (correct, given) => { if (done) return; setDone({ correct, given }); onAnswer(correct, given) }
  const props = { ex, submit, done, quiet, onSkip }
  return (
    <div className="stack">
      <span className="eyebrow">{LABEL[ex.type]}</span>
      {ex.type === 'read' && readText && <details className="card cream flat"><summary className="small muted">Read the text again</summary><p className="serif" style={{ whiteSpace: 'pre-line', fontSize: 18 }}>{readText}</p></details>}
      {(ex.type === 'mc' || ex.type === 'read' || ex.type === 'card') && <Choice {...props} />}
      {(ex.type === 'fill' || ex.type === 'fix' || ex.type === 'type') && <Typed {...props} />}
      {(ex.type === 'order' || ex.type === 'listen') && <Order {...props} />}
      {ex.type === 'speak' && <Speak {...props} />}
      {ex.type === 'match' && <Match {...props} />}
      {done && !quiet && (
        <div className={`why ${done.correct ? '' : 'no'}`} role="status">
          {done.correct ? <b>{PRAISE[(ex.id.length + (done.given?.length || 0)) % PRAISE.length]} </b> : <b>Not quite. </b>}
          {!done.correct && ex.answer && <>Answer: <b>{ex.answer.split('|')[0]}</b>. </>}
          {ex.why}
        </div>
      )}
      {done && !quiet && !done.correct && ex.answer && ex.type !== 'speak' && <Explain ex={ex} given={done.given} />}
    </div>
  )
}

/** "✨ Explícame": Gemini explains in Spanish why her answer was wrong */
export function Explain({ ex, given }) {
  const { currentModule } = useData()
  const [state, setState] = useState(null) // null | 'busy' | { explicacion, ejemplo, truco } | { error }
  const go = async () => {
    setState('busy')
    try {
      setState(await ask({ mode: 'explain', level: levelOf(currentModule), topic: ex.topic || '', prompt: ex.prompt || ex.es || '(listening)', answer: ex.answer.split('|')[0], given: String(given ?? '') }))
    } catch (e) { setState({ error: e.message }) }
  }
  if (!state) return <button className="btn ghost sm" style={{ justifySelf: 'start' }} onClick={go}><Sparkles /> Explícame</button>
  if (state === 'busy') return <div className="small muted italic" role="status">Tu tutora está pensando…</div>
  if (state.error) return <div className="small muted" role="alert">{state.error}</div>
  return (
    <div className="card cream flat stack-s enter" lang="es" role="status">
      <div className="row small"><Sparkles size={16} /><b>Tu tutora explica</b></div>
      <p style={{ margin: 0 }}>{state.explicacion}</p>
      {state.ejemplo && <div className="row" style={{ gap: 8 }}><SpeakBtn text={state.ejemplo} /><span className="serif italic" style={{ fontSize: 18 }} lang="en">{state.ejemplo}</span></div>}
      {state.truco && <p className="small" style={{ margin: 0 }}><b>Truco:</b> {state.truco}</p>}
    </div>
  )
}

function Choice({ ex, submit, done, quiet }) {
  const options = useMemo(() => shuffle(ex.options), [ex.id])
  const [picked, setPicked] = useState(null)
  return (
    <>
      {ex.type === 'card'
        ? <div className="center stack-s"><div className="prompt" style={{ fontSize: 34 }}>{ex.prompt}</div>{ex.speak && <div><button className="btn ghost sm" onClick={() => speak(ex.speak)}><Volume2 /> listen</button></div>}</div>
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
        placeholder={ex.type === 'fix' ? 'Rewrite the sentence correctly' : 'Type the missing word'} onKeyDown={e => e.key === 'Enter' && !done && check()} aria-label="Your answer" />
      {!done && <button className="btn" onClick={check} disabled={!v.trim()}>Check</button>}
    </>
  )
}

function Order({ ex, submit, done }) {
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
            <button className="speaker" onClick={() => speak(ex.answer)} aria-label="Play sentence"><Volume2 /></button>
            <button className="icon-btn" onClick={() => speak(ex.answer, .6)} aria-label="Play slowly"><Turtle /></button>
          </div>
        : ex.es && <div className="prompt" style={{ fontSize: 20 }}><span className="muted italic">“{ex.es}”</span></div>}
      <div className="tiles answer" aria-label="Your sentence">
        {built.map(w => <button key={w.i} className="tile" disabled={!!done} onClick={() => setBuilt(b => b.filter(x => x.i !== w.i))}>{w.t}</button>)}
      </div>
      <div className="tiles">
        {words.map(w => <button key={w.i} className={`tile ${used.has(w.i) ? 'used' : ''}`} disabled={!!done || used.has(w.i)} onClick={() => setBuilt(b => [...b, w])}>{w.t}</button>)}
      </div>
      {!done && <button className="btn" onClick={check} disabled={built.length !== words.length}>Check</button>}
    </>
  )
}

function Speak({ ex, submit, done, onSkip }) {
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
      <div className="prompt">{ex.answer} <button className="icon-btn" onClick={() => speak(ex.answer)} aria-label="Listen first"><Volume2 /></button></div>
      {!selfCheck ? (
        <div className="center stack-s">
          <button className={`speaker ${state === 'live' ? 'live' : ''}`} onClick={go} disabled={!!done || state === 'live'} aria-label="Start speaking"><Mic /></button>
          <span className="small muted">{state === 'live' ? 'Listening…' : done ? '' : state === 'heard' ? 'Almost! Try once more' : 'Tap the mic and read the sentence'}</span>
          {heard && <div className="small">I heard: <i>“{heard}”</i></div>}
        </div>
      ) : (
        <div className="stack-s">
          <span className="small muted">{state === 'blocked' ? 'The microphone isn’t available. ' : ''}Read it out loud — slowly, then naturally. Be honest 💛</span>
          {!done && <button className="btn" onClick={() => submit(true, '(self-check)')}><Check /> I said it</button>}
        </div>
      )}
      {!done && state !== 'live' && <button className="btn ghost sm" style={{ justifySelf: 'center' }} onClick={onSkip}>Can’t speak right now</button>}
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

/**
 * Runs a list of exercises with combo multiplier, floating points and logging.
 * Lessons/reviews re-queue missed items once at the end. Exams are quiet (no feedback until the end).
 */
export function Runner({ items, context, onFinish, onExit, exam = false, readText, onCard }) {
  const { logAnswer } = useData()
  const [queue, setQueue] = useState(items)
  const [i, setI] = useState(0)
  const [answered, setAnswered] = useState(null) // null | { correct }
  const [combo, setCombo] = useState(0)
  const [bump, setBump] = useState(0)
  const [float, setFloat] = useState(null)
  const [leaving, setLeaving] = useState(false)
  const stats = useRef({ points: 0, best: 0, first: {}, results: [] })
  const ex = queue[i]
  const retry = i >= items.length

  const onAnswer = (correct, given) => {
    const c = exam ? 0 : correct ? combo + 1 : 0
    const pts = exam || !correct ? 0 : BASE_POINTS * multiplier(c) * (retry ? 0.5 : 1)
    setCombo(c)
    setAnswered({ correct })
    const s = stats.current
    s.points += pts
    s.best = Math.max(s.best, c)
    if (!(ex.id in s.first)) { s.first[ex.id] = correct; s.results.push({ ex, correct, given }) }
    if (!correct && !exam && !retry && ex.type !== 'speak') setQueue(q => [...q, ex])
    if (pts) { setFloat({ k: Date.now(), t: `+${pts}${multiplier(c) > 1 ? ` ×${multiplier(c)}` : ''}` }); setBump(b => b + 1) }
    if (ex.cardId) onCard?.(ex.cardId, correct)
    logAnswer({ context, lesson_id: ex.lessonId, item_id: ex.cardId || ex.id, skill: ex.skill, topic: ex.topic, correct, given: String(given ?? ''), combo: c, points: pts })
    if (exam) setTimeout(next, 250)
  }
  const next = () => {
    setAnswered(null)
    if (i + 1 >= queue.length) {
      const s = stats.current
      const firstTry = Object.values(s.first)
      onFinish({ points: s.points, bestCombo: s.best, score: Math.round(100 * firstTry.filter(Boolean).length / Math.max(1, firstTry.length)), results: s.results })
    } else setI(n => n + 1)
  }
  useEffect(() => {
    const k = e => { if (e.key === 'Enter' && answered && !exam && document.activeElement?.tagName !== 'INPUT') next() }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  })

  const mult = multiplier(combo)
  return (
    <div className="stack">
      <div className="row">
        <button className="icon-btn" onClick={() => setLeaving(true)} aria-label="Leave"><X /></button>
        <div className="grow"><div className="bar rose"><i style={{ width: `${(i / queue.length) * 100}%` }} /></div></div>
        {!exam && <span key={bump} className={`combo ${bump ? 'bump' : ''}`} title="Correct answers in a row multiply your points" aria-label={`Combo ${combo}, multiplier ${mult}`}>
          <span className="small muted">{combo}🔥</span><span className="x">×{mult}</span>
        </span>}
      </div>
      {!exam && <div className="ink" style={{ width: `${Math.min(100, ((combo % 3) / 3) * 100 + (mult >= 5 ? 100 : 0))}%` }} title="Fill the ink to raise your multiplier" />}
      {retry && !exam && <div className="small muted italic">Second chance — this one came back for you.</div>}
      <div className="card" key={ex.id + i}>
        <Exercise ex={ex} onAnswer={onAnswer} onSkip={next} quiet={exam} readText={readText} />
        {answered && !exam && <span className={`stamp ${answered.correct ? 'ok' : 'no'}`}>{answered.correct ? 'Correct' : 'Oops'}</span>}
      </div>
      {answered && !exam && <button className="btn block" onClick={next} autoFocus>Continue</button>}
      {float && <div key={float.k} className="float-xp" aria-hidden="true">{float.t}</div>}
      {leaving && <Sheet onClose={() => setLeaving(false)}>
        <div className="stack center">
          <h3>Leave this session?</h3>
          <p className="muted">Your answers so far are saved, but the session won’t count as completed.</p>
          <button className="btn" onClick={() => setLeaving(false)}>Keep going</button>
          <button className="btn ghost" onClick={onExit}>Leave</button>
        </div>
      </Sheet>}
    </div>
  )
}
