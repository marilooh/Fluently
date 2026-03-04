'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';

type Mode = 'login' | 'register';
type Role = 'student' | 'nurse' | 'emt' | 'doctor' | 'premed' | 'other';

const ROLES: { value: Role; label: string; emoji: string }[] = [
  { value: 'premed', label: 'Pre-med Student', emoji: '📚' },
  { value: 'student', label: 'Medical Student', emoji: '🎓' },
  { value: 'nurse', label: 'Nurse / NP / PA', emoji: '💉' },
  { value: 'emt', label: 'EMT / Paramedic', emoji: '🚑' },
  { value: 'doctor', label: 'Physician', emoji: '👨‍⚕️' },
  { value: 'other', label: 'Other Healthcare', emoji: '🏥' },
];

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>('login');
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
    }
  }, [searchParams]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setInfo('');
  };

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
        email: data.user.email,
        display_name: name,
        xp: 0,
        coins: 100,
        completed_lessons: [],
        // Extra columns — only saved if they've been added via ALTER TABLE
        role,
        institution: institution || null,
        level: 1,
        streak: 0,
        last_active_date: today,
        hearts: 5,
        avatar_items: ['scrubs_white', 'badge_basic'],
        equipped_items: ['scrubs_white', 'badge_basic'],
        placement_level: null,
        onboarding_completed: true,
      });

      if (!data.session) {
        setInfo('Check your email to confirm your account, then sign in here.');
        setMode('login');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <span className="text-5xl">🩺</span>
          <h1 className="text-3xl font-bold text-sky-700 mt-2">Fluently</h1>
          <p className="text-gray-500 text-sm mt-1">Medical Spanish for Healthcare Professionals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors
                ${mode === 'login' ? 'text-sky-600 border-b-2 border-sky-500 bg-sky-50' : 'text-gray-500 hover:text-gray-700'}`}>
              Sign In
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors
                ${mode === 'register' ? 'text-sky-600 border-b-2 border-sky-500 bg-sky-50' : 'text-gray-500 hover:text-gray-700'}`}>
              Create Account
            </button>
          </div>

          <div className="p-8">
            {!configured && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
                <strong>Setup required:</strong> Add Supabase environment variables to enable auth.
              </div>
            )}

            {info && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-4 text-sm text-sky-800">
                {info}
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
            )}

            {mode === 'login' ? (
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
                <button type="submit" disabled={loading || !configured}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl py-3 transition-colors disabled:opacity-50">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
            ) : (
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
                <button type="submit" disabled={loading || !configured}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl py-3 transition-colors disabled:opacity-50">
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  By registering, you consent to anonymized usage data being used to improve Fluently.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50" />}>
      <AuthContent />
    </Suspense>
  );
}
