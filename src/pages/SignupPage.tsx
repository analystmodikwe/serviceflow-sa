import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { homePathForRole, type UserRole } from '../auth/AuthContext'
import { useAuth } from '../auth/useAuth'

type SignupRole = Exclude<UserRole, 'admin'>

export default function SignupPage() {
  const { session, role, loading, signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<SignupRole>('customer')
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
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setSubmitting(true)
    const result = await signUp(email, password, fullName, selectedRole)
    setSubmitting(false)
    if (result.error) setError(result.error.message)
  }

  return (
    <div className="mx-auto max-w-lg rounded-card border border-brand-100 bg-surface p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-brand-900">Create an account</h1>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium" htmlFor="signup-name">
          Full name
          <input
            id="signup-name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium" htmlFor="signup-email">
          Email
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium" htmlFor="signup-password">
          Password
          <input
            id="signup-password"
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-card border border-brand-100 px-3 py-2"
          />
        </label>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Choose your role</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ['customer', 'I want to book services'],
              ['provider', 'I offer services'],
            ] as const).map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-card border p-4 ${
                  selectedRole === value
                    ? 'border-brand-700 bg-brand-50'
                    : 'border-brand-100'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={selectedRole === value}
                  onChange={() => setSelectedRole(value)}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-card bg-accent-500 px-4 py-3 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </div>
  )
}
