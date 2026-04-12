import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'admin', label: 'Admin' },
]

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await authApi.register(form)
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="muted">You will receive a one-time code by email.</p>
        <form onSubmit={onSubmit} className="form">
          {error && <div className="alert error">{error}</div>}
          <label>
            Full name
            <input value={form.name} onChange={(e) => setField('name', e.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <label>
            Role
            <select value={form.role} onChange={(e) => setField('role', e.target.value)}>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? 'Creating…' : 'Register & send code'}
          </button>
        </form>
        <p className="muted small">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
