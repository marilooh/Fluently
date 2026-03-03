'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';

export interface UserProfile {
  // Columns that exist in the Supabase table
  id: string;
  email?: string;
  display_name: string;           // NOTE: Supabase column is display_name (not name)
  xp: number;
  coins: number;
  completed_lessons: string[];
  created_at: string;
  updated_at: string;

  // Columns that must be added via ALTER TABLE (see supabase-schema.sql)
  role?: 'student' | 'nurse' | 'emt' | 'doctor' | 'premed' | 'other';
  institution?: string;
  level?: number;
  streak?: number;
  last_active_date?: string;
  hearts?: number;
  avatar_items?: string[];
  equipped_items?: string[];
  placement_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  onboarding_completed?: boolean;
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
          email: (meta.email as string) || null,
          display_name: (meta.name as string) || 'User',
          xp: 0,
          coins: 100,
          completed_lessons: [],
          // Extra columns — only saved if they've been added via ALTER TABLE
          role: (meta.role as string) || 'student',
          institution: (meta.institution as string) || null,
          level: 1,
          streak: 0,
          last_active_date: today,
          hearts: 5,
          avatar_items: ['scrubs_white', 'badge_basic'],
          equipped_items: ['scrubs_white', 'badge_basic'],
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
          // Merge email into metadata so fetchProfile can include it when auto-creating the row
          await fetchProfile(session.user.id, {
            ...(session.user.user_metadata as Record<string, unknown>),
            email: session.user.email,
          });
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
