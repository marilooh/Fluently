'use client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'nurse' | 'emt' | 'doctor' | 'premed' | 'other';
  institution?: string;
  joinedAt: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  coins: number;
  hearts: number;
  avatarItems: string[];
  equippedItems: string[];
  completedLessons: string[];
  practiceData: PracticeSession[];
}

export interface PracticeSession {
  date: string;
  lessonId: string;
  score: number;
  timeSpent: number; // seconds
  cardsReviewed: number;
}

const STORAGE_KEY = 'fluently_user';
const ALL_USERS_KEY = 'fluently_all_users';

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  // Also update aggregate users list for admin data collection
  const allRaw = localStorage.getItem(ALL_USERS_KEY);
  const allUsers: Record<string, User> = allRaw ? JSON.parse(allRaw) : {};
  allUsers[user.id] = user;
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function login(email: string, password: string): User | null {
  if (typeof window === 'undefined') return null;
  const allRaw = localStorage.getItem(ALL_USERS_KEY);
  if (!allRaw) return null;
  const allUsers: Record<string, User> = JSON.parse(allRaw);
  const user = Object.values(allUsers).find(
    (u) => u.email === email
  );
  if (!user) return null;
  // Simple prototype auth — password check via stored hash equivalent
  const stored = localStorage.getItem(`fluently_pw_${user.id}`);
  if (stored !== password) return null;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function register(
  email: string,
  password: string,
  name: string,
  role: User['role'],
  institution?: string
): User {
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const user: User = {
    id,
    email,
    name,
    role,
    institution,
    joinedAt: now,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: now.split('T')[0],
    coins: 100, // starter coins
    hearts: 5,
    avatarItems: ['scrubs_white', 'badge_basic'],
    equippedItems: ['scrubs_white', 'badge_basic'],
    completedLessons: [],
    practiceData: [],
  };
  localStorage.setItem(`fluently_pw_${id}`, password);
  saveUser(user);
  return user;
}

export function updateUser(updates: Partial<User>): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  const updated = { ...user, ...updates };
  saveUser(updated);
  return updated;
}

export function addXP(amount: number): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  const newXp = user.xp + amount;
  const newLevel = Math.floor(newXp / 100) + 1;
  const today = new Date().toISOString().split('T')[0];
  const wasActiveYesterday =
    new Date(user.lastActiveDate).getTime() ===
    new Date(today).getTime() - 86400000;
  const newStreak = wasActiveYesterday ? user.streak + 1 : user.lastActiveDate === today ? user.streak : 1;
  return updateUser({ xp: newXp, level: newLevel, streak: newStreak, lastActiveDate: today });
}

export function addCoins(amount: number): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  return updateUser({ coins: user.coins + amount });
}

export function spendCoins(amount: number): boolean {
  const user = getCurrentUser();
  if (!user || user.coins < amount) return false;
  updateUser({ coins: user.coins - amount });
  return true;
}

export function unlockItem(itemId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.avatarItems.includes(itemId)) return true;
  updateUser({ avatarItems: [...user.avatarItems, itemId] });
  return true;
}

export function equipItem(itemId: string): void {
  const user = getCurrentUser();
  if (!user) return;
  // Each item has a "slot" prefix (e.g. scrubs_, cap_, stethoscope_)
  const slot = itemId.split('_')[0];
  const filtered = user.equippedItems.filter((i) => i.split('_')[0] !== slot);
  updateUser({ equippedItems: [...filtered, itemId] });
}

export function getAllUsersForAdmin(): User[] {
  if (typeof window === 'undefined') return [];
  const allRaw = localStorage.getItem(ALL_USERS_KEY);
  if (!allRaw) return [];
  return Object.values(JSON.parse(allRaw)) as User[];
}

export function logPracticeSession(session: PracticeSession): void {
  const user = getCurrentUser();
  if (!user) return;
  updateUser({ practiceData: [...(user.practiceData || []), session] });
}
