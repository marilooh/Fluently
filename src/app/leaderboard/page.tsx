'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const MOCK_USERS = [
  { name: 'Dr. Maria Santos', role: 'doctor', institution: 'UT Southwestern', xp: 480, level: 5, streak: 12 },
  { name: 'Alex Chen', role: 'student', institution: 'Harvard Med', xp: 410, level: 5, streak: 9 },
  { name: 'Jamie Ramirez', role: 'nurse', institution: 'NYU Langone', xp: 375, level: 4, streak: 14 },
  { name: 'Taylor Brooks', role: 'emt', institution: 'Chicago Fire', xp: 320, level: 4, streak: 7 },
  { name: 'Sam Nguyen', role: 'premed', institution: 'UCLA', xp: 285, level: 3, streak: 5 },
  { name: 'Jordan Miller', role: 'student', institution: 'Johns Hopkins', xp: 240, level: 3, streak: 4 },
  { name: 'Casey Torres', role: 'nurse', institution: 'Mass General', xp: 195, level: 2, streak: 3 },
  { name: 'Riley Kim', role: 'doctor', institution: 'Mayo Clinic', xp: 160, level: 2, streak: 2 },
];

const ROLE_EMOJI: Record<string, string> = {
  doctor: '👨‍⚕️', nurse: '💉', emt: '🚑', student: '🎓', premed: '📚', other: '🏥',
};

export default function LeaderboardPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [board, setBoard] = useState<{ name: string; xp: number; level: number; streak: number; role: string; institution?: string }[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !profile) { router.push('/'); return; }
    if (profile) {
      const combined = [
        ...MOCK_USERS,
        { name: profile.name, xp: profile.xp, level: profile.level, streak: profile.streak, role: profile.role, institution: profile.institution },
      ].sort((a, b) => b.xp - a.xp);
      setBoard(combined.slice(0, 20));
      const rank = combined.findIndex((p) => p.name === profile.name);
      setUserRank(rank >= 0 ? rank + 1 : null);
    }
  }, [profile, loading, router]);

  if (!profile) return null;
  const user = profile;

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 md:pb-8 px-4 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Leaderboard</h1>
          <p className="text-gray-500 text-sm">Top medical Spanish learners</p>
        </div>

        {/* Top 3 podium */}
        {board.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-6">
            {/* 2nd */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl border-4 border-gray-300 mb-1">
                {ROLE_EMOJI[board[1].role]}
              </div>
              <div className="bg-gray-300 rounded-xl px-3 py-3 text-center w-24">
                <div className="text-lg font-bold text-gray-700">🥈</div>
                <div className="text-xs font-bold text-gray-800 truncate">{board[1].name.split(' ')[0]}</div>
                <div className="text-xs text-gray-600">{board[1].xp} XP</div>
              </div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center -mt-4">
              <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-2xl border-4 border-amber-400 mb-1">
                {ROLE_EMOJI[board[0].role]}
              </div>
              <div className="bg-amber-400 rounded-xl px-3 py-4 text-center w-24">
                <div className="text-xl font-bold text-white">🥇</div>
                <div className="text-xs font-bold text-white truncate">{board[0].name.split(' ')[0]}</div>
                <div className="text-xs text-amber-100">{board[0].xp} XP</div>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl border-4 border-amber-300 mb-1">
                {ROLE_EMOJI[board[2].role]}
              </div>
              <div className="bg-amber-700 rounded-xl px-3 py-2 text-center w-24">
                <div className="text-lg font-bold text-amber-200">🥉</div>
                <div className="text-xs font-bold text-white truncate">{board[2].name.split(' ')[0]}</div>
                <div className="text-xs text-amber-200">{board[2].xp} XP</div>
              </div>
            </div>
          </div>
        )}

        {/* Your rank */}
        {userRank && (
          <div className="bg-sky-100 border border-sky-300 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sky-600 font-bold text-lg">#{userRank}</span>
              <div>
                <p className="font-bold text-sky-800 text-sm">{user.name} (You)</p>
                <p className="text-sky-600 text-xs">{user.xp} XP · Level {user.level}</p>
              </div>
            </div>
            <span className="text-xl">{ROLE_EMOJI[user.role]}</span>
          </div>
        )}

        {/* Full list */}
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 divide-y divide-gray-50">
          {board.map((p, i) => {
            const isCurrentUser = p.name === user.name;
            return (
              <div key={`${p.name}-${i}`}
                className={`flex items-center gap-4 px-4 py-3 ${isCurrentUser ? 'bg-sky-50' : ''}`}>
                <div className="w-8 text-center font-bold text-gray-500 text-sm">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-200 to-teal-200 flex items-center justify-center text-lg flex-shrink-0">
                  {ROLE_EMOJI[p.role]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isCurrentUser ? 'text-sky-700' : 'text-gray-900'}`}>
                    {p.name} {isCurrentUser ? '(You)' : ''}
                  </p>
                  <p className="text-gray-400 text-xs">{p.institution || p.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm text-gray-900">{p.xp} XP</p>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-orange-500 text-xs">🔥</span>
                    <span className="text-xs text-gray-400">{p.streak}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
