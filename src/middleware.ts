import { NextResponse, type NextRequest } from 'next/server';

// Middleware is intentionally kept as a lightweight passthrough.
//
// Why: @supabase/ssr imported on the Vercel Edge runtime caused
// MIDDLEWARE_INVOCATION_TIMEOUT (504) errors because the bundle size
// and/or auth.getSession() cookie parsing exceeded the Edge time/size limits.
//
// Auth protection is handled at the page level instead:
// - Every protected page uses useAuth() + router.push('/') when !user
// - This is equivalent protection without touching the Edge runtime.

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Only run on a specific set of paths that actually need middleware in the future.
  // Currently empty — all auth is done client-side on each protected page.
  matcher: [],
};
