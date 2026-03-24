'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase';

const ROLES = [
  { value: 'student',  label: 'Medical Student' },
  { value: 'resident', label: 'Resident' },
  { value: 'doctor',   label: 'Physician' },
  { value: 'nurse',    label: 'Nurse / Nurse Practitioner' },
  { value: 'pa',       label: 'Physician Assistant (PA)' },
  { value: 'other',    label: 'Other' },
];

const LEAD_KEY = 'sana_lead';

export default function WelcomePage() {
  const router = useRouter();
  const [name, setName]   = useState('');
  const [role, setRole]   = useState('student');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Already introduced themselves on this device — skip the form.
    try {
      if (localStorage.getItem(LEAD_KEY)) router.replace('/dashboard');
    } catch { /* localStorage blocked */ }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email.'); return; }
    setLoading(true);
    setError('');

    const lead = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      role,
      email: email.trim().toLowerCase(),
    };

    // Persist locally first — works even if Supabase insert fails
    localStorage.setItem(LEAD_KEY, JSON.stringify(lead));

    // Best-effort insert into Supabase `leads` table (no auth required).
    // Send the human-readable label so the leads table stores "Nurse / Nurse Practitioner"
    // rather than the internal key "nurse".
    const roleLabel = ROLES.find((r) => r.value === role)?.label ?? role;
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.from('leads').insert({ name: lead.name, role: roleLabel, email: lead.email });
      } catch { /* non-fatal */ }
    }

    // Use a full browser navigation instead of router.push so the AuthContext
    // re-mounts and re-reads localStorage from scratch. router.push is a
    // client-side transition that keeps the existing React tree — the context
    // would still have profile=null from before the form was submitted, causing
    // the dashboard to immediately redirect back to "/".
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <span className="text-5xl">🩺</span>
          <h1 className="text-3xl font-bold text-sky-700 mt-2">SanaSana</h1>
          <p className="text-gray-500 text-sm mt-1">Medical Spanish for Healthcare Professionals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Tell us a little about yourself to get started — no password needed.
          </p>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Smith"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl py-3 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Entering app…' : 'Enter App →'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            We&apos;ll remember you on this device so you never have to fill this out again.
          </p>
        </div>
      </div>
    </div>
  );
}
