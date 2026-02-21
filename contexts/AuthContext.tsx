"use client"
import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/lib/supabase/types'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true, refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchUser = useCallback(async (userId: string | null) => {
    if (!userId) { setUser(null); return }
    try {
      const { data } = await supabase.from('users').select('*').eq('id', userId).single()
      setUser(data as User | null)
    } catch { setUser(null) }
  }, [supabase])

  const refreshUser = useCallback(async () => {
    if (session?.user) await fetchUser(session.user.id)
  }, [session, fetchUser])

  useEffect(() => {
    let mounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return
        setSession(s)
        await fetchUser(s?.user?.id || null)
        setLoading(false)
      }
    )
    return () => { mounted = false; subscription.unsubscribe() }
  }, [supabase, fetchUser])

  return (
    <AuthContext.Provider value={{ user, session, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
