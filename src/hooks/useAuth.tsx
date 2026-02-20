'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createClient, User, SupabaseClient } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => true);
  const supabaseRef = useRef<SupabaseClient | null>(null);
  const initialized = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      const timer = window.setTimeout(() => {
        if (mountedRef.current) setLoading(false);
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    }

    const client = createClient(supabaseUrl, supabaseAnonKey);
    supabaseRef.current = client;

    client.auth.getSession().then(({ data: { session }, error }) => {
      if (!mountedRef.current) return;
      if (error) {
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (mountedRef.current) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const supabase = supabaseRef.current;

  const authRateLimit = useRef<{ lastAttempt: number; attempts: number }>({ lastAttempt: 0, attempts: 0 });
  
  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    
    const now = Date.now();
    if (now - authRateLimit.current.lastAttempt < 60000) {
      authRateLimit.current.attempts++;
      if (authRateLimit.current.attempts > 5) {
        return { error: new Error('Te veel pogingen. Wacht 1 minuut.') };
      }
    } else {
      authRateLimit.current = { lastAttempt: now, attempts: 1 };
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    
    const now = Date.now();
    if (now - authRateLimit.current.lastAttempt < 60000) {
      authRateLimit.current.attempts++;
      if (authRateLimit.current.attempts > 5) {
        return { error: new Error('Te veel pogingen. Wacht 1 minuut.') };
      }
    } else {
      authRateLimit.current = { lastAttempt: now, attempts: 1 };
    }
    
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
