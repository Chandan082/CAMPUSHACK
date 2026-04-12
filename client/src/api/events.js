import { http } from './http'

export const eventsApi = {
  list: () => http.get('/api/events'),
  listAll: () => http.get('/api/events/admin/all'),
  get: (id) => http.get(`/api/events/${id}`),
  create: (body) => http.post('/api/events', body),
  update: (id, body) => http.patch(`/api/events/${id}`, body),
  remove: (id) => http.delete(`/api/events/${id}`),
}
