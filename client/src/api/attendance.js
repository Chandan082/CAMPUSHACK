import { http } from './http'

export const attendanceApi = {
  createSession: (body) => http.post('/api/attendance/sessions', body),
  mySessions: () => http.get('/api/attendance/sessions/mine'),
  allSessions: () => http.get('/api/attendance/sessions/all'),
  checkIn: (body) => http.post('/api/attendance/check-in', body),
  mine: () => http.get('/api/attendance/mine'),
}
