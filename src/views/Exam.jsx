import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MODULE, MODULES } from '../content/index.js'
import { useData, useTheoryTime } from '../lib/store.jsx'
import { shuffle } from '../lib/logic.js'
import { celebrate } from '../components.jsx'
import { useT } from '../lib/i18n.jsx'
import { Runner, Explain, usableRun } from './Exercises.jsx'
import { loadDraft, clearDraft } from '../lib/drafts.js'

export default function Exam({ id, go }) {
  useTheoryTime()
  const m = MODULE[id]
  const { saveExam, moduleOpen, passed, uid } = useData()
  const { t } = useT()
  const draftKey = `exam:${id}`
  const [saved, setSaved] = useState(() => usableRun(loadDraft(uid, draftKey)?.run)) // an interrupted attempt
  const [resume, setResume] = useState(null)
  const [stage, setStage] = useState('intro')
  const [res, setRes] = useState(null)
  const items = useMemo(() => shuffle([
    ...m.examItems,
    ...shuffle(m.lessons.flatMap(l => l.exercises.filter(e => ['mc', 'fill', 'fix', 'order', 'listen'].includes(e.type)))).slice(0, 5),
  ]), [id, stage === 'run'])

  if (!moduleOpen(m)) return <div className="card center stack"><h3>{t('exam.locked')}</h3><p className="muted">{t('exam.lockedP')}</p><button className="btn" onClick={() => go('path')}>{t('common.back')}</button></div>

  const finish = async r => {
    const ok = r.score >= 70
    await saveExam(m.id, r.score, ok, { wrong: r.results.filter(x => !x.correct).map(x => ({ id: x.ex.id, given: x.given })) })
    setRes({ ...r, ok })
    setStage('done')
    if (ok) setTimeout(() => celebrate(true), 500)
  }
  const nextMod = MODULES[m.n]

  if (stage === 'run') return <Runner items={items} context="exam" exam draftKey={draftKey} resume={resume} onFinish={finish} onExit={() => { setSaved(usableRun(loadDraft(uid, draftKey)?.run)); setResume(null); setStage('intro') }} />

  if (stage === 'done') return (
    <div className="stack center enter">
      <div className={`seal ${res.ok ? '' : 'gray'}`} style={{ width: 96, height: 96, fontSize: 36, margin: '16px auto 0', animation: 'stampIn .8s var(--ease)' }}>{res.ok ? m.n : '·'}</div>
      <span className="eyebrow">{t('exam.eyebrow', { n: m.n })}</span>
      <h1>{res.score}%</h1>
      <h3 className="italic">{res.ok ? t('exam.sealed', { title: m.title }) : t('exam.notSealed')}</h3>
      <p className="muted">{res.ok ? (nextMod ? t('exam.nextOpen', { n: nextMod.n, title: nextMod.title }) : t('exam.finished')) : t('exam.need70')}</p>
      {res.results.some(x => !x.correct) && (
        <div className="card" style={{ textAlign: 'left' }}>
          <span className="eyebrow">{t('exam.review')}</span>
          <div className="stack-s" style={{ marginTop: 10 }}>
            {res.results.filter(x => !x.correct).map(({ ex, given }) => (
              <div key={ex.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
                <div className="serif" style={{ fontSize: 18 }}>{ex.prompt || ex.es || '(listening)'}</div>
                <div className="small"><span style={{ color: 'var(--bad)' }}>{t('exam.you')} {given || '—'}</span> · <span style={{ color: 'var(--ok)' }}>{t('exam.ans')} {ex.answer?.split('|')[0]}</span></div>
                {ex.why && <div className="small muted">{ex.why}</div>}
                {ex.type !== 'speak' && <div style={{ marginTop: 6 }}><Explain ex={ex} given={given} /></div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {res.ok && nextMod ? <button className="btn wax block" onClick={() => go(`module/${nextMod.id}`)}>{t('exam.openMod', { n: nextMod.n })} <ArrowRight /></button>
        : <button className="btn block" onClick={() => go('review')}>{t('exam.reviewThreads')}</button>}
      <button className="btn ghost block" onClick={() => go(`module/${m.id}`)}>{t('exam.backModule')}</button>
    </div>
  )

  return (
    <div className="stack">
      <div className="row"><button className="icon-btn" onClick={() => go(`module/${m.id}`)} aria-label={t('common.back')}><ArrowLeft /></button>
        <div className="grow"><span className="eyebrow">{t('exam.eyebrow', { n: m.n })}</span><h2>{m.title}</h2></div></div>
      <div className="card center stack tape" style={{ paddingTop: 32 }}>
        <div className="seal" style={{ margin: '0 auto' }}>{passed.has(m.id) ? '✓' : m.n}</div>
        <h3 className="italic">{t('exam.seal')}</h3>
        <ul className="small muted" style={{ textAlign: 'left', margin: '0 auto', lineHeight: 1.9 }}>
          <li>{t('exam.b1', { n: items.length })}</li>
          <li>{t('exam.b2')}</li>
          <li>{t('exam.b3')}</li>
          <li>{t('exam.b4')}</li>
        </ul>
        {saved && <>
          <p className="small" style={{ margin: 0 }}>{t('exam.resume', { i: Math.min(saved.i + 1, saved.queue.length), n: saved.queue.length })}</p>
          <button className="btn wax" onClick={() => { setResume(saved); setStage('run') }}>{t('exam.resumeBtn')} <ArrowRight /></button>
        </>}
        <button className={`btn ${saved ? 'ghost' : 'wax'}`} onClick={() => { clearDraft(uid, draftKey); setSaved(null); setResume(null); setStage('run') }}>{saved ? t('exam.restart') : t('exam.begin')} {!saved && <ArrowRight />}</button>
      </div>
    </div>
  )
}
