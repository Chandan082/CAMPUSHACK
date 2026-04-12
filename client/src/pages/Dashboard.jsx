import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { complaintsApi } from '../api/complaints'
import { useAuth } from '../context/AuthContext'

const tiles = [
  { to: '/attendance', title: 'QR attendance', desc: 'Check in to live sessions or host as faculty.' },
  { to: '/resources', title: 'Resources', desc: 'Course links, notes, and shared files.' },
  { to: '/utilities', title: 'Utilities', desc: 'Lost & found and campus tools.' },
  { to: '/events', title: 'Events', desc: 'Hackathons, talks, and deadlines.' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [mine, setMine] = useState([])
  const [form, setForm] = useState({ title: '', description: '', category: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    complaintsApi
      .mine()
      .then(({ data }) => setMine(data.items || []))
      .catch(() => {})
  }, [])

  async function submitComplaint(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await complaintsApi.create(form)
      setForm({ title: '', description: '', category: '' })
      const { data } = await complaintsApi.mine()
      setMine(data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <section className="hero-block">
        <h1>Welcome back, {user?.name}</h1>
        <p className="lead">
          Smart Student Solution centralizes attendance, resources, events, and complaints in one MERN stack.
        </p>
      </section>
      <div className="grid tiles">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="tile">
            <h3>{t.title}</h3>
            <p className="muted">{t.desc}</p>
          </Link>
        ))}
      </div>

      <section className="card">
        <h2>File a complaint</h2>
        <p className="muted small">Route to admins for triage. Admins manage the queue in the Admin panel.</p>
        <form onSubmit={submitComplaint} className="form tight">
          {error && <div className="alert error">{error}</div>}
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
            />
          </label>
          <button type="submit" className="btn primary" disabled={busy}>
            Submit complaint
          </button>
        </form>
        {mine.length > 0 && (
          <div className="mini-list">
            <h3>Your recent tickets</h3>
            <ul className="list">
              {mine.slice(0, 5).map((c) => (
                <li key={c._id}>
                  <strong>{c.title}</strong>
                  <span className="pill">{c.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
