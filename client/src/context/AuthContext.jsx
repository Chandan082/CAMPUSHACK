import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

const TOKEN_KEY = 'token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const setSession = useCallback((token, nextUser) => {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    setUser(nextUser)
  }, [])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { data } = await authApi.me()
      setUser(data.user)
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      setSession,
      logout,
      refreshUser,
    }),
    [user, loading, setSession, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
