import { useState } from 'react'
import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/shared/Button'
import { Field, Input } from '../components/shared/Input'
import { useToast } from '../components/shared/Toast'

export default function AdminLogin() {
  const { user, isAdmin, login } = useAuth()
  const { state } = useLocation()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { push } = useToast()

  if (user && isAdmin) return <Navigate to={state?.from || '/admin'} replace />

  async function onSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const result = await login(email, password)
      if (!result.isAdmin) {
        push('This account is missing the Firebase admin custom claim.', 'error')
        return
      }
      push('Admin login successful.', 'success')
    } catch (error) {
      push(error.message || 'Login failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid min-h-screen place-items-center bg-brand-cream px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
        <p className="text-sm font-black uppercase text-brand-rose">Admin Only</p>
        <h1 className="mt-2 text-3xl font-black text-brand-navy">Sreya Hospitals Admin</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          No public sign-up exists. Use the single Firebase email/password admin account with the `admin` custom claim.
        </p>
        {params.get('blocked') ? (
          <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">Admin claim required.</p>
        ) : null}
        <div className="mt-5 grid gap-4">
          <Field label="Email"><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></Field>
          <Field label="Password"><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></Field>
          <Button type="submit" disabled={loading}>{loading ? 'Checking...' : 'Login'}</Button>
        </div>
      </form>
    </section>
  )
}
