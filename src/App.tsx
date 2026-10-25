/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WardrobeItem, Outfit } from './types';
import { INITIAL_WARDROBE } from './data/initialWardrobe';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WardrobeView } from './components/WardrobeView';
import { OutfitGeneratorView } from './components/OutfitGeneratorView';
import { ScannerLabView } from './components/ScannerLabView';
import { CapsuleAuditView } from './components/CapsuleAuditView';
import { OutfitCalendarView } from './components/OutfitCalendarView';
import { AddItemModal } from './components/AddItemModal';
import { ClothingAnalysisModal } from './components/ClothingAnalysisModal';
import { EmailOutfitModal } from './components/EmailOutfitModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('wardrobe');
  const [items, setItems] = useState<WardrobeItem[]>(() => {
    try {
      const stored = localStorage.getItem('dolabim_items');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load items from storage:', e);
    }
    return INITIAL_WARDROBE;
  });

  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>(() => {
    try {
      const stored = localStorage.getItem('dolabim_outfits');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load outfits from storage:', e);
    }
    return [
      {
        id: 'outfit-sample-1',
        title: 'Akdeniz Smart Casual & Keten Silüeti',
        selectedItemIds: ['w-1', 'w-5', 'w-10', 'w-12'],
        stylingAdvice: 'İtalyan keten gömleğin kollarını iki kat kıvırın ve taş rengi pileli pantolonun içine yarım sokarak dökümlü bırakın. Kestane loafer ile deri kemerin ton uyumu çabasız bir zarafet sunar.',
        weatherNote: '22°C ılık ve güneşli bir gün için mükemmel nefes alan doku.',
        harmonyScore: 96,
        occasion: 'Hafta Sonu Kahvesi',
        occasionFit: 'Açık hava kahvesinde ve sahil yürüyüşünde hem konforlu hem de seçkin görünür.',
        colorPalette: ['#F3EFE0', '#BFB5A5', '#4A2E18', '#3E2723'],
        date: '25 Ekim 2026',
        dayOfWeek: 'Pazar',
        worn: true,
      },
      {
        id: 'outfit-sample-2',
        title: 'Kruvaze Yün & Ham Denim Kontrastı',
        selectedItemIds: ['w-4', 'w-3', 'w-6', 'w-11'],
        stylingAdvice: 'Kruvaze antrasit blazer ceketi açık bırakarak içindeki beyaz pima tişörtün minimalizmini vurgulayın. Selvedge denim paçalarını tek kat katlayarak beyaz deri sneaker ile eşleştirin.',
        weatherNote: '16°C serin ve kuru sonbahar havasına uygun yapılandırılmış katman.',
        harmonyScore: 94,
        occasion: 'Ofis & Toplantı',
        occasionFit: 'Yaratıcı ofisler ve iş toplantıları için modern, dinamik ve saygın.',
        colorPalette: ['#2C3539', '#FFFFFF', '#1C2833', '#F0EFEA'],
        date: '26 Ekim 2026',
        dayOfWeek: 'Pazartesi',
        worn: false,
      },
    ];
  });

  // Modal States
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [analyzingItem, setAnalyzingItem] = useState<WardrobeItem | null>(null);
  const [emailingOutfit, setEmailingOutfit] = useState<Outfit | null>(null);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('dolabim_items', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('dolabim_outfits', JSON.stringify(savedOutfits));
    } catch (e) {
      console.error('Failed to save outfits:', e);
    }
  }, [savedOutfits]);

  // Actions
  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleIncrementWear = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, wearCount: item.wearCount + 1 } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Bu parçayı dolabınızdan kaldırmak istediğinize emin misiniz?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAddItem = (newItem: WardrobeItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    setSavedOutfits((prev) => {
      const exists = prev.find((o) => o.id === outfit.id);
      if (exists) return prev;
      return [outfit, ...prev];
    });
  };

  const handleWearOutfit = (outfit: Outfit) => {
    // 1. Mark outfit as worn
    setSavedOutfits((prev) =>
      prev.map((o) => (o.id === outfit.id ? { ...o, worn: true } : o))
    );

    // 2. Increment wear count for all constituent items
    setItems((prev) =>
      prev.map((item) => {
        if (outfit.selectedItemIds.includes(item.id)) {
          return { ...item, wearCount: item.wearCount + 1 };
        }
        return item;
      })
    );
  };

  const handleDeleteOutfit = (id: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        itemCount={items.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'wardrobe' && (
          <WardrobeView
            items={items}
            onToggleFavorite={handleToggleFavorite}
            onIncrementWear={handleIncrementWear}
            onAnalyze={(item) => setAnalyzingItem(item)}
            onDelete={handleDeleteItem}
            onOpenAddItem={() => setIsAddItemOpen(true)}
            onGoToOutfitGenerator={() => setActiveTab('outfit')}
          />
        )}

        {activeTab === 'outfit' && (
          <OutfitGeneratorView
            wardrobeItems={items}
            onSaveOutfit={handleSaveOutfit}
            onWearOutfit={handleWearOutfit}
            onOpenEmailModal={(outfit) => setEmailingOutfit(outfit)}
          />
        )}

        {activeTab === 'scanner' && (
          <ScannerLabView
            wardrobeItems={items}
            onAddAnalyzedItem={handleAddItem}
            onOpenAddItem={() => setIsAddItemOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <OutfitCalendarView
            savedOutfits={savedOutfits}
            wardrobeItems={items}
            onWearOutfit={handleWearOutfit}
            onDeleteOutfit={handleDeleteOutfit}
            onOpenEmailModal={(outfit) => setEmailingOutfit(outfit)}
            onGoToGenerator={() => setActiveTab('outfit')}
          />
        )}

        {activeTab === 'capsule' && (
          <CapsuleAuditView
            items={items}
            onOpenAddItem={() => setIsAddItemOpen(true)}
          />
        )}
      </main>

      {/* Mobile Ergonomic Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAddItem={handleAddItem}
      />

      <ClothingAnalysisModal
        item={analyzingItem}
        onClose={() => setAnalyzingItem(null)}
      />

      <EmailOutfitModal
        outfit={emailingOutfit}
        wardrobeItems={items}
        onClose={() => setEmailingOutfit(null)}
      />
    </div>
  );
}
