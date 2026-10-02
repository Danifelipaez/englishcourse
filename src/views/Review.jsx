import { useEffect, useState } from 'react'
import { KeyRound, Link2, NotebookPen } from 'lucide-react'
import { CARDS, EXERCISE, LESSON, LESSONS } from '../content/index.js'
import { useData, useTheoryTime, supabase } from '../lib/store.jsx'
import { shuffle } from '../lib/logic.js'
import { celebrate } from '../components.jsx'
import { Runner } from './Exercises.jsx'

// Card → exercise. New cards: recognize (EN → ES). Older cards: produce (ES → EN).
function cardExercise(c, box) {
  const card = CARDS[c]
  if (!card) return null
  const base = { id: `card-${c}`, cardId: c, skill: 'vocab', topic: card.topic, lessonId: card.lessonId }
  if (box <= 2) {
    const others = shuffle(Object.values(CARDS).filter(x => x.es !== card.es)).slice(0, 3).map(x => x.es)
    return { ...base, type: 'card', prompt: card.en, speak: card.en, options: [card.es, ...others], answer: card.es, why: `“${card.example}”` }
  }
  const answer = card.en.replace(/\s*\(.*?\)/g, '').split(' / ').join('|')
  return { ...base, type: 'type', prompt: `How do you say “${card.es}” in English?`, answer, why: `“${card.example}”` }
}

const PLAYABLE = e => e && e.type !== 'speak' && e.type !== 'read' && e.type !== 'match'

export default function Review({ go }) {
  useTheoryTime()
  const { cards, due, completed, nextLesson, reviewCard, uid } = useData()
  const [session, setSession] = useState(null)
  const [done, setDone] = useState(null)
  const [misses, setMisses] = useState([])

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
      const cardsDue = shuffle(due).slice(0, 15).map(c => cardExercise(c.card_id, c.box)).filter(Boolean)
      items = [...cardsDue, ...fromLessons(threadLessons.length ? threadLessons : doneLessons).slice(0, 5)]
    } else if (kind === 'threads') items = fromLessons(threadLessons.length ? threadLessons : doneLessons).slice(0, 10)
    else if (kind === 'mistakes') items = shuffle(misses).slice(0, 12)
    else items = shuffle(Object.values(cards)).slice(0, 12).map(c => cardExercise(c.card_id, c.box)).filter(Boolean)
    if (items.length) { setDone(null); setSession({ kind, items: shuffle(items) }) }
  }

  if (session) return <Runner items={session.items} context="review" onCard={reviewCard} onExit={() => setSession(null)}
    onFinish={r => { setDone(r); setSession(null); celebrate(r.score >= 80) }} />

  const boxes = [1, 2, 3, 4, 5, 6].map(b => Object.values(cards).filter(c => c.box === b).length)
  return (
    <div className="stack">
      <div><span className="eyebrow">Remember what you learned</span><h1>Memory box</h1>
        <p className="muted">Words travel from drawer 1 to drawer 6. Each correct answer moves a word one drawer up and it comes back later; a mistake sends it back to drawer 1.</p></div>

      {done && <div className="card cream enter center"><div className="hand" style={{ fontSize: 30 }}>{done.score}% remembered</div><div className="small muted">+{Math.round(done.points)} points · best combo {done.bestCombo}</div></div>}

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
        <p className="small muted center" style={{ marginBottom: 0 }}>{Object.keys(cards).length} words in your box · {boxes[5]} mastered</p>
      </div>

      <button className="card link enter" style={{ textAlign: 'left', borderColor: 'var(--ink)' }} onClick={() => start('daily')} disabled={!due.length && !doneLessons.length}>
        <div className="row"><KeyRound /><div className="grow"><b>Daily review</b><div className="small muted">{due.length ? `${due.length} words due + threads from past lessons` : doneLessons.length ? 'No words due — threads only' : 'Finish your first lesson to fill the box'}</div></div></div>
      </button>
      <button className="card link enter" style={{ textAlign: 'left' }} onClick={() => start('threads')} disabled={!doneLessons.length}>
        <div className="row"><Link2 /><div className="grow"><b>Pull the threads</b><div className="small muted">{threadLessons.length ? `Refresh ${threadLessons.map(l => l.n).join(', ')} before “${nextLesson.title}”` : 'Mixed questions from lessons you finished'}</div></div></div>
      </button>
      <button className="card link enter" style={{ textAlign: 'left' }} onClick={() => start('mistakes')} disabled={!misses.length}>
        <div className="row"><NotebookPen /><div className="grow"><b>Mistakes notebook</b><div className="small muted">{misses.length ? `${misses.length} question${misses.length === 1 ? '' : 's'} you missed — try them again` : 'No mistakes yet. Suspiciously perfect.'}</div></div></div>
      </button>
      <button className="btn ghost" onClick={() => start('shuffle')} disabled={!Object.keys(cards).length}>Shuffle all my words</button>
      <button className="btn ghost" onClick={() => go('path')}>Go to lessons</button>
    </div>
  )
}
