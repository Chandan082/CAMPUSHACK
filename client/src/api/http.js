import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)
