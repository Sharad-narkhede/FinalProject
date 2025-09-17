import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiAuth } from '../services/api'

type User = {
  id: number
  email: string
  full_name: string
  role: 'student' | 'faculty' | 'admin'
}

type AuthContextType = {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refresh: async () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    try {
      const { data } = await apiAuth().get('/api/v1/auth/me')
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => { refresh() }, [])

  const value = useMemo(() => ({ user, loading, refresh, logout }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

