import React from 'react';
import { Calendar as CalendarIcon, Check, Trash2, Mail, Sparkles } from 'lucide-react';
import { Outfit, WardrobeItem } from '../types';
import { ClothingItemGraphic } from './ClothingItemGraphic';

interface OutfitCalendarViewProps {
  savedOutfits: Outfit[];
  wardrobeItems: WardrobeItem[];
  onWearOutfit: (outfit: Outfit) => void;
  onDeleteOutfit: (id: string) => void;
  onOpenEmailModal: (outfit: Outfit) => void;
  onGoToGenerator: () => void;
}

export const OutfitCalendarView: React.FC<OutfitCalendarViewProps> = ({
  savedOutfits,
  wardrobeItems,
  onWearOutfit,
  onDeleteOutfit,
  onOpenEmailModal,
  onGoToGenerator,
}) => {
  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  const getItemsForOutfit = (ids: string[]) => {
    return ids.map((id) => wardrobeItems.find((w) => w.id === id)).filter(Boolean) as WardrobeItem[];
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#8B5A2B] uppercase tracking-wider mb-1">
            <span>Stil Ajandası</span>
            <span aria-hidden="true">·</span>
            <span>Haftalık Planlayıcı</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            Kombin Takvimi & Kayıtlılar
          </h1>
          <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
            Önceden planlanmış kombinlerinizi görüntüleyin, haftanızı organize edin ve giydikçe dolabınızı güncelleyin.
          </p>
        </div>

        <button
          onClick={onGoToGenerator}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C1917] hover:bg-[#322E2B] text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#E5DCCF]" />
          <span>Yeni Kombin Planla</span>
        </button>
      </div>

      {/* Weekly Visual Strip */}
      <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-editorial text-xl font-semibold text-[#1C1917] flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#8B5A2B]" />
          <span>Bu Haftanın Kombin Akışı</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {daysOfWeek.map((day, idx) => {
            const outfitForDay = savedOutfits[idx % Math.max(1, savedOutfits.length)];
            const hasOutfit = Boolean(outfitForDay);
            const items = hasOutfit ? getItemsForOutfit(outfitForDay.selectedItemIds) : [];

            return (
              <div
                key={day}
                className="p-3 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <span className="text-xs font-semibold text-[#1C1917] block">
                    {day}
                  </span>
                  {hasOutfit ? (
                    <div className="mt-2">
                      <span className="text-[11px] font-medium text-[#8B5A2B] line-clamp-1 block">
                        {outfitForDay.occasion}
                      </span>
                      <p className="text-xs font-editorial font-semibold text-[#1C1917] line-clamp-2 mt-0.5">
                        {outfitForDay.title}
                      </p>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#A8A29E] mt-3 block">
                      Henüz planlanmadı
                    </span>
                  )}
                </div>

                {hasOutfit && items.length > 0 && (
                  <div className="flex items-center -space-x-2 mt-3 overflow-hidden">
                    {items.slice(0, 3).map((it) => (
                      <div
                        key={it.id}
                        className="w-7 h-7 rounded-full border border-white shadow-xs overflow-hidden bg-white shrink-0"
                        title={it.name}
                      >
                        <ClothingItemGraphic
                          category={it.category}
                          subCategory={it.subCategory}
                          colorHex={it.colorHex}
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-[#E5DCCF] text-[10px] font-mono font-medium text-[#1C1917] flex items-center justify-center border border-white">
                        +{items.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Outfits List */}
      <div className="space-y-4">
        <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
          Kayıtlı Kombinler ({savedOutfits.length})
        </h3>

        {savedOutfits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedOutfits.map((outfit) => {
              const items = getItemsForOutfit(outfit.selectedItemIds);
              return (
                <div
                  key={outfit.id}
                  className="bg-white border border-[#E7E3DC] rounded-2xl p-5 shadow-sm space-y-4 hover:border-[#D1C7BD] transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                        <span>{outfit.occasion}</span>
                        <span aria-hidden="true">·</span>
                        <span>{outfit.date}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-[#8B5A2B]">Uyum: %{outfit.harmonyScore}</span>
                      </div>
                      <h4 className="font-editorial text-xl font-semibold text-[#1C1917] mt-1">
                        {outfit.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEmailModal(outfit)}
                        className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors"
                        title="E-posta ile Gönder"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteOutfit(outfit.id)}
                        className="p-1.5 rounded-lg text-[#A8A29E] hover:text-[#DC2626] hover:bg-[#F5F2EB] transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Garment Preview Row */}
                  <div className="grid grid-cols-4 gap-2">
                    {items.slice(0, 4).map((it) => (
                      <div
                        key={it.id}
                        className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E7E3DC] bg-[#FAF8F5]"
                        title={it.name}
                      >
                        <ClothingItemGraphic
                          category={it.category}
                          subCategory={it.subCategory}
                          colorHex={it.colorHex}
                          imageUrl={it.image}
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                    {outfit.stylingAdvice}
                  </p>

                  <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-between">
                    <button
                      onClick={() => onWearOutfit(outfit)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                        outfit.worn
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-[#1C1917] text-white hover:bg-[#322E2B]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{outfit.worn ? 'Bugün Giyildi' : 'Bugün Giydim'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {(outfit.colorPalette || []).map((hex, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-stone-300"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white border border-[#E7E3DC] rounded-2xl">
            <CalendarIcon className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
            <h4 className="font-editorial text-lg font-semibold text-[#1C1917]">
              Henüz kaydedilmiş kombin yok
            </h4>
            <p className="text-xs text-[#78716C] mt-1 max-w-xs mx-auto">
              AI Kombin sekmesinden günün havasına veya özel etkinliğinize göre kombin oluşturup buraya kaydedebilirsiniz.
            </p>
            <button
              onClick={onGoToGenerator}
              className="mt-4 px-4 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#322E2B] rounded-lg transition-colors"
            >
              Hemen Kombin Oluştur
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
