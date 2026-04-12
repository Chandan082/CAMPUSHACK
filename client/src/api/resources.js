import { http } from './http'

export const resourcesApi = {
  list: (params) => http.get('/api/resources', { params }),
  get: (id) => http.get(`/api/resources/${id}`),
  create: (body) => http.post('/api/resources', body),
  update: (id, body) => http.patch(`/api/resources/${id}`, body),
  remove: (id) => http.delete(`/api/resources/${id}`),
}
