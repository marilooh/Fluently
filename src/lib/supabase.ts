import { createBrowserClient } from '@supabase/ssr';

// Env vars take precedence; the fallbacks are the real project credentials
// (anon key is publishable/public by design — safe in browser code).
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://fkhjuudfjnyjpmvtggkf.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'sb_publishable_YhFA_FTCzGU0CsAcZauPcg_hLciIJPH';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export function isSupabaseConfigured(): boolean {
  // Always true — real credentials are baked in as fallbacks
  return true;
}
