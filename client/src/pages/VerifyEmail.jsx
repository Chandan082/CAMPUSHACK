import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setSession } = useAuth()

  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onVerify(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)
    try {
      const { data } = await authApi.verifyEmail({ email, code })
      setSession(data.token, data.user)
      setMessage(data.message)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function onResend() {
    setError('')
    setMessage('')
    setBusy(true)
    try {
      await authApi.resendOtp({ email })
      setMessage('A new code was sent if the account exists and is unverified.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Verify email</h1>
        <p className="muted">Enter the 6-digit code from your inbox.</p>
        <form onSubmit={onVerify} className="form">
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            OTP code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={8}
              placeholder="123456"
            />
          </label>
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? 'Verifying…' : 'Verify & continue'}
          </button>
        </form>
        <div className="row-actions">
          <button type="button" className="btn ghost" onClick={onResend} disabled={busy || !email}>
            Resend code
          </button>
          <Link to="/login" className="btn link">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
