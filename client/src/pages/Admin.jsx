import { useEffect, useState } from 'react'
import { complaintsApi } from '../api/complaints'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const statuses = ['pending', 'in_review', 'resolved', 'rejected']

export default function Admin() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  async function load() {
    const { data } = await complaintsApi.adminAll()
    setItems(data.items || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function updateStatus(id, status, adminNotes) {
    setError('')
    setBusy(true)
    try {
      await complaintsApi.adminUpdate(id, { status, adminNotes })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <h1>Admin panel</h1>
      <p className="muted">Review complaints and triage student issues.</p>

      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <h2>Complaint queue</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>User</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>{c.user?.email}</td>
                  <td>
                    <select
                      defaultValue={c.status}
                      onChange={(e) => updateStatus(c._id, e.target.value, c.adminNotes || '')}
                      disabled={busy}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={c.adminNotes || ''}
                      placeholder="Admin notes"
                      onBlur={(e) => {
                        if (e.target.value !== (c.adminNotes || '')) {
                          updateStatus(c._id, c.status, e.target.value)
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <p className="muted">No complaints yet.</p>}
      </section>
    </div>
  )
}
