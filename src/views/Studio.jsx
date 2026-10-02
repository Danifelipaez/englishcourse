import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Coffee, PenLine } from 'lucide-react'
import { useData, useTheoryTime } from '../lib/store.jsx'
import { ask, levelOf } from '../lib/tutor.js'
import { PROMPTS } from '../content/library.js'
import { LESSON } from '../content/index.js'
import { SpeakBtn, celebrate } from '../components.jsx'
import { Lock } from 'lucide-react'
import { useT, lessonRef } from '../lib/i18n.jsx'

export default function Studio({ go, params }) {
  useTheoryTime()
  const { isLearned } = useData()
  const { t } = useT()
  const [tab, setTab] = useState('write')
  return (
    <div className="stack">
      <div><span className="eyebrow">{t('studio.eyebrow')}</span><h1>{t('studio.h')}</h1>
        <p className="muted">{t('studio.intro')}</p></div>
      {!isLearned('m1l1') ? (
        <div className="card center stack locked-card">
          <Lock className="muted" style={{ margin: '0 auto' }} />
          <h3>{t('studio.lockedH')}</h3>
          <p className="muted" style={{ margin: 0 }}>{t('studio.lockedP', lessonRef('m1l1'))}</p>
          <button className="btn" onClick={() => go('path')}>{t('path.back')}</button>
        </div>
      ) : <>
        <div className="seg">
          <button className={tab === 'write' ? 'on' : ''} onClick={() => setTab('write')}><PenLine size={14} /> {t('studio.tabWrite')}</button>
          <button className={tab === 'chat' ? 'on' : ''} onClick={() => setTab('chat')}><Coffee size={14} /> {t('studio.tabChat')}</button>
        </div>
        {tab === 'write' ? <Write go={go} initial={params.get('p')} /> : <Chat />}
      </>}
    </div>
  )
}

function Write({ go, initial }) {
  const { currentModule, saveWriting, isLearned, knownTopics } = useData()
  const { t, pick } = useT()
  const level = levelOf(currentModule)
  // only prompts whose grammar she has already learned
  const options = PROMPTS.filter(p => isLearned(p.needs))
  const [prompt, setPrompt] = useState(initial || options[Math.floor(Math.random() * options.length)].text)
  const [text, setText] = useState('')
  const [fb, setFb] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const current = PROMPTS.find(p => p.text === prompt)
  const promptText = current ? pick(current.text, current.es, current.needs) : prompt

  const send = async () => {
    setBusy(true); setErr('')
    try {
      const r = await ask({ mode: 'correct', level, text, prompt, known: knownTopics })
      setFb(r)
      saveWriting({ kind: 'correct', prompt, body: text, feedback: r })
      if ((r.score || 0) >= 85) celebrate()
    } catch (e) { setErr(e.message) }
    setBusy(false)
  }

  return (
    <div className="stack">
      <div className="card cream flat">
        <span className="eyebrow">{t('studio.prompt')}</span>
        <p className="serif italic" style={{ fontSize: 20, margin: '6px 0 10px' }}>{promptText}</p>
        <button className="btn ghost sm" onClick={() => setPrompt(options[Math.floor(Math.random() * options.length)].text)}>{t('studio.another')}</button>
      </div>
      <textarea className="textarea lined" style={{ minHeight: 224, padding: '0 14px' }} value={text} onChange={e => setText(e.target.value)} placeholder={t('studio.placeholder')} aria-label={t('studio.yourText')} />
      <div className="row between small muted"><span>{t('studio.words', { n: text.trim().split(/\s+/).filter(Boolean).length })}</span><span>{t('studio.counts')}</span></div>
      <button className="btn" onClick={send} disabled={busy || text.trim().length < 10}><Sparkles /> {busy ? t('studio.reading') : t('studio.polish')}</button>
      {err && <div className="why no">{err}</div>}
      {fb && (
        <div className="stack enter">
          <div className="card tape" style={{ paddingTop: 28 }}>
            <div className="row between"><span className="eyebrow">{t('studio.polished')}</span>{fb.score != null && <span className="hand" style={{ color: 'var(--wax)' }}>{fb.score}/100</span>}</div>
            <p className="serif" style={{ fontSize: 20, whiteSpace: 'pre-line' }}>{fb.corrected}</p>
            <SpeakBtn text={fb.corrected} label={t('studio.aloud')} />
          </div>
          {fb.praise && <p className="hand center" style={{ fontSize: 26 }}>“{fb.praise}”</p>}
          {fb.mistakes?.length > 0 && (
            <div className="card">
              <span className="eyebrow">{t('studio.notice')}</span>
              <div className="stack-s" style={{ marginTop: 10 }}>
                {fb.mistakes.map((m, i) => {
                  const l = LESSON[m.lesson]
                  return (
                    <div key={i} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
                      <div><s style={{ color: 'var(--bad)' }}>{m.original}</s> → <b style={{ color: 'var(--ok)' }}>{m.fix}</b></div>
                      <div className="small muted">{m.why_es}</div>
                      {l && <button className="chip" style={{ marginTop: 6 }} onClick={() => go(`lesson/${l.id}`)}>{t('studio.thread', { n: l.n, title: l.title })}</button>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {fb.upgrade && <div className="card cream flat"><span className="eyebrow">{t('studio.native')}</span><p className="serif italic" style={{ fontSize: 19, margin: '6px 0 0' }}>{fb.upgrade}</p></div>}
        </div>
      )}
    </div>
  )
}

function Chat() {
  const { currentModule, saveWriting, knownTopics } = useData()
  const { t } = useT()
  const level = levelOf(currentModule)
  const [msgs, setMsgs] = useState([{ role: 'sam', text: "Hi Meri! I just made coffee ☕ How was your day?" }])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs])

  const send = async () => {
    const msg = text.trim()
    if (!msg) return
    const history = msgs
    setMsgs(m => [...m, { role: 'me', text: msg }]); setText(''); setBusy(true); setErr('')
    try {
      const r = await ask({ mode: 'chat', level, text: msg, history, known: knownTopics })
      setMsgs(m => [...m.slice(0, -1), { ...m.at(-1), correction: r.correction }, { role: 'sam', text: r.reply }])
    } catch (e) { setErr(e.message) }
    setBusy(false)
  }
  const finish = () => {
    const mine = msgs.filter(m => m.role === 'me')
    if (mine.length) saveWriting({ kind: 'chat', prompt: 'Coffee chat with Sam', body: msgs.map(m => `${m.role === 'me' ? 'Meri' : 'Sam'}: ${m.text}`).join('\n'), feedback: { corrections: mine.filter(m => m.correction).map(m => m.correction) } })
    setMsgs([{ role: 'sam', text: 'That was lovely. Same time tomorrow? ☕' }])
  }

  return (
    <div className="stack">
      <div className="card" style={{ padding: 14 }}>
        <div className="stack-s" style={{ maxHeight: '52dvh', overflowY: 'auto', padding: 4 }}>
          {msgs.map((m, i) => (
            <div key={i} className="enter" style={{ justifySelf: m.role === 'me' ? 'end' : 'start', maxWidth: '86%' }}>
              <div style={{ padding: '10px 14px', borderRadius: 16, background: m.role === 'me' ? 'var(--ink)' : 'var(--cream)', color: m.role === 'me' ? '#fff' : 'inherit', borderBottomRightRadius: m.role === 'me' ? 4 : 16, borderBottomLeftRadius: m.role === 'me' ? 16 : 4 }}>
                {m.text} {m.role === 'sam' && <SpeakBtn text={m.text} />}
              </div>
              {m.correction && <div className="small" style={{ marginTop: 4, textAlign: 'right' }}>
                <span className="muted">✎ </span><s style={{ color: 'var(--bad)' }}>{m.correction.original}</s> → <b style={{ color: 'var(--ok)' }}>{m.correction.better}</b>
                <div className="muted">{m.correction.why_es}</div>
              </div>}
            </div>
          ))}
          {busy && <div className="small muted italic">{t('chat.typing')}</div>}
          <div ref={end} />
        </div>
      </div>
      {err && <div className="why no">{err}</div>}
      <div className="row">
        <input className="input grow" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && !busy && send()} placeholder={t('chat.placeholder')} aria-label={t('chat.message')} />
        <button className="btn" onClick={send} disabled={busy || !text.trim()} aria-label={t('chat.send')}><Send /></button>
      </div>
      <button className="btn ghost sm" onClick={finish}>{t('chat.end')}</button>
    </div>
  )
}
