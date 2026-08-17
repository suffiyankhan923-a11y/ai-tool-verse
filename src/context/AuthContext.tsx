import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getSupabaseClient,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection
} from '../lib/supabase.js';

export interface AdminUser {
  id: string;
  email: string;
  provider: 'supabase' | 'built-in';
  role?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  supabaseConfig: { url: string; anonKey: string; isEnv: boolean };
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateSupabaseSettings: (url: string, anonKey: string) => Promise<{ success: boolean; message: string }>;
  disconnectSupabase: () => void;
  updateBuiltInPassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'toolverse_admin_session';
const LOCAL_CRED_KEY = 'toolverse_custom_admin_password';
const DEFAULT_EMAIL = 'admin@toolverse.com';
const DEFAULT_PASS = 'admin123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());

  const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

  // Initialize auth state
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
                email: data.session.user.email || 'supabase-admin@toolverse.com',
                provider: 'supabase',
                role: 'Supabase Admin',
                lastLogin: new Date().toISOString()
              });
            }
          }
        } catch (e) {
          console.warn('Supabase session lookup error:', e);
        }
      }

      // Check local fallback session if no Supabase session was found
      if (!user) {
        try {
          const storedSession = localStorage.getItem(LOCAL_SESSION_KEY);
          if (storedSession) {
            const parsed = JSON.parse(storedSession);
            if (parsed && parsed.email) {
              if (isMounted) {
                setUser({
                  id: parsed.id || 'admin-local-1',
                  email: parsed.email,
                  provider: 'built-in',
                  role: 'Super Admin',
                  lastLogin: parsed.lastLogin || new Date().toISOString()
                });
              }
            }
          }
        } catch {
          // ignore
        }
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
            email: session.user.email || 'supabase-admin@toolverse.com',
            provider: 'supabase',
            role: 'Supabase Admin',
            lastLogin: new Date().toISOString()
          });
        } else if (user?.provider === 'supabase') {
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
    password: string,
    remember = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const client = getSupabaseClient();

    // 1. Try Supabase Auth if client is configured
    if (client && isSupabaseConfigured) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: `Supabase Auth Error: ${error.message}` };
        }

        if (data.user) {
          const authUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            provider: 'supabase',
            role: 'Supabase Admin',
            lastLogin: new Date().toISOString()
          };
          setUser(authUser);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Supabase authentication failed' };
      }
    }

    // 2. Fallback: Built-in Admin Authentication (default or saved custom password)
    const storedCustomPass = localStorage.getItem(LOCAL_CRED_KEY) || DEFAULT_PASS;
    const validEmail = DEFAULT_EMAIL.toLowerCase();

    // Check if email matches default or custom admin credentials
    if (
      (email.trim().toLowerCase() === validEmail || email.trim().toLowerCase() === 'admin') &&
      password.trim() === storedCustomPass
    ) {
      const authUser: AdminUser = {
        id: 'admin-local-1',
        email: email.includes('@') ? email.trim() : DEFAULT_EMAIL,
        provider: 'built-in',
        role: 'Super Admin',
        lastLogin: new Date().toISOString()
      };

      if (remember) {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(authUser));
      } else {
        sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(authUser));
      }

      setUser(authUser);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: isSupabaseConfigured
        ? 'Invalid Supabase Auth credentials. Please check the user in your Supabase Auth > Users dashboard.'
        : 'Invalid email or password. Default credentials: admin@toolverse.com / admin123'
    };
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

    localStorage.removeItem(LOCAL_SESSION_KEY);
    sessionStorage.removeItem(LOCAL_SESSION_KEY);
    setUser(null);
    setIsLoading(false);
  };

  const updateSupabaseSettings = async (url: string, anonKey: string): Promise<{ success: boolean; message: string }> => {
    const testResult = await testSupabaseConnection(url, anonKey);
    if (!testResult.success) {
      return testResult;
    }

    saveSupabaseConfig(url, anonKey);
    const newConfig = getSupabaseConfig();
    setSupabaseConfig(newConfig);

    return {
      success: true,
      message: 'Supabase credentials verified and saved! You can now log in using Supabase Auth > Users.'
    };
  };

  const disconnectSupabase = () => {
    clearSupabaseConfig();
    setSupabaseConfig(getSupabaseConfig());
  };

  const updateBuiltInPassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    const currentPass = localStorage.getItem(LOCAL_CRED_KEY) || DEFAULT_PASS;
    if (oldPass !== currentPass) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    localStorage.setItem(LOCAL_CRED_KEY, newPass);
    return { success: true };
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
        logout,
        updateSupabaseSettings,
        disconnectSupabase,
        updateBuiltInPassword
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
