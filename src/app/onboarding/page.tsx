'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Placement quiz removed. Redirect existing bookmarks straight to the dashboard.
export default function OnboardingPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  return null;
}
