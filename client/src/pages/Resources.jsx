import { useEffect, useState } from 'react'
import { resourcesApi } from '../api/resources'

export default function Resources() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const { data } = await resourcesApi.list()
    setItems(data.items || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await resourcesApi.create({ title, description, url, category })
      setTitle('')
      setDescription('')
      setUrl('')
      setCategory('')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <h1>Resources</h1>
      <p className="muted">Share links and references with your cohort.</p>

      <section className="card">
        <h2>Add resource</h2>
        <form onSubmit={onCreate} className="form tight">
          {error && <div className="alert error">{error}</div>}
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            URL
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </label>
          <label>
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Notes, Repo…" />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </label>
          <button type="submit" className="btn primary" disabled={busy}>
            Publish
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Library</h2>
        <div className="grid list-grid">
          {items.map((r) => (
            <article key={r._id} className="mini-card">
              <h3>{r.title}</h3>
              {r.category && <span className="pill">{r.category}</span>}
              <p className="muted small">{r.description}</p>
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer">
                  Open link
                </a>
              )}
            </article>
          ))}
        </div>
        {items.length === 0 && <p className="muted">Nothing posted yet.</p>}
      </section>
    </div>
  )
}
