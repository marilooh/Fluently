'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';

type Role = 'student' | 'nurse' | 'emt' | 'doctor' | 'premed' | 'other';

const ROLES: { value: Role; label: string; emoji: string }[] = [
  { value: 'premed', label: 'Pre-med Student', emoji: '📚' },
  { value: 'student', label: 'Medical Student', emoji: '🎓' },
  { value: 'nurse', label: 'Nurse / NP / PA', emoji: '💉' },
  { value: 'emt', label: 'EMT / Paramedic', emoji: '🚑' },
  { value: 'doctor', label: 'Physician', emoji: '👨‍⚕️' },
  { value: 'other', label: 'Other Healthcare', emoji: '🏥' },
];

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'landing' | 'login' | 'register'>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (searchParams?.get('error') === 'auth_callback_failed') {
      setError('Authentication failed. Please try again.');
      setMode('login');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const supabase = createClient();

    const { data, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { name, role, institution },
      },
    });

    if (signUpErr) {
      setError(signUpErr.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const today = new Date().toISOString().split('T')[0];
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        name,
        role,
        institution: institution || null,
        xp: 0,
        level: 1,
        streak: 0,
        last_active_date: today,
        coins: 100,
        hearts: 5,
        avatar_items: ['scrubs_white', 'badge_basic'],
        equipped_items: ['scrubs_white', 'badge_basic'],
        completed_lessons: [],
        placement_level: null,
        onboarding_completed: false,
      });

      if (!data.session) {
        // Email confirmation required
        setInfo('Check your email to confirm your account, then come back to sign in.');
        setMode('login');
        setLoading(false);
      } else {
        router.push('/onboarding');
        router.refresh();
      }
    }
    setLoading(false);
  };

  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button onClick={() => { setMode('landing'); setError(''); setInfo(''); }}
            className="mb-6 text-sky-600 flex items-center gap-1 hover:underline text-sm">
            ← Back
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <span className="text-4xl">🩺</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Welcome back</h1>
              <p className="text-gray-500 text-sm">Continue your medical Spanish journey</p>
            </div>

            {!configured && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
                <strong>Setup required:</strong> Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment variables.
              </div>
            )}

            {info && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-4 text-sm text-sky-800">
                {info}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@university.edu"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>

              <div className="text-right">
                <Link href="/auth/reset" className="text-sky-600 text-sm hover:underline">Forgot password?</Link>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={loading || !configured}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl py-3 transition-colors disabled:opacity-50">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              New to Fluently?{' '}
              <button onClick={() => { setMode('register'); setError(''); setInfo(''); }}
                className="text-sky-600 font-medium hover:underline">Create account</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button onClick={() => { setMode('landing'); setError(''); }}
            className="mb-6 text-sky-600 flex items-center gap-1 hover:underline text-sm">
            ← Back
          </button>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <span className="text-4xl">🩺</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Create your account</h1>
              <p className="text-gray-500 text-sm">Join thousands of healthcare professionals</p>
            </div>

            {!configured && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
                <strong>Setup required:</strong> Supabase environment variables are not configured.
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="Dr. Jane Smith"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="you@university.edu"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a…</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors
                        ${role === r.value ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600 hover:border-sky-200'}`}>
                      <span>{r.emoji}</span> {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)}
                  placeholder="University / Hospital name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

              <button type="submit" disabled={loading || !configured}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl py-3 transition-colors disabled:opacity-50">
                {loading ? 'Creating account…' : 'Start Learning Free'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                By registering, you consent to your anonymized usage data being used to improve Fluently.
              </p>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }}
                className="text-sky-600 font-medium hover:underline">Sign in</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Landing Page ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🩺</span>
          <span className="text-xl font-bold text-sky-700">Fluently</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setMode('login')} className="px-4 py-2 text-sky-600 font-medium text-sm hover:bg-sky-50 rounded-xl transition-colors">
            Sign In
          </button>
          <button onClick={() => setMode('register')} className="px-4 py-2 bg-sky-500 text-white font-medium text-sm rounded-xl hover:bg-sky-600 transition-colors">
            Get Started Free
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🌎 Bridging the language gap in healthcare
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
            Learn Medical Spanish.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-500">Save Lives.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The first gamified medical Spanish platform built for healthcare professionals — from pre-med to attending.
            Bridge the language gap with your Spanish-speaking patients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={() => setMode('register')}
              className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold rounded-2xl transition-colors shadow-lg shadow-sky-200">
              Start Learning Free →
            </button>
            <button onClick={() => setMode('login')}
              className="px-8 py-4 bg-white text-sky-600 text-lg font-semibold rounded-2xl border-2 border-sky-200 hover:border-sky-400 transition-colors">
              Sign In
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-16">
            {[{ stat: '200+', label: 'Medical terms' }, { stat: '16', label: 'Lessons' }, { stat: '10', label: 'Specialties' }].map((s) => (
              <div key={s.stat} className="bg-white rounded-2xl p-5 shadow-sm border border-sky-100">
                <div className="text-3xl font-bold text-sky-600">{s.stat}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '🎮', title: 'Gamified Learning', desc: 'Earn XP, build streaks, level up — just like Duolingo, but for medical Spanish.' },
            { icon: '🃏', title: 'Smart Flashcards', desc: 'Spaced repetition ensures you remember terms when it matters most in the clinic.' },
            { icon: '🔍', title: 'Medical Dictionary', desc: 'Instantly search 200+ anatomical terms, diagnoses, symptoms, and clinical phrases.' },
            { icon: '👔', title: 'Character Builder', desc: 'Customize your avatar with scrubs, caps, stethoscopes, and accessories.' },
            { icon: '🗺️', title: 'Skill Tree', desc: 'Visual roadmap showing your progression through all medical Spanish topics.' },
            { icon: '🏆', title: 'Leaderboard', desc: 'Compete with peers, earn badges, and climb the ranks in your cohort.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-sky-50 card-hover">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-sky-500 to-teal-500 rounded-3xl p-8 text-white text-center mb-16">
          <h2 className="text-2xl font-bold mb-6">Built for every stage of your career</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ROLES.map((r) => (
              <div key={r.value} className="bg-white/20 rounded-2xl p-4">
                <div className="text-2xl mb-1">{r.emoji}</div>
                <div className="font-medium text-sm">{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-sky-100 text-center max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🌎</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Over 41 million Spanish speakers in the US often face critical language barriers in healthcare settings.
            Fluently helps providers communicate with greater confidence and cultural sensitivity —
            <strong> not to replace interpreters, but to empower providers</strong> to make every patient feel heard.
          </p>
        </div>
      </main>

      <footer className="text-center text-gray-400 text-sm py-8 border-t border-sky-100">
        © 2025 Fluently · Medical Spanish for Healthcare Professionals · Beta Prototype
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50" />}>
      <LandingContent />
    </Suspense>
  );
}
