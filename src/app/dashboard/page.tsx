'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { lessons } from '@/data/lessons';
import { vocabulary } from '@/data/vocabulary';
import { getDueCards, initForUser } from '@/lib/spaceRepetition';

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !profile) router.push('/');
    if (!loading && user) initForUser(user.id);
  }, [user, profile, loading, router]);

  if (loading || !profile) return null;

  const level = profile.level ?? 1;
  const xpForNextLevel = level * 100;
  const xpInCurrentLevel = (profile.xp ?? 0) - (level - 1) * 100;
  const xpProgress = Math.min((xpInCurrentLevel / xpForNextLevel) * 100, 100);

  const completedCount = profile.completed_lessons.length;
  const dueCardCount = getDueCards(vocabulary.map((v) => v.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 md:pb-8 px-4 max-w-2xl mx-auto">

        {/* Welcome header */}
        <div className="bg-gradient-to-r from-sky-500 to-teal-500 rounded-3xl p-6 text-white mb-6 slide-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sky-100 text-sm mb-1">¡Hola, {(profile.display_name || '').split(' ')[0]}!</p>
              <h1 className="text-2xl font-bold">Ready to learn? 💪</h1>
              <p className="text-sky-100 text-sm mt-1">Level {level} · {profile.xp ?? 0} XP total</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/20 rounded-2xl p-3 text-center min-w-[64px]">
                <div className="text-2xl">🔥</div>
                <div className="text-xl font-bold">{profile.streak ?? 0}</div>
                <div className="text-xs text-sky-100">Streak</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-3 text-center min-w-[64px]">
                <div className="text-2xl">🪙</div>
                <div className="text-xl font-bold">{profile.coins ?? 0}</div>
                <div className="text-xs text-sky-100">Coins</div>
              </div>
              <div className="bg-white/20 rounded-2xl p-3 text-center min-w-[64px]">
                <div className="text-2xl">❤️</div>
                <div className="text-xl font-bold">{profile.hearts ?? 5}</div>
                <div className="text-xs text-sky-100">Hearts</div>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-sky-100 mb-1">
              <span>Level {level}</span>
              <span>{xpInCurrentLevel} / {xpForNextLevel} XP to Level {level + 1}</span>
            </div>
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div className="bg-white rounded-full h-3 transition-all duration-700" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Two core feature cards */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">What do you want to do?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          {/* Lessons card */}
          <Link href="/learn"
            className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 card-hover flex flex-col gap-3 group">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-teal-500 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              📚
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">Lessons</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                Learn medical Spanish through structured, interactive lessons with real clinical vocabulary.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-sky-600">{completedCount}</span> / {lessons.length} completed
              </div>
              <span className="text-sky-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
            {/* Mini progress bar */}
            <div className="bg-sky-50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-teal-400 rounded-full h-2 transition-all duration-700"
                style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
              />
            </div>
          </Link>

          {/* Flashcards card */}
          <Link href="/flashcards"
            className="bg-white rounded-3xl p-6 shadow-sm border border-violet-100 card-hover flex flex-col gap-3 group">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              🃏
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors">Flashcards</h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                Drill vocabulary with spaced repetition — review what you need to, exactly when you need to.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {dueCardCount > 0
                  ? <><span className="font-semibold text-violet-600">{dueCardCount}</span> cards due today</>
                  : <span className="text-gray-400">{vocabulary.length} cards available</span>}
              </div>
              <span className="text-violet-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
            {dueCardCount > 0 && (
              <div className="bg-violet-50 rounded-xl px-3 py-1.5 text-xs text-violet-700 font-medium text-center">
                {dueCardCount} due for review
              </div>
            )}
          </Link>
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
                This simple question helps differentiate biliary colic from cholecystitis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
