import { useState } from 'react'
import { LogOut, Shield } from 'lucide-react'
import { useData, supabase } from '../lib/store.jsx'
import { Bar, celebrate, Sheet, hm } from '../components.jsx'

export const rewardProgress = (r, d) => ({
  streak: d.streak.current, xp: d.xp, lessons: d.completed.size, exams: d.passed.size, days: d.streak.metDays.length,
}[r.kind] || 0)
export const KIND_LABEL = { streak: 'day streak', xp: 'points', lessons: 'lessons', exams: 'module exams', days: 'days with goal met' }

export default function Me({ go }) {
  const d = useData()
  const [opening, setOpening] = useState(null)
  const [reveal, setReveal] = useState(null)
  const letters = d.notes.filter(n => n.read_at).sort((a, b) => b.created_at.localeCompare(a.created_at))

  const breakSeal = r => {
    setOpening(r.id)
    setTimeout(async () => { await d.openReward(r.id); setOpening(null); setReveal(r); celebrate(true) }, 700)
  }

  return (
    <div className="stack">
      <div><span className="eyebrow">Level {d.level.n} · {d.xp.toLocaleString()} points</span><h1 className="italic">{d.level.title}</h1>
        <div style={{ marginTop: 12 }}><Bar value={d.level.progress} tone="gold" /></div></div>

      <div className="kpis">
        <Kpi label="Current streak" v={d.streak.current} sub={`longest ${d.streak.longest}`} />
        <Kpi label="Theory" v={hm(d.theorySec)} sub="all time" />
        <Kpi label="Free English" v={hm(d.freeSec)} sub="all time" />
        <Kpi label="Accuracy" v={`${Math.round(d.accuracy * 100)}%`} sub={`${d.answers} answers`} />
        <Kpi label="Words" v={d.cardsCount} sub="in memory box" />
        <Kpi label="Best combo" v={d.bestCombo} sub="in a row" />
      </div>

      <section className="stack-s">
        <h3>Sealed envelopes</h3>
        {!d.rewards.length && <p className="small muted">No envelopes yet. Someone might be preparing a surprise… 💌</p>}
        {d.rewards.map(r => {
          const p = rewardProgress(r, d), ready = p >= r.target
          return (
            <div key={r.id} className={`envelope enter ${r.opened_at ? '' : ''}`}>
              <div className="row" style={{ position: 'relative' }}>
                <div className={`seal ${r.opened_at ? 'gold' : ready ? '' : 'gray'} ${opening === r.id ? 'crack' : ''}`}>{r.opened_at ? '✓' : '♥'}</div>
                <div className="grow stack-s">
                  {r.opened_at ? <><b className="serif" style={{ fontSize: 22 }}>{r.title}</b>{r.note && <span className="hand">{r.note}</span>}</>
                    : <><b>{ready ? 'Ready to open!' : 'A sealed surprise'}</b><span className="small muted">Unlocks at {r.target} {KIND_LABEL[r.kind]}</span><Bar value={p / r.target} tone="rose" /></>}
                </div>
                {!r.opened_at && ready && <button className="btn wax sm" onClick={() => breakSeal(r)}>Break the seal</button>}
              </div>
            </div>
          )
        })}
      </section>

      <section className="stack-s">
        <h3>Stamp collection</h3>
        <div className="stamps">
          {d.achievements.map(a => (
            <div key={a.id} className={`ach ${a.got ? '' : 'off'}`} title={a.desc}>
              <span className="em">{a.em}</span><b>{a.title}</b><span className="muted">{a.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {letters.length > 0 && <section className="stack-s">
        <h3>Letters</h3>
        {letters.map(n => <div key={n.id} className="card flat"><span className="eyebrow">{new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><p className="hand" style={{ margin: '6px 0 0', whiteSpace: 'pre-line' }}>{n.body}</p></div>)}
      </section>}

      <section className="card flat stack-s">
        <h3>Settings</h3>
        <label className="field">Default theory minutes per day: <b>{d.profile.theory_target}</b>
          <input type="range" min="10" max="20" defaultValue={d.profile.theory_target} onChange={e => d.setDefaultTarget(+e.target.value)} />
        </label>
        {d.profile.role === 'admin' && <button className="btn ghost" onClick={() => go('admin')}><Shield /> Admin dashboard</button>}
        <button className="btn ghost" onClick={() => supabase.auth.signOut()}><LogOut /> Sign out</button>
      </section>

      {reveal && <Sheet onClose={() => setReveal(null)}>
        <div className="letter stack center">
          <span className="eyebrow">You unlocked</span>
          <h2 className="italic">{reveal.title}</h2>
          {reveal.note && <p className="hand" style={{ fontSize: 26 }}>{reveal.note}</p>}
          <button className="btn" onClick={() => setReveal(null)}>♥</button>
        </div>
      </Sheet>}
    </div>
  )
}

export function Kpi({ label, v, sub }) {
  return <div className="kpi"><span className="eyebrow">{label}</span><b>{v}</b>{sub && <span className="sub">{sub}</span>}</div>
}
