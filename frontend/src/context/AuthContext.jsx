import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getSession, loginCustomer, loginStaff, logoutSession } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { getSession().then(setSession).catch(() => setSession(null)).finally(() => setLoading(false)) }, [])
  const value = useMemo(() => ({ session, loading,
    async login(email, password) { const next = await loginCustomer({ email, password }); setSession(next); return next },
    async staffLogin(username, password) { const next = await loginStaff({ username, password }); setSession(next); return next },
    async refresh() { try { const next = await getSession(); setSession(next); return next } catch { setSession(null); return null } },
    async logout() { try { await logoutSession() } finally { setSession(null) } },
    setSession,
  }), [session, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
