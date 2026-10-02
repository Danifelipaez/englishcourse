import { supabase } from './store.jsx'

// Calls the Gemini tutor (api/tutor.js). Throws with a readable message.
export async function ask(body) {
  const { data: { session } } = await supabase.auth.getSession()
  const r = await fetch('/api/tutor', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${session?.access_token}` }, body: JSON.stringify(body) })
  const j = await r.json().catch(() => ({ error: 'The tutor is offline right now.' }))
  if (!r.ok || j.error) throw new Error(j.error || 'Something went wrong')
  return j
}

export const levelOf = m => (m.level.startsWith('B') ? 'B1' : m.level.includes('A2') ? 'A2' : 'A1')
