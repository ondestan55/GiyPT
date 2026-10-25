import React from 'react';
import { Heart, Plus, Sparkles, Trash2 } from 'lucide-react';
import { WardrobeItem } from '../types';
import { ClothingItemGraphic } from './ClothingItemGraphic';

interface ClothingItemCardProps {
  item: WardrobeItem;
  onToggleFavorite: (id: string) => void;
  onIncrementWear: (id: string) => void;
  onAnalyze: (item: WardrobeItem) => void;
  onDelete: (id: string) => void;
}

export const ClothingItemCard: React.FC<ClothingItemCardProps> = ({
  item,
  onToggleFavorite,
  onIncrementWear,
  onAnalyze,
  onDelete,
}) => {
  return (
    <div className="group relative bg-white border border-[#E7E3DC] rounded-xl overflow-hidden hover:border-[#D1C7BD] hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Visual Image / Graphic Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F2EB] border-b border-[#E7E3DC]">
        <ClothingItemGraphic
          category={item.category}
          subCategory={item.subCategory}
          colorHex={item.colorHex}
          imageUrl={item.image}
          className="w-full h-full"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E7E3DC] flex items-center justify-center text-[#78716C] hover:text-[#E11D48] transition-colors focus:outline-none"
          title={item.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        >
          <Heart
            className={`w-4 h-4 ${
              item.isFavorite ? 'fill-[#E11D48] text-[#E11D48]' : ''
            }`}
          />
        </button>

        {/* Color Swatch Dot */}
        <div
          className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full border border-white/80 shadow-sm"
          style={{ backgroundColor: item.colorHex }}
          title={item.color}
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Section 1.A: Unboxed metadata with typographic separators - NO PILLS */}
          <div className="flex items-center gap-1.5 text-xs text-[#78716C] mb-1">
            <span className="uppercase tracking-wider font-medium text-[11px] text-[#8B5A2B]">
              {item.subCategory}
            </span>
            <span aria-hidden="true">·</span>
            <span>{item.season}</span>
            <span aria-hidden="true">·</span>
            <span>{item.style}</span>
          </div>

          <h3 className="font-editorial text-lg font-semibold text-[#1C1917] leading-snug line-clamp-1">
            {item.name}
          </h3>

          <p className="text-xs text-[#57534E] mt-1 line-clamp-1">
            {item.fabric} · {item.color}
          </p>
        </div>

        {/* Bottom Row: Wear Metrics & Actions */}
        <div className="mt-3 pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-[#78716C]">
          <div className="flex items-center gap-1 font-mono tabular-nums">
            <span className="font-medium text-[#1C1917]">{item.wearCount}</span>
            <span>kez giyildi</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onIncrementWear(item.id)}
              className="p-1.5 rounded hover:bg-[#F5F2EB] text-[#57534E] hover:text-[#1C1917] transition-colors"
              title="Bugün Giydim (+1)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAnalyze(item)}
              className="p-1.5 rounded hover:bg-[#F5F2EB] text-[#8B5A2B] hover:text-[#6D4421] transition-colors"
              title="AI ile Kombin ve Kumaş Analizi"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded hover:bg-[#F5F2EB] text-[#A8A29E] hover:text-[#DC2626] transition-colors"
              title="Sil"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
