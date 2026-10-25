import React, { useState } from 'react';
import { X, Upload, Sparkles, Check, Camera, Image as ImageIcon, Video } from 'lucide-react';
import { WardrobeItem, CategoryType } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: WardrobeItem) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('tops');
  const [subCategory, setSubCategory] = useState<string>('Gömlek');
  const [color, setColor] = useState<string>('Kum Beji');
  const [colorHex, setColorHex] = useState<string>('#D6C7B2');
  const [fabric, setFabric] = useState<string>('Keten & Pamuk');
  const [season, setSeason] = useState<'İlkbahar/Yaz' | 'Sonbahar/Kış' | 'Dört Mevsim'>('Dört Mevsim');
  const [style, setStyle] = useState<'Old Money' | 'Minimalist' | 'Smart Casual' | 'Resmi' | 'Sokak Stili'>('Smart Casual');
  const [price, setPrice] = useState<string>('2400');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzingWithAI, setAnalyzingWithAI] = useState<boolean>(false);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const triggerAutoAnalysis = async (imgBase64: string) => {
    setAnalyzingWithAI(true);
    setAiNote('Yapay zekâ görseli inceliyor: kıyafet ismi, kategori, tür ve renk belirleniyor...');

    try {
      const res = await fetch('/api/ai/analyze-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || '',
          category,
          imageBase64: imgBase64,
          details: 'Kullanıcı kameradan/fotoğraftan yeni kıyafet ekledi',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.identifiedName) setName(data.identifiedName);
        if (data.category) setCategory(data.category);
        if (data.subCategory) setSubCategory(data.subCategory);
        if (data.colorName) setColor(data.colorName);
        if (data.colorHex) setColorHex(data.colorHex);
        if (data.fabric) setFabric(data.fabric);
        if (data.season) setSeason(data.season);
        if (data.style) setStyle(data.style);

        setAiNote('✨ Görsel başarıyla analiz edildi! Kıyafet adı, türü ve renk tonu otomatik dolduruldu.');
      } else {
        setAiNote('Detaylar kısmi olarak belirlendi. İsterseniz alanları düzenleyebilirsiniz.');
      }
    } catch (err) {
      console.error('AI scan error:', err);
      setAiNote('Görsel kaydedildi. Bilgileri dilediğiniz gibi düzenleyebilirsiniz.');
    } finally {
      setAnalyzingWithAI(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        triggerAutoAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualReAnalyze = () => {
    if (imagePreview) {
      triggerAutoAnalysis(imagePreview);
    } else {
      setAiNote('Lütfen önce bir kıyafet fotoğrafı çekin veya yükleyin.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: WardrobeItem = {
      id: `w-${Date.now()}`,
      name: name.trim(),
      category,
      subCategory: subCategory.trim() || 'Kıyafet',
      color: color.trim() || 'Doğal',
      colorHex: colorHex || '#1C1917',
      fabric: fabric.trim() || 'Karışımlı Kumaş',
      season,
      style,
      formality: 'Smart Casual',
      wearCount: 0,
      price: price ? parseFloat(price) : undefined,
      image: imagePreview || undefined,
      isFavorite: false,
      tags: [subCategory, style, season],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#E7E3DC] rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E7E3DC] flex items-center justify-between z-10">
          <div>
            <h3 className="font-editorial text-2xl font-semibold text-[#1C1917]">
              Gardıroba Yeni Parça Ekle
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Fotoğraf yükleyin veya detayları girerek gardırobunuzu zenginleştirin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo Upload & Camera Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
              Kıyafet Fotoğrafı (Kamera veya Dosya)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-28 h-28 rounded-xl border-2 border-dashed border-[#D1C7BD] bg-[#FAF8F5] overflow-hidden flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    {analyzingWithAI && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-center p-1 text-white space-y-1">
                        <div className="w-5 h-5 border-2 border-[#E5DCCF]/40 border-t-[#E5DCCF] rounded-full animate-spin" />
                        <span className="text-[10px] font-medium text-[#E5DCCF]">Taranıyor...</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors z-10"
                      title="Fotoğrafı Kaldır"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center text-[#A8A29E]">
                    <Camera className="w-7 h-7 mb-1" />
                    <span className="text-[10px]">Fotoğraf Yok</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#1C1917] hover:bg-[#322E2B] text-white shadow-xs transition-colors shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#E5DCCF]" />
                    <span>Kamerayı Aç & Çek</span>
                  </button>

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-white hover:bg-[#F5F2EB] text-[#1C1917] border border-[#D1C7BD] transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Dosyadan Seç</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleManualReAnalyze}
                    disabled={analyzingWithAI}
                    className="w-full py-1.5 px-3 text-xs font-medium rounded-lg bg-[#FAF8F5] hover:bg-[#F5F2EB] text-[#8B5A2B] border border-[#D1C7BD] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-[#8B5A2B]" />
                    <span>Yeniden Analiz Et</span>
                  </button>
                )}

                <p className="text-[11px] text-[#78716C]">
                  {analyzingWithAI
                    ? '⚡ Yapay zekâ görselden kıyafet ismi, rengi ve türünü otomatik çıkarıyor...'
                    : 'Kamerayla çektiğiniz anda isim, kategori, alt tür ve renk tonu yapay zekâ tarafından otomatik belirlenir.'}
                </p>
              </div>
            </div>

            {aiNote && (
              <div className={`mt-2.5 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                analyzingWithAI ? 'bg-[#F0EBE1] text-[#8B5A2B] animate-pulse' : 'bg-[#F5F2EB] text-[#8B5A2B]'
              }`}>
                {analyzingWithAI ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#8B5A2B]/20 border-t-[#8B5A2B] rounded-full animate-spin shrink-0" />
                ) : (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{aiNote}</span>
              </div>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
              Kıyafet İsmi *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: İtalyan Keten Gömlek, Kaşmir Triko, Selvedge Jean..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
            />
          </div>

          {/* Category & SubCategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
              >
                <option value="tops">Üst Giyim</option>
                <option value="bottoms">Alt Giyim</option>
                <option value="outerwear">Dış Giyim</option>
                <option value="shoes">Ayakkabı</option>
                <option value="accessories">Aksesuar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                Alt Tür
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Gömlek, Blazer, Pantolon, Loafer..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
              />
            </div>
          </div>

          {/* Color & ColorHex */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                Renk Tanımı
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Fildişi Krem, Antrasit, Lacivert..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                Renk Tonu Seçimi
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded border border-[#E7E3DC] bg-white cursor-pointer"
                />
                <input
                  type="text"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none text-[#1C1917]"
                />
              </div>
            </div>
          </div>

          {/* Fabric & Season */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                Kumaş / Materyal
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="%100 İtalyan Keteni, Kaşmir, Pamuk..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                Mevsim
              </label>
              <select
                value={season}
                onChange={(e: any) => setSeason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
              >
                <option value="Dört Mevsim">Dört Mevsim</option>
                <option value="İlkbahar/Yaz">İlkbahar / Yaz</option>
                <option value="Sonbahar/Kış">Sonbahar / Kış</option>
              </select>
            </div>
          </div>

          {/* Style & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                Stil
              </label>
              <select
                value={style}
                onChange={(e: any) => setStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
              >
                <option value="Old Money">Old Money & Quiet Luxury</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Smart Casual">Smart Casual</option>
                <option value="Resmi">Resmi / Business</option>
                <option value="Sokak Stili">Sokak Stili</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-1">
                Fiyat (₺) (Opsiyonel)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2400"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E7E3DC] rounded-lg focus:outline-none focus:border-[#1C1917] text-[#1C1917] font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 border-t border-[#F5F2EB] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-medium text-white bg-[#1C1917] hover:bg-[#322E2B] rounded-lg shadow-sm transition-colors active:scale-[0.98]"
            >
              Gardıroba Kaydet
            </button>
          </div>
        </form>
      </div>

      {/* Live Camera Stream Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => {
          setImagePreview(img);
          triggerAutoAnalysis(img);
        }}
      />
    </div>
  );
};
