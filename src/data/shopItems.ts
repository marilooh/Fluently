export type ItemSlot = 'scrubs' | 'cap' | 'stethoscope' | 'badge' | 'accessory';

export interface ShopItem {
  id: string;
  slot: ItemSlot;
  name: string;
  description: string;
  price: number; // in coins
  emoji: string;
  color?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isDefault?: boolean;
}

export const shopItems: ShopItem[] = [
  // ── SCRUBS ─────────────────────────────────────────────────────────────
  { id: 'scrubs_white', slot: 'scrubs', name: 'Classic White Coat', description: 'The timeless medical professional look.', price: 0, emoji: '🥼', color: '#f8fafc', rarity: 'common', isDefault: true },
  { id: 'scrubs_blue', slot: 'scrubs', name: 'Ocean Blue Scrubs', description: 'Cool and professional navy blue scrubs.', price: 50, emoji: '👕', color: '#3b82f6', rarity: 'common' },
  { id: 'scrubs_green', slot: 'scrubs', name: 'Surgical Green Scrubs', description: 'Classic OR-ready green scrubs.', price: 50, emoji: '👕', color: '#22c55e', rarity: 'common' },
  { id: 'scrubs_purple', slot: 'scrubs', name: 'Purple Haze Scrubs', description: 'Stand out with stylish purple.', price: 75, emoji: '👕', color: '#a855f7', rarity: 'rare' },
  { id: 'scrubs_pink', slot: 'scrubs', name: 'Coral Scrubs', description: 'Bright and vibrant coral scrubs.', price: 75, emoji: '👕', color: '#f43f5e', rarity: 'rare' },
  { id: 'scrubs_black', slot: 'scrubs', name: 'Midnight Scrubs', description: 'Sleek all-black scrubs for the night shift.', price: 100, emoji: '👕', color: '#1f2937', rarity: 'rare' },
  { id: 'scrubs_teal', slot: 'scrubs', name: 'Teal ICU Scrubs', description: 'The ICU staple — teal perfection.', price: 100, emoji: '👕', color: '#0d9488', rarity: 'rare' },
  { id: 'scrubs_gold', slot: 'scrubs', name: 'Golden Resident Scrubs', description: 'You survived residency. You earned these.', price: 250, emoji: '✨', color: '#f59e0b', rarity: 'epic' },
  { id: 'scrubs_rainbow', slot: 'scrubs', name: 'Pride Scrubs', description: 'Celebrate diversity and inclusion.', price: 200, emoji: '🌈', color: '#ec4899', rarity: 'epic' },
  { id: 'scrubs_legendary', slot: 'scrubs', name: 'Attending Legendary Coat', description: 'Only the masters wear this.', price: 500, emoji: '🏆', color: '#92400e', rarity: 'legendary' },

  // ── SCRUB CAPS ──────────────────────────────────────────────────────────
  { id: 'cap_none', slot: 'cap', name: 'No Cap', description: 'Free your hair.', price: 0, emoji: '—', color: 'transparent', rarity: 'common', isDefault: true },
  { id: 'cap_blue', slot: 'cap', name: 'Blue Surgical Cap', description: 'Standard issue OR cap.', price: 30, emoji: '🧢', color: '#3b82f6', rarity: 'common' },
  { id: 'cap_pattern_stars', slot: 'cap', name: 'Starry Night Cap', description: 'For the astronomers of medicine.', price: 60, emoji: '⭐', color: '#1e1b4b', rarity: 'rare' },
  { id: 'cap_pattern_hearts', slot: 'cap', name: 'Hearts Cap', description: 'Show your patients some love.', price: 60, emoji: '❤️', color: '#fce7f3', rarity: 'rare' },
  { id: 'cap_pattern_tropical', slot: 'cap', name: 'Tropical Cap', description: 'Vacation vibes in the OR.', price: 80, emoji: '🌺', color: '#fef08a', rarity: 'rare' },
  { id: 'cap_pattern_tacos', slot: 'cap', name: 'Taco Tuesday Cap', description: 'Every day is taco day.', price: 100, emoji: '🌮', color: '#fef3c7', rarity: 'epic' },
  { id: 'cap_gold', slot: 'cap', name: 'Gold Chief Cap', description: 'Chief resident energy only.', price: 200, emoji: '👑', color: '#fbbf24', rarity: 'legendary' },

  // ── STETHOSCOPES ────────────────────────────────────────────────────────
  { id: 'stethoscope_basic', slot: 'stethoscope', name: 'Classic Stethoscope', description: 'The trusty black stethoscope.', price: 0, emoji: '🩺', color: '#374151', rarity: 'common', isDefault: true },
  { id: 'stethoscope_blue', slot: 'stethoscope', name: 'Blue Stethoscope', description: 'Color-coded for identification.', price: 40, emoji: '🩺', color: '#3b82f6', rarity: 'common' },
  { id: 'stethoscope_red', slot: 'stethoscope', name: 'Red Cross Stethoscope', description: 'Emergency medicine vibes.', price: 60, emoji: '🩺', color: '#ef4444', rarity: 'rare' },
  { id: 'stethoscope_gold', slot: 'stethoscope', name: 'Gold Littmann', description: 'Only the finest acoustic quality.', price: 150, emoji: '🩺', color: '#f59e0b', rarity: 'epic' },
  { id: 'stethoscope_legendary', slot: 'stethoscope', name: 'Diamond Stethoscope', description: 'Pure prestige. You can hear heartbeats from a mile away.', price: 400, emoji: '💎', color: '#a5f3fc', rarity: 'legendary' },

  // ── BADGES ──────────────────────────────────────────────────────────────
  { id: 'badge_basic', slot: 'badge', name: 'Student Badge', description: 'Your first hospital ID.', price: 0, emoji: '🪪', color: '#d1fae5', rarity: 'common', isDefault: true },
  { id: 'badge_resident', slot: 'badge', name: 'Resident Badge', description: 'You made it to residency!', price: 80, emoji: '🩻', color: '#bfdbfe', rarity: 'rare' },
  { id: 'badge_bilingual', slot: 'badge', name: 'Bilingual Pro Badge', description: 'Certified Medical Spanish Speaker.', price: 120, emoji: '🌎', color: '#fde68a', rarity: 'rare' },
  { id: 'badge_attending', slot: 'badge', name: 'Attending Badge', description: 'The real deal.', price: 200, emoji: '⚕️', color: '#c7d2fe', rarity: 'epic' },
  { id: 'badge_fluently', slot: 'badge', name: 'Fluently Champion', description: 'Top of the leaderboard.', price: 300, emoji: '🏆', color: '#fef3c7', rarity: 'legendary' },

  // ── ACCESSORIES ─────────────────────────────────────────────────────────
  { id: 'accessory_none', slot: 'accessory', name: 'None', description: 'Simple and professional.', price: 0, emoji: '—', rarity: 'common', isDefault: true },
  { id: 'accessory_coffee', slot: 'accessory', name: 'Coffee Cup', description: 'Fueled by caffeine and compassion.', price: 30, emoji: '☕', rarity: 'common' },
  { id: 'accessory_clipboard', slot: 'accessory', name: 'Clipboard', description: 'Always taking notes.', price: 40, emoji: '📋', rarity: 'common' },
  { id: 'accessory_reflex_hammer', slot: 'accessory', name: 'Reflex Hammer', description: 'For the neurologists.', price: 60, emoji: '🔨', rarity: 'rare' },
  { id: 'accessory_otoscope', slot: 'accessory', name: 'Otoscope', description: 'Let me look in your ears.', price: 80, emoji: '🔦', rarity: 'rare' },
  { id: 'accessory_heart', slot: 'accessory', name: 'Heart Pin', description: 'You care deeply about your patients.', price: 100, emoji: '❤️', rarity: 'epic' },
  { id: 'accessory_caduceus', slot: 'accessory', name: 'Caduceus Pin', description: 'Symbol of medicine.', price: 150, emoji: '⚕️', rarity: 'epic' },
];

export const RARITY_COLORS: Record<ShopItem['rarity'], string> = {
  common: 'border-gray-200 bg-gray-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-400 bg-purple-50',
  legendary: 'border-amber-400 bg-amber-50',
};

export const RARITY_BADGE: Record<ShopItem['rarity'], string> = {
  common: 'bg-gray-100 text-gray-600',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-amber-100 text-amber-700',
};

export function getItemsBySlot(slot: ItemSlot): ShopItem[] {
  return shopItems.filter((i) => i.slot === slot);
}
