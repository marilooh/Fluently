'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { shopItems, ShopItem, ItemSlot, RARITY_COLORS, RARITY_BADGE, getItemsBySlot } from '@/data/shopItems';

const SLOTS: { slot: ItemSlot; label: string; emoji: string }[] = [
  { slot: 'scrubs', label: 'Scrubs', emoji: '👕' },
  { slot: 'cap', label: 'Cap', emoji: '🧢' },
  { slot: 'stethoscope', label: 'Stethoscope', emoji: '🩺' },
  { slot: 'badge', label: 'Badge', emoji: '🪪' },
  { slot: 'accessory', label: 'Accessory', emoji: '✨' },
];

function Avatar({ equippedItems, items }: { equippedItems: string[]; items: ShopItem[] }) {
  const equipped = equippedItems.map((id) => items.find((i) => i.id === id)).filter(Boolean) as ShopItem[];
  const scrubs = equipped.find((i) => i.slot === 'scrubs');
  const cap = equipped.find((i) => i.slot === 'cap');
  const stethoscope = equipped.find((i) => i.slot === 'stethoscope');
  const badge = equipped.find((i) => i.slot === 'badge');
  const accessory = equipped.find((i) => i.slot === 'accessory');

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-44">
        {/* Body */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-6">
          {/* Head */}
          <div className="w-16 h-16 rounded-full bg-amber-200 border-4 border-amber-300 flex items-center justify-center text-2xl relative z-10">
            😊
            {/* Cap */}
            {cap && cap.id !== 'cap_none' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">{cap.emoji}</div>
            )}
          </div>
          {/* Body / Scrubs */}
          <div className="w-24 h-20 rounded-2xl mt-1 flex items-center justify-center relative"
            style={{ backgroundColor: scrubs?.color || '#e2e8f0' }}>
            <span className="text-3xl">{scrubs?.emoji || '👕'}</span>
            {/* Badge */}
            {badge && (
              <div className="absolute bottom-1 right-1 text-sm">{badge.emoji}</div>
            )}
            {/* Stethoscope */}
            {stethoscope && (
              <div className="absolute -right-3 top-2 text-xl">{stethoscope.emoji}</div>
            )}
          </div>
          {/* Accessory */}
          {accessory && accessory.id !== 'accessory_none' && (
            <div className="mt-1 text-xl">{accessory.emoji}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CharacterPage() {
  const router = useRouter();
  const { user: authUser, profile, updateProfile, loading } = useAuth();
  const [activeSlot, setActiveSlot] = useState<ItemSlot>('scrubs');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !authUser) router.push('/');
  }, [authUser, loading, router]);

  const handlePurchase = async (item: ShopItem) => {
    if (!profile) return;
    const ownedItems = profile.avatar_items ?? [];
    const equippedItems = profile.equipped_items ?? [];
    const owned = ownedItems.includes(item.id);
    if (owned) {
      // Already owned — just equip
      const slot = item.slot;
      const filtered = equippedItems.filter((i) => {
        const s = shopItems.find((si) => si.id === i);
        return s ? s.slot !== slot : true;
      });
      await updateProfile({ equipped_items: [...filtered, item.id] });
      setMessage(`${item.emoji} ${item.name} equipped!`);
    } else if ((profile.coins ?? 0) >= item.price) {
      const slot = item.slot;
      const filtered = equippedItems.filter((i) => {
        const s = shopItems.find((si) => si.id === i);
        return s ? s.slot !== slot : true;
      });
      await updateProfile({
        coins: (profile.coins ?? 0) - item.price,
        avatar_items: [...ownedItems, item.id],
        equipped_items: [...filtered, item.id],
      });
      setMessage(`🎉 Purchased & equipped ${item.name}!`);
    } else {
      setMessage(`❌ Not enough coins! You need ${item.price - (profile.coins ?? 0)} more coins.`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading || !authUser || !profile) return null;
  const user = profile;

  const slotItems = getItemsBySlot(activeSlot);

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="pt-4 md:pt-20 pb-24 md:pb-8 px-4 max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Locker Room</h1>
          <p className="text-gray-500 text-sm">Customize your provider avatar</p>
        </div>

        {message && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 mb-4 text-sky-700 text-sm font-medium slide-up">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Avatar preview */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-sky-100 text-center sticky top-24">
              <p className="text-sm font-medium text-gray-500 mb-4">Your Avatar</p>
              <Avatar equippedItems={user.equipped_items ?? []} items={shopItems} />
              <p className="font-bold text-gray-900 mt-4 text-sm">{user.display_name}</p>
              <p className="text-gray-400 text-xs capitalize">{user.role ?? 'healthcare'}</p>
              <div className="flex items-center justify-center gap-1 mt-3 bg-yellow-50 rounded-xl py-2 px-4">
                <span>🪙</span>
                <span className="font-bold text-yellow-600">{user.coins ?? 0} coins</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Earn coins by completing lessons</p>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2">
            {/* Slot tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
              {SLOTS.map((s) => (
                <button key={s.slot} onClick={() => setActiveSlot(s.slot)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                    ${activeSlot === s.slot ? 'bg-sky-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slotItems.map((item) => {
                const owned = (user.avatar_items ?? []).includes(item.id);
                const equipped = (user.equipped_items ?? []).includes(item.id);
                return (
                  <button key={item.id} onClick={() => handlePurchase(item)}
                    className={`text-left border-2 rounded-2xl p-4 transition-all card-hover ${RARITY_COLORS[item.rarity]}
                      ${equipped ? 'ring-2 ring-sky-400' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RARITY_BADGE[item.rarity]}`}>
                        {item.rarity}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 text-xs leading-tight mb-1">{item.name}</p>
                    <p className="text-gray-500 text-xs leading-tight mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      {equipped ? (
                        <span className="text-xs text-sky-600 font-bold bg-sky-100 px-2 py-0.5 rounded-full">✓ Equipped</span>
                      ) : owned ? (
                        <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">Owned</span>
                      ) : item.price === 0 ? (
                        <span className="text-xs text-gray-500">Free</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-xs">🪙</span>
                          <span className={`text-xs font-bold ${(user.coins ?? 0) >= item.price ? 'text-amber-600' : 'text-red-400'}`}>
                            {item.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
