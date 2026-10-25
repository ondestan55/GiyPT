import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, Heart, Sparkles, X } from 'lucide-react';
import { WardrobeItem, CategoryType } from '../types';
import { ClothingItemCard } from './ClothingItemCard';

interface WardrobeViewProps {
  items: WardrobeItem[];
  onToggleFavorite: (id: string) => void;
  onIncrementWear: (id: string) => void;
  onAnalyze: (item: WardrobeItem) => void;
  onDelete: (id: string) => void;
  onOpenAddItem: () => void;
  onGoToOutfitGenerator: () => void;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  items,
  onToggleFavorite,
  onIncrementWear,
  onAnalyze,
  onDelete,
  onOpenAddItem,
  onGoToOutfitGenerator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'wear-desc' | 'name-asc' | 'recent'>('wear-desc');

  const categories: { id: string; label: string; count?: number }[] = [
    { id: 'all', label: 'Tüm Gardırop' },
    { id: 'tops', label: 'Üst Giyim' },
    { id: 'bottoms', label: 'Alt Giyim' },
    { id: 'outerwear', label: 'Dış Giyim' },
    { id: 'shoes', label: 'Ayakkabı' },
    { id: 'accessories', label: 'Aksesuar' },
  ];

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (seasonFilter !== 'all' && item.season !== seasonFilter && item.season !== 'Dört Mevsim') return false;
        if (onlyFavorites && !item.isFavorite) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchSub = item.subCategory.toLowerCase().includes(q);
          const matchColor = item.color.toLowerCase().includes(q);
          const matchFabric = item.fabric.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchSub && !matchColor && !matchFabric && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'wear-desc') return b.wearCount - a.wearCount;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'tr');
        if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [items, selectedCategory, seasonFilter, onlyFavorites, searchQuery, sortBy]);

  const topWornItem = useMemo(() => {
    return [...items].sort((a, b) => b.wearCount - a.wearCount)[0];
  }, [items]);

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Hero Banner & KPI Strip */}
      <section className="relative overflow-hidden bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-medium text-[#8B5A2B] uppercase tracking-wider mb-2">
            <span>Kişisel Gardırop & Stil Danışmanı</span>
            <span aria-hidden="true">·</span>
            <span>Versiyon 2026</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1C1917] text-balance">
            Dolabınızdaki her parça bir hikaye, her kombin rafine bir ifade.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#57534E] leading-relaxed max-w-2xl">
            Yapay zekâ stil motorumuz gardırobunuzdaki kumaşları, renkleri ve silüetleri analiz eder; günün hava koşullarına ve gideceğiniz mekana özel kusursuz kombinler üretir.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToOutfitGenerator}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] hover:bg-[#322E2B] text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm transition-colors active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#E5DCCF]" />
              <span>Günün Kombinini Oluştur</span>
            </button>
            <button
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#F5F2EB] text-[#1C1917] border border-[#D1C7BD] text-xs sm:text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Kıyafet Tara</span>
            </button>
          </div>
        </div>

        {/* 4-Metric Clean KPI Strip */}
        <div className="mt-8 pt-6 border-t border-[#F5F2EB] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="block text-xs text-[#78716C]">Kayıtlı Parça</span>
            <span className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917] font-mono tabular-nums">
              {items.length}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#78716C]">En Çok Giyilen</span>
            <span className="font-editorial text-lg sm:text-xl font-semibold text-[#1C1917] truncate block" title={topWornItem?.name}>
              {topWornItem ? topWornItem.name : '—'}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#78716C]">Favori Parçalar</span>
            <span className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917] font-mono tabular-nums">
              {items.filter((i) => i.isFavorite).length}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#78716C]">Kapsül Uyum Skoru</span>
            <span className="font-editorial text-2xl sm:text-3xl font-semibold text-[#8B5A2B] font-mono tabular-nums">
              %94
            </span>
          </div>
        </div>
      </section>

      {/* Control Bar: Categories, Search, Filters */}
      <section className="space-y-4">
        {/* Category Tabs: Segmented interactive control buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? items.length
                : items.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1C1917] text-white shadow-sm'
                    : 'bg-white text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F2EB] border border-[#E7E3DC]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F0EBE1] text-[#78716C]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar: Search, Season, Favorites, Sort */}
        <div className="bg-white border border-[#E7E3DC] rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Parça adı, kumaş, renk veya stil ara..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917] placeholder-[#A8A29E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
            >
              <option value="all">Tüm Mevsimler</option>
              <option value="İlkbahar/Yaz">İlkbahar / Yaz</option>
              <option value="Sonbahar/Kış">Sonbahar / Kış</option>
              <option value="Dört Mevsim">Dört Mevsim</option>
            </select>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
            >
              <option value="wear-desc">En Çok Giyilenler</option>
              <option value="recent">En Son Eklenenler</option>
              <option value="name-asc">Alfabetik (A-Z)</option>
            </select>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                onlyFavorites
                  ? 'bg-[#FFE4E6] text-[#E11D48] border-[#FDA4AF]'
                  : 'bg-[#FAF8F5] text-[#57534E] border-[#E7E3DC] hover:text-[#1C1917]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-[#E11D48]' : ''}`} />
              <span>Favoriler</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid of Clothes */}
      <section>
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <ClothingItemCard
                key={item.id}
                item={item}
                onToggleFavorite={onToggleFavorite}
                onIncrementWear={onIncrementWear}
                onAnalyze={onAnalyze}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white border border-[#E7E3DC] rounded-2xl">
            <SlidersHorizontal className="w-8 h-8 text-[#A8A29E] mx-auto mb-3" />
            <h3 className="font-editorial text-xl font-semibold text-[#1C1917]">
              Kıyafet bulunamadı
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-sm mx-auto">
              Arama kriterlerinize uygun parça bulunamadı. Filtreleri temizleyebilir veya gardırobunuza yeni bir parça ekleyebilirsiniz.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSeasonFilter('all');
                  setOnlyFavorites(false);
                }}
                className="px-4 py-2 text-xs font-medium text-[#1C1917] bg-[#F5F2EB] hover:bg-[#EAE4D9] rounded-lg transition-colors"
              >
                Filtreleri Sıfırla
              </button>
              <button
                onClick={onOpenAddItem}
                className="px-4 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#322E2B] rounded-lg transition-colors"
              >
                Yeni Parça Ekle
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
