import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Password recovery — go to the update-password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/update-password`);
      }

      // All other flows (new signup email confirm, magic link, etc.) → dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Auth failed
  return NextResponse.redirect(`${origin}/?error=auth_callback_failed`);
}
