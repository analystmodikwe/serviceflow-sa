import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { homePathForRole } from '../auth/AuthContext'
import { useAuth } from '../auth/useAuth'

export default function LoginPage() {
  const { session, role, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && session && role) {
      navigate(homePathForRole(role), { replace: true })
    }
  }, [loading, navigate, role, session])

  if (!loading && session && role) return <Navigate to={homePathForRole(role)} replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await signIn(email, password)
    setSubmitting(false)
    if (result.error) setError(result.error.message)
  }

  return (
    <div className="mx-auto max-w-md rounded-card border border-brand-100 bg-surface p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-brand-900">Log in</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium" htmlFor="login-email">
          Email
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium" htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          />
        </label>
        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-card bg-accent-500 px-4 py-3 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
