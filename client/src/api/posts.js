import { http } from './http'

export const postsApi = {
  list: (params) => http.get('/api/posts', { params }),
  get: (id) => http.get(`/api/posts/${id}`),
  create: (body) => http.post('/api/posts', body),
  update: (id, body) => http.patch(`/api/posts/${id}`, body),
  remove: (id) => http.delete(`/api/posts/${id}`),
}
