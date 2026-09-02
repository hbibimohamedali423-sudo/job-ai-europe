import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import { getCurrentUser } from '@/services/auth'

type UserRole = 'user' | 'admin' | 'super_admin'

interface AuthState {
  user: User | null
  session: { access_token: string; refresh_token: string } | null
  loading: boolean
  initialized: boolean
  isAdmin: boolean
  userRole: UserRole

  initialize: () => Promise<void>
  setUser: (user: User | null) => void
  setSession: (session: { access_token: string; refresh_token: string } | null) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,
      initialized: false,
      isAdmin: false,
      userRole: 'user',

      initialize: async () => {
        if (get().initialized) return

        set({ loading: true })

        const { user } = await getCurrentUser()

        if (user) {
          const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'super_admin'
          const userRole = user.user_metadata?.role || 'user'

          set({
            user,
            loading: false,
            initialized: true,
            isAdmin,
            userRole,
          })
        } else {
          set({
            user: null,
            loading: false,
            initialized: true,
            isAdmin: false,
            userRole: 'user',
          })
        }
      },

      setUser: (user) => {
        const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin'
        const userRole = user?.user_metadata?.role || 'user'
        set({ user, isAdmin, userRole })
      },

      setSession: (session) => set({ session }),

      setLoading: (loading) => set({ loading }),

      logout: async () => {
        const { logout: authLogout } = await import('@/services/auth')
        await authLogout()
        set({
          user: null,
          session: null,
          loading: false,
          isAdmin: false,
          userRole: 'user',
        })
      },
    }),
    {
      name: 'job-ai-auth',
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAdmin: state.isAdmin,
        userRole: state.userRole,
      }),
    }
  )
)
