import { useEffect, useState } from 'react'
import { Sun, Map, KeyRound, Headphones, User, Sparkles, Pause, Shield } from 'lucide-react'
import { useData, useTimer } from './lib/store.jsx'
import { useT, rememberLearned } from './lib/i18n.jsx'
import { Candle, celebrate, fmt, mins } from './components.jsx'
import Today from './views/Today.jsx'
import { Path, Module } from './views/Path.jsx'
import Lesson from './views/Lesson.jsx'
import Review from './views/Review.jsx'
import Exam from './views/Exam.jsx'
import Free from './views/Free.jsx'
import Studio from './views/Studio.jsx'
import Me from './views/Me.jsx'
import Admin from './views/Admin.jsx'

const parse = () => {
  const [path, q] = location.hash.replace(/^#\/?/, '').split('?')
  return { parts: path.split('/'), params: new URLSearchParams(q) }
}

export default function App() {
  const d = useData()
  const { t, n } = useT()
  const [route, setRoute] = useState(parse)
  useEffect(() => { const f = () => { setRoute(parse()); scrollTo(0, 0) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const go = to => { location.hash = '/' + to }
  useCelebrations(d)
  useEffect(() => { rememberLearned(n) }, [n]) // so the sign-in screen speaks her current level

  const [page, id] = route.parts
  const isAdmin = d.profile.role === 'admin'
  const view = (() => {
    switch (page) {
      case 'path': return <Path go={go} />
      case 'module': return <Module id={id} go={go} />
      case 'lesson': return <Lesson key={id} id={id} go={go} />
      case 'review': return <Review go={go} />
      case 'exam': return <Exam key={id} id={id} go={go} />
      case 'free': return <Free go={go} />
      case 'studio': return <Studio go={go} params={route.params} />
      case 'me': return <Me go={go} />
      case 'admin': return isAdmin ? <Admin go={go} /> : <Me go={go} />
      default: return isAdmin && page !== 'today' ? <Admin go={go} /> : <Today go={go} />
    }
  })()

  const tabs = [['today', t('nav.today'), Sun], ['path', t('nav.path'), Map], ['review', t('nav.review'), KeyRound], ['free', t('nav.free'), Headphones], ['studio', t('nav.studio'), Sparkles], ['me', t('nav.me'), User]]
  const active = page === 'module' || page === 'lesson' || page === 'exam' ? 'path' : page === 'admin' || (isAdmin && !page) ? 'admin' : page || 'today'
  const Nav = ({ desktop }) => (
    <nav className="tabbar" aria-label={t('nav.aria')}>
      {tabs.map(([k, label, Icon]) => <a key={k} href={`#/${k}`} className={`tab ${active === k ? 'on' : ''}`} aria-current={active === k ? 'page' : undefined}><Icon />{label}</a>)}
      {desktop && isAdmin && <a href="#/admin" className={`tab ${active === 'admin' ? 'on' : ''}`}><Shield />{t('nav.admin')}</a>}
    </nav>
  )
  const Chips = () => (
    <div className="chips">
      <span className="chip" title={t('chip.streak')}><Candle lit={d.streak.current > 0} /> {d.streak.current}</span>
      <span className="chip" title={t('chip.points')}>✦ {d.xp.toLocaleString()}</span>
    </div>
  )

  return (
    <div className="app">
      <aside className="side">
        <a className="brand" href="#/today">Inglés para <b>mi amor</b></a>
        <Chips />
        <Nav desktop />
      </aside>
      <header className="topbar">
        <div className="topbar-in">
          <a className="brand" href="#/today">Inglés para <b>mi amor</b></a>
          <Chips />
        </div>
      </header>
      <main className="main" style={page === 'admin' || (isAdmin && !page) ? { maxWidth: 1100 } : undefined}>{view}</main>
      <div className="mobile-only"><Nav /></div>
      <TimerPill />
    </div>
  )
}

function TimerPill() {
  const { row, mode, setMode } = useTimer()
  const { t } = useT()
  if (!mode) return null
  const theory = mode === 'theory'
  return (
    <div className="timer-pill" role="timer" aria-label={t(theory ? 'timer.theoryAria' : 'timer.freeAria')}>
      <span className={`dot ${theory ? '' : 'free'}`} />
      {theory ? <>{t('timer.theory')} {fmt(row.theory_sec)} <span style={{ opacity: .6 }}>/ {row.theory_target} min</span></>
        : <>{t('timer.free')} {fmt(row.free_sec)}</>}
      {!theory && <button className="icon-btn" onClick={() => setMode(null)} aria-label={t('common.pause')}><Pause size={14} /></button>}
      {theory && <span style={{ opacity: .6, paddingRight: 8 }}>{mins(row.theory_sec + row.free_sec)}/20</span>}
    </div>
  )
}

// New stamps and level-ups get their own moment
function useCelebrations(d) {
  const { t } = useT()
  useEffect(() => {
    try {
      const got = d.achievements.filter(a => a.got).map(a => a.id)
      const seen = JSON.parse(localStorage.getItem('stamps') || 'null')
      const fresh = seen ? got.filter(id => !seen.includes(id)) : []
      localStorage.setItem('stamps', JSON.stringify(got))
      if (fresh.length) {
        const a = d.achievements.find(x => x.id === fresh[0])
        d.notify(<><span style={{ fontSize: 28 }}>{a.em}</span><div><b>{t('toast.stamp', { title: t(`ach.${a.id}.t`) })}</b><div className="small muted">{t(`ach.${a.id}.d`)}</div></div></>)
        celebrate()
      }
      const lvl = +localStorage.getItem('level') || 0
      localStorage.setItem('level', d.level.n)
      if (lvl && d.level.n > lvl) { setTimeout(() => { d.notify(<><span style={{ fontSize: 28 }}>📜</span><div><b>{t('toast.level', { n: d.level.n, title: t(`lvl.${Math.min(d.level.n - 1, 11)}`) })}</b><div className="small muted">{t('toast.chapter')}</div></div></>); celebrate(true) }, 1500) }
    } catch { /* storage unavailable */ }
  }, [d.achievements.filter(a => a.got).length, d.level.n])
}
