import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, KeyRound, Headphones, Feather, Bookmark, Lock, Play } from 'lucide-react'
import { useData, useTimer } from '../lib/store.jsx'
import { GoalRing, Week, Candle, Bar, Sheet, SpeakBtn, celebrate, mins, greeting, todayLabel } from '../components.jsx'
import { LIBRARY, POEMS, TIPS, ART } from '../content/library.js'
import { LESSON, MODULE } from '../content/index.js'
import { daysBetween } from '../lib/logic.js'
import { useT, T, lessonRef, lessonIndex } from '../lib/i18n.jsx'
import { listRuns } from '../lib/drafts.js'

const dayIndex = today => daysBetween('2026-01-01', today)
const earliest = list => [...list].sort((a, b) => lessonIndex(a.needs) - lessonIndex(b.needs))[0]

export default function Today({ go }) {
  const d = useData()
  const { t, locale, pick } = useT()
  const { row, met, setTarget } = useTimer()
  const unread = d.notes.filter(n => !n.read_at).sort((a, b) => a.created_at.localeCompare(b.created_at))
  const [letter, setLetter] = useState(null)
  const target = row.theory_target
  // only what she can already use: supplementary content opens with the lesson it needs
  const open = LIBRARY.filter(x => d.isLearned(x.needs))
  const pool = open.filter(x => x.link === d.currentModule.id)
  const suggestion = (pool.length ? pool : open)[dayIndex(d.today) % Math.max(1, pool.length || open.length)]
  const tips = TIPS.filter(x => d.isLearned(x.needs))
  const tip = tips[dayIndex(d.today) % Math.max(1, tips.length)]
  const runs = listRuns(d.uid).map(r => {
    const [kind, id] = r.key.split(':')
    if (kind === 'lesson' && LESSON[id]) return { r, title: LESSON[id].title, what: t('cont.lesson', { n: LESSON[id].n }), to: `lesson/${id}` }
    if (kind === 'exam' && MODULE[id]) return { r, title: MODULE[id].title, what: t('cont.exam', { n: MODULE[id].n }), to: `exam/${id}` }
    if (kind === 'review') return { r, title: t('rev.h'), what: t('cont.review'), to: 'review' }
    return null
  }).filter(Boolean)

  useEffect(() => {
    const key = 'met-' + d.today
    try {
      if (met && !localStorage.getItem(key)) { localStorage.setItem(key, '1'); celebrate(true); d.notify(t('today.metToast')) }
    } catch { /* private mode */ }
  }, [met])

  const studioOpen = d.isLearned('m1l1')

  return (
    <div className="stack">
      <header className="enter">
        <span className="eyebrow">{todayLabel(locale)}</span>
        <h1>{greeting(t)}, <span className="italic">{d.profile.name}</span></h1>
      </header>

      {unread.length > 0 && (
        <button className="envelope enter" style={{ textAlign: 'left' }} onClick={() => setLetter(unread[0])}>
          <div className="row" style={{ position: 'relative' }}>
            <div className="seal">♥</div>
            <div><div className="eyebrow">{unread.length > 1 ? t('today.letters', { n: unread.length }) : t('today.letter')}</div><div className="hand">{t('today.note')}</div></div>
          </div>
        </button>
      )}

      <section className="card enter">
        <div className="row" style={{ alignItems: 'center', gap: 20 }}>
          <GoalRing theory={row.theory_sec} free={row.free_sec} target={target} />
          <div className="grow stack-s">
            <span className="eyebrow">{t('today.goal')}</span>
            <div className="small"><span style={{ color: 'var(--wax)' }}>●</span> {t('today.theory')} <b>{mins(row.theory_sec)}</b> / {target} min</div>
            <div className="small"><span style={{ color: 'var(--sage)' }}>●</span> {t('today.free')} <b>{mins(row.free_sec)}</b> / {20 - target} min</div>
            {met ? <div className="hand" style={{ color: 'var(--wax)' }}>{t('today.metMsg')}</div>
              : <div className="small muted">{t('today.left', { n: Math.max(0, 20 - mins(row.theory_sec + row.free_sec)) })}</div>}
          </div>
        </div>
        <div className="divider" style={{ margin: '16px 0' }} />
        <label className="field">
          <span><T k="today.pick" v={{ t: target, f: 20 - target }} /></span>
          <input type="range" min="10" max="20" value={target} onChange={e => setTarget(+e.target.value)} aria-label={t('today.slider')} />
        </label>
      </section>

      <section className="card flat enter">
        <div className="row between" style={{ marginBottom: 14 }}>
          <div className="row"><Candle lit={d.streak.todayMet || d.streak.current > 0} /><div><b className="serif" style={{ fontSize: 24 }}>{d.streak.current}</b> <span className="small muted">{t('today.streak')}</span></div></div>
          <div className="row small muted" title={t('today.protectorsTip')}><Bookmark size={16} /> {t('today.protectors', { n: d.streak.freezes })}</div>
        </div>
        <Week metDays={d.streak.metDays} frozenDays={d.streak.frozenDays} today={d.today} />
      </section>

      <section className="stack-s">
        <span className="eyebrow">{t('today.plan')}</span>
        {runs.slice(0, 2).map(({ r, title, what, to }) => (
          <PlanItem key={r.key} n="▶" icon={<Play />} title={`${title}`} accent
            sub={t('plan.continueSub', { what, i: Math.min(r.run.i + 1, r.run.queue.length), n: r.run.queue.length })} onClick={() => go(to)} />
        ))}
        <PlanItem n="1" icon={<KeyRound />} title={t('plan.warm')} sub={d.due.length ? t('plan.warmSub', { n: d.due.length }) : t('plan.warmNone')} onClick={() => go('review')} />
        {d.nextLesson
          ? <PlanItem n="2" icon={<BookOpen />} title={d.nextLesson.title} sub={t('plan.lessonSub', { n: d.nextLesson.n, topic: d.nextLesson.topic })} onClick={() => go(`lesson/${d.nextLesson.id}`)} accent={!runs.length} />
          : <PlanItem n="2" icon={<BookOpen />} title={t('plan.exam', { title: d.currentModule.title })} sub={t('plan.examSub')} onClick={() => go(`exam/${d.currentModule.id}`)} accent={!runs.length} />}
        {suggestion
          ? <PlanItem n="3" icon={<Headphones />} title={t('plan.free', { title: suggestion.title })} sub={pick(suggestion.mission, suggestion.mission_es, suggestion.needs)} onClick={() => go('free')} />
          : <PlanItem n="3" icon={<Headphones />} title={t('plan.freeOpen')} sub={t('plan.freeSub')} onClick={() => go('free')} />}
        {studioOpen
          ? <PlanItem n="✦" icon={<Feather />} title={t('plan.write')} sub={t('plan.writeSub')} onClick={() => go('studio')} />
          : <PlanItem n="✦" icon={<Lock />} title={t('plan.write')} sub={t('plan.writeLocked')} locked />}
      </section>

      <section className="card flat enter">
        <div className="row between"><span className="eyebrow">{t('today.level', { n: d.level.n })}</span><span className="small muted">{d.xp.toLocaleString()} {t('today.pts')}</span></div>
        <h3 className="italic" style={{ margin: '6px 0 10px' }}>{t(`lvl.${Math.min(d.level.n - 1, 11)}`)}</h3>
        <Bar value={d.level.progress} tone="gold" />
      </section>

      <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <ArtOfDay today={d.today} go={go} />
        <PoemOfDay today={d.today} go={go} />
      </div>

      {tip && <p className="center hand muted" style={{ padding: '8px 16px' }}>“{pick(tip.t, tip.es, tip.needs)}”</p>}

      {letter && <Sheet onClose={() => { d.readNote(letter.id); setLetter(null) }}>
        <div className="letter stack">
          <span className="eyebrow">{new Date(letter.created_at).toLocaleDateString(locale, { month: 'long', day: 'numeric' })}</span>
          <p className="hand" style={{ fontSize: 28, margin: 0, whiteSpace: 'pre-line' }}>{letter.body}</p>
          <button className="btn" onClick={() => { d.readNote(letter.id); setLetter(null); celebrate() }}>{t('today.keep')}</button>
        </div>
      </Sheet>}
    </div>
  )
}

function PlanItem({ n, icon, title, sub, onClick, accent, locked }) {
  return (
    <button className={`card link enter ${locked ? 'locked' : ''}`} style={{ textAlign: 'left', padding: 16, borderColor: accent ? 'var(--ink)' : undefined }} onClick={onClick} disabled={locked}>
      <div className="row">
        <span className="serif" style={{ width: 22, fontSize: 22, color: 'var(--ink-3)' }}>{n}</span>
        <div className="grow"><div style={{ fontWeight: 500 }}>{title}</div><div className="small muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div></div>
        <span className="muted" style={{ display: 'inline-flex' }}>{icon}</span>
      </div>
    </button>
  )
}

// A card that isn't open yet: shows what it will be and which lesson opens it
export function LockedCard({ eyebrow, text, needs, tape }) {
  const { t } = useT()
  const ref = lessonRef(needs)
  return (
    <section className={`card enter locked-card ${tape || ''}`} style={{ paddingTop: tape ? 28 : undefined }}>
      <span className="eyebrow">{eyebrow}</span>
      <div className="row" style={{ alignItems: 'flex-start', margin: '12px 0 0' }}>
        <Lock size={20} className="muted" style={{ flex: 'none', marginTop: 2 }} />
        <p className="small muted" style={{ margin: 0 }}>{text}</p>
      </div>
      <div className="lock-chip small"><Lock size={13} /> {t('lock.lesson', ref)}</div>
    </section>
  )
}

export function ArtOfDay({ today, go }) {
  const { isLearned } = useData()
  const { t, pick } = useT()
  const [failed, setFailed] = useState(false)
  const open = ART.filter(a => isLearned(a.needs))
  if (!open.length) {
    const next = earliest(ART)
    return <LockedCard eyebrow={t('art.title')} text={t('art.locked', lessonRef(next.needs))} needs={next.needs} />
  }
  const art = open[dayIndex(today) % open.length]
  if (failed) return null
  const l = LESSON[art.link]
  return (
    <section className="card enter">
      <span className="eyebrow">{t('art.title')}</span>
      <div className="frame" style={{ margin: '12px 0' }}>
        <img src={art.img} alt={`${art.title} · ${art.artist}`} loading="lazy" onError={() => setFailed(true)} />
      </div>
      <div className="serif italic" style={{ fontSize: 20 }}>{art.title}</div>
      <div className="small muted">{art.artist} · {art.year} · {t('art.pd')}</div>
      <p className="small" style={{ margin: '10px 0 0' }}>{pick(art.task, art.task_es, art.needs)}{l && <span className="muted"> — {t('art.thread', { n: l.n })}</span>}</p>
      <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={() => go(`studio?p=${encodeURIComponent(`Look at "${art.title}" by ${art.artist} (${art.year}). ${art.task}`)}`)}>
        {t('art.describe')} <ArrowRight />
      </button>
    </section>
  )
}

export function PoemOfDay({ today }) {
  const { isLearned } = useData()
  const { t } = useT()
  const [openPoem, setOpenPoem] = useState(false)
  const open = POEMS.filter(p => isLearned(p.needs))
  if (!open.length) {
    const next = earliest(POEMS)
    return <LockedCard tape="tape sage" eyebrow={t('poem.title')} text={t('poem.locked', lessonRef(next.needs))} needs={next.needs} />
  }
  const p = open[dayIndex(today) % open.length]
  return (
    <section className="card enter tape sage" style={{ paddingTop: 28 }}>
      <span className="eyebrow">{t('poem.title')} · {p.level}</span>
      <h3 className="italic" style={{ margin: '8px 0 4px' }}>{p.title}</h3>
      <div className="small muted">{p.author}, {p.year}</div>
      <div className="poem" style={{ margin: '12px 0', fontSize: 18 }}>{p.text.split('\n').slice(0, 4).join('\n')}</div>
      <button className="btn ghost sm" onClick={() => setOpenPoem(true)}>{t('poem.read')}</button>
      {openPoem && <PoemSheet p={p} onClose={() => setOpenPoem(false)} />}
    </section>
  )
}

export function PoemSheet({ p, onClose }) {
  const { t, pick } = useT()
  const l = LESSON[p.link]
  return (
    <Sheet onClose={onClose}>
      <div className="stack">
        <div className="row between"><div><span className="eyebrow">{p.author}, {p.year}</span><h2 className="italic">{p.title}</h2></div><SpeakBtn text={p.text} rate={0.82} label={t('poem.aloud')} /></div>
        <div className="poem">{p.text}</div>
        <div className="card cream flat"><b className="small">{t('poem.spot')}</b><p className="small" style={{ margin: '4px 0 0' }}>{pick(p.spotlight, p.spotlight_es, p.needs)}{l ? ` ${t('poem.see', { n: l.n, title: l.title })}.` : ''}</p></div>
        <table className="gram"><tbody>{p.glossary.map(([w, m]) => <tr key={w}><td><b>{w}</b></td><td>{m}</td></tr>)}</tbody></table>
        <p className="small muted">{t('poem.pd')}</p>
        <button className="btn" onClick={onClose}>{t('common.close')}</button>
      </div>
    </Sheet>
  )
}
