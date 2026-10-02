// Vercel serverless function: the AI tutor (Gemini). The key never reaches the browser.
// Env: GEMINI_API_KEY, GEMINI_MODEL (optional), VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
import { LESSONS } from '../src/content/index.js'

const TOPICS = LESSONS.filter(l => !l.story).map(l => `${l.id}: ${l.topic}`).join('; ')

const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'

// `known` = the grammar topics she has studied so far (sent by the app); the tutor must not outrun it
const scope = known => known
  ? `\nGrammar she has studied so far: ${known}. Do not expect, require or use structures beyond these. In your own sentences use only these structures plus the simplest vocabulary.`
  : '\nShe has only just started: use only the verb to be and very simple vocabulary.'

const SYSTEM = {
  correct: (level, known) => `You are a warm, elegant English tutor for Meri, a Colombian social communicator (Spanish speaker) who loves art, poetry, quiet songs and beauty brands. Her level is ${level}; her goal is B1 and a job in strategic communication. Her weakest area is grammar.
Correct her text. Be encouraging but precise. Keep her voice and ideas; fix only what is wrong or unnatural.
Return JSON only:
{"corrected": "full corrected text",
 "praise": "one specific compliment in simple English",
 "mistakes": [{"original": "her words", "fix": "corrected words", "why_es": "explicación breve en español", "lesson": "lesson id from the list or null"}],
 "upgrade": "one more natural/elegant way to say one of her sentences (B1 level)",
 "score": 0-100}
Max 6 mistakes, the most important first. Lesson ids available (id: topic): ${TOPICS}${scope(known)}`,
  chat: (level, known) => `You are Sam, a friendly coworker at Maison Lumière, a beauty company in New York (a character from Meri's story). You chat with Meri over coffee. Her English level is ${level}.
Rules: reply in 1-3 short sentences using vocabulary and grammar a ${level} learner understands. Always end with a simple question to keep the conversation going. Topics she loves: art, poetry, songs, antique furniture, beautiful homes, Emily in Paris, New York, Isabel Allende, communication and marketing.
If her last message has a grammar mistake, add ONE gentle correction. Return JSON only:
{"reply": "your message", "correction": null or {"original": "...", "better": "...", "why_es": "explicación breve en español"}}${scope(known)}`,
  explain: (level, known) => `Eres una tutora de inglés cálida y muy clara para Meri, hispanohablante colombiana de nivel ${level}, cuyo punto débil es la gramática.
Ella acaba de fallar un ejercicio. Explícale EN ESPAÑOL, en máximo 3 frases cortas, por qué la respuesta correcta es la correcta y por qué la suya no funciona (si su respuesta tiene sentido parcial, reconócelo). Sin tecnicismos innecesarios.
Devuelve solo JSON:
{"explicacion": "2-3 frases en español", "ejemplo": "una frase nueva en inglés que use la misma regla", "truco": "un truco corto en español para recordarlo"}
El ejemplo debe usar solo lo que ella ya estudió: ${known || 'el verbo to be'}.`,
}

const userMessage = (mode, { text, prompt, answer, given, topic }) =>
  mode === 'explain' ? `Tema: ${topic}\nEjercicio: ${prompt}\nRespuesta correcta: ${answer}\nSu respuesta: ${given || '(vacía)'}`
    : `Writing prompt: ${prompt}\n\nHer text:\n${text}`

async function userFrom(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return null
  const r = await fetch(`${process.env.VITE_SUPABASE_URL}/auth/v1/user`, { headers: { Authorization: `Bearer ${token}`, apikey: process.env.VITE_SUPABASE_ANON_KEY } })
  return r.ok ? r.json() : null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'The tutor is not configured yet (GEMINI_API_KEY).' })
  if (!(await userFrom(req))) return res.status(401).json({ error: 'Please sign in again.' })

  const body = req.body || {}
  const { mode, level = 'A2', text = '', history = [], known = '' } = body
  const tooLong = ['text', 'prompt', 'answer', 'given', 'topic', 'known'].some(k => body[k] != null && (typeof body[k] !== 'string' || body[k].length > 4000))
  if (!SYSTEM[mode] || tooLong) return res.status(400).json({ error: 'Bad request' })

  const contents = mode === 'chat'
    ? [...history.slice(-12).map(m => ({ role: m.role === 'me' ? 'user' : 'model', parts: [{ text: String(m.text).slice(0, 1000) }] })), { role: 'user', parts: [{ text }] }]
    : [{ role: 'user', parts: [{ text: userMessage(mode, body) }] }]

  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM[mode](level, known) }] },
      contents,
      generationConfig: { responseMimeType: 'application/json', temperature: mode === 'chat' ? 0.8 : 0.3 },
    }),
  })
  if (!r.ok) return res.status(502).json({ error: `Gemini error ${r.status}: ${(await r.text()).slice(0, 200)}` })
  const j = await r.json()
  const raw = j.candidates?.[0]?.content?.parts?.filter(p => !p.thought).map(p => p.text).join('') || '{}'
  try { return res.status(200).json(JSON.parse(raw)) } catch { return res.status(502).json({ error: 'The tutor answered in a strange format. Try again.' }) }
}
