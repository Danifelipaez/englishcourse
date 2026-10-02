import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, KeyRound, Headphones, Feather, Bookmark } from 'lucide-react'
import { useData, useTimer } from '../lib/store.jsx'
import { GoalRing, Week, Candle, Bar, Sheet, SpeakBtn, celebrate, mins, greeting, todayLabel } from '../components.jsx'
import { LIBRARY, POEMS, TIPS, ART } from '../content/library.js'
import { LESSON } from '../content/index.js'
import { daysBetween } from '../lib/logic.js'

const dayIndex = today => daysBetween('2026-01-01', today)

export default function Today({ go }) {
  const d = useData()
  const { row, met, setTarget } = useTimer()
  const unread = d.notes.filter(n => !n.read_at).sort((a, b) => a.created_at.localeCompare(b.created_at))
  const [letter, setLetter] = useState(null)
  const target = row.theory_target
  const lvl = d.currentModule.level.startsWith('B') ? 'B1' : d.currentModule.level.includes('A2') ? 'A2' : 'A1'
  const pool = LIBRARY.filter(x => x.link === d.currentModule.id && x.level <= lvl)
  const fallback = LIBRARY.filter(x => x.level <= lvl)
  const suggestion = (pool.length ? pool : fallback)[dayIndex(d.today) % (pool.length || fallback.length)]

  useEffect(() => {
    const key = 'met-' + d.today
    try {
      if (met && !localStorage.getItem(key)) { localStorage.setItem(key, '1'); celebrate(true); d.notify('🌸 Today’s goal is met. Your streak is safe!') }
    } catch { /* private mode */ }
  }, [met])

  return (
    <div className="stack">
      <header className="enter">
        <span className="eyebrow">{todayLabel()}</span>
        <h1>{greeting()}, <span className="italic">{d.profile.name}</span></h1>
      </header>

      {unread.length > 0 && (
        <button className="envelope enter" style={{ textAlign: 'left' }} onClick={() => setLetter(unread[0])}>
          <div className="row" style={{ position: 'relative' }}>
            <div className="seal">♥</div>
            <div><div className="eyebrow">{unread.length > 1 ? `${unread.length} letters` : 'A letter'} for you</div><div className="hand">Someone left you a note…</div></div>
          </div>
        </button>
      )}

      <section className="card enter">
        <div className="row" style={{ alignItems: 'center', gap: 20 }}>
          <GoalRing theory={row.theory_sec} free={row.free_sec} target={target} />
          <div className="grow stack-s">
            <span className="eyebrow">Today’s goal</span>
            <div className="small"><span style={{ color: 'var(--wax)' }}>●</span> Theory <b>{mins(row.theory_sec)}</b> / {target} min</div>
            <div className="small"><span style={{ color: 'var(--sage)' }}>●</span> Free English <b>{mins(row.free_sec)}</b> / {20 - target} min</div>
            {met ? <div className="hand" style={{ color: 'var(--wax)' }}>Goal met. Proud of you!</div>
              : <div className="small muted">{Math.max(0, 20 - mins(row.theory_sec + row.free_sec))} min to keep the candle lit</div>}
          </div>
        </div>
        <div className="divider" style={{ margin: '16px 0' }} />
        <label className="field">
          <span>Today I’ll do <b style={{ color: 'var(--ink)' }}>{target} min of theory</b>{target < 20 ? <> + <b style={{ color: 'var(--ink)' }}>{20 - target} min of free English</b></> : ' (all theory today)'}</span>
          <input type="range" min="10" max="20" value={target} onChange={e => setTarget(+e.target.value)} aria-label="Theory minutes today" />
        </label>
      </section>

      <section className="card flat enter">
        <div className="row between" style={{ marginBottom: 14 }}>
          <div className="row"><Candle lit={d.streak.todayMet || d.streak.current > 0} /><div><b className="serif" style={{ fontSize: 24 }}>{d.streak.current}</b> <span className="small muted">day streak</span></div></div>
          <div className="row small muted" title="Protectors save your streak if you miss a day. You earn one every 7 days (max 2)."><Bookmark size={16} /> {d.streak.freezes} protector{d.streak.freezes === 1 ? '' : 's'}</div>
        </div>
        <Week metDays={d.streak.metDays} frozenDays={d.streak.frozenDays} today={d.today} />
      </section>

      <section className="stack-s">
        <span className="eyebrow">Today’s plan</span>
        <PlanItem n="1" icon={<KeyRound />} title="Warm up your memory" sub={d.due.length ? `${d.due.length} words are waiting in your memory box` : 'Nothing due — try a thread review'} onClick={() => go('review')} />
        {d.nextLesson
          ? <PlanItem n="2" icon={<BookOpen />} title={d.nextLesson.title} sub={`Lesson ${d.nextLesson.n} · ${d.nextLesson.topic}`} onClick={() => go(`lesson/${d.nextLesson.id}`)} accent />
          : <PlanItem n="2" icon={<BookOpen />} title={`${d.currentModule.title} — exam`} sub="All lessons done. Seal the module!" onClick={() => go(`exam/${d.currentModule.id}`)} accent />}
        <PlanItem n="3" icon={<Headphones />} title={`Free English: ${suggestion.title}`} sub={suggestion.mission} onClick={() => go('free')} />
        <PlanItem n="✦" icon={<Feather />} title="Write something" sub="Your tutor is waiting with a coffee" onClick={() => go('studio')} />
      </section>

      <section className="card flat enter">
        <div className="row between"><span className="eyebrow">Level {d.level.n}</span><span className="small muted">{d.xp.toLocaleString()} pts</span></div>
        <h3 className="italic" style={{ margin: '6px 0 10px' }}>{d.level.title}</h3>
        <Bar value={d.level.progress} tone="gold" />
      </section>

      <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <ArtOfDay today={d.today} go={go} />
        <PoemOfDay today={d.today} go={go} />
      </div>

      <p className="center hand muted" style={{ padding: '8px 16px' }}>“{TIPS[dayIndex(d.today) % TIPS.length]}”</p>

      {letter && <Sheet onClose={() => { d.readNote(letter.id); setLetter(null) }}>
        <div className="letter stack">
          <span className="eyebrow">{new Date(letter.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
          <p className="hand" style={{ fontSize: 28, margin: 0, whiteSpace: 'pre-line' }}>{letter.body}</p>
          <button className="btn" onClick={() => { d.readNote(letter.id); setLetter(null); celebrate() }}>Keep it ♥</button>
        </div>
      </Sheet>}
    </div>
  )
}

function PlanItem({ n, icon, title, sub, onClick, accent }) {
  return (
    <button className="card link enter" style={{ textAlign: 'left', padding: 16, borderColor: accent ? 'var(--ink)' : undefined }} onClick={onClick}>
      <div className="row">
        <span className="serif" style={{ width: 22, fontSize: 22, color: 'var(--ink-3)' }}>{n}</span>
        <div className="grow"><div style={{ fontWeight: 500 }}>{title}</div><div className="small muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div></div>
        <span className="muted" style={{ display: 'inline-flex' }}>{icon}</span>
      </div>
    </button>
  )
}

export function ArtOfDay({ today, go }) {
  const art = ART[dayIndex(today) % ART.length]
  const [failed, setFailed] = useState(false)
  if (failed) return null
  const l = LESSON[art.link]
  return (
    <section className="card enter">
      <span className="eyebrow">Painting of the day</span>
      <div className="frame" style={{ margin: '12px 0' }}>
        <img src={art.img} alt={`${art.title} by ${art.artist}`} loading="lazy" onError={() => setFailed(true)} />
      </div>
      <div className="serif italic" style={{ fontSize: 20 }}>{art.title}</div>
      <div className="small muted">{art.artist} · {art.year} · public domain</div>
      <p className="small" style={{ margin: '10px 0 0' }}>{art.task}{l && <span className="muted"> — thread {l.n}</span>}</p>
      <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={() => go(`studio?p=${encodeURIComponent(`Look at "${art.title}" by ${art.artist} (${art.year}). ${art.task}`)}`)}>
        Describe it in English <ArrowRight />
      </button>
    </section>
  )
}

export function PoemOfDay({ today }) {
  const [open, setOpen] = useState(false)
  const p = POEMS[dayIndex(today) % POEMS.length]
  return (
    <section className="card enter tape sage" style={{ paddingTop: 28 }}>
      <span className="eyebrow">Poem of the day · {p.level}</span>
      <h3 className="italic" style={{ margin: '8px 0 4px' }}>{p.title}</h3>
      <div className="small muted">{p.author}, {p.year}</div>
      <div className="poem" style={{ margin: '12px 0', fontSize: 18 }}>{p.text.split('\n').slice(0, 4).join('\n')}</div>
      <button className="btn ghost sm" onClick={() => setOpen(true)}>Read the whole poem</button>
      {open && <PoemSheet p={p} onClose={() => setOpen(false)} />}
    </section>
  )
}

export function PoemSheet({ p, onClose }) {
  const l = LESSON[p.link]
  return (
    <Sheet onClose={onClose}>
      <div className="stack">
        <div className="row between"><div><span className="eyebrow">{p.author}, {p.year}</span><h2 className="italic">{p.title}</h2></div><SpeakBtn text={p.text} rate={0.82} label="Read aloud" /></div>
        <div className="poem">{p.text}</div>
        <div className="card cream flat"><b className="small">Grammar spotlight</b><p className="small" style={{ margin: '4px 0 0' }}>{p.spotlight}{l ? ` — see lesson ${l.n}, ${l.title}.` : ''}</p></div>
        <table className="gram"><tbody>{p.glossary.map(([w, m]) => <tr key={w}><td><b>{w}</b></td><td>{m}</td></tr>)}</tbody></table>
        <p className="small muted">Public domain. Read it aloud twice: once slowly, once like an actress.</p>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </Sheet>
  )
}
