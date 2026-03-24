'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface UserProfile {
  id: string;
  email?: string;
  display_name: string;
  xp: number;
  coins: number;
  completed_lessons: string[];
  created_at: string;
  updated_at: string;
  role?: string;
  institution?: string;
  level?: number;
  streak?: number;
  last_active_date?: string;
  hearts?: number;
  avatar_items?: string[];
  equipped_items?: string[];
  placement_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  onboarding_completed?: boolean;
  cards_studied?: number;
  cards_mastered?: number;
}

// Minimal stub so pages that destructure user.id / user.email still compile.
interface StubUser {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: StubUser | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
}

const LEAD_KEY = 'sana_lead';
const PROGRESS_KEY = 'sana_profile';

const DEFAULT_PROGRESS = {
  xp: 0,
  coins: 100,
  completed_lessons: [] as string[],
  level: 1,
  streak: 0,
  hearts: 5,
  avatar_items: ['scrubs_white', 'badge_basic'],
  equipped_items: ['scrubs_white', 'badge_basic'],
  placement_level: null as null,
  onboarding_completed: true,
  cards_studied: 0,
  cards_mastered: 0,
};

function readStorage(): { user: StubUser; profile: UserProfile } | null {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return null;
    const lead = JSON.parse(raw) as { id: string; name: string; role: string; email: string };
    const saved = localStorage.getItem(PROGRESS_KEY);
    const progress = saved ? JSON.parse(saved) : {};
    const now = new Date().toISOString();
    const profile: UserProfile = {
      ...DEFAULT_PROGRESS,
      ...progress,
      // Always override with identity from LEAD_KEY (source of truth)
      id: lead.id,
      email: lead.email,
      display_name: lead.name ?? '',
      role: lead.role,
      created_at: progress.created_at ?? now,
      updated_at: now,
      // Coerce arrays — a corrupt/old localStorage entry can store null/undefined
      // here, and undefined.length throws a white-screen exception on the dashboard.
      completed_lessons: Array.isArray(progress.completed_lessons)
        ? progress.completed_lessons
        : [],
      avatar_items: Array.isArray(progress.avatar_items)
        ? progress.avatar_items
        : DEFAULT_PROGRESS.avatar_items,
      equipped_items: Array.isArray(progress.equipped_items)
        ? progress.equipped_items
        : DEFAULT_PROGRESS.equipped_items,
    };
    return { user: { id: lead.id, email: lead.email }, profile };
  } catch {
    return null;
  }
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
  const [user, setUser] = useState<StubUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readStorage();
    if (stored) {
      setUser(stored.user);
      setProfile(stored.profile);
    }
    setLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    const stored = readStorage();
    if (stored) setProfile(stored.profile);
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
      if (!profile) return null;
      const updated: UserProfile = { ...profile, ...updates, updated_at: new Date().toISOString() };
      setProfile(updated);
      // Persist only progress fields — lead identity lives in LEAD_KEY
      const { id: _id, email: _email, display_name: _dn, role: _role, created_at: _ca, ...progress } = updated;
      void _id; void _email; void _dn; void _role; void _ca;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      return updated;
    },
    [profile]
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem(LEAD_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
