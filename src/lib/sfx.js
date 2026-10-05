// Short synthesized feedback sounds (no audio files): a bright two-note chime for right, a low buzz for wrong
let ctx
function audio() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone(c, { freq, start, dur, type = 'sine', gain = 0.18, to }) {
  const o = c.createOscillator(), g = c.createGain()
  const t0 = c.currentTime + start
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(c.destination)
  o.start(t0)
  o.stop(t0 + dur + 0.02)
}

export function playCorrect() {
  try {
    const c = audio(); if (!c) return
    tone(c, { freq: 659.25, start: 0, dur: 0.14 })      // E5
    tone(c, { freq: 987.77, start: 0.1, dur: 0.28 })    // B5
  } catch { /* sound is optional */ }
}

export function playWrong() {
  try {
    const c = audio(); if (!c) return
    tone(c, { freq: 220, to: 150, start: 0, dur: 0.32, type: 'sawtooth', gain: 0.12 })
    tone(c, { freq: 165, to: 110, start: 0.12, dur: 0.32, type: 'sawtooth', gain: 0.12 })
  } catch { /* sound is optional */ }
}
