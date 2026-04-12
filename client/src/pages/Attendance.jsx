import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { attendanceApi } from '../api/attendance'
import { useAuth } from '../context/AuthContext'

export default function Attendance() {
  const { user } = useAuth()
  const canHost = user?.role === 'faculty' || user?.role === 'admin'

  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [minutes, setMinutes] = useState(30)
  const [qrPayload, setQrPayload] = useState('')
  const [sessionCode, setSessionCode] = useState('')
  const [checkCode, setCheckCode] = useState('')
  const [mine, setMine] = useState([])
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadMine() {
    try {
      const { data } = await attendanceApi.mine()
      setMine(data.items || [])
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    loadMine()
  }, [])

  async function createSession(e) {
    e.preventDefault()
    setError('')
    setMsg('')
    setBusy(true)
    try {
      const { data } = await attendanceApi.createSession({
        title,
        course,
        expiresInMinutes: Number(minutes) || 30,
      })
      setQrPayload(data.qrPayload)
      setSessionCode(data.session?.sessionCode || '')
      setMsg('Session live — students can scan or enter the code.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function checkIn(e) {
    e.preventDefault()
    setError('')
    setMsg('')
    setBusy(true)
    try {
      await attendanceApi.checkIn({ sessionCode: checkCode.trim().toUpperCase() })
      setMsg('Attendance recorded.')
      setCheckCode('')
      loadMine()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <h1>Attendance</h1>
      <p className="muted">Faculty and admins generate a session QR. Students check in with the session code.</p>

      <div className="split">
        {canHost && (
          <section className="card">
            <h2>Host session</h2>
            <form onSubmit={createSession} className="form tight">
              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lecture 4" />
              </label>
              <label>
                Course (optional)
                <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="CS101" />
              </label>
              <label>
                Expires in (minutes)
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </label>
              <button type="submit" className="btn primary" disabled={busy}>
                Generate QR
              </button>
            </form>
            {qrPayload && (
              <div className="qr-wrap">
                <QRCodeSVG value={qrPayload} size={180} level="M" />
                <p className="mono">{sessionCode}</p>
                <p className="small muted">Payload encodes session metadata for scanner apps.</p>
              </div>
            )}
          </section>
        )}

        <section className="card">
          <h2>Check in</h2>
          <form onSubmit={checkIn} className="form tight">
            <label>
              Session code
              <input
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value)}
                placeholder="Paste from QR or faculty"
              />
            </label>
            <button type="submit" className="btn primary" disabled={busy}>
              Submit attendance
            </button>
          </form>
        </section>
      </div>

      {error && <div className="alert error">{error}</div>}
      {msg && <div className="alert success">{msg}</div>}

      <section className="card">
        <h2>Your history</h2>
        {mine.length === 0 && <p className="muted">No check-ins yet.</p>}
        <ul className="list">
          {mine.map((a) => (
            <li key={a._id}>
              <span className="mono">{a.sessionCode}</span>
              <span className="muted">{a.course || 'General'}</span>
              <span className="small">{new Date(a.checkedInAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
