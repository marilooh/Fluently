'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

const QUIZ: Question[] = [
  {
    id: 'q1',
    level: 'beginner',
    question: 'How do you say "Hello, how are you?" to a patient in Spanish?',
    options: ['Hola, ¿cómo está usted?', 'Gracias, buenos días', 'Me duele aquí', 'Necesito ayuda'],
    correct: 'Hola, ¿cómo está usted?',
    explanation: '"Hola, ¿cómo está usted?" is the formal greeting used with patients.',
  },
  {
    id: 'q2',
    level: 'beginner',
    question: 'What does "dolor" mean in English?',
    options: ['Pain', 'Fever', 'Nausea', 'Dizziness'],
    correct: 'Pain',
    explanation: '"Dolor" means pain — one of the most important words in clinical Spanish.',
  },
  {
    id: 'q3',
    level: 'beginner',
    question: 'How do you say "Where does it hurt?" in Spanish?',
    options: ['¿Dónde le duele?', '¿Cuánto tiempo?', '¿Tiene fiebre?', '¿Está casado?'],
    correct: '¿Dónde le duele?',
    explanation: '"¿Dónde le duele?" literally means "Where does it hurt you?" — essential for every exam.',
  },
  {
    id: 'q4',
    level: 'intermediate',
    question: 'What does "corazón" mean?',
    options: ['Heart', 'Lung', 'Kidney', 'Liver'],
    correct: 'Heart',
    explanation: '"Corazón" = heart. "Tengo dolor en el corazón" = I have chest/heart pain.',
  },
  {
    id: 'q5',
    level: 'intermediate',
    question: 'Which phrase means "Are you allergic to any medication?"',
    options: [
      '¿Es alérgico a algún medicamento?',
      '¿Tiene seguro médico?',
      '¿Cuántos años tiene?',
      '¿Tiene hijos?',
    ],
    correct: '¿Es alérgico a algún medicamento?',
    explanation: 'Checking allergies is critical before any treatment.',
  },
  {
    id: 'q6',
    level: 'intermediate',
    question: 'What do "náuseas y vómitos" mean in English?',
    options: ['Nausea and vomiting', 'Fever and chills', 'Pain and swelling', 'Cough and congestion'],
    correct: 'Nausea and vomiting',
    explanation: '"Náuseas y vómitos" is a common chief complaint phrase to recognize.',
  },
  {
    id: 'q7',
    level: 'advanced',
    question: 'What is "disnea" in English?',
    options: ['Shortness of breath', 'Chest pain', 'Palpitations', 'Edema'],
    correct: 'Shortness of breath',
    explanation: '"Disnea" (dyspnea) is shortness of breath — critical in cardiopulmonary assessment.',
  },
  {
    id: 'q8',
    level: 'advanced',
    question: 'A patient says "Tengo fiebre y escalofríos." What symptoms are they describing?',
    options: ['Fever and chills', 'Headache and vomiting', 'Chest pain and cough', 'Dizziness and weakness'],
    correct: 'Fever and chills',
    explanation: '"Fiebre" = fever, "escalofríos" = chills. Classic infectious/sepsis presentation.',
  },
  {
    id: 'q9',
    level: 'advanced',
    question: 'What does "anticoagulante" mean?',
    options: ['Anticoagulant', 'Antibiotic', 'Anti-inflammatory', 'Antiemetic'],
    correct: 'Anticoagulant',
    explanation: '"Anticoagulante" = anticoagulant. Medication reconciliation is vital for patient safety.',
  },
  {
    id: 'q10',
    level: 'advanced',
    question: 'What is "infarto agudo de miocardio" in English?',
    options: ['Acute myocardial infarction', 'Pulmonary embolism', 'Aortic dissection', 'Heart failure'],
    correct: 'Acute myocardial infarction',
    explanation: '"Infarto agudo de miocardio" = AMI / heart attack. Recognizing this in Spanish can save lives.',
  },
];

function calculatePlacement(answers: Record<string, string>): {
  level: 'beginner' | 'intermediate' | 'advanced';
  lessonsToSkip: string[];
} {
  const beginnerScore = QUIZ.filter((q) => q.level === 'beginner' && answers[q.id] === q.correct).length;
  const intermediateScore = QUIZ.filter((q) => q.level === 'intermediate' && answers[q.id] === q.correct).length;
  const advancedScore = QUIZ.filter((q) => q.level === 'advanced' && answers[q.id] === q.correct).length;
  const total = beginnerScore + intermediateScore + advancedScore;

  if (total >= 7 && advancedScore >= 2) {
    return {
      level: 'advanced',
      lessonsToSkip: [
        'lesson_greet_01', 'lesson_greet_02',
        'lesson_anatomy_01', 'lesson_anatomy_02',
        'lesson_vitals_01', 'lesson_symptoms_01', 'lesson_symptoms_02',
        'lesson_medications_01',
      ],
    };
  } else if (total >= 4 && (beginnerScore >= 2 || intermediateScore >= 1)) {
    return {
      level: 'intermediate',
      lessonsToSkip: [
        'lesson_greet_01', 'lesson_greet_02',
        'lesson_anatomy_01',
      ],
    };
  } else {
    return { level: 'beginner', lessonsToSkip: [] };
  }
}

type Phase = 'welcome' | 'quiz' | 'result';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, loading } = useAuth();
  const [phase, setPhase] = useState<Phase>('welcome');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !profile) router.push('/');
  }, [profile, loading, router]);

  if (!profile) return null;

  // Already completed onboarding
  if (profile.onboarding_completed && phase === 'welcome') {
    router.push('/dashboard');
    return null;
  }

  const q = QUIZ[qIndex];
  const totalQuestions = QUIZ.length;

  const handleSelect = (option: string) => {
    if (feedback) return;
    setSelected(option);
    const correct = option === q.correct;
    setFeedback(correct ? 'correct' : 'wrong');
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  };

  const handleNext = () => {
    setSelected(null);
    setFeedback(null);
    if (qIndex + 1 >= totalQuestions) {
      setPhase('result');
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const handleSkipQuiz = () => {
    // Skip quiz, start as beginner
    finishOnboarding({ level: 'beginner', lessonsToSkip: [] });
  };

  const finishOnboarding = async (result: { level: 'beginner' | 'intermediate' | 'advanced'; lessonsToSkip: string[] }) => {
    setSaving(true);
    await updateProfile({
      placement_level: result.level,
      completed_lessons: result.lessonsToSkip,
      onboarding_completed: true,
    });
    setSaving(false);
    router.push('/dashboard');
  };

  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">🩺</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Fluently!</h1>
            <p className="text-gray-500 mb-2">
              ¡Hola, <strong>{profile.name.split(' ')[0]}</strong>!
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Let&apos;s quickly assess your Spanish level so we can skip what you already know
              and focus on what you need to learn. This takes about 3 minutes.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">10</div>
                <div className="text-xs text-green-700 mt-1">Questions</div>
              </div>
              <div className="bg-sky-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-sky-600">~3</div>
                <div className="text-xs text-sky-700 mt-1">Minutes</div>
              </div>
              <div className="bg-violet-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-violet-600">3</div>
                <div className="text-xs text-violet-700 mt-1">Levels</div>
              </div>
            </div>

            <button
              onClick={() => setPhase('quiz')}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-4 text-lg transition-colors mb-3"
            >
              Take the Placement Quiz →
            </button>
            <button
              onClick={handleSkipQuiz}
              className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
            >
              Skip — start as a beginner
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const result = calculatePlacement(answers);
    const correct = Object.entries(answers).filter(([id, ans]) => {
      const quiz = QUIZ.find((q) => q.id === id);
      return quiz?.correct === ans;
    }).length;

    const levelInfo = {
      beginner: { emoji: '🌱', label: 'Beginner', color: 'text-green-600', bg: 'bg-green-50', desc: "You'll start from the fundamentals — greetings, basic anatomy, and essential phrases." },
      intermediate: { emoji: '📈', label: 'Intermediate', color: 'text-amber-600', bg: 'bg-amber-50', desc: "You've already got the basics! We'll skip those and jump into symptoms, vitals, and clinical vocabulary." },
      advanced: { emoji: '🚀', label: 'Advanced', color: 'text-violet-600', bg: 'bg-violet-50', desc: "Impressive! You'll start with advanced clinical scenarios, medications, and medical history taking." },
    };
    const info = levelInfo[result.level];

    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-3">{info.emoji}</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              You&apos;re at the <span className={info.color}>{info.label}</span> level!
            </h1>
            <p className="text-gray-500 text-sm mb-6">{correct}/{totalQuestions} correct</p>

            <div className={`${info.bg} rounded-2xl p-5 mb-6 text-left`}>
              <p className={`font-semibold ${info.color} mb-1`}>What this means for you:</p>
              <p className="text-gray-700 text-sm leading-relaxed">{info.desc}</p>
              {result.lessonsToSkip.length > 0 && (
                <p className="text-gray-500 text-xs mt-2">
                  ✓ {result.lessonsToSkip.length} lessons pre-completed based on your score
                </p>
              )}
            </div>

            {/* Score breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                const levelQs = QUIZ.filter((q) => q.level === level);
                const levelCorrect = levelQs.filter((q) => answers[q.id] === q.correct).length;
                return (
                  <div key={level} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-lg font-bold text-gray-800">{levelCorrect}/{levelQs.length}</div>
                    <div className="text-xs text-gray-500 capitalize">{level}</div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => finishOnboarding(result)}
              disabled={saving}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-4 text-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Setting up your path…' : 'Go to My Learning Path →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz phase
  const progress = ((qIndex) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-4">
          <div className="flex-1 bg-white/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-sky-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{qIndex + 1}/{totalQuestions}</span>
        </div>

        {/* Level badge */}
        <div className="flex justify-center mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            q.level === 'beginner' ? 'bg-green-100 text-green-700' :
            q.level === 'intermediate' ? 'bg-amber-100 text-amber-700' :
            'bg-violet-100 text-violet-700'
          }`}>
            {q.level.charAt(0).toUpperCase() + q.level.slice(1)} Level
          </span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100 mb-4">
          <h2 className="text-xl font-bold text-gray-900 leading-snug">{q.question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-4">
          {q.options.map((opt) => {
            let cls = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-sky-300';
            if (feedback) {
              if (opt === q.correct) cls = 'bg-green-50 border-2 border-green-400 text-green-800';
              else if (opt === selected) cls = 'bg-red-50 border-2 border-red-400 text-red-800';
              else cls = 'bg-white border-2 border-gray-100 text-gray-400';
            } else if (opt === selected) {
              cls = 'bg-sky-50 border-2 border-sky-400 text-sky-800';
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left rounded-2xl px-5 py-4 font-medium text-sm transition-all ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`rounded-2xl p-4 mb-4 ${feedback === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-bold text-sm mb-1 ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
              {feedback === 'correct' ? '✓ Correct!' : '✗ Not quite'}
            </p>
            <p className="text-gray-600 text-xs leading-relaxed">{q.explanation}</p>
            <button
              onClick={handleNext}
              className={`mt-3 w-full font-bold rounded-xl py-3 text-white transition-colors
                ${feedback === 'correct' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            >
              {qIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question →'}
            </button>
          </div>
        )}

        {/* Skip option */}
        {!feedback && (
          <div className="text-center">
            <button
              onClick={handleSkipQuiz}
              className="text-gray-400 text-xs hover:text-gray-600 transition-colors"
            >
              Skip quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
