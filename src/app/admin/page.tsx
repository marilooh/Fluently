'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllUsersForAdmin, User } from '@/lib/auth';
import { lessons } from '@/data/lessons';

const ADMIN_CODE = 'fluently2025';

const ROLE_LABELS: Record<string, string> = {
  doctor: 'Physician', nurse: 'Nurse/NP/PA', emt: 'EMT/Paramedic',
  student: 'Medical Student', premed: 'Pre-med', other: 'Other',
};

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (authenticated) {
      const data = getAllUsersForAdmin();
      setUsers(data);
    }
  }, [authenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setAuthenticated(true);
    } else {
      setError('Incorrect access code.');
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Institution', 'Joined', 'XP', 'Level', 'Streak', 'Completed Lessons', 'Cards Studied'];
    const rows = users.map((u) => [
      u.name, u.email, ROLE_LABELS[u.role] || u.role, u.institution || '',
      new Date(u.joinedAt).toLocaleDateString(),
      u.xp, u.level, u.streak,
      u.completedLessons.length,
      u.practiceData?.reduce((sum, s) => sum + s.cardsReviewed, 0) || 0,
    ]);
    const csv = [headers, ...rows].map((r) => r.map(String).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fluently_users.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <span className="text-3xl">🔐</span>
            <h1 className="text-xl font-bold text-gray-900 mt-2">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Fluently Data Collection Portal</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="password" value={code} onChange={(e) => setCode(e.target.value)}
              placeholder="Access code" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-sky-500 text-white font-semibold rounded-xl py-3 hover:bg-sky-600 transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const roleBreakdown = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1; return acc;
  }, {});

  const avgXP = users.length ? Math.round(users.reduce((s, u) => s + u.xp, 0) / users.length) : 0;
  const avgStreak = users.length ? (users.reduce((s, u) => s + u.streak, 0) / users.length).toFixed(1) : '0';
  const totalSessions = users.reduce((s, u) => s + (u.practiceData?.length || 0), 0);

  const lessonCompletionRates = lessons.map((l) => ({
    title: l.title,
    completions: users.filter((u) => u.completedLessons.includes(l.id)).length,
    rate: users.length ? Math.round((users.filter((u) => u.completedLessons.includes(l.id)).length / users.length) * 100) : 0,
  })).sort((a, b) => b.completions - a.completions);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🩺</span>
          <span className="font-bold text-gray-900">Fluently Admin</span>
          <span className="bg-sky-100 text-sky-700 text-xs px-2 py-0.5 rounded-full">Data Portal</span>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-600 transition-colors">
            Export CSV
          </button>
          <button onClick={() => router.push('/')} className="text-gray-500 text-sm hover:underline">← App</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '👥', value: users.length, label: 'Total Users' },
            { icon: '⚡', value: avgXP, label: 'Avg. XP' },
            { icon: '🔥', value: avgStreak, label: 'Avg. Streak' },
            { icon: '📋', value: totalSessions, label: 'Practice Sessions' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Role breakdown */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-900 mb-4">Users by Role</h2>
            <div className="space-y-3">
              {Object.entries(roleBreakdown).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{ROLE_LABELS[role] || role}</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 rounded-full h-2 w-32 overflow-hidden">
                      <div className="bg-sky-400 h-2 rounded-full" style={{ width: `${(count / users.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(roleBreakdown).length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No users yet</p>
              )}
            </div>
          </div>

          {/* Lesson completion */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-900 mb-4">Top Completed Lessons</h2>
            <div className="space-y-2">
              {lessonCompletionRates.slice(0, 6).map((l) => (
                <div key={l.title} className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 flex-1 truncate mr-2">{l.title}</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 rounded-full h-2 w-20 overflow-hidden">
                      <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${l.rate}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{l.rate}%</span>
                  </div>
                </div>
              ))}
              {lessonCompletionRates.every((l) => l.completions === 0) && (
                <p className="text-gray-400 text-sm text-center py-4">No completions yet</p>
              )}
            </div>
          </div>
        </div>

        {/* User table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">All Users ({users.length})</h2>
          </div>
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-4xl mb-3">👥</p>
              <p>No users registered yet. Share the app link to start collecting data.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Name', 'Role', 'Institution', 'XP', 'Level', 'Streak', 'Lessons', 'Joined'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500">{ROLE_LABELS[u.role] || u.role}</td>
                      <td className="px-4 py-3 text-gray-500">{u.institution || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-sky-600">{u.xp}</td>
                      <td className="px-4 py-3 text-gray-700">{u.level}</td>
                      <td className="px-4 py-3 text-orange-500 font-medium">🔥 {u.streak}</td>
                      <td className="px-4 py-3 text-gray-700">{u.completedLessons.length}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
