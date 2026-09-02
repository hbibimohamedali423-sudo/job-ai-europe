import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export interface RegisterInput {
  email: string
  password: string
  fullName: string
}

export interface LoginInput {
  email: string
  password: string
}

export async function register({ email, password, fullName }: RegisterInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { user: null, session: null, error: error.message }
  }

  return { user: data.user, session: data.session, error: null }
}

export async function login({ email, password }: LoginInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, session: null, error: error.message }
  }

  return { user: data.user, session: data.session, error: null }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    return { error: error.message }
  }
  return { error: null }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return { user: null, error: error.message }
  }
  return { user: data.user, error: null }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return { session: null, error: error.message }
  }
  return { session: data.session, error: null }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) {
    return { error: error.message }
  }
  return { error: null }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) {
    return { error: error.message }
  }
  return { error: null }
}

export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback)
}
