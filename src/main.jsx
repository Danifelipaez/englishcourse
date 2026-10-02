import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase, StoreProvider, Splash } from './lib/store.jsx'
import App from './App.jsx'
import Auth from './views/Auth.jsx'
import './styles.css'

function Root() {
  const [session, setSession] = useState(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (session === undefined) return <Splash />
  if (!session) return <Auth />
  return <StoreProvider key={session.user.id} session={session}><App /></StoreProvider>
}

createRoot(document.getElementById('root')).render(<StrictMode><Root /></StrictMode>)
