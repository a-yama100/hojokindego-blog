import { createClient } from '@/lib/supabase/client'
import type { User } from '@/lib/supabase/types'

let _supabase: ReturnType<typeof createClient> | null = null
function getSupabase() {
  if (!_supabase) _supabase = createClient()
  return _supabase
}

// Sign up - calls API route to create user record server-side
export async function signUp(email: string, password: string, redirectTo?: string) {
  const emailRedirectTo = (process.env.NEXT_PUBLIC_SITE_URL || '') + '/auth/callback' + (redirectTo ? '?redirect=' + encodeURIComponent(redirectTo) : '')

  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  })
  if (error) throw error

  // Create user record via API route (server-side)
  if (data.user) {
    await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: data.user.id, email: data.user.email }),
    })
  }

  return data
}

// Sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const { error } = await getSupabase().auth.signOut()
  if (error) throw error
}

// Get current session
export async function getSession() {
  const { data: { session }, error } = await getSupabase().auth.getSession()
  if (error) throw error
  return session
}

// Get current user with profile
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) return null
  return data as User
}

// Password reset
export async function resetPassword(email: string) {
  const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/reset-password',
  })
  if (error) throw error
}
