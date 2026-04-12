import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { data } = await authApi.login({ email, password })
      setSession(data.token, data.user)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.message || 'Login failed'
      setError(msg)
      if (msg.includes('verify')) {
        navigate('/verify-email', { state: { email } })
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="muted">JWT session after verified email.</p>
        <form onSubmit={onSubmit} className="form">
          {error && <div className="alert error">{error}</div>}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="muted small">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
