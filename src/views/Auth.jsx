import { useEffect, useState } from 'react'
import { supabase } from '../lib/store.jsx'
import { useT } from '../lib/i18n.jsx'

export default function Auth() {
  const { t } = useT()
  const [mode, setMode] = useState('in')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState(false) // account exists but the email isn't confirmed yet
  const [cool, setCool] = useState(0)             // seconds until the confirmation email can be re-sent
  const set = k => e => setF({ ...f, [k]: e.target.value })

  useEffect(() => { if (cool > 0) { const id = setTimeout(() => setCool(cool - 1), 1000); return () => clearTimeout(id) } }, [cool])
  // the confirmation link failed (expired / already used): Supabase puts the reason in the URL hash
  useEffect(() => {
    const h = new URLSearchParams(location.hash.replace(/^#\/?/, '').replace(/^\?/, ''))
    if (h.get('error_code') || h.get('error_description')) {
      setMsg(h.get('error_code') === 'otp_expired' ? t('auth.expired') : (h.get('error_description') || '').replace(/\+/g, ' '))
      setPending(true)
      history.replaceState(null, '', location.pathname + location.search)
    }
  }, [])

  const resend = async () => {
    if (!f.email) { setMsg(t('auth.needEmail')); return }
    setBusy(true); setMsg('')
    const { error } = await supabase.auth.resend({ type: 'signup', email: f.email, options: { emailRedirectTo: location.origin } })
    setMsg(error ? error.message : t('auth.resent'))
    if (!error) setCool(60)
    setBusy(false)
  }

  const submit = async e => {
    e.preventDefault(); setBusy(true); setMsg('')
    const { data, error } = mode === 'in'
      ? await supabase.auth.signInWithPassword({ email: f.email, password: f.password })
      : await supabase.auth.signUp({ email: f.email, password: f.password, options: { emailRedirectTo: location.origin, data: { name: f.name || 'Meri' } } })
    if (error) {
      const unconfirmed = error.code === 'email_not_confirmed' || /email not confirmed/i.test(error.message)
      setPending(unconfirmed)
      setMsg(unconfirmed ? t('auth.unconfirmed') : error.message)
    } else if (mode === 'up' && !data.session) { setPending(true); setMsg(t('auth.check')); setCool(60) }
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
        {pending && <button type="button" className="btn ghost" disabled={busy || cool > 0} onClick={resend}>{cool > 0 ? t('auth.resendIn', { n: cool }) : t('auth.resend')}</button>}
        <button className="btn" disabled={busy}>{mode === 'in' ? t('auth.in') : t('auth.up')}</button>
        <button type="button" className="btn ghost" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg(''); setPending(false) }}>
          {mode === 'in' ? t('auth.toUp') : t('auth.toIn')}
        </button>
      </form>
    </div>
  )
}
