import { useState } from 'react'
import { supabase } from '../lib/store.jsx'
import { useT } from '../lib/i18n.jsx'

export default function Auth() {
  const { t } = useT()
  const [mode, setMode] = useState('in')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })

  const submit = async e => {
    e.preventDefault(); setBusy(true); setMsg('')
    const { data, error } = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email: f.email, password: f.password })
      : await supabase.auth.signUp({ email: f.email, password: f.password, options: { data: { name: f.name || 'Meri' } } })
    if (error) setMsg(error.message)
    else if (mode === 'up' && !data.session) setMsg(t('auth.check'))
    setBusy(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <form className="card tape stack" style={{ width: '100%', maxWidth: 400, paddingTop: 36 }} onSubmit={submit}>
        <div className="center stack-s">
          <div className="seal" style={{ margin: '0 auto' }}>M</div>
          <h1 className="italic" style={{ fontSize: 34 }}>Inglés para mi amor</h1>
          <p className="muted small" style={{ margin: 0 }}>{t('auth.tag')}</p>
        </div>
        {mode === 'up' && <label className="field">{t('auth.name')}<input className="input" value={f.name} onChange={set('name')} placeholder="Meri" autoComplete="given-name" /></label>}
        <label className="field">{t('auth.email')}<input className="input" type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label className="field">{t('auth.pass')}<input className="input" type="password" required minLength={6} value={f.password} onChange={set('password')} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></label>
        {msg && <div className="why" role="alert">{msg}</div>}
        <button className="btn" disabled={busy}>{mode === 'in' ? t('auth.in') : t('auth.up')}</button>
        <button type="button" className="btn ghost" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg('') }}>
          {mode === 'in' ? t('auth.toUp') : t('auth.toIn')}
        </button>
      </form>
    </div>
  )
}
