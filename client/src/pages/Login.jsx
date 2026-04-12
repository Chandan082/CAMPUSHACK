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

  const [otpMode, setOtpMode] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')

  async function onRequestOtp() {
    if (!email) {
      setError('Please enter your email first.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await authApi.requestLoginOtp({ email })
      setOtpSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setBusy(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      let data;
      if (otpMode && otpSent) {
        const res = await authApi.loginWithOtp({ email, code: otpCode })
        data = res.data
      } else {
        const res = await authApi.login({ email, password })
        data = res.data
      }
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

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button type="button" className={`btn ${!otpMode ? 'primary' : 'ghost'}`} onClick={() => { setOtpMode(false); setError(''); }}>Use Password</button>
          <button type="button" className={`btn ${otpMode ? 'primary' : 'ghost'}`} onClick={() => { setOtpMode(true); setError(''); }}>Use OTP</button>
        </div>

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
              disabled={otpMode && otpSent}
            />
          </label>
          
          {!otpMode && (
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
          )}

          {otpMode && otpSent && (
            <label>
              Login OTP
              <input
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                placeholder="123456"
                maxLength={8}
              />
            </label>
          )}

          {!otpMode && (
            <button type="submit" className="btn primary" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          )}

          {otpMode && !otpSent && (
            <button type="button" onClick={onRequestOtp} className="btn primary" disabled={busy}>
              {busy ? 'Sending OTP…' : 'Send Login OTP'}
            </button>
          )}

          {otpMode && otpSent && (
            <button type="submit" className="btn primary" disabled={busy}>
              {busy ? 'Verifying…' : 'Login with OTP'}
            </button>
          )}
        </form>
        <p className="muted small">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
