import { useEffect, useState } from 'react'
import { Sun, Map, KeyRound, Headphones, User, Sparkles, Pause, Shield } from 'lucide-react'
import { useData, useTimer } from './lib/store.jsx'
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
  const [route, setRoute] = useState(parse)
  useEffect(() => { const f = () => { setRoute(parse()); scrollTo(0, 0) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const go = to => { location.hash = '/' + to }
  useCelebrations(d)

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

  const tabs = [['today', 'Today', Sun], ['path', 'Path', Map], ['review', 'Memory', KeyRound], ['free', 'Free', Headphones], ['studio', 'Tutor', Sparkles], ['me', 'Me', User]]
  const active = page === 'module' || page === 'lesson' || page === 'exam' ? 'path' : page === 'admin' || (isAdmin && !page) ? 'admin' : page || 'today'
  const Nav = ({ desktop }) => (
    <nav className="tabbar" aria-label="Main">
      {tabs.map(([k, label, Icon]) => <a key={k} href={`#/${k}`} className={`tab ${active === k ? 'on' : ''}`} aria-current={active === k ? 'page' : undefined}><Icon />{label}</a>)}
      {desktop && isAdmin && <a href="#/admin" className={`tab ${active === 'admin' ? 'on' : ''}`}><Shield />Admin</a>}
    </nav>
  )
  const Chips = () => (
    <div className="chips">
      <span className="chip" title="Day streak"><Candle lit={d.streak.current > 0} /> {d.streak.current}</span>
      <span className="chip" title="Points">✦ {d.xp.toLocaleString()}</span>
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
  if (!mode) return null
  const theory = mode === 'theory'
  return (
    <div className="timer-pill" role="timer" aria-label={`${theory ? 'Theory' : 'Free English'} timer`}>
      <span className={`dot ${theory ? '' : 'free'}`} />
      {theory ? <>Theory {fmt(row.theory_sec)} <span style={{ opacity: .6 }}>/ {row.theory_target} min</span></>
        : <>Free English {fmt(row.free_sec)}</>}
      {!theory && <button className="icon-btn" onClick={() => setMode(null)} aria-label="Pause"><Pause size={14} /></button>}
      {theory && <span style={{ opacity: .6, paddingRight: 8 }}>{mins(row.theory_sec + row.free_sec)}/20</span>}
    </div>
  )
}

// New stamps and level-ups get their own moment
function useCelebrations(d) {
  useEffect(() => {
    try {
      const got = d.achievements.filter(a => a.got).map(a => a.id)
      const seen = JSON.parse(localStorage.getItem('stamps') || 'null')
      const fresh = seen ? got.filter(id => !seen.includes(id)) : []
      localStorage.setItem('stamps', JSON.stringify(got))
      if (fresh.length) {
        const a = d.achievements.find(x => x.id === fresh[0])
        d.notify(<><span style={{ fontSize: 28 }}>{a.em}</span><div><b>New stamp: {a.title}</b><div className="small muted">{a.desc}</div></div></>)
        celebrate()
      }
      const lvl = +localStorage.getItem('level') || 0
      localStorage.setItem('level', d.level.n)
      if (lvl && d.level.n > lvl) { setTimeout(() => { d.notify(<><span style={{ fontSize: 28 }}>📜</span><div><b>Level {d.level.n}: {d.level.title}</b><div className="small muted">A new chapter begins.</div></div></>); celebrate(true) }, 1500) }
    } catch { /* storage unavailable */ }
  }, [d.achievements.filter(a => a.got).length, d.level.n])
}
