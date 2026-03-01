'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout, getCurrentUser } from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/learn', label: 'Learn', icon: '📖' },
  { href: '/flashcards', label: 'Flashcards', icon: '🃏' },
  { href: '/search', label: 'Dictionary', icon: '🔍' },
  { href: '/character', label: 'Locker', icon: '👔' },
  { href: '/leaderboard', label: 'Ranks', icon: '🏆' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden md:flex items-center justify-between bg-white border-b border-sky-100 px-6 py-3 fixed top-0 left-0 right-0 z-40 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🩺</span>
          <span className="font-bold text-sky-700 text-lg">Fluently</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors
                ${pathname === item.href ? 'bg-sky-100 text-sky-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl">
                <span>🔥</span>
                <span className="text-amber-600 font-bold text-sm">{user.streak}</span>
              </div>
              <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-xl">
                <span>⚡</span>
                <span className="text-sky-600 font-bold text-sm">{user.xp} XP</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-xl">
                <span>🪙</span>
                <span className="text-yellow-600 font-bold text-sm">{user.coins}</span>
              </div>
            </>
          )}
          <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-sky-100 flex items-center justify-around py-2 px-2">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors text-center
              ${pathname === item.href ? 'text-sky-600' : 'text-gray-400'}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
