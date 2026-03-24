'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { searchVocabulary, vocabulary, VocabEntry, CATEGORY_ICONS, CATEGORY_LABELS, CATEGORIES, Category } from '@/data/vocabulary';

export default function SearchPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VocabEntry[]>(vocabulary);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selected, setSelected] = useState<VocabEntry | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !profile) { router.push('/'); return; }
    if (profile) inputRef.current?.focus();
  }, [profile, loading, router]);

  useEffect(() => {
    let r = searchVocabulary(query);
    if (activeCategory !== 'all') r = r.filter((v) => v.category === activeCategory);
    if (activeDifficulty !== 'all') r = r.filter((v) => v.difficulty === activeDifficulty);
    setResults(r);
  }, [query, activeCategory, activeDifficulty]);

  if (loading || !profile) return null;

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 md:pb-8 px-4 max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Medical Dictionary</h1>
          <p className="text-gray-500 text-sm">Search {vocabulary.length}+ medical terms in English or Spanish</p>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anatomy, symptoms, diagnoses… (English or Spanish)"
            className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
          <select value={activeDifficulty} onChange={(e) => setActiveDifficulty(e.target.value as typeof activeDifficulty)}
            className="flex-shrink-0 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-400">
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${activeCategory === 'all' ? 'bg-sky-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors
                ${activeCategory === cat ? 'bg-sky-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat].split(' /')[0]}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 mb-3">{results.length} result{results.length !== 1 ? 's' : ''}</p>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-3">
          {results.map((entry) => (
            <button key={entry.id} onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
              className={`text-left bg-white rounded-2xl p-4 shadow-sm border transition-all card-hover
                ${selected?.id === entry.id ? 'border-sky-400 ring-2 ring-sky-100' : 'border-sky-50'}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{entry.english}</p>
                  <p className="text-sky-600 font-semibold text-base">{entry.spanish}</p>
                </div>
                <span className="text-lg flex-shrink-0">{CATEGORY_ICONS[entry.category]}</span>
              </div>
              <p className="text-gray-400 text-xs italic mb-2">{entry.pronunciation}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  entry.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  entry.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'}`}>
                  {entry.difficulty}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                  {CATEGORY_LABELS[entry.category].split(' /')[0]}
                </span>
              </div>

              {selected?.id === entry.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 slide-up">
                  {entry.example && (
                    <div className="bg-sky-50 rounded-xl p-3 mb-2">
                      <p className="text-xs font-medium text-sky-700 mb-1">Example Phrase</p>
                      <p className="text-sm text-gray-800 font-medium">{entry.example.es}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{entry.example.en}</p>
                    </div>
                  )}
                  {entry.notes && (
                    <div className="bg-amber-50 rounded-xl p-3 mb-2">
                      <p className="text-xs font-medium text-amber-700 mb-1">Clinical Note</p>
                      <p className="text-xs text-gray-700">{entry.notes}</p>
                    </div>
                  )}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </button>
          ))}

          {results.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium text-gray-600">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-gray-400 text-sm mt-1">Try searching in English or Spanish</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
