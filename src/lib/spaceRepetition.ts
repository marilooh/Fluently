'use client';

// SM-2 spaced repetition algorithm (simplified)
export interface CardState {
  cardId: string;
  easeFactor: number; // 1.3 – 2.5
  interval: number; // days until next review
  repetitions: number;
  nextReview: string; // ISO date
  lastRating?: number; // 0-5
}

export type Rating = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout, 1 = wrong but familiar, 2 = wrong with easy hint,
// 3 = correct with difficulty, 4 = correct, 5 = perfect

let storageKey = 'fluently_srs';

/** Call once after auth loads to namespace progress per user. */
export function initForUser(userId: string): void {
  storageKey = `fluently_srs_${userId}`;
}

function loadStates(): Record<string, CardState> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : {};
}

function saveStates(states: Record<string, CardState>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey, JSON.stringify(states));
}

export function getCardState(cardId: string): CardState {
  const states = loadStates();
  return (
    states[cardId] ?? {
      cardId,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReview: new Date().toISOString().split('T')[0],
    }
  );
}

export function rateCard(cardId: string, rating: Rating): CardState {
  const state = getCardState(cardId);
  let { easeFactor, interval, repetitions } = state;

  if (rating >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  const nextReview = nextReviewDate.toISOString().split('T')[0];

  const newState: CardState = {
    cardId,
    easeFactor,
    interval,
    repetitions,
    nextReview,
    lastRating: rating,
  };

  const states = loadStates();
  states[cardId] = newState;
  saveStates(states);

  return newState;
}

export function getDueCards(cardIds: string[]): string[] {
  const today = new Date().toISOString().split('T')[0];
  return cardIds.filter((id) => {
    const state = getCardState(id);
    return state.nextReview <= today;
  });
}

export function getAllCardStates(): Record<string, CardState> {
  return loadStates();
}

export function resetCardState(cardId: string): void {
  const states = loadStates();
  delete states[cardId];
  saveStates(states);
}
