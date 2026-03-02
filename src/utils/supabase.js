import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL and Anon Key are required! Please check your .env.local file.');
}

export const SUPABASE_PROXY_URL = 'https://geodashboard.jiobase.com';
export const SUPABASE_DIRECT_URL = 'https://gcbppyetisfunawqzzjt.supabase.co';

/**
 * Rewrites a raw Supabase storage URL to go through the Jiobase proxy.
 * Use this on every URL returned by getPublicUrl().
 */
export function getProxiedStorageUrl(rawUrl) {
    if (!rawUrl) return rawUrl;
    return rawUrl.replace(SUPABASE_DIRECT_URL, SUPABASE_PROXY_URL);
}

export const supabase = createClient(supabaseUrl || SUPABASE_PROXY_URL, supabaseAnonKey || 'placeholder');

