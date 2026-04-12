import { useEffect, useState } from 'react'
import { eventsApi } from '../api/events'
import { useAuth } from '../context/AuthContext'

export default function Events() {
  const { user } = useAuth()
  const canManage = user?.role === 'admin' || user?.role === 'faculty'

  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    startsAt: '',
    location: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const { data } = canManage ? await eventsApi.listAll() : await eventsApi.list()
    setItems(data.items || [])
  }

  useEffect(() => {
    load().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage])

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onCreate(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await eventsApi.create({
        ...form,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
      })
      setForm({ title: '', description: '', startsAt: '', location: '' })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <h1>Events</h1>
      <p className="muted">Published happenings across campus.</p>

      {canManage && (
        <section className="card">
          <h2>Create event</h2>
          <form onSubmit={onCreate} className="form tight">
            {error && <div className="alert error">{error}</div>}
            <label>
              Title
              <input value={form.title} onChange={(e) => setField('title', e.target.value)} required />
            </label>
            <label>
              Starts at
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setField('startsAt', e.target.value)}
                required
              />
            </label>
            <label>
              Location
              <input value={form.location} onChange={(e) => setField('location', e.target.value)} />
            </label>
            <label>
              Description
              <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows={3} />
            </label>
            <button type="submit" className="btn primary" disabled={busy}>
              Save event
            </button>
          </form>
        </section>
      )}

      <section className="card">
        <h2>Upcoming</h2>
        <ul className="list events">
          {items.map((ev) => (
            <li key={ev._id}>
              <div>
                <strong>{ev.title}</strong>
                {!ev.isPublished && <span className="pill warn">Draft</span>}
              </div>
              <p className="muted small">{ev.description}</p>
              <div className="meta">
                <span>{new Date(ev.startsAt).toLocaleString()}</span>
                {ev.location && <span>{ev.location}</span>}
              </div>
            </li>
          ))}
        </ul>
        {items.length === 0 && <p className="muted">No events scheduled.</p>}
      </section>
    </div>
  )
}
