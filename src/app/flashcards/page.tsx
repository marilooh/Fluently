'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { vocabulary, VocabEntry, CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS, Category } from '@/data/vocabulary';
import { getCardState, rateCard, getDueCards, initForUser, Rating } from '@/lib/spaceRepetition';

type Mode = 'menu' | 'study';

export default function FlashcardsPage() {
  const router = useRouter();
  const { profile, updateProfile, loading } = useAuth();
  const [mode, setMode] = useState<Mode>('menu');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [deck, setDeck] = useState<VocabEntry[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [flashEarnedXp, setFlashEarnedXp] = useState(0);
  const [flashNewTotalXp, setFlashNewTotalXp] = useState(0);

  useEffect(() => {
    if (!loading && !profile) router.push('/');
    if (!loading && profile) initForUser(profile.id);
  }, [profile, loading, router]);

  const startSession = useCallback((category: Category | 'all') => {
    const pool = category === 'all' ? vocabulary : vocabulary.filter((v) => v.category === category);
    const allIds = pool.map((v) => v.id);
    const dueIds = getDueCards(allIds);
    const dueCards = dueIds.map((id) => vocabulary.find((v) => v.id === id)).filter(Boolean) as VocabEntry[];
    // If fewer than 5 due, supplement with random from pool
    const toStudy = dueCards.length >= 5
      ? dueCards.slice(0, 20)
      : [...dueCards, ...pool.filter((v) => !dueIds.includes(v.id)).slice(0, 20 - dueCards.length)];
    setSelectedCategory(category);
    setDeck(toStudy.sort(() => Math.random() - 0.5));
    setCardIndex(0);
    setFlipped(false);
    setRated(false);
    setSessionComplete(false);
    setSessionStats({ again: 0, hard: 0, good: 0, easy: 0 });
    setMode('study');
  }, []);

  const rate = (rating: Rating, label: keyof typeof sessionStats) => {
    const card = deck[cardIndex];
    rateCard(card.id, rating);
    // Compute final stats synchronously so the setTimeout closure has the correct values
    const finalStats = { ...sessionStats, [label]: sessionStats[label] + 1 };
    setSessionStats(finalStats);
    setRated(true);
    setTimeout(async () => {
      if (cardIndex + 1 >= deck.length) {
        // Session done — award XP + coins and record cards studied / mastered
        if (profile) {
          const XP_PER_SESSION = 10;
          const newXp = profile.xp + XP_PER_SESSION;
          const mastered = finalStats.good + finalStats.easy;
          setFlashEarnedXp(XP_PER_SESSION);
          setFlashNewTotalXp(newXp);
          await updateProfile({
            xp: newXp,
            level: Math.floor(newXp / 100) + 1,
            coins: profile.coins + 5,
            cards_studied: (profile.cards_studied ?? 0) + deck.length,
            cards_mastered: (profile.cards_mastered ?? 0) + mastered,
          });
        }
        setSessionComplete(true);
      } else {
        setCardIndex((i) => i + 1);
        setFlipped(false);
        setRated(false);
      }
    }, 300);
  };

  if (loading || !profile) return null;
  const user = profile;

  const allIds = vocabulary.map((v) => v.id);
  const dueCount = getDueCards(allIds).length;

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-sky-50">
        <Navbar />
        <div className="pt-4 md:pt-20 pb-24 px-4 max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Flashcards</h1>
            <p className="text-gray-500 text-sm">Spaced repetition — review what you need to, when you need to.</p>
          </div>

          {dueCount > 0 && (
            <div className="bg-gradient-to-r from-sky-500 to-teal-500 rounded-2xl p-5 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sky-100 text-sm">Cards due for review</p>
                  <p className="text-3xl font-bold">{dueCount}</p>
                </div>
                <button onClick={() => startSession('all')}
                  className="bg-white text-sky-600 font-bold px-5 py-2.5 rounded-xl hover:bg-sky-50 transition-colors">
                  Review Now
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100 mb-4">
            <h2 className="font-bold text-gray-900 mb-4">Study by Category</h2>
            <div className="space-y-2">
              <button onClick={() => startSession('all')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-sky-50 transition-colors border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📚</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 text-sm">All Categories</p>
                    <p className="text-gray-400 text-xs">{vocabulary.length} cards total</p>
                  </div>
                </div>
                <span className="text-sky-400">›</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = vocabulary.filter((v) => v.category === cat).length;
                const dueInCat = getDueCards(vocabulary.filter((v) => v.category === cat).map((v) => v.id)).length;
                return (
                  <button key={cat} onClick={() => startSession(cat)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-sky-50 transition-colors border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 text-sm">{CATEGORY_LABELS[cat]}</p>
                        <p className="text-gray-400 text-xs">{count} cards{dueInCat > 0 ? ` · ${dueInCat} due` : ''}</p>
                      </div>
                    </div>
                    {dueInCat > 0 && (
                      <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{dueInCat}</span>
                    )}
                    {dueInCat === 0 && <span className="text-sky-400">›</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
            <p className="text-violet-800 font-semibold text-sm mb-1">How spaced repetition works</p>
            <p className="text-violet-600 text-xs leading-relaxed">
              After each card, rate how well you knew it. Cards you struggle with appear more frequently;
              cards you know well are shown less often. This is the most efficient way to build long-term memory.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Study mode
  if (sessionComplete) {
    const total = sessionStats.again + sessionStats.hard + sessionStats.good + sessionStats.easy;
    const known = sessionStats.good + sessionStats.easy;
    const pct = total > 0 ? Math.round((known / total) * 100) : 0;
    const subMessage =
      pct >= 80 ? 'Outstanding session — your memory is sharp!' :
      pct >= 60 ? 'Solid review — the spaced repetition is working!' :
                  'Keep going — every session builds stronger recall.';
    return (
      <div className="min-h-screen bg-sky-50">
        <Navbar />
        <div className="pt-4 md:pt-24 pb-24 px-4 max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-sky-100 slide-up">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">¡Excelente!</h1>
            <p className="text-gray-500 text-sm mb-6">{subMessage}</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-sky-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-sky-600">+{flashEarnedXp}</div>
                <div className="text-xs text-gray-500 mt-1">XP Earned</div>
              </div>
              <div className="bg-violet-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-violet-600">{flashNewTotalXp}</div>
                <div className="text-xs text-gray-500 mt-1">Total XP</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-amber-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-500">+5</div>
                <div className="text-xs text-gray-500 mt-1">Coins</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{pct}%</div>
                <div className="text-xs text-gray-500 mt-1">Recall Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-8">
              {[
                { label: 'Again', value: sessionStats.again, color: 'text-red-500' },
                { label: 'Hard', value: sessionStats.hard, color: 'text-orange-500' },
                { label: 'Good', value: sessionStats.good, color: 'text-sky-600' },
                { label: 'Easy', value: sessionStats.easy, color: 'text-green-600' },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <span className={`font-bold text-lg ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => router.push('/dashboard')}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-4 transition-colors text-lg">
                Back to Dashboard
              </button>
              <button onClick={() => startSession(selectedCategory)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl py-3 transition-colors text-sm">
                Study Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const card = deck[cardIndex];
  const cardState = getCardState(card.id);

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMode('menu')} className="text-gray-400 hover:text-gray-600">✕</button>
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 rounded-full h-2 w-48 overflow-hidden">
              <div className="bg-sky-400 h-2 rounded-full" style={{ width: `${((cardIndex + 1) / deck.length) * 100}%` }} />
            </div>
            <span className="text-xs text-gray-500">{cardIndex + 1}/{deck.length}</span>
          </div>
          <span className="text-sm text-gray-400">+10 XP</span>
        </div>

        {/* Flashcard */}
        <div className="flashcard-container h-72 mb-6 cursor-pointer" onClick={() => !rated && setFlipped(!flipped)}>
          <div className={`flashcard w-full h-full ${flipped ? 'flipped' : ''}`}>
            {/* Front */}
            <div className="flashcard-front bg-white rounded-3xl shadow-sm border border-sky-100 flex flex-col items-center justify-center p-8 absolute inset-0">
              <p className="text-xs text-sky-500 font-medium uppercase tracking-wide mb-3">English</p>
              <p className="text-3xl font-bold text-gray-900 text-center">{card.english}</p>
              <p className="text-gray-400 text-sm mt-4">Tap to reveal</p>
              {cardState.repetitions > 0 && (
                <div className="absolute top-4 right-4 bg-gray-100 rounded-lg px-2 py-1">
                  <p className="text-xs text-gray-400">reviewed {cardState.repetitions}×</p>
                </div>
              )}
            </div>

            {/* Back */}
            <div className="flashcard-back bg-gradient-to-br from-sky-500 to-teal-500 rounded-3xl shadow-sm flex flex-col items-center justify-center p-8 text-white absolute inset-0">
              <p className="text-xs text-sky-100 font-medium uppercase tracking-wide mb-2">Spanish</p>
              <p className="text-3xl font-bold text-center mb-3">{card.spanish}</p>
              <p className="text-sky-100 text-sm italic">{card.pronunciation}</p>
              {card.example && (
                <div className="mt-4 bg-white/20 rounded-xl p-3 text-center">
                  <p className="text-sm text-sky-100 text-xs">&ldquo;{card.example.es}&rdquo;</p>
                  <p className="text-xs text-sky-200 mt-1">{card.example.en}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating buttons */}
        {flipped && !rated ? (
          <div>
            <p className="text-center text-sm text-gray-500 mb-3">How well did you know this?</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Again', sub: 'Forgot', color: 'bg-red-100 text-red-700 border-red-200', rating: 0 as Rating, key: 'again' },
                { label: 'Hard', sub: 'Difficult', color: 'bg-orange-100 text-orange-700 border-orange-200', rating: 2 as Rating, key: 'hard' },
                { label: 'Good', sub: 'Got it', color: 'bg-sky-100 text-sky-700 border-sky-200', rating: 4 as Rating, key: 'good' },
                { label: 'Easy', sub: 'Perfect', color: 'bg-green-100 text-green-700 border-green-200', rating: 5 as Rating, key: 'easy' },
              ].map((btn) => (
                <button key={btn.label} onClick={() => rate(btn.rating, btn.key as keyof typeof sessionStats)}
                  className={`border-2 rounded-2xl py-3 px-2 text-center transition-all hover:scale-105 ${btn.color}`}>
                  <p className="font-bold text-sm">{btn.label}</p>
                  <p className="text-xs opacity-70">{btn.sub}</p>
                </button>
              ))}
            </div>
          </div>
        ) : !flipped ? (
          <div className="text-center">
            <button onClick={() => setFlipped(true)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors">
              Show Answer
            </button>
          </div>
        ) : null}

        {/* Card info */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            card.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
            card.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'}`}>
            {card.difficulty}
          </span>
          <span className="text-xs text-gray-400">{CATEGORY_ICONS[card.category]} {CATEGORY_LABELS[card.category].split(' /')[0]}</span>
        </div>
      </div>
    </div>
  );
}
