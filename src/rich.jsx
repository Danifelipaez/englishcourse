// Explanations: **key term** → bold + marker highlight. Everything else stays plain.
export function Rich({ text }) {
  return <>{String(text ?? '').split('**').map((p, i) => (i % 2 ? <strong key={i} className="hl">{p}</strong> : p))}</>
}
export const stripMarks = s => String(s ?? '').replace(/\*\*/g, '')

// Feedback notes: the answer after an arrow ("He / she / it → is.") gets the highlight automatically
export function Why({ text }) {
  const parts = String(text ?? '').split(/(→\s*[^.;,]+)/)
  return <>{parts.map((p, i) => p.startsWith('→') ? <span key={i}>→ <strong className="hl">{p.replace(/^→\s*/, '')}</strong></span> : <Rich key={i} text={p} />)}</>
}

