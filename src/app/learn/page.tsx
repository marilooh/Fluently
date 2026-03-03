'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { lessons, isLessonUnlocked } from '@/data/lessons';
import { CATEGORY_ICONS, CATEGORY_LABELS, CATEGORIES, Category } from '@/data/vocabulary';

export default function LearnPage() {
  const router = useRouter();
  const { user: authUser, profile, loading } = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  useEffect(() => {
    if (!loading && !authUser) router.push('/');
    if (!loading && authUser && !profile) router.push('/onboarding');
  }, [authUser, profile, loading, router]);

  if (loading || !authUser || !profile) return null;
  const user = profile;

  const categories = CATEGORIES.filter((c) => lessons.some((l) => l.category === c));
  const filtered = activeCategory === 'all' ? lessons : lessons.filter((l) => l.category === activeCategory);

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 md:pb-8 px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Lessons</h1>
          <p className="text-gray-500 text-sm">{user.completed_lessons.length}/{lessons.length} completed</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4">
          <button onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${activeCategory === 'all' ? 'bg-sky-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${activeCategory === cat ? 'bg-sky-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{CATEGORY_LABELS[cat].split(' /')[0]}</span>
            </button>
          ))}
        </div>

        {/* Lessons grid */}
        <div className="space-y-3">
          {filtered.map((lesson) => {
            const completed = user.completed_lessons.includes(lesson.id);
            const unlocked = isLessonUnlocked(lesson.id, user.completed_lessons);
            return (
              <div key={lesson.id}>
                {unlocked ? (
                  <Link href={`/learn/${lesson.id}`}
                    className={`bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4 card-hover block
                      ${completed ? 'border-green-200' : 'border-sky-50'}`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-2xl flex-shrink-0 relative`}>
                      {lesson.icon}
                      {completed && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-gray-900 text-sm">{lesson.title}</p>
                      </div>
                      <p className="text-gray-500 text-xs mb-2 truncate">{lesson.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          lesson.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'}`}>
                          {lesson.difficulty}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-0.5">⚡ +{lesson.xpReward} XP</span>
                        <span className="text-xs text-gray-400 flex items-center gap-0.5">🪙 +{lesson.coinReward}</span>
                        <span className="text-xs text-gray-400">~{lesson.estimatedMinutes} min</span>
                      </div>
                    </div>
                    <span className="text-sky-400 text-xl flex-shrink-0">{completed ? '🔁' : '›'}</span>
                  </Link>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 opacity-60">
                    <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                      🔒
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-500 text-sm">{lesson.title}</p>
                      <p className="text-gray-400 text-xs">
                        Complete prerequisite lessons to unlock
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
