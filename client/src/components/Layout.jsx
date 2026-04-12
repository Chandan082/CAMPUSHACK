import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/resources', label: 'Resources' },
  { to: '/utilities', label: 'Utilities' },
  { to: '/events', label: 'Events' },
]

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" onClick={() => navigate('/dashboard')} role="presentation">
          <span className="brand-mark">SSS</span>
          <div>
            <div className="brand-title">Smart Student Solution</div>
            <div className="brand-sub">Campus hackathon build</div>
          </div>
        </div>
        <nav className="nav">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              Admin
            </NavLink>
          )}
        </nav>
        <div className="user-area">
          <span className="user-pill">
            {user?.name}
            <span className="role">{user?.role}</span>
          </span>
          <button type="button" className="btn ghost" onClick={() => { logout(); navigate('/login') }}>
            Log out
          </button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
