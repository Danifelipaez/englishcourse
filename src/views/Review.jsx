import { useEffect, useState } from 'react'
import { KeyRound, Link2, NotebookPen } from 'lucide-react'
import { CARDS, EXERCISE, LESSON, LESSONS } from '../content/index.js'
import { useData, useTheoryTime, supabase } from '../lib/store.jsx'
import { shuffle } from '../lib/logic.js'
import { celebrate } from '../components.jsx'
import { useT } from '../lib/i18n.jsx'
import { Runner, usableRun } from './Exercises.jsx'
import { loadDraft, saveDraft, clearDraft } from '../lib/drafts.js'

// Card → exercise. New cards: recognize (EN → ES). Older cards: produce (ES → EN).
function cardExercise(c, box, t) {
  const card = CARDS[c]
  if (!card) return null
  const base = { id: `card-${c}`, cardId: c, skill: 'vocab', topic: card.topic, lessonId: card.lessonId }
  if (box <= 2) {
    const others = shuffle(Object.values(CARDS).filter(x => x.es !== card.es)).slice(0, 3).map(x => x.es)
    return { ...base, type: 'card', prompt: card.en, speak: card.en, options: [card.es, ...others], answer: card.es, why: `“${card.example}”` }
  }
  const answer = card.en.replace(/\s*\(.*?\)/g, '').split(' / ').join('|')
  return { ...base, type: 'type', prompt: t('card.howSay', { es: card.es }), answer, why: `“${card.example}”` }
}

// ids of review items: `card-<cardId>` is rebuilt from the card, anything else is a lesson exercise
const resolveItem = (id, cards, t) => id.startsWith('card-') ? cardExercise(id.slice(5), cards[id.slice(5)]?.box ?? 1, t) : EXERCISE[id]

const PLAYABLE = e => e && e.type !== 'speak' && e.type !== 'read' && e.type !== 'match'

export default function Review({ go }) {
  useTheoryTime()
  const { cards, due, completed, nextLesson, reviewCard, uid } = useData()
  const { t } = useT()
  const [session, setSession] = useState(null)
  const [done, setDone] = useState(null)
  const [misses, setMisses] = useState([])
  const resolve = id => resolveItem(id, cards, t)
  const loadSaved = () => usableRun(loadDraft(uid, 'review')?.run, resolve) // an interrupted session
  const [saved, setSaved] = useState(loadSaved)
  const [resume, setResume] = useState(null)

  useEffect(() => {
    supabase.from('v_item_misses').select('item_id,misses,last_seen').eq('user_id', uid).gt('misses', 0).order('last_seen', { ascending: false }).limit(40)
      .then(({ data }) => setMisses((data || []).map(r => EXERCISE[r.item_id]).filter(PLAYABLE)))
  }, [uid])

  // Threads: exercises from the lessons your next lesson builds on
  const threadLessons = (nextLesson?.links || []).map(id => LESSON[id]).filter(l => l && completed.has(l.id))
  const fromLessons = ls => shuffle(ls.flatMap(l => l.exercises.filter(PLAYABLE)))
  const doneLessons = LESSONS.filter(l => completed.has(l.id))

  const start = kind => {
    let items
    if (kind === 'daily') {
      const cardsDue = shuffle(due).slice(0, 15).map(c => cardExercise(c.card_id, c.box, t)).filter(Boolean)
      items = [...cardsDue, ...fromLessons(threadLessons.length ? threadLessons : doneLessons).slice(0, 5)]
    } else if (kind === 'threads') items = fromLessons(threadLessons.length ? threadLessons : doneLessons).slice(0, 10)
    else if (kind === 'mistakes') items = shuffle(misses).slice(0, 12)
    else items = shuffle(Object.values(cards)).slice(0, 12).map(c => cardExercise(c.card_id, c.box, t)).filter(Boolean)
    if (items.length) { clearDraft(uid, 'review'); setSaved(null); setResume(null); setDone(null); setSession({ kind, items: shuffle(items) }) }
  }

  if (session) return <Runner items={session.items} context="review" onCard={reviewCard} draftKey="review" resume={resume} resolve={resolve}
    onExit={() => { setSession(null); setResume(null); setSaved(loadSaved()) }}
    onFinish={r => { setDone(r); setSession(null); setResume(null); setSaved(null); celebrate(r.score >= 80) }} />

  const boxes = [1, 2, 3, 4, 5, 6].map(b => Object.values(cards).filter(c => c.box === b).length)
  return (
    <div className="stack">
      <div><span className="eyebrow">{t('rev.eyebrow')}</span><h1>{t('rev.h')}</h1>
        <p className="muted">{t('rev.intro')}</p></div>

      {done && <div className="card cream enter center"><div className="hand" style={{ fontSize: 30 }}>{t('rev.remembered', { n: done.score })}</div><div className="small muted">{t('rev.donePts', { n: Math.round(done.points), c: done.bestCombo })}</div></div>}

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
          {boxes.map((n, i) => (
            <div key={i} className="center" style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '10px 0 6px', background: i === 5 ? 'var(--gold-soft)' : 'var(--cream)' }}>
              <div className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{n}</div>
              <div style={{ width: 14, height: 3, borderRadius: 2, background: 'var(--gold)', margin: '4px auto' }} />
              <div className="small muted">{i + 1}</div>
            </div>
          ))}
        </div>
        <p className="small muted center" style={{ marginBottom: 0 }}>{t('rev.inBox', { n: Object.keys(cards).length, m: boxes[5] })}</p>
      </div>

      {saved && (
        <button className="card link enter" style={{ textAlign: 'left', borderColor: 'var(--wax)' }} onClick={() => { setResume(saved); setSession({ kind: 'resume', items: [] }) }}>
          <div className="row"><KeyRound /><div className="grow"><b>{t('rev.continue')}</b><div className="small muted">{t('rev.contSub', { i: Math.min(saved.i + 1, saved.queue.length), n: saved.queue.length })}</div></div></div>
        </button>
      )}
      <button className="card link enter" style={{ textAlign: 'left', borderColor: 'var(--ink)' }} onClick={() => start('daily')} disabled={!due.length && !doneLessons.length}>
        <div className="row"><KeyRound /><div className="grow"><b>{t('rev.daily')}</b><div className="small muted">{due.length ? t('rev.dailyDue', { n: due.length }) : doneLessons.length ? t('rev.dailyThreads') : t('rev.dailyNone')}</div></div></div>
      </button>
      <button className="card link enter" style={{ textAlign: 'left' }} onClick={() => start('threads')} disabled={!doneLessons.length}>
        <div className="row"><Link2 /><div className="grow"><b>{t('rev.threads')}</b><div className="small muted">{threadLessons.length ? t('rev.threadsSub', { list: threadLessons.map(l => l.n).join(', '), title: nextLesson.title }) : t('rev.threadsMixed')}</div></div></div>
      </button>
      <button className="card link enter" style={{ textAlign: 'left' }} onClick={() => start('mistakes')} disabled={!misses.length}>
        <div className="row"><NotebookPen /><div className="grow"><b>{t('rev.mistakes')}</b><div className="small muted">{misses.length ? t('rev.mistakesSub', { n: misses.length }) : t('rev.noMistakes')}</div></div></div>
      </button>
      <button className="btn ghost" onClick={() => start('shuffle')} disabled={!Object.keys(cards).length}>{t('rev.shuffle')}</button>
      <button className="btn ghost" onClick={() => go('path')}>{t('rev.toLessons')}</button>
    </div>
  )
}
