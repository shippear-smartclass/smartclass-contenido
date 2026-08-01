'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

/**
 * Autenticación SIMULADA para la demo.
 * No valida contra ningún backend: guarda el "usuario" en localStorage.
 * Reemplazar por Supabase Auth cuando esté disponible.
 */

export type DemoUser = {
  nombre: string
  email: string
}

type AuthContextValue = {
  user: DemoUser | null
  ready: boolean
  signIn: (email: string, password: string, nombre?: string) => DemoUser
  signOut: () => void
}

const STORAGE_KEY = 'smartclass.demo-user'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw) as DemoUser)
    } catch {
      // ignorar datos corruptos
    }
    setReady(true)
  }, [])

  const signIn = useCallback((email: string, _password: string, nombre?: string) => {
    const next: DemoUser = {
      email,
      nombre: nombre?.trim() || email.split('@')[0] || 'Docente',
    }
    setUser(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // almacenamiento no disponible: seguimos igual para la demo
    }
    return next
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignorar
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
