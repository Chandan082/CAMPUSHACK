import { http } from './http'

export const complaintsApi = {
  create: (body) => http.post('/api/complaints', body),
  mine: () => http.get('/api/complaints/mine'),
  adminAll: (params) => http.get('/api/complaints/admin/all', { params }),
  get: (id) => http.get(`/api/complaints/${id}`),
  adminUpdate: (id, body) => http.patch(`/api/complaints/admin/${id}`, body),
}
