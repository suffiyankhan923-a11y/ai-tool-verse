import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Storage keys for user-configured Supabase credentials
const STORAGE_URL_KEY = 'toolverse_supabase_url';
const STORAGE_KEY_KEY = 'toolverse_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: 'env' | 'stored' | 'none';
}

/**
 * Resolves the active Supabase URL and Anon Key from environment variables or localStorage.
 */
export function getActiveSupabaseConfig(): SupabaseConfig {
  const envUrl = (((import.meta as any).env?.VITE_SUPABASE_URL as string) || '').trim();
  const envKey = (((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '').trim();

  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      source: 'env',
    };
  }

  try {
    const storedUrl = (localStorage.getItem(STORAGE_URL_KEY) || '').trim();
    const storedKey = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();
    if (storedUrl && storedKey) {
      return {
        url: storedUrl,
        anonKey: storedKey,
        source: 'stored',
      };
    }
  } catch {
    // localStorage might fail in restricted iframe mode
  }

  return {
    url: '',
    anonKey: '',
    source: 'none',
  };
}

/**
 * Returns true if Supabase URL and Anon Key are present.
 */
export function isSupabaseConfigured(): boolean {
  const config = getActiveSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

/**
 * Gets or initializes the Supabase client instance.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getActiveSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  // Reuse cached client if URL & key haven't changed
  if (cachedClient && lastUsedUrl === config.url && lastUsedKey === config.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUsedUrl = config.url;
    lastUsedKey = config.anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

/**
 * Saves Supabase credentials to localStorage and clears client cache.
 */
export function saveSupabaseCredentials(url: string, anonKey: string): void {
  try {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
  cachedClient = null;
}

/**
 * Clears stored Supabase credentials.
 */
export function clearSupabaseCredentials(): void {
  try {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
  } catch (e) {
    console.warn('Could not remove from localStorage:', e);
  }
  cachedClient = null;
}

export interface ConnectionHealthResult {
  connected: boolean;
  latencyMs?: number;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * Pings Supabase to verify connection health and table accessibility.
 */
export async function testSupabaseConnection(
  customUrl?: string,
  customKey?: string
): Promise<ConnectionHealthResult> {
  const url = customUrl?.trim() || getActiveSupabaseConfig().url;
  const key = customKey?.trim() || getActiveSupabaseConfig().anonKey;

  if (!url || !key) {
    return {
      connected: false,
      message: 'No Supabase URL or Anon Key provided.',
      timestamp: new Date().toISOString(),
    };
  }

  const startTime = performance.now();

  try {
    const client = createClient(url, key);
    // Attempt a light select on tools or categories, or fallback to REST root ping
    const { data, error } = await client.from('categories').select('count', { count: 'exact', head: true });
    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      // If table doesn't exist yet (404/PGRST204), the connection itself is valid, but tables need to be created.
      if (error.code === '42P01' || error.message.includes('relation "public.categories" does not exist') || error.message.includes('not found')) {
        return {
          connected: true,
          latencyMs,
          message: 'Connected to Supabase project successfully! (Note: Tables are not created yet. Run the SQL schema script in SQL Editor).',
          details: error,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        connected: false,
        latencyMs,
        message: `Supabase returned error: ${error.message} (${error.code || 'UNKNOWN'})`,
        details: error,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      connected: true,
      latencyMs,
      message: `Connected successfully to Supabase! (Latency: ${latencyMs}ms)`,
      details: { data },
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      connected: false,
      latencyMs,
      message: err.message || 'Network request failed. Please check the URL and CORS settings.',
      details: err,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Sign in to Supabase using email and password.
 */
export async function signInWithSupabase(email: string, pass: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please provide your Supabase URL and Anon Key.');
  }
  return await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: pass,
  });
}

/**
 * Sign out from Supabase authentication.
 */
export async function signOutSupabase() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
}

/**
 * Get the current active Supabase auth session.
 */
export async function getSupabaseSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Request a password reset email from Supabase Auth.
 */
export async function resetSupabasePassword(email: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }
  return await supabase.auth.resetPasswordForEmail(email.trim());
}

