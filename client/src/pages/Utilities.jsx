import { useEffect, useState } from 'react'
import { postsApi } from '../api/posts'

export default function Utilities() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'lost',
    location: '',
    contact: '',
  })
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const params = {}
    if (filter) params.type = filter
    const { data } = await postsApi.list(params)
    setItems(data.items || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [filter])

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onCreate(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await postsApi.create(form)
      setForm({ title: '', description: '', type: 'lost', location: '', contact: '' })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <h1>Utilities</h1>
      <p className="muted">Lost &amp; found board for the campus community.</p>

      <section className="card">
        <h2>New post</h2>
        <form onSubmit={onCreate} className="form tight">
          {error && <div className="alert error">{error}</div>}
          <label>
            Title
            <input value={form.title} onChange={(e) => setField('title', e.target.value)} required />
          </label>
          <label>
            Type
            <select value={form.type} onChange={(e) => setField('type', e.target.value)}>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </label>
          <label>
            Location hint
            <input value={form.location} onChange={(e) => setField('location', e.target.value)} />
          </label>
          <label>
            Contact
            <input value={form.contact} onChange={(e) => setField('contact', e.target.value)} />
          </label>
          <label>
            Details
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={3}
            />
          </label>
          <button type="submit" className="btn primary" disabled={busy}>
            Post
          </button>
        </form>
      </section>

      <section className="card">
        <div className="toolbar">
          <h2>Feed</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        <ul className="list posts">
          {items.map((p) => (
            <li key={p._id}>
              <div>
                <strong>{p.title}</strong>
                <span className={`badge ${p.type}`}>{p.type}</span>
              </div>
              <p className="muted small">{p.description}</p>
              <div className="meta">
                {p.location && <span>{p.location}</span>}
                {p.contact && <span>{p.contact}</span>}
              </div>
            </li>
          ))}
        </ul>
        {items.length === 0 && <p className="muted">No posts yet.</p>}
      </section>
    </div>
  )
}
