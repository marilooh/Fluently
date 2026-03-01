'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { lessons, isLessonUnlocked } from '@/data/lessons';
import { CATEGORY_ICONS } from '@/data/vocabulary';

// Alternating column positions for a winding skill tree path
const COLUMN_POSITIONS = ['justify-start', 'justify-center', 'justify-end', 'justify-center'];

function SkillTree({ completedLessons }: { completedLessons: string[] }) {
  // Find the first incomplete-but-unlocked lesson for highlighting
  const currentLesson = lessons.find(
    (l) => !completedLessons.includes(l.id) && isLessonUnlocked(l.id, completedLessons)
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">🗺️ Skill Tree</h2>
        <Link href="/learn" className="text-sky-600 text-sm font-medium hover:underline">See all →</Link>
      </div>

      <div className="relative">
        {/* Connecting line behind nodes */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2 z-0" />

        <div className="relative z-10 space-y-2">
          {lessons.map((lesson, idx) => {
            const completed = completedLessons.includes(lesson.id);
            const unlocked = isLessonUnlocked(lesson.id, completedLessons);
            const isCurrent = lesson.id === currentLesson?.id;
            const colClass = COLUMN_POSITIONS[idx % COLUMN_POSITIONS.length];

            let nodeStyle = '';
            let iconBg = '';
            let label = '';

            if (completed) {
              nodeStyle = 'bg-green-500 border-green-600 shadow-green-200 shadow-md';
              iconBg = '';
              label = 'text-green-600';
            } else if (isCurrent) {
              nodeStyle = 'bg-sky-500 border-sky-600 shadow-sky-300 shadow-lg ring-4 ring-sky-200 animate-pulse';
              iconBg = '';
              label = 'text-sky-600 font-bold';
            } else if (unlocked) {
              nodeStyle = 'bg-white border-sky-300 shadow-sm hover:border-sky-500 hover:shadow-md transition-all';
              iconBg = '';
              label = 'text-gray-700';
            } else {
              nodeStyle = 'bg-gray-100 border-gray-200';
              iconBg = 'grayscale opacity-40';
              label = 'text-gray-400';
            }

            const NodeContent = (
              <div className={`flex ${colClass} py-1`}>
                <div className="flex flex-col items-center max-w-[120px]">
                  {/* Node */}
                  <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl relative ${nodeStyle}`}>
                    <span className={iconBg}>{completed ? '✓' : unlocked ? lesson.icon : '🔒'}</span>
                    {isCurrent && (
                      <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                        NOW
                      </div>
                    )}
                    {completed && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs leading-none">✓</span>
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <div className={`text-center mt-1.5 px-1 ${label}`}>
                    <p className="text-xs font-medium leading-tight line-clamp-2">{lesson.title}</p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className="text-xs">{CATEGORY_ICONS[lesson.category]}</span>
                      {!completed && unlocked && (
                        <span className="text-xs text-sky-500">+{lesson.xpReward}XP</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );

            return (
              <div key={lesson.id}>
                {unlocked && !completed ? (
                  <Link href={`/learn/${lesson.id}`} className="block">
                    {NodeContent}
                  </Link>
                ) : unlocked && completed ? (
                  <Link href={`/learn/${lesson.id}`} className="block opacity-90 hover:opacity-100">
                    {NodeContent}
                  </Link>
                ) : (
                  <div className="block cursor-default">{NodeContent}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !profile) router.push('/');
    if (!loading && profile && !profile.onboarding_completed) router.push('/onboarding');
  }, [profile, loading, router]);

  if (!profile) return null;
  const user = profile;

  const xpForNextLevel = user.level * 100;
  const xpInCurrentLevel = user.xp - (user.level - 1) * 100;
  const xpProgress = Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100);

  const completedCount = user.completed_lessons.length;
  const totalLessons = lessons.length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  const nextLesson = lessons.find(
    (l) => !user.completed_lessons.includes(l.id) && isLessonUnlocked(l.id, user.completed_lessons)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 md:pb-8 px-4 max-w-4xl mx-auto">

        {/* Welcome header */}
        <div className="bg-gradient-to-r from-sky-500 to-teal-500 rounded-3xl p-6 text-white mb-6 slide-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sky-100 text-sm mb-1">¡Hola, {user.name.split(' ')[0]}!</p>
              <h1 className="text-2xl font-bold">Keep it up! 💪</h1>
              <p className="text-sky-100 text-sm mt-1">Level {user.level} · {user.xp} XP total</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/20 rounded-2xl p-3 text-center min-w-[64px]">
                <div className="text-2xl font-bold">🔥</div>
                <div className="text-xl font-bold">{user.streak}</div>
                <div className="text-xs text-sky-100">Streak</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-3 text-center min-w-[64px]">
                <div className="text-2xl font-bold">🪙</div>
                <div className="text-xl font-bold">{user.coins}</div>
                <div className="text-xs text-sky-100">Coins</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-3 text-center min-w-[64px]">
                <div className="text-2xl font-bold">❤️</div>
                <div className="text-xl font-bold">{user.hearts}</div>
                <div className="text-xs text-sky-100">Hearts</div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-sky-100 mb-1">
              <span>Level {user.level}</span>
              <span>{xpInCurrentLevel} / {xpForNextLevel} XP to Level {user.level + 1}</span>
            </div>
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div className="bg-white rounded-full h-3 xp-bar-fill" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Overall progress bar + continue button */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-100 mb-6 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span className="font-medium text-gray-700">Overall Progress</span>
              <span>{completedCount}/{totalLessons} lessons</span>
            </div>
            <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-teal-400 rounded-full h-3 transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          {nextLesson && (
            <Link href={`/learn/${nextLesson.id}`}
              className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex-shrink-0">
              Continue →
            </Link>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { href: '/flashcards', icon: '🃏', label: 'Practice', sub: 'Flashcards', color: 'bg-violet-500' },
            { href: '/search', icon: '🔍', label: 'Look up', sub: 'Dictionary', color: 'bg-teal-500' },
            { href: '/character', icon: '👔', label: 'Locker', sub: 'Room', color: 'bg-amber-500' },
            { href: '/leaderboard', icon: '🏆', label: 'Rankings', sub: 'Leaderboard', color: 'bg-rose-500' },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className={`${a.color} text-white rounded-2xl p-4 card-hover flex flex-col items-center text-center`}>
              <span className="text-2xl mb-1">{a.icon}</span>
              <span className="font-bold text-sm">{a.label}</span>
              <span className="text-xs opacity-80">{a.sub}</span>
            </Link>
          ))}
        </div>

        {/* Skill Tree — Duolingo-style path */}
        <SkillTree completedLessons={user.completed_lessons} />

        {/* Daily tip */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-bold text-violet-800 text-sm mb-1">Daily Clinical Tip</p>
              <p className="text-violet-700 text-sm leading-relaxed">
                When a patient says <strong>&ldquo;me duele aquí&rdquo;</strong> (it hurts here), follow up with
                <strong> &ldquo;¿Es un dolor constante o va y viene?&rdquo;</strong> — Is it constant or does it come and go?
                This simple question can help differentiate biliary colic from cholecystitis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
