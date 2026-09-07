import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/types/database';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) { console.error('Error fetching profile:', error); return; }
    setProfile(data as Profile | null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id).finally(() => setLoading(false));
      } else { setLoading(false); }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
      if (newSession?.user) {
        (async () => { await fetchProfile(newSession.user.id); })();
      } else { setProfile(null); }
    });
    return () => { authListener.subscription.unsubscribe(); };
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, fullName: string): Promise<{ error: string | null; needsConfirmation?: boolean }> => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) {
      if (error.message.toLowerCase().includes('already') || error.message.toLowerCase().includes('exists')) return { error: 'auth.error.emailInUse' };
      if (error.message.toLowerCase().includes('rate') || error.message.toLowerCase().includes('frequent')) return { error: 'auth.error.rateLimit' };
      return { error: 'auth.error.generic' };
    }
    if (data.session && data.user) { setSession(data.session); setUser(data.user); await fetchProfile(data.user.id); return { error: null }; }
    return { error: null, needsConfirmation: true };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('credentials')) return { error: 'auth.error.invalidCredentials' };
      if (error.message.toLowerCase().includes('rate') || error.message.toLowerCase().includes('frequent')) return { error: 'auth.error.rateLimit' };
      return { error: 'auth.error.generic' };
    }
    if (data.session) { setSession(data.session); setUser(data.user); await fetchProfile(data.user.id); }
    return { error: null };
  }, [fetchProfile]);

  const signInWithGoogle = useCallback(async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } });
    if (error) return { error: 'auth.error.generic' };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => { await supabase.auth.signOut(); setSession(null); setUser(null); setProfile(null); }, []);

  const value = useMemo<AuthContextValue>(() => ({ session, user, profile, loading, signUp, signIn, signInWithGoogle, signOut }), [session, user, profile, loading, signUp, signIn, signInWithGoogle, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
