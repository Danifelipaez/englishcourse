import { useState } from 'react'
import { LogOut, Shield } from 'lucide-react'
import { useData, supabase } from '../lib/store.jsx'
import { Bar, celebrate, Sheet, hm } from '../components.jsx'
import { useT, setUiLang } from '../lib/i18n.jsx'

export const rewardProgress = (r, d) => ({
  streak: d.streak.current, xp: d.xp, lessons: d.completed.size, exams: d.passed.size, days: d.streak.metDays.length,
}[r.kind] || 0)
export const KIND_LABEL = { streak: 'day streak', xp: 'points', lessons: 'lessons', exams: 'module exams', days: 'days with goal met' }

export default function Me({ go }) {
  const d = useData()
  const { t, locale, mode, percent } = useT()
  const [opening, setOpening] = useState(null)
  const [reveal, setReveal] = useState(null)
  const letters = d.notes.filter(n => n.read_at).sort((a, b) => b.created_at.localeCompare(a.created_at))

  const breakSeal = r => {
    setOpening(r.id)
    setTimeout(async () => { await d.openReward(r.id); setOpening(null); setReveal(r); celebrate(true) }, 700)
  }

  return (
    <div className="stack">
      <div><span className="eyebrow">{t('me.eyebrow', { n: d.level.n, xp: d.xp.toLocaleString() })}</span><h1 className="italic">{t(`lvl.${Math.min(d.level.n - 1, 11)}`)}</h1>
        <div style={{ marginTop: 12 }}><Bar value={d.level.progress} tone="gold" /></div></div>

      <div className="kpis">
        <Kpi label={t('me.streak')} v={d.streak.current} sub={t('me.longest', { n: d.streak.longest })} />
        <Kpi label={t('me.theory')} v={hm(d.theorySec)} sub={t('me.allTime')} />
        <Kpi label={t('me.free')} v={hm(d.freeSec)} sub={t('me.allTime')} />
        <Kpi label={t('me.accuracy')} v={`${Math.round(d.accuracy * 100)}%`} sub={t('me.answers', { n: d.answers })} />
        <Kpi label={t('me.words')} v={d.cardsCount} sub={t('me.inBox')} />
        <Kpi label={t('me.combo')} v={d.bestCombo} sub={t('me.inRow')} />
      </div>

      <section className="stack-s">
        <h3>{t('me.envelopes')}</h3>
        {!d.rewards.length && <p className="small muted">{t('me.noEnv')}</p>}
        {d.rewards.map(r => {
          const p = rewardProgress(r, d), ready = p >= r.target
          return (
            <div key={r.id} className={`envelope enter ${r.opened_at ? '' : ''}`}>
              <div className="row" style={{ position: 'relative' }}>
                <div className={`seal ${r.opened_at ? 'gold' : ready ? '' : 'gray'} ${opening === r.id ? 'crack' : ''}`}>{r.opened_at ? '✓' : '♥'}</div>
                <div className="grow stack-s">
                  {r.opened_at ? <><b className="serif" style={{ fontSize: 22 }}>{r.title}</b>{r.note && <span className="hand">{r.note}</span>}</>
                    : <><b>{ready ? t('me.ready') : t('me.surprise')}</b><span className="small muted">{t('me.unlocksAt', { n: r.target, what: t(`kl.${r.kind}`) })}</span><Bar value={p / r.target} tone="rose" /></>}
                </div>
                {!r.opened_at && ready && <button className="btn wax sm" onClick={() => breakSeal(r)}>{t('me.break')}</button>}
              </div>
            </div>
          )
        })}
      </section>

      <section className="stack-s">
        <h3>{t('me.stamps')}</h3>
        <div className="stamps">
          {d.achievements.map(a => (
            <div key={a.id} className={`ach ${a.got ? '' : 'off'}`} title={t(`ach.${a.id}.d`)}>
              <span className="em">{a.em}</span><b>{t(`ach.${a.id}.t`)}</b><span className="muted">{t(`ach.${a.id}.d`)}</span>
            </div>
          ))}
        </div>
      </section>

      {letters.length > 0 && <section className="stack-s">
        <h3>{t('me.letters')}</h3>
        {letters.map(n => <div key={n.id} className="card flat"><span className="eyebrow">{new Date(n.created_at).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}</span><p className="hand" style={{ margin: '6px 0 0', whiteSpace: 'pre-line' }}>{n.body}</p></div>)}
      </section>}

      <section className="card flat stack-s">
        <h3>{t('me.settings')}</h3>
        <label className="field">{t('me.target', { n: d.profile.theory_target })}
          <input type="range" min="10" max="20" defaultValue={d.profile.theory_target} onChange={e => d.setDefaultTarget(+e.target.value)} />
        </label>
        <div className="stack-s">
          <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{t('me.lang')}</span>
          <div className="seg" role="radiogroup" aria-label={t('me.lang')}>
            {[['auto', t('me.langAuto')], ['es', t('me.langEs')], ['en', t('me.langEn')]].map(([k, label]) => (
              <button key={k} role="radio" aria-checked={mode === k} className={mode === k ? 'on' : ''} onClick={() => setUiLang(k)}>{label}</button>
            ))}
          </div>
          {mode === 'auto' && <><Bar value={percent() / 100} tone="rose" /><span className="small muted">{t('me.langPct', { n: percent() })}</span></>}
        </div>
        {d.profile.role === 'admin' && <button className="btn ghost" onClick={() => go('admin')}><Shield /> {t('me.admin')}</button>}
        <button className="btn ghost" onClick={() => supabase.auth.signOut()}><LogOut /> {t('me.signOut')}</button>
      </section>

      {reveal && <Sheet onClose={() => setReveal(null)}>
        <div className="letter stack center">
          <span className="eyebrow">{t('me.unlocked')}</span>
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
