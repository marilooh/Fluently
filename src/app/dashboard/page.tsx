'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getCurrentUser, User } from '@/lib/auth';
import { lessons } from '@/data/lessons';
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORIES } from '@/data/vocabulary';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
  }, [router]);

  if (!user) return null;

  const xpForNextLevel = user.level * 100;
  const xpInCurrentLevel = user.xp - (user.level - 1) * 100;
  const xpProgress = Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100);

  const completedCount = user.completedLessons.length;
  const totalLessons = lessons.length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  const recentLessons = lessons
    .filter((l) => !user.completedLessons.includes(l.id))
    .slice(0, 3);

  const categoryProgress = CATEGORIES.map((cat) => {
    const catLessons = lessons.filter((l) => l.category === cat);
    const completed = catLessons.filter((l) => user.completedLessons.includes(l.id)).length;
    return { cat, total: catLessons.length, completed };
  }).filter((c) => c.total > 0);

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

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { href: '/learn', icon: '📖', label: 'Continue', sub: 'Learning', color: 'bg-sky-500' },
            { href: '/flashcards', icon: '🃏', label: 'Practice', sub: 'Flashcards', color: 'bg-violet-500' },
            { href: '/search', icon: '🔍', label: 'Look up', sub: 'Dictionary', color: 'bg-teal-500' },
            { href: '/character', icon: '👔', label: 'Visit', sub: 'Locker Room', color: 'bg-amber-500' },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className={`${a.color} text-white rounded-2xl p-4 card-hover flex flex-col items-center text-center`}>
              <span className="text-2xl mb-1">{a.icon}</span>
              <span className="font-bold text-sm">{a.label}</span>
              <span className="text-xs opacity-80">{a.sub}</span>
            </Link>
          ))}
        </div>

        {/* Overall progress */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Overall Progress</h2>
            <span className="text-sky-600 font-bold text-sm">{completedCount}/{totalLessons} lessons</span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-sky-400 to-teal-400 rounded-full h-3 transition-all duration-700"
              style={{ width: `${progressPct}%` }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categoryProgress.map(({ cat, total, completed }) => (
              <div key={cat} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span className="text-xs font-medium text-gray-700 truncate">{CATEGORY_LABELS[cat].split(' /')[0]}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-sky-400 rounded-full h-1.5" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{completed}/{total}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue learning */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Up Next</h2>
            <Link href="/learn" className="text-sky-600 text-sm font-medium hover:underline">See all →</Link>
          </div>
          <div className="space-y-3">
            {recentLessons.map((lesson) => (
              <Link key={lesson.id} href={`/learn/${lesson.id}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-sky-50 flex items-center gap-4 card-hover block">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{lesson.title}</p>
                  <p className="text-gray-500 text-xs truncate">{lesson.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      lesson.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'}`}>
                      {lesson.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">+{lesson.xpReward} XP</span>
                    <span className="text-xs text-gray-400">~{lesson.estimatedMinutes} min</span>
                  </div>
                </div>
                <span className="text-sky-400 text-lg">›</span>
              </Link>
            ))}
            {recentLessons.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-bold text-green-700">All lessons completed!</p>
                <p className="text-green-600 text-sm">Practice with flashcards to reinforce your knowledge.</p>
              </div>
            )}
          </div>
        </div>

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
