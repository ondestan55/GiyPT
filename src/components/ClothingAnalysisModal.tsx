import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ShieldAlert } from 'lucide-react';
import { WardrobeItem, ClothingAnalysisResult } from '../types';
import { ClothingItemGraphic } from './ClothingItemGraphic';

interface ClothingAnalysisModalProps {
  item: WardrobeItem | null;
  onClose: () => void;
}

export const ClothingAnalysisModal: React.FC<ClothingAnalysisModalProps> = ({ item, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ClothingAnalysisResult | null>(null);

  useEffect(() => {
    if (!item) return;

    let isMounted = true;
    setLoading(true);

    const runAnalysis = async () => {
      try {
        const res = await fetch('/api/ai/analyze-clothing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            category: item.category,
            details: `${item.subCategory}, ${item.color}, ${item.fabric}, ${item.season}`,
          }),
        });

        if (res.ok && isMounted) {
          const data = await res.json();
          setAnalysis(data);
        }
      } catch (err) {
        console.error('Analysis error:', err);
        if (isMounted) {
          setAnalysis({
            identifiedName: item.name,
            category: item.category,
            subCategory: item.subCategory,
            colorName: item.color,
            colorHex: item.colorHex,
            fabric: item.fabric,
            season: item.season,
            style: item.style,
            capsuleScore: 90,
            matchingColors: ['#1C1917', '#E5DCCF', '#3E2723', '#2C3E50'],
            stylingScenarios: [
              {
                occasion: 'Gündüz & Kahve',
                advice: 'Ham denim veya keten pantolonla kombinleyerek dengeli bir hafta sonu stili yakalayın.',
              },
              {
                occasion: 'Ofis & Toplantı',
                advice: 'Koyu lacivert veya antrasit yün kumaşlarla eşleştirerek saygın bir iş silüeti oluşturun.',
              },
              {
                occasion: 'Akşam & Yemek',
                advice: 'Deri kemer ve loafer ayakkabı ile ton sür ton bir derinlik katarak akşam şıklığını tamamlayın.',
              },
            ],
            careTip: 'Kumaş yapısını korumak için 30°C hassas yıkama veya kuru temizleme tercih edin.',
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E7E3DC] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E7E3DC] flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B5A2B]" />
            <h3 className="font-editorial text-xl font-semibold text-[#1C1917]">
              Akıllı Kıyafet & Stil Analizi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Top: Item Summary Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E7E3DC]">
            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#E7E3DC]">
              <ClothingItemGraphic
                category={item.category}
                subCategory={item.subCategory}
                colorHex={item.colorHex}
                imageUrl={item.image}
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs uppercase font-medium text-[#8B5A2B] tracking-wider">
                {item.subCategory} · {item.season}
              </span>
              <h4 className="font-editorial text-2xl font-semibold text-[#1C1917]">
                {item.name}
              </h4>
              <p className="text-xs text-[#57534E] mt-0.5">
                {item.fabric} · {item.color}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-6 h-6 border-2 border-[#1C1917]/20 border-t-[#1C1917] rounded-full animate-spin" />
              <p className="text-xs text-[#78716C]">
                Kıyafet dokusu, renk armonisi ve kapsül uyumluluğu taranıyor...
              </p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Metric Row: Capsule Score & Match Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    Kapsül Gardırop Uyum Skoru
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-editorial text-3xl font-semibold text-[#8B5A2B] font-mono tabular-nums">
                      %{analysis.capsuleScore || 88}
                    </span>
                    <span className="text-xs text-[#78716C]">Çok Yönlü Baz Parça</span>
                  </div>
                  <div className="w-full bg-[#E7E3DC] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#8B5A2B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.capsuleScore || 88}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                    En İyi Uyumlu Renk Paleti
                  </span>
                  <div className="flex items-center gap-2.5 mt-2">
                    {(analysis.matchingColors || ['#1C1917', '#FAF8F5', '#8B5A2B', '#3E2723']).map((hex, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-8 h-8 rounded-full border border-stone-300 shadow-xs"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                        <span className="text-[10px] font-mono text-[#78716C] mt-1 uppercase">
                          {hex.slice(1, 4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 Styling Scenarios */}
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-3">
                  3 Farklı Ortamda Nasıl Kombinlenir?
                </h5>
                <div className="space-y-3">
                  {(analysis.stylingScenarios || []).map((sc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white border border-[#E7E3DC] rounded-xl flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#F5F2EB] text-[#8B5A2B] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-xs text-[#1C1917] block">
                          {sc.occasion}
                        </span>
                        <p className="text-xs text-[#57534E] mt-0.5 leading-relaxed">
                          {sc.advice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Care & Maintenance */}
              {analysis.careTip && (
                <div className="p-3.5 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl text-xs text-[#57534E] flex items-center gap-2">
                  <span className="font-semibold text-[#1C1917] shrink-0">Bakım Tavsiyesi:</span>
                  <span>{analysis.careTip}</span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#E7E3DC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#322E2B] rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
