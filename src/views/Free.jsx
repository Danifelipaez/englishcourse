import { useState } from 'react'
import { Play, Pause, ExternalLink, Wrench, Lock } from 'lucide-react'
import { useData, useTimer } from '../lib/store.jsx'
import { LIBRARY, KINDS, TOOLS, POEMS } from '../content/library.js'
import { MODULE } from '../content/index.js'
import { fmt, mins } from '../components.jsx'
import { PoemSheet } from './Today.jsx'
import { useT, lessonRef, lessonIndex } from '../lib/i18n.jsx'

const ACTIVITIES = ['series', 'song', 'podcast', 'video', 'book', 'talk']

export default function Free() {
  const { currentModule, passed, isLearned } = useData()
  const { t, pick } = useT()
  const { row, mode, setMode, freeMeta, setFreeMeta } = useTimer()
  const [kind, setKind] = useState('all')
  const [poem, setPoem] = useState(null)
  const running = mode === 'free'
  const goal = (20 - row.theory_target) * 60
  const levelNow = currentModule.level.startsWith('B') ? 'B1' : currentModule.level.includes('A2') ? 'A2' : 'A1'
  const items = LIBRARY.filter(x => kind === 'all' || x.kind === kind)
  // Only what she already has the English for is open; the rest waits, visible, with the lesson that opens it
  const open = items.filter(x => isLearned(x.needs))
    .sort((a, b) => (b.link === currentModule.id) - (a.link === currentModule.id) || a.level.localeCompare(b.level))
  const waiting = items.filter(x => !isLearned(x.needs)).sort((a, b) => lessonIndex(a.needs) - lessonIndex(b.needs))

  return (
    <div className="stack">
      <div><span className="eyebrow">{t('free.eyebrow')}</span><h1>{t('free.h')}</h1>
        <p className="muted">{t('free.intro')}</p></div>

      <section className="card center stack">
        <span className="eyebrow">{running ? t('free.counting') : t('free.stopwatch')}</span>
        <div className="clock" aria-live="off">{fmt(row.free_sec)}</div>
        <div className="small muted">{goal > 0 ? (row.free_sec >= goal ? t('free.goalMet') : t('free.minLeft', { n: mins(goal - row.free_sec) })) : t('free.bonus')}</div>
        <div className="seg" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          {ACTIVITIES.map(k => <button key={k} className={freeMeta.kind === k ? 'on' : ''} onClick={() => setFreeMeta(m => ({ ...m, kind: k }))}>{t(`free.act.${k}`)}</button>)}
        </div>
        <input className="input" placeholder={t('free.what')} value={freeMeta.title} onChange={e => setFreeMeta(m => ({ ...m, title: e.target.value }))} />
        <button className={`btn ${running ? 'ghost' : 'sage'}`} onClick={() => setMode(running ? null : 'free')}>
          {running ? <><Pause /> {t('free.pause')}</> : <><Play /> {t('free.start')}</>}
        </button>
        {(row.free_log || []).length > 0 && (
          <div style={{ textAlign: 'left' }}>
            <div className="divider" />
            <span className="eyebrow">{t('free.today')}</span>
            {row.free_log.map((l, i) => <div key={i} className="row between small" style={{ padding: '6px 0' }}><span>{ACTIVITIES.includes(l.kind) ? t(`free.act.${l.kind}`) : l.kind} {l.title && `· ${l.title}`}</span><span className="muted">{mins(l.sec)} min</span></div>)}
          </div>
        )}
      </section>

      <section className="stack-s">
        <div className="row between"><h3>{t('free.recommended')}</h3><span className="small muted">{t('free.level', { l: levelNow, m: currentModule.title })}</span></div>
        <div className="seg">{KINDS.map(k => <button key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{t(`kind.${k}`)}</button>)}</div>
        {open.length === 0 && waiting.length > 0 && <p className="small muted">{t('free.noneYet')}</p>}
        {open.map(x => {
          const thread = MODULE[x.link]
          return (
            <article key={x.title} className="card flat enter">
              <div className="row between" style={{ alignItems: 'flex-start' }}>
                <div className="grow">
                  <span className="eyebrow">{t(`kind1.${x.kind}`)} · {x.level}</span>
                  <h3 style={{ fontSize: 20, margin: '4px 0' }}>{x.title}</h3>
                  <p className="small muted" style={{ margin: 0 }}>{pick(x.why, x.why_es, x.needs)}</p>
                </div>
                <a className="icon-btn" href={x.url} target="_blank" rel="noreferrer" aria-label={t('free.openAria', { title: x.title })} onClick={() => !running && setFreeMeta({ kind: ['film', 'series'].includes(x.kind) ? 'series' : ['playlist', 'tool'].includes(x.kind) ? 'song' : x.kind === 'site' ? 'book' : x.kind, title: x.title })}><ExternalLink /></a>
              </div>
              <div className="small" style={{ marginTop: 10, padding: '8px 12px', background: 'var(--cream)', borderRadius: 10 }}>
                <b>{t('free.mission')}</b> {pick(x.mission, x.mission_es, x.needs)} {thread && <span className="muted">{t('free.thread', { n: thread.n })}{passed.has(thread.id) ? ' ✓' : ''}</span>}
              </div>
            </article>
          )
        })}
      </section>

      {waiting.length > 0 && (
        <section className="stack-s">
          <h3>{t('free.upcoming')}</h3>
          <p className="small muted" style={{ margin: 0 }}>{t('free.upcomingP')}</p>
          {waiting.slice(0, 6).map(x => (
            <div key={x.title} className="card flat locked-row">
              <Lock size={16} className="muted" style={{ flex: 'none' }} />
              <div className="grow"><b>{x.title}</b><div className="small muted">{t(`kind1.${x.kind}`)} · {x.level} — {t('lock.lesson', lessonRef(x.needs))}</div></div>
            </div>
          ))}
          {waiting.length > 6 && <p className="small muted" style={{ margin: 0 }}>{t('free.more', { n: waiting.length - 6 })}</p>}
        </section>
      )}

      <section className="stack-s">
        <h3>{t('free.poems')}</h3>
        <div className="seg">{POEMS.map(p => {
          const ok = isLearned(p.needs)
          return <button key={p.title} disabled={!ok} title={ok ? undefined : t('lock.lesson', lessonRef(p.needs))} onClick={() => setPoem(p)}>{!ok && <Lock size={12} style={{ verticalAlign: -1, marginRight: 4 }} />}{p.title} · {p.level}</button>
        })}</div>
      </section>

      <section className="card">
        <div className="row"><Wrench size={18} /><h3>{t('free.toolbox')}</h3></div>
        <div className="stack-s" style={{ marginTop: 10 }}>
          {TOOLS.map(x => <a key={x.title} href={x.url} target="_blank" rel="noreferrer" className="row between" style={{ textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <div><b>{x.title}</b><div className="small muted">{pick(x.why, x.why_es, 'm2l1')}</div></div><ExternalLink size={16} className="muted" />
          </a>)}
        </div>
      </section>
      {poem && <PoemSheet p={poem} onClose={() => setPoem(null)} />}
    </div>
  )
}
