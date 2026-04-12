import { http } from './http'

export const authApi = {
  register: (body) => http.post('/api/auth/register', body),
  verifyEmail: (body) => http.post('/api/auth/verify-email', body),
  resendOtp: (body) => http.post('/api/auth/resend-otp', body),
  login: (body) => http.post('/api/auth/login', body),
  requestLoginOtp: (body) => http.post('/api/auth/login-otp/request', body),
  loginWithOtp: (body) => http.post('/api/auth/login-otp/verify', body),
  me: () => http.get('/api/auth/me'),
}
