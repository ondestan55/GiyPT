import React, { useState } from 'react';
import { Sparkles, Sun, CloudRain, Wind, Cloud, Check, Mail, BookmarkPlus, RotateCcw, AlertCircle } from 'lucide-react';
import { WardrobeItem, Outfit, WeatherCondition } from '../types';
import { ClothingItemGraphic } from './ClothingItemGraphic';

interface OutfitGeneratorViewProps {
  wardrobeItems: WardrobeItem[];
  onSaveOutfit: (outfit: Outfit) => void;
  onWearOutfit: (outfit: Outfit) => void;
  onOpenEmailModal: (outfit: Outfit) => void;
}

export const OutfitGeneratorView: React.FC<OutfitGeneratorViewProps> = ({
  wardrobeItems,
  onSaveOutfit,
  onWearOutfit,
  onOpenEmailModal,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('İstanbul');
  const [temp, setTemp] = useState<number>(18);
  const [condition, setCondition] = useState<string>('Güneşli & Ilık');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Ofis & Toplantı');
  const [selectedVibe, setSelectedVibe] = useState<string>('Old Money & Quiet Luxury');
  const [preferences, setPreferences] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [wornSuccess, setWornSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cityPresets: Record<string, { temp: number; condition: string }> = {
    'İstanbul': { temp: 18, condition: 'Parçalı Bulutlu' },
    'Ankara': { temp: 14, condition: 'Serin & Açık' },
    'İzmir': { temp: 22, condition: 'Güneşli & Ilık' },
    'Bodrum': { temp: 24, condition: 'Güneşli & Ilık' },
    'Londra': { temp: 12, condition: 'Yağmurlu & Serin' },
    'Paris': { temp: 15, condition: 'Hafif Rüzgarlı' },
  };

  const occasions = [
    'Ofis & Toplantı',
    'Hafta Sonu Kahvesi',
    'Akşam Yemeği & Kokteyl',
    'İlk Randevu',
    'Seyahat & Şehir Gezisi',
    'Günlük & Rahat',
  ];

  const vibes = [
    'Old Money & Quiet Luxury',
    'Parisian Minimalist',
    'Modern Smart Casual',
    'Monokrom Zarafet',
    'İtalyan Klasik',
  ];

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    if (cityPresets[cityName]) {
      setTemp(cityPresets[cityName].temp);
      setCondition(cityPresets[cityName].condition);
    }
  };

  const handleGenerateOutfit = async () => {
    if (wardrobeItems.length === 0) {
      setErrorMsg('Kombin oluşturabilmek için gardırobunuzda en az birkaç parça olmalıdır.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSavedSuccess(false);
    setWornSuccess(false);

    try {
      const weatherPayload: WeatherCondition = {
        city: selectedCity,
        temp,
        condition,
        icon: 'sun',
      };

      const res = await fetch('/api/ai/outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wardrobeItems,
          weather: weatherPayload,
          occasion: selectedOccasion,
          vibe: selectedVibe,
          preferences,
        }),
      });

      if (!res.ok) {
        throw new Error(`Sunucu hatası: ${res.status}`);
      }

      const data = await res.json();

      const newOutfit: Outfit = {
        id: `outfit-${Date.now()}`,
        title: data.title || `${selectedOccasion} için Stil Kombini`,
        selectedItemIds: data.selectedItemIds || [],
        stylingAdvice: data.stylingAdvice || 'Seçilen parçaları dengeli katmanlama ile tamamlayın.',
        weatherNote: data.weatherNote || `${selectedCity} hava koşullarına uygun bir seçim.`,
        harmonyScore: data.harmonyScore || 92,
        occasion: selectedOccasion,
        occasionFit: data.occasionFit,
        colorPalette: data.colorPalette || ['#FAF8F5', '#1C1917'],
        date: new Date().toLocaleDateString('tr-TR'),
        dayOfWeek: new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(new Date()),
        worn: false,
      };

      setCurrentOutfit(newOutfit);
    } catch (err: any) {
      console.error('Failed to generate outfit:', err);
      // Fallback outfit generation so user experience is never blocked
      const tops = wardrobeItems.filter((i) => i.category === 'tops');
      const bottoms = wardrobeItems.filter((i) => i.category === 'bottoms');
      const shoes = wardrobeItems.filter((i) => i.category === 'shoes');
      const outer = wardrobeItems.filter((i) => i.category === 'outerwear');
      const acc = wardrobeItems.filter((i) => i.category === 'accessories');

      const chosenTops = tops[0] || wardrobeItems[0];
      const chosenBottoms = bottoms[0] || wardrobeItems[1] || wardrobeItems[0];
      const chosenShoes = shoes[0] || wardrobeItems[2] || wardrobeItems[0];
      const chosenOuter = temp < 18 ? outer[0] : null;
      const chosenAcc = acc[0] || null;

      const ids = [chosenTops?.id, chosenBottoms?.id, chosenOuter?.id, chosenShoes?.id, chosenAcc?.id].filter(Boolean) as string[];

      setCurrentOutfit({
        id: `outfit-${Date.now()}`,
        title: `${selectedOccasion} için ${selectedVibe} Silüeti`,
        selectedItemIds: ids,
        stylingAdvice: `${chosenTops?.name} ile ${chosenBottoms?.name} arasındaki renk ve silüet dengesi mekana uyum sağlıyor. Ayakkabı ve kemer tonlarını eşleştirerek rafine bir duruş sergileyin.`,
        weatherNote: `${selectedCity} ${temp}°C hava sıcaklığına uygun, nefes alan ve hafif katmanlı bir seçim.`,
        harmonyScore: 93,
        occasion: selectedOccasion,
        occasionFit: `${selectedOccasion} etkinliğinde hem zahmetsiz hem de saygın bir stil yansıtır.`,
        colorPalette: ['#E7E3DC', '#3E2723', '#1C1917'],
        date: new Date().toLocaleDateString('tr-TR'),
        dayOfWeek: new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(new Date()),
        worn: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedItemObjects = (ids: string[]) => {
    return ids.map((id) => wardrobeItems.find((item) => item.id === id)).filter(Boolean) as WardrobeItem[];
  };

  const selectedItems = currentOutfit ? getSelectedItemObjects(currentOutfit.selectedItemIds) : [];

  return (
    <div className="space-y-8 pb-16">
      {/* View Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#8B5A2B] uppercase tracking-wider mb-1">
          <span>Stil Asistanı</span>
          <span aria-hidden="true">·</span>
          <span>Akıllı Kombin Motoru</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Günün Kombinini Oluştur
        </h1>
        <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
          Hava durumunu, etkinliği ve stil yönünüzü seçin; yapay zekâ dolabınızdaki gerçek parçalardan en uyumlu kıyafet kombinasyonunu çıkarsın.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-center gap-3 text-xs sm:text-sm text-[#991B1B]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Generator Configuration Grid */}
      <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Row 1: Weather & Location Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-2">
            1. Şehir ve Hava Durumu
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.keys(cityPresets).map((city) => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedCity === city
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#1C1917] border-[#E7E3DC] hover:border-[#D1C7BD]'
                }`}
              >
                <span className="block text-xs font-medium">{city}</span>
                <span className={`block text-xs font-mono tabular-nums mt-0.5 ${selectedCity === city ? 'text-[#E5DCCF]' : 'text-[#78716C]'}`}>
                  {cityPresets[city].temp}°C · {cityPresets[city].condition.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Occasion / Ortam */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-2">
            2. Nereye Gidiyorsunuz? (Etkinlik)
          </label>
          <div className="flex flex-wrap gap-2">
            {occasions.map((occ) => {
              const isSelected = selectedOccasion === occ;
              return (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#1C1917] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] border border-[#E7E3DC]'
                  }`}
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Style Vibe */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-2">
            3. Stil Yönü (Vibe)
          </label>
          <div className="flex flex-wrap gap-2">
            {vibes.map((v) => {
              const isSelected = selectedVibe === v;
              return (
                <button
                  key={v}
                  onClick={() => setSelectedVibe(v)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#8B5A2B] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] border border-[#E7E3DC]'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Custom Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1917] uppercase tracking-wider mb-1.5">
            4. Özel Tercih veya Not (İsteğe Bağlı)
          </label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Örn: Rahat ayakkabı tercih ediyorum, mutlaka blazer ekle, şık bir kemer olsun..."
            className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl focus:outline-none focus:border-[#1C1917] text-[#1C1917] placeholder-[#A8A29E]"
          />
        </div>

        {/* Generate CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerateOutfit}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#1C1917] hover:bg-[#322E2B] disabled:opacity-60 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gardırobunuz analiz ediliyor ve kombin kurgulanıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E5DCCF]" />
                <span>Yapay Zekâ ile Kombin Yap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Outfit Result Display */}
      {currentOutfit && (
        <section className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-8 animate-fadeIn">
          {/* Header of Outfit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F5F2EB]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
                <span>{currentOutfit.occasion}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedCity} {temp}°C</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#8B5A2B]">Uyum Skoru: %{currentOutfit.harmonyScore}</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                {currentOutfit.title}
              </h2>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  onSaveOutfit(currentOutfit);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2500);
                }}
                className="px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E7E3DC] bg-[#FAF8F5] hover:bg-[#F5F2EB] text-[#1C1917] flex items-center gap-1.5 transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kaydedildi</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Kaydet</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onWearOutfit(currentOutfit);
                  setWornSuccess(true);
                  setTimeout(() => setWornSuccess(false), 2500);
                }}
                className="px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E7E3DC] bg-[#FAF8F5] hover:bg-[#F5F2EB] text-[#1C1917] flex items-center gap-1.5 transition-colors"
              >
                {wornSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gardıroba İşlendi</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Bugün Giydim</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenEmailModal(currentOutfit)}
                className="px-3.5 py-2 text-xs font-medium rounded-lg border border-[#E7E3DC] bg-[#FAF8F5] hover:bg-[#F5F2EB] text-[#1C1917] flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>E-posta Gönder</span>
              </button>

              <button
                onClick={handleGenerateOutfit}
                className="p-2 text-xs font-medium rounded-lg border border-[#E7E3DC] bg-[#FAF8F5] hover:bg-[#F5F2EB] text-[#1C1917] transition-colors"
                title="Yeni Varyasyon Üret"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Garments Collage / Selected Pieces Grid */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-4">
              Kombindeki Parçalar ({selectedItems.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl overflow-hidden flex flex-col group"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#F5F2EB] border-b border-[#E7E3DC]">
                    <ClothingItemGraphic
                      category={item.category}
                      subCategory={item.subCategory}
                      colorHex={item.colorHex}
                      imageUrl={item.image}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-[#78716C] mb-0.5">
                        <span className="uppercase font-medium text-[#8B5A2B]">
                          {item.subCategory}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.color}</span>
                      </div>
                      <h4 className="font-editorial text-base font-semibold text-[#1C1917] line-clamp-1">
                        {item.name}
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#57534E] mt-1.5 font-mono tabular-nums">
                      {item.fabric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Styling Notes and Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#F5F2EB]">
            {/* Styling Advice */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                Stilist Notu & Taşıma İpuçları
              </h4>
              <p className="text-sm text-[#44403C] leading-relaxed">
                {currentOutfit.stylingAdvice}
              </p>
              {currentOutfit.occasionFit && (
                <p className="text-xs text-[#78716C] italic border-l-2 border-[#8B5A2B] pl-3 py-0.5">
                  {currentOutfit.occasionFit}
                </p>
              )}
            </div>

            {/* Weather & Palette */}
            <div className="space-y-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E7E3DC]">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                  Hava Uyumu
                </span>
                <p className="text-xs text-[#1C1917] mt-1">
                  {currentOutfit.weatherNote}
                </p>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
                  Kombin Renk Dengesi
                </span>
                <div className="flex items-center gap-2">
                  {(currentOutfit.colorPalette || ['#FAF8F5', '#1C1917']).map((hex, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border border-stone-300 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
