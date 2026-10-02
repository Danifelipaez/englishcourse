import { useState } from 'react'
import { Play, Pause, ExternalLink, Wrench } from 'lucide-react'
import { useData, useTimer } from '../lib/store.jsx'
import { LIBRARY, KINDS, TOOLS, POEMS } from '../content/library.js'
import { MODULE } from '../content/index.js'
import { fmt, mins } from '../components.jsx'
import { PoemSheet } from './Today.jsx'

const ACTIVITIES = [['series', '📺 Series / film'], ['song', '🎵 Songs'], ['podcast', '🎧 Podcast'], ['video', '▶️ YouTube'], ['book', '📖 Reading'], ['talk', '💬 Conversation']]

export default function Free() {
  const { currentModule, passed } = useData()
  const { row, mode, setMode, freeMeta, setFreeMeta } = useTimer()
  const [kind, setKind] = useState('all')
  const [poem, setPoem] = useState(null)
  const running = mode === 'free'
  const goal = (20 - row.theory_target) * 60
  const levelNow = currentModule.level.startsWith('B') ? 'B1' : currentModule.level.includes('A2') ? 'A2' : 'A1'
  const items = LIBRARY.filter(x => kind === 'all' || x.kind === kind)
    .sort((a, b) => (b.link === currentModule.id) - (a.link === currentModule.id) || a.level.localeCompare(b.level))

  return (
    <div className="stack">
      <div><span className="eyebrow">Input in the wild</span><h1>Free English</h1>
        <p className="muted">Series, songs, podcasts, books. Start the stopwatch, then go enjoy — it keeps counting while you watch in another app.</p></div>

      <section className="card center stack">
        <span className="eyebrow">{running ? 'Counting your free English' : 'Stopwatch'}</span>
        <div className="clock" aria-live="off">{fmt(row.free_sec)}</div>
        <div className="small muted">{goal > 0 ? (row.free_sec >= goal ? 'Free-English goal met ✓' : `${mins(goal - row.free_sec)} min left for today’s goal`) : 'Today is all theory — this is a bonus ✨'}</div>
        <div className="seg" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          {ACTIVITIES.map(([k, label]) => <button key={k} className={freeMeta.kind === k ? 'on' : ''} onClick={() => setFreeMeta(m => ({ ...m, kind: k }))}>{label}</button>)}
        </div>
        <input className="input" placeholder="What are you watching / listening to? (optional)" value={freeMeta.title} onChange={e => setFreeMeta(m => ({ ...m, title: e.target.value }))} />
        <button className={`btn ${running ? 'ghost' : 'sage'}`} onClick={() => setMode(running ? null : 'free')}>
          {running ? <><Pause /> Pause</> : <><Play /> Start</>}
        </button>
        {(row.free_log || []).length > 0 && (
          <div style={{ textAlign: 'left' }}>
            <div className="divider" />
            <span className="eyebrow">Today</span>
            {row.free_log.map((l, i) => <div key={i} className="row between small" style={{ padding: '6px 0' }}><span>{ACTIVITIES.find(a => a[0] === l.kind)?.[1] || l.kind} {l.title && `· ${l.title}`}</span><span className="muted">{mins(l.sec)} min</span></div>)}
          </div>
        )}
      </section>

      <section className="stack-s">
        <div className="row between"><h3>Recommended for you</h3><span className="small muted">Level {levelNow} · {currentModule.title}</span></div>
        <div className="seg">{KINDS.map(k => <button key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{k}</button>)}</div>
        {items.map(x => {
          const later = x.level > levelNow
          const thread = MODULE[x.link]
          return (
            <article key={x.title} className="card flat enter" style={{ opacity: later ? .62 : 1 }}>
              <div className="row between" style={{ alignItems: 'flex-start' }}>
                <div className="grow">
                  <span className="eyebrow">{x.kind} · {x.level}{later ? ' · a little later' : ''}</span>
                  <h3 style={{ fontSize: 20, margin: '4px 0' }}>{x.title}</h3>
                  <p className="small muted" style={{ margin: 0 }}>{x.why}</p>
                </div>
                <a className="icon-btn" href={x.url} target="_blank" rel="noreferrer" aria-label={`Open ${x.title}`} onClick={() => !running && setFreeMeta({ kind: ['film', 'series'].includes(x.kind) ? 'series' : ['playlist', 'tool'].includes(x.kind) ? 'song' : x.kind === 'site' ? 'book' : x.kind, title: x.title })}><ExternalLink /></a>
              </div>
              <div className="small" style={{ marginTop: 10, padding: '8px 12px', background: 'var(--cream)', borderRadius: 10 }}>
                <b>Mission:</b> {x.mission} {thread && <span className="muted">· thread: module {thread.n}{passed.has(thread.id) ? ' ✓' : ''}</span>}
              </div>
            </article>
          )
        })}
      </section>

      <section className="stack-s">
        <h3>Poems to read aloud</h3>
        <div className="seg">{POEMS.map(p => <button key={p.title} onClick={() => setPoem(p)}>{p.title} · {p.level}</button>)}</div>
      </section>

      <section className="card">
        <div className="row"><Wrench size={18} /><h3>Toolbox</h3></div>
        <div className="stack-s" style={{ marginTop: 10 }}>
          {TOOLS.map(t => <a key={t.title} href={t.url} target="_blank" rel="noreferrer" className="row between" style={{ textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <div><b>{t.title}</b><div className="small muted">{t.why}</div></div><ExternalLink size={16} className="muted" />
          </a>)}
        </div>
      </section>
      {poem && <PoemSheet p={poem} onClose={() => setPoem(null)} />}
    </div>
  )
}
