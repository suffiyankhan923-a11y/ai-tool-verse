import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getSupabaseClient,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig
} from '../lib/supabase.js';

export interface AdminUser {
  id: string;
  email: string;
  provider: 'supabase';
  role?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  supabaseConfig: { url: string; anonKey: string; isEnv: boolean };
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());

  const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

  // Initialize auth state directly from Supabase session
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      setIsLoading(true);
      const config = getSupabaseConfig();
      setSupabaseConfig(config);

      const client = getSupabaseClient();
      if (client && config.url && config.anonKey) {
        try {
          const { data, error } = await client.auth.getSession();
          if (data.session?.user && !error) {
            if (isMounted) {
              setUser({
                id: data.session.user.id,
                email: data.session.user.email || 'admin@supabase.io',
                provider: 'supabase',
                role: 'Supabase Admin',
                lastLogin: new Date().toISOString()
              });
            }
          } else {
            if (isMounted) {
              setUser(null);
            }
          }
        } catch (e) {
          console.warn('Supabase session verification error:', e);
          if (isMounted) setUser(null);
        }
      } else {
        if (isMounted) setUser(null);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    initAuth();

    // Supabase auth state change subscription
    const client = getSupabaseClient();
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (client) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'admin@supabase.io',
            provider: 'supabase',
            role: 'Supabase Admin',
            lastLogin: new Date().toISOString()
          });
        } else {
          setUser(null);
        }
      });
      authListener = data;
    }

    return () => {
      isMounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const client = getSupabaseClient();

    if (!client || !isSupabaseConfigured) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message || 'Invalid email or password.' };
      }

      if (data.user) {
        const authUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || email.trim(),
          provider: 'supabase',
          role: 'Supabase Admin',
          lastLogin: new Date().toISOString()
        };
        setUser(authUser);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Authentication failed. Please verify user in Supabase Auth > Users.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Supabase authentication failed.' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout notice:', e);
      }
    }
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        isSupabaseConfigured,
        supabaseConfig,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

