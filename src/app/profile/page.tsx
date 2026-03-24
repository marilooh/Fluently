'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { lessons } from '@/data/lessons';
import { vocabulary } from '@/data/vocabulary';
import { getAllCardStates } from '@/lib/spaceRepetition';

const ROLE_LABELS: Record<string, string> = {
  doctor: 'Physician', nurse: 'Nurse / NP / PA', emt: 'EMT / Paramedic',
  student: 'Medical Student', premed: 'Pre-med Student', other: 'Healthcare Professional',
};

const BADGES = [
  { id: 'first_lesson', emoji: '🎓', label: 'First Lesson', desc: 'Complete your first lesson', check: (u: UserProfile) => (u.completed_lessons ?? []).length >= 1 },
  { id: 'streak_3', emoji: '🔥', label: '3-Day Streak', desc: '3 days in a row', check: (u: UserProfile) => (u.streak ?? 0) >= 3 },
  { id: 'streak_7', emoji: '⚡', label: 'Week Warrior', desc: '7-day streak', check: (u: UserProfile) => (u.streak ?? 0) >= 7 },
  { id: 'xp_100', emoji: '💯', label: '100 XP Club', desc: 'Earn 100 XP', check: (u: UserProfile) => (u.xp ?? 0) >= 100 },
  { id: 'xp_500', emoji: '🌟', label: 'Star Learner', desc: 'Earn 500 XP', check: (u: UserProfile) => (u.xp ?? 0) >= 500 },
  { id: 'lessons_5', emoji: '📚', label: 'Bookworm', desc: 'Complete 5 lessons', check: (u: UserProfile) => (u.completed_lessons ?? []).length >= 5 },
  { id: 'lessons_10', emoji: '🏆', label: 'Committed', desc: 'Complete 10 lessons', check: (u: UserProfile) => (u.completed_lessons ?? []).length >= 10 },
  { id: 'level_5', emoji: '🚀', label: 'Level 5', desc: 'Reach level 5', check: (u: UserProfile) => (u.level ?? 0) >= 5 },
  { id: 'coins_200', emoji: '🪙', label: 'Coin Collector', desc: 'Accumulate 200 coins', check: (u: UserProfile) => (u.coins ?? 0) >= 200 },
];

export default function ProfilePage() {
  const router = useRouter();
  const { profile, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !profile) router.push('/');
  }, [profile, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !profile) return null;
  const user = profile;
  const level = user.level ?? 1;

  const cardStates = getAllCardStates();
  const reviewedCards = Object.keys(cardStates).length;
  const masteredCards = Object.values(cardStates).filter((s) => s.interval > 7).length;
  const completedLessons = (user.completed_lessons ?? []).length;
  const totalLessons = lessons.length;
  const xpForNextLevel = level * 100;
  const xpInCurrentLevel = (user.xp ?? 0) - (level - 1) * 100;
  const xpProgress = Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100);

  const earnedBadges = BADGES.filter((b) => b.check(user));
  const unearnedBadges = BADGES.filter((b) => !b.check(user));

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 md:pb-8 px-4 max-w-2xl mx-auto">

        {/* Profile header */}
        <div className="bg-gradient-to-r from-sky-500 to-teal-500 rounded-3xl p-6 text-white mb-6 slide-up">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-3xl">
              😊
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user.display_name}</h1>
              <p className="text-sky-100 text-sm">{ROLE_LABELS[user.role ?? 'other'] || 'Healthcare Professional'}</p>
              {user.institution && <p className="text-sky-100 text-xs">{user.institution}</p>}
              <p className="text-sky-200 text-xs mt-1">Member since {joinDate}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">Lv.{level}</div>
              <div className="text-sky-100 text-xs">{user.xp ?? 0} XP total</div>
            </div>
          </div>

          {/* XP bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-sky-100 mb-1">
              <span>Level {level}</span>
              <span>{xpInCurrentLevel} / {xpForNextLevel} XP</span>
            </div>
            <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div className="bg-white rounded-full h-2.5 xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: '🔥', value: user.streak ?? 0, label: 'Day Streak' },
            { icon: '📖', value: `${completedLessons}/${totalLessons}`, label: 'Lessons Done' },
            { icon: '🃏', value: reviewedCards, label: 'Cards Studied' },
            { icon: '🧠', value: masteredCards, label: 'Cards Mastered' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-sky-100">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Badges & Achievements</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="text-center bounce-in">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-center justify-center text-2xl mx-auto mb-1">
                  {badge.emoji}
                </div>
                <p className="text-xs font-medium text-gray-700">{badge.label}</p>
              </div>
            ))}
            {unearnedBadges.map((badge) => (
              <div key={badge.id} className="text-center opacity-30">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-2xl mx-auto mb-1">
                  {badge.emoji}
                </div>
                <p className="text-xs text-gray-400">{badge.label}</p>
              </div>
            ))}
          </div>
          {earnedBadges.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">Complete lessons to earn your first badge!</p>
          )}
        </div>

        {/* Lesson history */}
        {(user.completed_lessons ?? []).length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Completed Lessons</h2>
            <div className="space-y-2">
              {(user.completed_lessons ?? []).map((lessonId) => {
                const lesson = lessons.find((l) => l.id === lessonId);
                if (!lesson) return null;
                return (
                  <div key={lessonId} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-sm`}>
                      {lesson.icon}
                    </div>
                    <p className="text-sm text-gray-700">{lesson.title}</p>
                    <span className="ml-auto text-green-500 text-sm">✓</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Data & Privacy note */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Data Collection Notice:</strong> Your progress data (lessons completed, XP, streaks, study time)
            is stored locally on your device and may be used in anonymized, aggregated form to improve Fluently
            and support our medical school partnership proposals. No personally identifiable information is shared with third parties.
          </p>
        </div>

        <button onClick={handleLogout}
          className="w-full bg-white border-2 border-red-200 text-red-500 font-semibold rounded-2xl py-3 hover:bg-red-50 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}
