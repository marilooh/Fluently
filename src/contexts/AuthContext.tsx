'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email?: string;
  name: string;
  role: 'student' | 'nurse' | 'emt' | 'doctor' | 'premed' | 'other';
  institution?: string;
  xp: number;
  level: number;
  streak: number;
  last_active_date: string;
  coins: number;
  hearts: number;
  avatar_items: string[];
  equipped_items: string[];
  completed_lessons: string[];
  placement_level: 'beginner' | 'intermediate' | 'advanced' | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  updateProfile: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  /**
   * Fetch the user_profiles row for `userId`.
   *
   * If it doesn't exist yet — which happens when email confirmation is
   * enabled: the signup upsert in page.tsx runs without a session, so
   * RLS blocks it — we auto-create the row here using the auth
   * user_metadata stored at sign-up time.  We always have a valid session
   * at this point (onAuthStateChange fires after the token exchange), so
   * the INSERT will pass the `auth.uid() = id` RLS policy.
   */
  const fetchProfile = useCallback(
    async (userId: string, userMeta?: Record<string, unknown>) => {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data as UserProfile);
        return;
      }

      // Row missing — create it now from auth metadata
      const meta = userMeta ?? {};
      const today = new Date().toISOString().split('T')[0];
      const { data: created, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          name: (meta.name as string) || 'User',
          role: (meta.role as string) || 'student',
          institution: (meta.institution as string) || null,
          xp: 0,
          level: 1,
          streak: 0,
          last_active_date: today,
          coins: 100,
          hearts: 5,
          avatar_items: ['scrubs_white', 'badge_basic'],
          equipped_items: ['scrubs_white', 'badge_basic'],
          completed_lessons: [],
          placement_level: null,
          onboarding_completed: true,
        })
        .select()
        .single();

      if (created && !error) {
        setProfile(created as UserProfile);
      }
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    if (data && !error) {
      setProfile(data as UserProfile);
      return data as UserProfile;
    }
    return null;
  }, [user, supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          // Pass user_metadata so fetchProfile can auto-create the row if needed
          await fetchProfile(
            session.user.id,
            (session.user.user_metadata as Record<string, unknown>) ?? undefined
          );
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
