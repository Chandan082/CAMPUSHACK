import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { Layout } from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Resources from './pages/Resources'
import Utilities from './pages/Utilities'
import Events from './pages/Events'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="resources" element={<Resources />} />
            <Route path="utilities" element={<Utilities />} />
            <Route path="events" element={<Events />} />
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
