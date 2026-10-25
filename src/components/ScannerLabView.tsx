import React, { useState } from 'react';
import { Camera, Sparkles, Upload, Check, Layers, AlertCircle, ArrowRight } from 'lucide-react';
import { WardrobeItem, ClothingAnalysisResult, CategoryType } from '../types';
import { ClothingItemGraphic } from './ClothingItemGraphic';
import { CameraCaptureModal } from './CameraCaptureModal';

interface ScannerLabViewProps {
  wardrobeItems: WardrobeItem[];
  onAddAnalyzedItem: (item: WardrobeItem) => void;
  onOpenAddItem: () => void;
}

export const ScannerLabView: React.FC<ScannerLabViewProps> = ({
  wardrobeItems,
  onAddAnalyzedItem,
  onOpenAddItem,
}) => {
  const [selectedExistingId, setSelectedExistingId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ClothingAnalysisResult | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const handleScan = async (overrideImg?: string) => {
    const targetImage = overrideImg !== undefined ? overrideImg : imagePreview;
    if (!customTitle && !targetImage && !selectedExistingId) return;

    setLoading(true);
    setAnalysisResult(null);
    setAddedSuccess(false);

    try {
      const selectedItem = wardrobeItems.find((w) => w.id === selectedExistingId);
      const res = await fetch('/api/ai/analyze-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customTitle || selectedItem?.name || '',
          category: selectedItem?.category || 'tops',
          imageBase64: targetImage,
          details: selectedItem
            ? `${selectedItem.subCategory}, ${selectedItem.color}, ${selectedItem.fabric}`
            : 'Yeni kıyafet taraması',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error('Scan error:', err);
      // Fallback analysis
      setAnalysisResult({
        identifiedName: customTitle || 'Rafine Kaşmir & Yün Karışımı',
        category: 'tops',
        subCategory: 'Triko',
        colorName: 'Doğal Vizon Bej',
        colorHex: '#D6C7B2',
        fabric: '%85 Kaşmir, %15 İpek',
        season: 'Sonbahar/Kış',
        style: 'Old Money',
        capsuleScore: 94,
        matchingColors: ['#1C1917', '#FAF8F5', '#8B5A2B', '#2C3539'],
        stylingScenarios: [
          {
            occasion: 'Gündüz & Hafta Sonu',
            advice: 'Koyu selvedge denim pantolon ve beyaz minimalist sneaker ile zahmetsiz şıklık.',
          },
          {
            occasion: 'İş & Toplantı',
            advice: 'Taş rengi pileli yün pantolon ve deri penny loafer ile eşleştirerek saygın bir silüet yaratın.',
          },
          {
            occasion: 'Akşam Daveti',
            advice: 'Kruvaze antrasit blazer ceket altına katmanlayarak modern ve lüks bir duruş elde edin.',
          },
        ],
        careTip: 'Yumuşaklığını ve lif yapısını korumak için sadece kuru temizleme önerilir.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setSelectedExistingId('');
        handleScan(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectExisting = (id: string) => {
    setSelectedExistingId(id);
    const item = wardrobeItems.find((w) => w.id === id);
    if (item) {
      setCustomTitle(item.name);
      setImagePreview(item.image || null);
    }
  };

  const handleSaveToWardrobe = () => {
    if (!analysisResult) return;

    const newItem: WardrobeItem = {
      id: `w-${Date.now()}`,
      name: analysisResult.identifiedName,
      category: analysisResult.category || 'tops',
      subCategory: analysisResult.subCategory || 'Kıyafet',
      color: analysisResult.colorName || 'Doğal',
      colorHex: analysisResult.colorHex || '#E5DCCF',
      fabric: analysisResult.fabric || 'Doğal Lif',
      season: analysisResult.season || 'Dört Mevsim',
      style: analysisResult.style || 'Smart Casual',
      formality: 'Smart Casual',
      wearCount: 0,
      image: imagePreview || undefined,
      isFavorite: false,
      tags: [analysisResult.subCategory, analysisResult.style],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddAnalyzedItem(newItem);
    setAddedSuccess(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#8B5A2B] uppercase tracking-wider mb-1">
          <span>Kıyafet & Kumaş Laboratuvarı</span>
          <span aria-hidden="true">·</span>
          <span>Stil Analizi</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Kıyafet ve Renk Analizi
        </h1>
        <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
          Gardırobunuzdaki herhangi bir parçayı veya yeni aldığınız bir kıyafeti taratın; yapay zekâ kumaşını, uyumlu renklerini ve 3 farklı kullanım formülünü çıkarsın.
        </p>
      </div>

      {/* Input Selection Grid */}
      <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: Select from current wardrobe */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
              Dolaptaki Bir Parçayı Seç
            </label>
            <select
              value={selectedExistingId}
              onChange={(e) => handleSelectExisting(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
            >
              <option value="">Dolaptan bir kıyafet seçin...</option>
              {wardrobeItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.subCategory} - {item.color})
                </option>
              ))}
            </select>
          </div>

          {/* Option B: Write a custom clothing title or search */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
              Veya Kıyafet Adı / Türü Yazın
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => {
                setCustomTitle(e.target.value);
                setSelectedExistingId('');
              }}
              placeholder="Örn: Balıksırtı yün palto, İtalyan keten gömlek..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
            />
          </div>
        </div>

        {/* Photo Upload Area */}
        <div className="pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
            Fotoğraf Yükle veya Kamera ile Çek (İsteğe Bağlı)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FAF8F5] rounded-xl border border-dashed border-[#D1C7BD]">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-[#E7E3DC] flex items-center justify-center shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6 text-[#A8A29E]" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#1C1917] hover:bg-[#322E2B] text-white rounded-lg shadow-xs transition-colors shrink-0"
                >
                  <Camera className="w-3.5 h-3.5 text-[#E5DCCF]" />
                  <span>Kamerayı Aç & Çek</span>
                </button>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white hover:bg-[#F5F2EB] border border-[#D1C7BD] text-[#1C1917] rounded-lg transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Dosyadan Seç</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <p className="text-[11px] text-[#78716C]">
                Kıyafetin dokusunu, rengini ve detaylarını kameradan anında çekebilir veya galeriden yükleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => handleScan()}
            disabled={loading || (!customTitle && !imagePreview && !selectedExistingId)}
            className="w-full py-3 px-6 rounded-xl bg-[#1C1917] hover:bg-[#322E2B] disabled:opacity-50 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-[0.99]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Kumaş ve Renk Analizi Yapılıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E5DCCF]" />
                <span>Kıyafeti Analiz Et</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F5F2EB]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
                <span>{analysisResult.category}</span>
                <span aria-hidden="true">·</span>
                <span>{analysisResult.season}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#8B5A2B]">{analysisResult.style}</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                {analysisResult.identifiedName}
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                Kumaş: <strong>{analysisResult.fabric}</strong> · Renk: <strong>{analysisResult.colorName}</strong>
              </p>
            </div>

            {!selectedExistingId && (
              <button
                onClick={handleSaveToWardrobe}
                disabled={addedSuccess}
                className="px-4 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#322E2B] disabled:bg-emerald-600 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Dolaba Eklendi</span>
                  </>
                ) : (
                  <>
                    <span>Bu Parçayı Dolabıma Ekle</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] block">
                Kapsül Gardırop Çok Yönlülük Puanı
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-4xl font-semibold text-[#8B5A2B] font-mono tabular-nums">
                  %{analysisResult.capsuleScore}
                </span>
                <span className="text-xs text-[#78716C]">/ 100</span>
              </div>
              <p className="text-xs text-[#57534E]">
                Farklı silüetlerle kolayca eşleşen, gardırobun temel direği sayılabilecek yüksek değerli bir parça.
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] block">
                Uyumlu Renk Paleti Tavsiyesi
              </span>
              <div className="flex items-center gap-3 pt-1">
                {(analysisResult.matchingColors || []).map((hex, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full border border-stone-300 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                    <span className="text-[10px] font-mono text-[#78716C] mt-1 uppercase">
                      {hex.slice(1, 4)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#57534E] pt-1">
                Bu renklerle bir araya getirildiğinde ton sür ton veya dengeli kontrast sağlar.
              </p>
            </div>
          </div>

          {/* 3 Styling Scenarios */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-4">
              3 Farklı Senaryo için Stil Formülü
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(analysisResult.stylingScenarios || []).map((sc, i) => (
                <div
                  key={i}
                  className="p-5 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-medium text-[#8B5A2B] uppercase tracking-wider">
                      Senaryo {i + 1}
                    </span>
                    <h4 className="font-editorial text-lg font-semibold text-[#1C1917] mt-0.5">
                      {sc.occasion}
                    </h4>
                    <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                      {sc.advice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Care Tip */}
          {analysisResult.careTip && (
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl text-xs text-[#44403C]">
              <strong className="text-[#1C1917]">Kumaş Bakım ve Ömür Uzatma Tavsiyesi:</strong>{' '}
              {analysisResult.careTip}
            </div>
          )}
        </div>
      )}

      {/* Live Camera Stream Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => {
          setImagePreview(img);
          setSelectedExistingId('');
          handleScan(img);
        }}
      />
    </div>
  );
};
