// Browser text-to-speech + speech recognition (Safari on iPhone/Mac supports both)
let voice
function pickVoice() {
  const vs = speechSynthesis.getVoices().filter(v => v.lang?.startsWith('en'))
  // Apple's natural voices first
  voice = vs.find(v => /Samantha|Ava|Allison|Susan|Google US English/.test(v.name)) || vs.find(v => v.lang === 'en-US') || vs[0]
}
if (typeof speechSynthesis !== 'undefined') { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice }

export function speak(text, rate = 0.92) {
  if (typeof speechSynthesis === 'undefined') return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  if (voice) u.voice = voice
  speechSynthesis.speak(u)
}

const Rec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
export const canListen = !!Rec

// Resolves with the recognizer's alternatives ([] if nothing was heard)
export function listen() {
  return new Promise((resolve, reject) => {
    if (!Rec) return reject(new Error('unsupported'))
    const r = new Rec()
    r.lang = 'en-US'
    r.interimResults = false
    r.maxAlternatives = 3
    let alts = []
    r.onresult = e => { alts = [...e.results[0]].map(a => a.transcript) }
    r.onerror = e => (e.error === 'no-speech' ? resolve([]) : reject(e))
    r.onend = () => resolve(alts)
    r.start()
  })
}
