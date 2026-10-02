import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Send, Gift, Trash2, Bookmark, RotateCcw, RefreshCw } from 'lucide-react'
import { supabase, loadUser, derive } from '../lib/store.jsx'
import { EXERCISE, LESSONS, MODULES, CARDS } from '../content/index.js'
import { addDays, daysBetween, ymd, isMet } from '../lib/logic.js'
import { fmt, hm, mins } from '../components.jsx'
import { Kpi, KIND_LABEL, rewardProgress } from './Me.jsx'

// Validated pair (dataviz validator: all six checks pass on white)
const C_THEORY = '#b03a52', C_FREE = '#2f7fc4'
const RANGES = [['7', 7], ['30', 30], ['90', 90], ['All', 0]]
const SKILLS = ['grammar', 'vocab', 'listening', 'speaking', 'reading']

export default function Admin({ go }) {
  const [students, setStudents] = useState(null)
  const [sid, setSid] = useState(null)
  const [data, setData] = useState(null)
  const [misses, setMisses] = useState([])
  const [range, setRange] = useState(30)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    // students first; the admin can also preview the dashboard on their own (test) data
    supabase.from('profiles').select('*').order('created_at').then(({ data }) => {
      const list = (data || []).sort((a, b) => (a.role === 'admin') - (b.role === 'admin'))
      setStudents(list); if (list[0]) setSid(list[0].id)
    })
  }, [])
  const load = async () => {
    if (!sid) return
    setBusy(true)
    const [d, m] = await Promise.all([loadUser(sid), supabase.from('v_item_misses').select('*').eq('user_id', sid).gt('misses', 0).order('misses', { ascending: false }).limit(25)])
    setData(d); setMisses(m.data || []); setBusy(false)
  }
  useEffect(() => { load() }, [sid])

  if (students && !students.length) return <div className="stack"><Back go={go} /><div className="card">No student account yet. Ask Meri to sign up — she’ll appear here.</div></div>
  if (!data) return <div className="stack"><Back go={go} /><p className="muted">Loading dashboard…</p></div>
  return <Dashboard {...{ data, misses, range, setRange, students, sid, setSid, reload: load, busy, go }} />
}

const Back = ({ go }) => <div className="row"><button className="icon-btn" onClick={() => go('me')} aria-label="Back"><ArrowLeft /></button><div><span className="eyebrow">Admin</span><h2>Refuerzo 1-1</h2></div></div>

function Dashboard({ data, misses, range, setRange, students, sid, setSid, reload, busy, go }) {
  const today = ymd()
  const v = useMemo(() => derive(data, today), [data, today])
  const firstDay = [...data.days.map(d => d.day)].sort()[0] || today
  const from = range ? addDays(today, -(range - 1)) : firstDay
  const span = daysBetween(from, today) + 1
  const inRange = d => d >= from && d <= today
  const days = data.days.filter(d => inRange(d.day))
  const met = days.filter(isMet).length
  const totalSec = days.reduce((s, d) => s + d.theory_sec + d.free_sec, 0)
  const rows = data.daily.filter(r => inRange(r.day))
  const acc = rows.reduce((a, r) => ({ n: a.n + r.n, ok: a.ok + r.ok }), { n: 0, ok: 0 })

  // pace → projected B1 date
  const studied = Math.max(1, daysBetween(firstDay, today) + 1)
  const pace = v.completed.size / studied
  const left = LESSONS.length - v.completed.size
  const eta = pace > 0 ? addDays(today, Math.ceil(left / pace)) : null

  const bySkill = SKILLS.map(s => { const r = rows.filter(x => x.skill === s); const n = r.reduce((a, x) => a + x.n, 0); return { s, n, acc: n ? r.reduce((a, x) => a + x.ok, 0) / n : null } })
  const byTopic = Object.values(rows.reduce((m, r) => { if (!r.topic) return m; const t = m[r.topic] ||= { topic: r.topic, n: 0, ok: 0 }; t.n += r.n; t.ok += r.ok; return m }, {}))
    .filter(t => t.n >= 3).map(t => ({ ...t, acc: t.ok / t.n })).sort((a, b) => a.acc - b.acc).slice(0, 10)
  const ctx = rows.reduce((m, r) => (m[r.context] = (m[r.context] || 0) + r.n, m), {})
  const free = data.days.filter(d => inRange(d.day)).flatMap(d => d.free_log || [])
  const freeBy = Object.entries(free.reduce((m, l) => (m[l.kind] = (m[l.kind] || 0) + l.sec, m), {})).sort((a, b) => b[1] - a[1])
  const boxes = [1, 2, 3, 4, 5, 6].map(b => Object.values(data.cards).filter(c => c.box === b).length)
  const student = students.find(s => s.id === sid)

  return (
    <div className="stack" style={{ maxWidth: 1100 }}>
      <Back go={go} />
      <div className="row wrap">
        {students.length > 1 && <select className="select" style={{ width: 'auto' }} value={sid} onChange={e => setSid(e.target.value)}>{students.map(s => <option key={s.id} value={s.id}>{s.name}{s.role === 'admin' ? ' (you)' : ''}</option>)}</select>}
        {student?.role === 'admin' && <span className="chip">Previewing your own test data</span>}
        <div className="seg" role="group" aria-label="Date range">{RANGES.map(([l, n]) => <button key={l} className={range === n ? 'on' : ''} onClick={() => setRange(n)}>{n ? `Last ${l} days` : 'All time'}</button>)}</div>
        <button className="icon-btn" onClick={reload} aria-label="Refresh" style={{ opacity: busy ? .4 : 1 }}><RefreshCw /></button>
      </div>

      <div className="kpis" style={{ opacity: busy ? .5 : 1 }}>
        <Kpi label="Streak" v={v.streak.current} sub={`longest ${v.streak.longest} · ${v.streak.freezes} protectors`} />
        <Kpi label="Days goal met" v={`${met}/${span}`} sub={`${Math.round((met / span) * 100)}% in range`} />
        <Kpi label="Avg per day" v={`${mins(totalSec / span)} min`} sub="theory + free, in range" />
        <Kpi label="Accuracy" v={acc.n ? `${Math.round((acc.ok / acc.n) * 100)}%` : '—'} sub={`${acc.n} answers in range`} />
        <Kpi label="Lessons" v={`${v.completed.size}/${LESSONS.length}`} sub={`module ${v.currentModule.n} · ${v.currentModule.level}`} />
        <Kpi label="Exams passed" v={`${v.passed.size}/12`} sub={`${data.exams.length} attempts`} />
        <Kpi label="Level" v={v.level.n} sub={`${v.xp.toLocaleString()} pts · ${v.level.title}`} />
        <Kpi label="Words" v={v.cardsCount} sub={`${boxes[5]} mastered · ${v.due.length} due`} />
        <Kpi label="Theory total" v={hm(v.theorySec)} sub="all time" />
        <Kpi label="Free total" v={hm(v.freeSec)} sub="all time" />
        <Kpi label="Best combo" v={v.bestCombo} sub="correct in a row" />
        <Kpi label="Projected B1" v={eta ? new Date(eta + 'T12:00').toLocaleDateString('es-CO', { month: 'short', year: 'numeric' }) : '—'} sub={pace ? `${(pace * 7).toFixed(1)} lessons/week` : 'needs data'} />
      </div>

      <section className="card">
        <ChartHead title="Minutes per day" legend={[['Theory', C_THEORY], ['Free English', C_FREE]]} />
        <DayBars days={data.days} from={from} span={Math.min(span, 120)} today={today} overrides={new Set(data.overrides.map(o => o.day))} frozen={new Set(v.streak.frozenDays)} />
        <p className="small muted" style={{ margin: 0 }}>Dashed line = 20-min goal. 🔖 protector used · ★ restored by admin.</p>
      </section>

      <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <section className="card">
          <ChartHead title="Last 16 weeks" />
          <Heatmap days={data.days} today={today} />
        </section>
        <section className="card">
          <ChartHead title="Accuracy by skill" sub="in range" />
          {bySkill.map(s => <HBar key={s.s} label={s.s} value={s.acc} note={s.n ? `${Math.round(s.acc * 100)}% · ${s.n}` : 'no data'} />)}
          <p className="small muted">Answers by context: {Object.entries(ctx).map(([k, n]) => `${k} ${n}`).join(' · ') || '—'}</p>
        </section>
      </div>

      <section className="card">
        <ChartHead title="Weakest topics — start the 1-1 here" sub="min. 3 answers, in range" />
        {byTopic.length ? byTopic.map(t => <HBar key={t.topic} label={t.topic} value={t.acc} note={`${Math.round(t.acc * 100)}% · ${t.n}`} wide />) : <p className="muted small">Not enough answers yet.</p>}
      </section>

      <section className="card">
        <ChartHead title="Most-missed questions" sub="all time — what she actually answered" />
        <div className="scroll-x"><table className="table">
          <thead><tr><th>Question</th><th>Right answer</th><th>Her last wrong answer</th><th>Missed</th></tr></thead>
          <tbody>{misses.map(m => {
            const e = EXERCISE[m.item_id], c = CARDS[m.item_id]
            return <tr key={m.item_id}>
              <td>{e ? (e.prompt || e.es || e.answer) : c ? `Word: ${c.en}` : m.item_id}<div className="small muted">{m.topic}</div></td>
              <td style={{ color: 'var(--ok)' }}>{e?.answer?.split('|')[0] || c?.es || (e?.pairs ? 'vocab match' : '')}</td>
              <td style={{ color: 'var(--bad)' }}>{m.last_wrong || '—'}</td>
              <td>{m.misses}/{m.attempts}</td>
            </tr>
          })}</tbody>
        </table></div>
        {!misses.length && <p className="muted small">No mistakes recorded yet.</p>}
      </section>

      <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <section className="card">
          <ChartHead title="When she studies" sub="answers by hour, all time" />
          <Hours hours={data.hours} />
        </section>
        <section className="card">
          <ChartHead title="Memory box" sub="words per drawer" />
          {boxes.map((n, i) => <HBar key={i} label={`Drawer ${i + 1}`} value={v.cardsCount ? n / v.cardsCount : 0} note={n} />)}
        </section>
      </div>

      <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <section className="card">
          <ChartHead title="Exams" />
          <table className="table"><thead><tr><th>Module</th><th>Attempts</th><th>Best</th><th>Last</th></tr></thead>
            <tbody>{MODULES.map(m => { const e = data.exams.filter(x => x.module_id === m.id); if (!e.length) return null
              return <tr key={m.id}><td>{m.n}. {m.title}</td><td>{e.length}</td><td style={{ color: e.some(x => x.passed) ? 'var(--ok)' : 'var(--bad)' }}>{Math.max(...e.map(x => x.score))}%</td><td>{e.at(-1).created_at.slice(0, 10)}</td></tr> })}</tbody></table>
          {!data.exams.length && <p className="muted small">No exams yet.</p>}
        </section>
        <section className="card">
          <ChartHead title="Free English" sub="in range" />
          {freeBy.map(([k, s]) => <HBar key={k} label={k} value={s / (freeBy[0][1] || 1)} note={fmt(s)} />)}
          <div className="stack-s" style={{ marginTop: 10 }}>{free.slice(-6).reverse().map((l, i) => <div key={i} className="small row between"><span>{l.kind}{l.title && ` · ${l.title}`}</span><span className="muted">{mins(l.sec)} min · {l.at?.slice(0, 10)}</span></div>)}</div>
          {!free.length && <p className="muted small">Nothing logged in range.</p>}
        </section>
      </div>

      <Writings writings={data.writings} />
      <Actions student={student} data={data} v={v} reload={reload} />
    </div>
  )
}

const ChartHead = ({ title, sub, legend }) => (
  <div className="row between wrap" style={{ marginBottom: 12 }}>
    <div><h3 style={{ fontSize: 20 }}>{title}</h3>{sub && <span className="small muted">{sub}</span>}</div>
    {legend && <div className="row small">{legend.map(([l, c]) => <span key={l} className="row" style={{ gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />{l}</span>)}</div>}
  </div>
)

function HBar({ label, value, note, wide }) {
  return (
    <div className="row" style={{ padding: '5px 0' }}>
      <span className="small" style={{ width: wide ? '42%' : 90, flex: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>{label}</span>
      <div className="grow" style={{ height: 10, background: 'var(--cream-2)', borderRadius: 4 }}>
        {value > 0 && <div style={{ width: `${Math.max(2, value * 100)}%`, height: '100%', background: C_THEORY, borderRadius: '0 4px 4px 0', transition: 'width .6s' }} />}
      </div>
      <span className="small muted" style={{ width: 72, textAlign: 'right', flex: 'none' }}>{note}</span>
    </div>
  )
}

function Tip({ tip }) {
  return tip && <div className="chart-tip" style={{ left: tip.x, top: tip.y }}><b>{tip.v}</b> <span style={{ opacity: .75 }}>{tip.l}</span></div>
}

// Stacked bars: theory (bottom) + free, 20-min goal line
function DayBars({ days, from, span, today, overrides, frozen }) {
  const [tip, setTip] = useState(null)
  const start = span < daysBetween(from, today) + 1 ? addDays(today, -(span - 1)) : from
  const list = Array.from({ length: span }, (_, i) => addDays(start, i))
  const by = Object.fromEntries(days.map(d => [d.day, d]))
  const max = Math.max(30, ...list.map(d => ((by[d]?.theory_sec || 0) + (by[d]?.free_sec || 0)) / 60))
  const W = 720, H = 200, pad = 28, bw = (W - pad) / span
  const y = m => H - 20 - (m / max) * (H - 36)
  return (
    <div style={{ position: 'relative' }} onPointerLeave={() => setTip(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Minutes studied per day">
        {[0, 20, Math.round(max)].map(m => <g key={m}><line x1={pad} x2={W} y1={y(m)} y2={y(m)} stroke="var(--line)" strokeDasharray={m === 20 ? '4 4' : undefined} strokeWidth={m === 20 ? 1.5 : 1} /><text x={pad - 6} y={y(m) + 4} fontSize="10" textAnchor="end" fill="var(--ink-3)">{m}</text></g>)}
        {list.map((d, i) => {
          const t = (by[d]?.theory_sec || 0) / 60, f = (by[d]?.free_sec || 0) / 60, x = pad + i * bw + 1, w = Math.max(2, bw - 2)
          const show = e => { const r = e.currentTarget.ownerSVGElement.getBoundingClientRect(); setTip({ x: ((x + w / 2) / W) * r.width, y: (y(t + f) / H) * r.height, v: `${Math.round(t)}+${Math.round(f)} min`, l: d }) }
          return (
            <g key={d} onPointerEnter={show} onFocus={show} tabIndex={0}>
              <rect x={x - 1} y={0} width={bw} height={H} fill="transparent" />
              {t > 0 && <rect x={x} y={y(t)} width={w} height={y(0) - y(t)} fill={C_THEORY} rx="2" />}
              {f > 0 && <rect x={x} y={y(t + f)} width={w} height={Math.max(0, y(t) - y(t + f) - 2)} fill={C_FREE} rx="2" />}
              {(frozen.has(d) || overrides.has(d)) && <text x={x + w / 2} y={y(0) - 4} fontSize="10" textAnchor="middle">{overrides.has(d) ? '★' : '🔖'}</text>}
              {(span <= 31 ? i % 7 === 0 : i % 30 === 0) && <text x={x} y={H - 4} fontSize="10" fill="var(--ink-3)">{d.slice(5)}</text>}
            </g>
          )
        })}
      </svg>
      <Tip tip={tip} />
    </div>
  )
}

function Heatmap({ days, today }) {
  const [tip, setTip] = useState(null)
  const by = Object.fromEntries(days.map(d => [d.day, (d.theory_sec + d.free_sec) / 60]))
  const end = addDays(today, 6 - new Date(today + 'T12:00').getDay())
  const cells = Array.from({ length: 16 * 7 }, (_, i) => addDays(end, -(16 * 7 - 1) + i))
  const shade = m => !m ? 'var(--cream-2)' : m < 10 ? '#f1d3d8' : m < 20 ? '#dc8f9d' : m < 40 ? C_THEORY : '#6e1f31'
  return (
    <div style={{ position: 'relative' }} onPointerLeave={() => setTip(null)}>
      <svg viewBox="0 0 330 112" width="100%" role="img" aria-label="Study calendar heatmap">
        {cells.map((d, i) => {
          const x = Math.floor(i / 7) * 20 + 10, y = (i % 7) * 15 + 4
          return <rect key={d} x={x} y={y} width="17" height="12" rx="3" fill={d > today ? 'transparent' : shade(by[d])}
            onPointerEnter={e => { const r = e.currentTarget.ownerSVGElement.getBoundingClientRect(); setTip({ x: ((x + 8) / 330) * r.width, y: (y / 112) * r.height, v: `${Math.round(by[d] || 0)} min`, l: d }) }} />
        })}
      </svg>
      <div className="row small muted" style={{ gap: 6 }}>less {['var(--cream-2)', '#f1d3d8', '#dc8f9d', C_THEORY, '#6e1f31'].map(c => <i key={c} style={{ width: 12, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />)} more <span>(0 · &lt;10 · &lt;20 · &lt;40 · 40+ min)</span></div>
      <Tip tip={tip} />
    </div>
  )
}

function Hours({ hours }) {
  const [tip, setTip] = useState(null)
  const by = Array(24).fill(0)
  hours.forEach(h => { if (h.local_hour != null) by[h.local_hour] += h.n })
  const max = Math.max(1, ...by)
  return (
    <div style={{ position: 'relative' }} onPointerLeave={() => setTip(null)}>
      <svg viewBox="0 0 336 120" width="100%" role="img" aria-label="Answers by hour of day">
        {by.map((n, h) => {
          const bh = (n / max) * 90, x = h * 14 + 2
          return <g key={h} onPointerEnter={e => { const r = e.currentTarget.ownerSVGElement.getBoundingClientRect(); setTip({ x: ((x + 6) / 336) * r.width, y: ((100 - bh) / 120) * r.height, v: n, l: `${h}:00` }) }}>
            <rect x={x - 1} y="0" width="14" height="104" fill="transparent" />
            {n > 0 && <rect x={x} y={100 - bh} width="11" height={bh} rx="2" fill={C_THEORY} />}
            {h % 6 === 0 && <text x={x} y="116" fontSize="10" fill="var(--ink-3)">{h}h</text>}
          </g>
        })}
        <line x1="0" x2="336" y1="100.5" y2="100.5" stroke="var(--line)" />
      </svg>
      <Tip tip={tip} />
    </div>
  )
}

function Writings({ writings }) {
  const [open, setOpen] = useState(null)
  const list = [...writings].reverse()
  return (
    <section className="card">
      <ChartHead title="Her writing" sub={`${writings.length} texts & chats with the tutor`} />
      {!list.length && <p className="muted small">Nothing yet.</p>}
      {list.slice(0, 20).map(w => (
        <div key={w.id} style={{ borderBottom: '1px solid var(--line)', padding: '10px 0' }}>
          <button className="row between" style={{ width: '100%', border: 0, background: 'none', textAlign: 'left', padding: 0 }} onClick={() => setOpen(open === w.id ? null : w.id)}>
            <span><b>{w.kind === 'chat' ? '☕ Chat' : '✍️ ' + (w.prompt || '').slice(0, 60)}</b> <span className="small muted">{w.created_at.slice(0, 10)}</span></span>
            {w.feedback?.score != null && <span className="small">{w.feedback.score}/100</span>}
          </button>
          {open === w.id && <div className="stack-s" style={{ marginTop: 8 }}>
            <div className="small" style={{ whiteSpace: 'pre-line', background: 'var(--cream)', padding: 10, borderRadius: 8 }}>{w.body}</div>
            {(w.feedback?.mistakes || w.feedback?.corrections || []).map((m, i) => <div key={i} className="small"><s style={{ color: 'var(--bad)' }}>{m.original}</s> → <b style={{ color: 'var(--ok)' }}>{m.fix || m.better}</b> <span className="muted">{m.why_es}</span></div>)}
          </div>}
        </div>
      ))}
    </section>
  )
}

function Actions({ student, data, v, reload }) {
  const [note, setNote] = useState('')
  const [rw, setRw] = useState({ title: '', note: '', kind: 'streak', target: 7 })
  const [day, setDay] = useState(addDays(ymd(), -1))
  const [msg, setMsg] = useState('')
  const run = async (p, ok) => { const { error } = await p; setMsg(error ? `Error: ${error.message}` : ok); if (!error) reload() }

  return (
    <div className="stack" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      <section className="card stack-s">
        <h3 style={{ fontSize: 20 }}><Send size={16} /> Love note</h3>
        <p className="small muted" style={{ margin: 0 }}>She’ll see a sealed envelope on her Today page.</p>
        <textarea className="textarea" style={{ minHeight: 100 }} value={note} onChange={e => setNote(e.target.value)} placeholder="¡Qué orgullo, 15 días seguidos!…" />
        <button className="btn" disabled={!note.trim()} onClick={() => { run(supabase.from('notes').insert({ user_id: student.id, body: note.trim() }), 'Note sent 💌'); setNote('') }}>Send note</button>
        {data.notes.slice(-5).reverse().map(n => <div key={n.id} className="small row between"><span className="hand">{n.body.slice(0, 50)}</span><span className="muted">{n.read_at ? 'read ✓' : 'unread'}</span></div>)}
      </section>

      <section className="card stack-s">
        <h3 style={{ fontSize: 20 }}><Gift size={16} /> Real-life reward</h3>
        <input className="input" placeholder="Title (e.g. Dinner at her favorite place)" value={rw.title} onChange={e => setRw({ ...rw, title: e.target.value })} />
        <input className="input" placeholder="Message when she opens it (optional)" value={rw.note} onChange={e => setRw({ ...rw, note: e.target.value })} />
        <div className="row">
          <input className="input" type="number" min="1" style={{ width: 100 }} value={rw.target} onChange={e => setRw({ ...rw, target: +e.target.value })} />
          <select className="select" value={rw.kind} onChange={e => setRw({ ...rw, kind: e.target.value })}>{Object.entries(KIND_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        </div>
        <button className="btn" disabled={!rw.title.trim() || rw.target < 1} onClick={() => { run(supabase.from('rewards').insert({ user_id: student.id, ...rw }), 'Reward sealed 🎁'); setRw({ ...rw, title: '', note: '' }) }}>Seal the envelope</button>
        {data.rewards.map(r => <div key={r.id} className="small row between">
          <span>{r.opened_at ? '✓' : '✉'} {r.title} <span className="muted">· {Math.min(rewardProgress(r, v), r.target)}/{r.target} {KIND_LABEL[r.kind]}</span></span>
          <button className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Delete reward" onClick={() => confirm('Delete this reward?') && run(supabase.from('rewards').delete().eq('id', r.id), 'Deleted')}><Trash2 size={14} /></button>
        </div>)}
      </section>

      <section className="card stack-s">
        <h3 style={{ fontSize: 20 }}><Bookmark size={16} /> Streak tools</h3>
        <p className="small muted" style={{ margin: 0 }}>Current streak {v.streak.current} · {v.streak.freezes} protectors · bonus granted {student.bonus_freezes}</p>
        <button className="btn ghost" onClick={() => run(supabase.from('profiles').update({ bonus_freezes: (student.bonus_freezes || 0) + 1 }).eq('id', student.id), 'Protector granted 🔖')}>Grant a protector</button>
        <div className="row">
          <input className="input" type="date" value={day} max={ymd()} onChange={e => setDay(e.target.value)} />
          <button className="btn ghost" onClick={() => run(supabase.from('day_overrides').upsert({ user_id: student.id, day, reason: 'admin' }), `Day ${day} restored ★`)}><RotateCcw size={16} /> Restore</button>
        </div>
        {data.overrides.map(o => <div key={o.day} className="small row between"><span>★ {o.day}</span>
          <button className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Remove" onClick={() => run(supabase.from('day_overrides').delete().eq('user_id', student.id).eq('day', o.day), 'Removed')}><Trash2 size={14} /></button></div>)}
      </section>
      {msg && <div className="toast" onAnimationEnd={() => setTimeout(() => setMsg(''), 2500)}>{msg}</div>}
    </div>
  )
}
