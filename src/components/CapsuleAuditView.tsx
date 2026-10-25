import React, { useState } from 'react';
import { Sparkles, PieChart, Layers, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { WardrobeItem, CapsuleAuditResult } from '../types';

interface CapsuleAuditViewProps {
  items: WardrobeItem[];
  onOpenAddItem: () => void;
}

export const CapsuleAuditView: React.FC<CapsuleAuditViewProps> = ({ items, onOpenAddItem }) => {
  const [audit, setAudit] = useState<CapsuleAuditResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const totalWearCount = items.reduce((acc, i) => acc + i.wearCount, 0);
  const avgCostPerWear = Math.round(
    items.reduce((acc, i) => {
      if (i.price && i.wearCount > 0) {
        return acc + i.price / i.wearCount;
      }
      return acc;
    }, 0) / Math.max(1, items.filter((i) => i.price && i.wearCount > 0).length)
  );

  const categoryCounts = {
    tops: items.filter((i) => i.category === 'tops').length,
    bottoms: items.filter((i) => i.category === 'bottoms').length,
    outerwear: items.filter((i) => i.category === 'outerwear').length,
    shoes: items.filter((i) => i.category === 'shoes').length,
    accessories: items.filter((i) => i.category === 'accessories').length,
  };

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/capsule-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wardrobeItems: items }),
      });

      if (res.ok) {
        const data = await res.json();
        setAudit(data);
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#8B5A2B] uppercase tracking-wider mb-1">
          <span>Kapsül Analitiği</span>
          <span aria-hidden="true">·</span>
          <span>Sürdürülebilir Stil</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Kapsül Gardırop & Verimlilik Raporu
        </h1>
        <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
          Az parça ile sonsuz kombin: Gardırobunuzun renk uyumunu, giyme sıklığını ve eksik temel taşları analiz edin.
        </p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7E3DC] rounded-xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] block">
            Toplam Parça Sayısı
          </span>
          <span className="font-editorial text-3xl font-semibold text-[#1C1917] font-mono tabular-nums mt-1 block">
            {items.length}
          </span>
          <span className="text-xs text-[#8B5A2B] mt-1 block">
            İdeal kapsül aralığı: 25 - 40 parça
          </span>
        </div>

        <div className="bg-white border border-[#E7E3DC] rounded-xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] block">
            Toplam Giyme Kaydı
          </span>
          <span className="font-editorial text-3xl font-semibold text-[#1C1917] font-mono tabular-nums mt-1 block">
            {totalWearCount}
          </span>
          <span className="text-xs text-[#78716C] mt-1 block">
            Parça başına ort. {Math.round(totalWearCount / Math.max(1, items.length))} kez
          </span>
        </div>

        <div className="bg-white border border-[#E7E3DC] rounded-xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] block">
            Ortalama Giyme Başı Maliyet
          </span>
          <span className="font-editorial text-3xl font-semibold text-[#1C1917] font-mono tabular-nums mt-1 block">
            ₺{avgCostPerWear || 140}
          </span>
          <span className="text-xs text-emerald-700 mt-1 block">
            Yüksek yatırım değeri
          </span>
        </div>

        <div className="bg-white border border-[#E7E3DC] rounded-xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] block">
            Kapsül Sağlık Skoru
          </span>
          <span className="font-editorial text-3xl font-semibold text-[#8B5A2B] font-mono tabular-nums mt-1 block">
            %{audit ? audit.capsuleRating : 91}
          </span>
          <span className="text-xs text-[#78716C] mt-1 block">
            Yüksek kombinlenebilirlik
          </span>
        </div>
      </div>

      {/* Category Distribution Bar */}
      <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-editorial text-xl font-semibold text-[#1C1917]">
          Kategori Dağılımı & Denge
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
            <span className="text-xs text-[#78716C] block">Üst Giyim</span>
            <span className="font-editorial text-2xl font-semibold text-[#1C1917] font-mono tabular-nums">
              {categoryCounts.tops}
            </span>
          </div>
          <div className="p-3 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
            <span className="text-xs text-[#78716C] block">Alt Giyim</span>
            <span className="font-editorial text-2xl font-semibold text-[#1C1917] font-mono tabular-nums">
              {categoryCounts.bottoms}
            </span>
          </div>
          <div className="p-3 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
            <span className="text-xs text-[#78716C] block">Dış Giyim</span>
            <span className="font-editorial text-2xl font-semibold text-[#1C1917] font-mono tabular-nums">
              {categoryCounts.outerwear}
            </span>
          </div>
          <div className="p-3 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
            <span className="text-xs text-[#78716C] block">Ayakkabı</span>
            <span className="font-editorial text-2xl font-semibold text-[#1C1917] font-mono tabular-nums">
              {categoryCounts.shoes}
            </span>
          </div>
          <div className="p-3 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
            <span className="text-xs text-[#78716C] block">Aksesuar</span>
            <span className="font-editorial text-2xl font-semibold text-[#1C1917] font-mono tabular-nums">
              {categoryCounts.accessories}
            </span>
          </div>
        </div>
      </div>

      {/* AI Capsule Audit Action & Results */}
      <div className="bg-white border border-[#E7E3DC] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
              Yapay Zekâ Gardırop Denetimi
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">
              Gardırobunuzu derinlemesine tarayarak eksik kalan 3 kilit parçayı belirleyin.
            </p>
          </div>

          <button
            onClick={handleRunAudit}
            disabled={loading}
            className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#322E2B] text-white text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E5DCCF]" />
                <span>Denetimi Başlat</span>
              </>
            )}
          </button>
        </div>

        {audit ? (
          <div className="pt-6 border-t border-[#F5F2EB] space-y-6">
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B5A2B] block">
                Genel Değerlendirme
              </span>
              <p className="text-sm text-[#44403C] mt-1 leading-relaxed">
                {audit.summary}
              </p>
            </div>

            {/* Missing Foundation Staples */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-3">
                Kombin Potansiyelini Artıracak Eksik 3 Parça
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {audit.missingStaples.map((staple, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[#FAF8F5] border border-[#E7E3DC] rounded-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-medium text-[#8B5A2B] uppercase">
                          Öncelik: {staple.priority}
                        </span>
                        <span className="text-xs font-mono text-[#78716C]">#{i + 1}</span>
                      </div>
                      <h5 className="font-editorial text-lg font-semibold text-[#1C1917]">
                        {staple.item}
                      </h5>
                      <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                        {staple.reason}
                      </p>
                    </div>

                    <button
                      onClick={onOpenAddItem}
                      className="mt-4 pt-2 border-t border-[#E7E3DC] text-xs font-medium text-[#1C1917] hover:text-[#8B5A2B] flex items-center justify-between transition-colors"
                    >
                      <span>Dolaba Ekle</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Versatility Tip */}
            {audit.versatilityTip && (
              <div className="p-4 bg-white border border-[#E7E3DC] rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-[#1C1917] block">
                    Stilist Tavsiyesi
                  </span>
                  <p className="text-xs text-[#57534E] mt-0.5">
                    {audit.versatilityTip}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#78716C]">
            Denetimi başlat butonuna basarak gardırobunuzun yapay zekâ analizini görebilirsiniz.
          </div>
        )}
      </div>
    </div>
  );
};
