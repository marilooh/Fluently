'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';

// ── Survey option constants ───────────────────────────────────────────────────

const ROLES = [
  'Medical student',
  'Nursing student',
  'Resident / Fellow',
  'Practicing physician',
  'Nurse / NP / PA',
  'EMT / Paramedic',
  'Other',
];

const FREQUENCIES = [
  'Daily',
  'A few times a week',
  'Occasionally',
  'Rarely',
  'Never',
];

const PRIOR_TOOL_ISSUES = [
  'Too expensive',
  'Hard to stay consistent',
  'Not relevant to my specialty',
  'Boring or hard to engage with',
  'Did not retain the information',
  'Other',
];

const DESIRED_FEATURES = [
  'Flashcards',
  'Short lessons',
  'Real clinical scenarios',
  'Audio pronunciation',
  'Progress tracking',
  'Quizzes',
  'Other',
];

const TEACHING_PROBLEMS = [
  'Too expensive',
  'Not practical or clinical enough',
  'Hard to stay consistent',
  'Not engaging or memorable',
  'No good options exist',
  'It has never been a priority at my institution',
];

const COMMUNICATION_BARRIERS = [
  'Yes, regularly',
  'Yes, occasionally',
  'Rarely',
  'No, never',
  'I have not had Spanish-speaking patients yet',
];

const PRICE_RANGES = [
  '$5 or less',
  '$6 – $10',
  '$11 – $20',
  'More than $20',
];

// ── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  role: string;
  frequency: string;
  usedPriorTool: string;
  priorToolIssues: string[];
  desiredFeatures: string[];
  teachingProblem: string;
  communicationBarrier: string;
  commitmentScale: number;
  wouldPay: string;
  priceRange: string;
  referralSource: string;
  additionalComments: string;
}

const EMPTY_FORM: FormData = {
  role: '',
  frequency: '',
  usedPriorTool: '',
  priorToolIssues: [],
  desiredFeatures: [],
  teachingProblem: '',
  communicationBarrier: '',
  commitmentScale: 0,
  wouldPay: '',
  priceRange: '',
  referralSource: '',
  additionalComments: '',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]
    );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
              ${checked
                ? 'border-violet-500 bg-violet-50 text-violet-800'
                : 'border-gray-200 bg-white text-gray-700 hover:border-violet-300'
              }`}
          >
            <span className={`inline-block w-4 h-4 rounded mr-2 border-2 align-middle transition-all
              ${checked ? 'bg-violet-500 border-violet-500' : 'border-gray-300'}`} />
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function RadioGroup({
  options,
  selected,
  onChange,
  cols = 1,
}: {
  options: string[];
  selected: string;
  onChange: (val: string) => void;
  cols?: number;
}) {
  return (
    <div className={`grid gap-2 ${cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((opt) => {
        const checked = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
              ${checked
                ? 'border-violet-500 bg-violet-50 text-violet-800'
                : 'border-gray-200 bg-white text-gray-700 hover:border-violet-300'
              }`}
          >
            <span className={`inline-block w-4 h-4 rounded-full mr-2 border-2 align-middle transition-all
              ${checked ? 'bg-violet-500 border-violet-500' : 'border-gray-300'}`} />
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function QuestionBlock({ number, label, children }: { number: number; label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Question {number}</p>
      <p className="text-gray-800 font-semibold mb-3 leading-snug">{label}</p>
      {children}
    </div>
  );
}

// ── Shared thank-you screen ───────────────────────────────────────────────────

function ThankYouScreen({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-orange-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-24 pb-24">
        <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-2xl font-bold text-violet-800 mb-1">¡Muchas gracias!</h1>
          <p className="text-orange-500 font-semibold mb-4">Thank you so much!</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            Tu opinión es invaluable y nos ayudará a construir una herramienta que realmente sirva
            a los profesionales de la salud.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your feedback is invaluable and will help us build a tool that truly serves healthcare
            professionals.
          </p>
          {isLoggedIn && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-violet-600 font-semibold text-sm hover:underline"
              >
                ← Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SurveyPage() {
  const { user, loading } = useAuth();

  const [checkingSubmission, setCheckingSubmission] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // For logged-in users, check if they already submitted
  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Anonymous users can always fill out the form
      setCheckingSubmission(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from('survey_responses')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAlreadySubmitted(!!data);
        setCheckingSubmission(false);
      });
  }, [loading, user]);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role || !form.frequency || !form.usedPriorTool || !form.teachingProblem || !form.communicationBarrier || !form.wouldPay || !form.commitmentScale) {
      setError('Please answer all required questions before submitting.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('survey_responses').insert({
        user_id: user?.id ?? null,
        email: user?.email ?? null,
        role: form.role,
        spanish_interaction_frequency: form.frequency,
        used_prior_tool: form.usedPriorTool === 'Yes',
        prior_tool_issues: form.priorToolIssues,
        desired_features: form.desiredFeatures,
        teaching_problem: form.teachingProblem,
        communication_barrier: form.communicationBarrier,
        commitment_scale: form.commitmentScale,
        would_pay: form.wouldPay.toLowerCase(),
        price_range: form.priceRange || null,
        referral_source: form.referralSource || null,
        additional_comments: form.additionalComments || null,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch {
      setError('Something went wrong saving your response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading || checkingSubmission) return null;

  // ── Already submitted (logged-in users only) ────────────────────────────────
  if (alreadySubmitted || submitted) return <ThankYouScreen isLoggedIn={!!user} />;

  // ── Survey form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-orange-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-4">
            <span className="text-lg">🩺</span>
            <span className="text-violet-700 font-semibold text-sm">SanaSana / Fluently</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Spanish Survey</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">
            Help us build a better tool for healthcare providers. This takes about 3 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-violet-100 p-8">

          {/* Q1 */}
          <QuestionBlock number={1} label="What best describes your current role? *">
            <RadioGroup options={ROLES} selected={form.role} onChange={(v) => set('role', v)} cols={2} />
          </QuestionBlock>

          {/* Q2 */}
          <QuestionBlock number={2} label="How often do you interact with Spanish-speaking patients? *">
            <RadioGroup options={FREQUENCIES} selected={form.frequency} onChange={(v) => set('frequency', v)} />
          </QuestionBlock>

          {/* Q3 */}
          <QuestionBlock number={3} label="Have you ever used a tool or course to learn medical Spanish? *">
            <RadioGroup options={['Yes', 'No']} selected={form.usedPriorTool} onChange={(v) => set('usedPriorTool', v)} />
          </QuestionBlock>

          {/* Q4 — conditional on Q3 = Yes */}
          {form.usedPriorTool === 'Yes' && (
            <QuestionBlock number={4} label="What didn't work about it? (Select all that apply)">
              <CheckboxGroup
                options={PRIOR_TOOL_ISSUES}
                selected={form.priorToolIssues}
                onChange={(v) => set('priorToolIssues', v)}
              />
            </QuestionBlock>
          )}

          {/* Q5 */}
          <QuestionBlock number={5} label="What would you most want from a medical Spanish app? (Select all that apply)">
            <CheckboxGroup
              options={DESIRED_FEATURES}
              selected={form.desiredFeatures}
              onChange={(v) => set('desiredFeatures', v)}
            />
          </QuestionBlock>

          {/* Q6 */}
          <QuestionBlock number={6} label="What is the biggest problem with how medical Spanish is currently taught? *">
            <RadioGroup
              options={TEACHING_PROBLEMS}
              selected={form.teachingProblem}
              onChange={(v) => set('teachingProblem', v)}
            />
          </QuestionBlock>

          {/* Q7 */}
          <QuestionBlock number={7} label="Have you ever felt unable to properly communicate with a Spanish-speaking patient? *">
            <RadioGroup
              options={COMMUNICATION_BARRIERS}
              selected={form.communicationBarrier}
              onChange={(v) => set('communicationBarrier', v)}
            />
          </QuestionBlock>

          {/* Q8 */}
          <QuestionBlock number={8} label="How committed are you to learning medical Spanish? * (1 = not at all, 5 = very committed)">
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('commitmentScale', n)}
                  className={`w-12 h-12 rounded-xl border-2 font-bold text-lg transition-all
                    ${form.commitmentScale === n
                      ? 'border-orange-400 bg-orange-50 text-orange-600'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-orange-300'
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>Not at all</span>
              <span>Very committed</span>
            </div>
          </QuestionBlock>

          {/* Q9 */}
          <QuestionBlock number={9} label="Would you pay for a high-quality medical Spanish app? *">
            <RadioGroup
              options={['Yes', 'Maybe', 'No']}
              selected={form.wouldPay}
              onChange={(v) => { set('wouldPay', v); if (v === 'No') set('priceRange', ''); }}
            />
          </QuestionBlock>

          {/* Q10 — conditional on Q9 = Yes or Maybe */}
          {(form.wouldPay === 'Yes' || form.wouldPay === 'Maybe') && (
            <QuestionBlock number={10} label="How much per month would feel reasonable?">
              <RadioGroup options={PRICE_RANGES} selected={form.priceRange} onChange={(v) => set('priceRange', v)} cols={2} />
            </QuestionBlock>
          )}

          {/* Q11 */}
          <QuestionBlock number={11} label="How did you hear about SanaSana / Fluently?">
            <input
              type="text"
              value={form.referralSource}
              onChange={(e) => set('referralSource', e.target.value)}
              placeholder="e.g. Instagram, classmate, professor…"
              className="w-full border-2 border-gray-200 focus:border-violet-400 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none"
            />
          </QuestionBlock>

          {/* Q12 */}
          <QuestionBlock number={12} label="Any additional comments or things you wish a medical Spanish app would do?">
            <textarea
              value={form.additionalComments}
              onChange={(e) => set('additionalComments', e.target.value)}
              placeholder="Optional — share anything else on your mind…"
              rows={3}
              className="w-full border-2 border-gray-200 focus:border-violet-400 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none resize-none"
            />
          </QuestionBlock>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold rounded-2xl py-4 text-base transition-all disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit Survey'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Your responses are anonymous unless you&apos;re logged in.
          </p>
        </form>
      </div>
    </div>
  );
}
