import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://fkhjuudfjnyjpmvtggkf.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_YhFA_FTCzGU0CsAcZauPcg_hLciIJPH';

  if (!url.startsWith('https://') || !key) {
    throw new Error(
      'Invalid Supabase configuration. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL (must start with https://) ' +
      'and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly.'
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore — called from Server Component where cookies are read-only
          }
        },
      },
    }
  );
}
