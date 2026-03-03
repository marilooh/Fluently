'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonById } from '@/data/lessons';
import { vocabulary, VocabEntry } from '@/data/vocabulary';

type Phase = 'intro' | 'quiz' | 'complete';
type QuizType = 'translate_to_spanish' | 'translate_to_english' | 'multiple_choice';

interface QuizQuestion {
  vocabId: string;
  type: QuizType;
  prompt: string;
  correct: string;
  options: string[];
  hint?: string;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(vocabItems: VocabEntry[], allVocab: VocabEntry[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (const item of vocabItems) {
    // Multiple choice: English → Spanish
    const wrongOptions = shuffle(allVocab.filter((v) => v.id !== item.id))
      .slice(0, 3)
      .map((v) => v.spanish);
    questions.push({
      vocabId: item.id,
      type: 'multiple_choice',
      prompt: item.english,
      correct: item.spanish,
      options: shuffle([item.spanish, ...wrongOptions]),
      hint: item.pronunciation,
    });
    // Type answer: Spanish → English (for every other card)
    if (Math.random() > 0.5) {
      questions.push({
        vocabId: item.id,
        type: 'translate_to_english',
        prompt: item.spanish,
        correct: item.english,
        options: [],
      });
    }
  }
  return shuffle(questions).slice(0, Math.min(questions.length, 10));
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const { user: authUser, profile, updateProfile, loading } = useAuth();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [shake, setShake] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const lesson = getLessonById(lessonId);

  useEffect(() => {
    if (!loading && !authUser) { router.push('/'); return; }
    if (profile) setHearts(profile.hearts);
  }, [authUser, profile, loading, router]);

  const startLesson = useCallback(() => {
    if (!lesson) return;
    const vocabItems = lesson.vocabIds
      .map((id) => vocabulary.find((v) => v.id === id))
      .filter(Boolean) as VocabEntry[];
    const qs = buildQuestions(vocabItems, vocabulary);
    setQuestions(qs);
    setPhase('quiz');
  }, [lesson]);

  const submitAnswer = (answer: string) => {
    if (feedback) return;
    const q = questions[qIndex];
    const correct = answer.toLowerCase().trim() === q.correct.toLowerCase().trim();
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore((s) => s + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setInput('');
    setSelected(null);
    if (qIndex + 1 >= questions.length || hearts <= 0) {
      completeLesson();
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const completeLesson = async () => {
    if (!lesson || !profile) return;
    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const xpEarned = Math.round(lesson.xpReward * (accuracy / 100));
    const coinsEarned = Math.round(lesson.coinReward * (accuracy / 100));

    const newXp = profile.xp + xpEarned;
    const newLevel = Math.floor(newXp / 100) + 1;
    const today = new Date().toISOString().split('T')[0];
    const wasYesterday = profile.last_active_date &&
      new Date(today).getTime() - new Date(profile.last_active_date).getTime() === 86400000;
    const newStreak = wasYesterday ? profile.streak + 1 :
      profile.last_active_date === today ? profile.streak : 1;
    const completedLessons = [...new Set([...(profile.completed_lessons || []), lesson.id])];

    const saved = await updateProfile({
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      last_active_date: today,
      coins: profile.coins + coinsEarned,
      hearts: Math.min(5, hearts + 1),
      completed_lessons: completedLessons,
    });
    if (!saved) setSaveError(true);
    setPhase('complete');
  };

  if (!lesson) return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center">
      <p className="text-gray-500">Lesson not found.</p>
    </div>
  );

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-sky-50">
        <Navbar />
        <div className="pt-4 md:pt-24 pb-24 px-4 max-w-xl mx-auto">
          <button onClick={() => router.push('/learn')} className="mb-6 text-sky-600 text-sm hover:underline flex items-center gap-1">
            ← Back to lessons
          </button>
          <div className="bg-white rounded-3xl shadow-sm border border-sky-100 p-8 text-center slide-up">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${lesson.color} flex items-center justify-center text-4xl mx-auto mb-4`}>
              {lesson.icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{lesson.title}</h1>
            <p className="text-gray-500 text-sm mb-1">{lesson.titleEs}</p>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{lesson.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-sky-600">+{lesson.xpReward}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-amber-500">+{lesson.coinReward}</div>
                <div className="text-xs text-gray-500">Coins</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-gray-700">~{lesson.estimatedMinutes}m</div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-center mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                lesson.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'}`}>
                {lesson.difficulty}
              </span>
              <span className="text-gray-400 text-sm">{lesson.vocabIds.length} terms</span>
            </div>

            <button onClick={startLesson}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-4 transition-colors text-lg">
              Start Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const xpEarned = Math.round(lesson.xpReward * (accuracy / 100));
    const coinsEarned = Math.round(lesson.coinReward * (accuracy / 100));
    return (
      <div className="min-h-screen bg-sky-50">
        <Navbar />
        <div className="pt-4 md:pt-24 pb-24 px-4 max-w-xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-sky-100 p-8 text-center slide-up">
            <div className="text-5xl mb-4">{accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {accuracy >= 80 ? '¡Excelente!' : accuracy >= 50 ? '¡Bien hecho!' : 'Keep Practicing!'}
            </h1>
            <p className="text-gray-500 text-sm mb-6">Lesson complete</p>

            {saveError && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
                ⚠️ Progress could not be saved. Check your connection — your XP and completion may not have updated.
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-sky-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-sky-600">+{xpEarned}</div>
                <div className="text-xs text-gray-500">XP Earned</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-500">+{coinsEarned}</div>
                <div className="text-xs text-gray-500">Coins</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setPhase('intro'); setQIndex(0); setScore(0); setHearts(5); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl py-3 transition-colors">
                Try Again
              </button>
              <button onClick={() => router.push('/learn')}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl py-3 transition-colors">
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz phase
  const q = questions[qIndex];
  if (!q) return null;
  const progress = ((qIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 px-4 max-w-xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6 mt-2">
          <button onClick={() => router.push('/learn')} className="text-gray-400 hover:text-gray-600">✕</button>
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-sky-400 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: hearts }).map((_, i) => <span key={i} className="text-red-500">❤️</span>)}
            {Array.from({ length: 5 - hearts }).map((_, i) => <span key={i} className="text-gray-300">🤍</span>)}
          </div>
        </div>

        <div className={`slide-up ${shake ? 'shake' : ''}`}>
          {/* Question card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sky-50 mb-4">
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wide mb-2">
              {q.type === 'multiple_choice' ? 'Translate to Spanish' :
               q.type === 'translate_to_english' ? 'What does this mean?' : 'Fill in the blank'}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{q.prompt}</h2>
            {q.hint && <p className="text-gray-400 text-sm italic">{q.hint}</p>}
          </div>

          {/* Multiple choice */}
          {q.type === 'multiple_choice' && (
            <div className="space-y-3">
              {q.options.map((opt) => {
                let btnClass = 'bg-white border-gray-200 text-gray-800 hover:border-sky-300';
                if (feedback) {
                  if (opt === q.correct) btnClass = 'bg-green-50 border-green-400 text-green-800';
                  else if (opt === selected) btnClass = 'bg-red-50 border-red-400 text-red-800';
                  else btnClass = 'bg-white border-gray-200 text-gray-400';
                } else if (opt === selected) {
                  btnClass = 'bg-sky-50 border-sky-400 text-sky-800';
                }
                return (
                  <button key={opt} onClick={() => { if (!feedback) { setSelected(opt); submitAnswer(opt); } }}
                    className={`w-full text-left border-2 rounded-2xl px-5 py-4 font-medium transition-all ${btnClass}`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Text input */}
          {q.type === 'translate_to_english' && (
            <div>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !feedback && submitAnswer(input)}
                placeholder="Type in English…" disabled={!!feedback}
                className="w-full border-2 border-gray-200 focus:border-sky-400 rounded-2xl px-5 py-4 text-lg focus:outline-none mb-3" />
              {!feedback && (
                <button onClick={() => submitAnswer(input)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-4 transition-colors">
                  Check Answer
                </button>
              )}
            </div>
          )}

          {/* Feedback banner */}
          {feedback && (
            <div className={`mt-4 rounded-2xl p-4 ${feedback === 'correct' ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`}>
              <p className={`font-bold text-sm ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                {feedback === 'correct' ? '✓ ¡Correcto!' : '✗ Not quite'}
              </p>
              {feedback === 'wrong' && (
                <p className="text-gray-600 text-sm mt-1">Correct answer: <strong>{q.correct}</strong></p>
              )}
              <button onClick={nextQuestion}
                className={`mt-3 w-full font-bold rounded-xl py-3 transition-colors text-white
                  ${feedback === 'correct' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                Continue
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">{qIndex + 1} / {questions.length}</p>
      </div>
    </div>
  );
}
