export type CategoryType = 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories';

export interface WardrobeItem {
  id: string;
  name: string;
  category: CategoryType;
  subCategory: string; // e.g. Gömlek, Blazer, Pantolon, Loafer, Tişört, Triko
  color: string;
  colorHex: string;
  fabric: string; // e.g. Keten, Kaşmir & Yün, Pamuk, Deri
  season: 'İlkbahar/Yaz' | 'Sonbahar/Kış' | 'Dört Mevsim';
  style: 'Old Money' | 'Minimalist' | 'Smart Casual' | 'Resmi' | 'Sokak Stili';
  formality: 'Günlük' | 'İş / Ofis' | 'Özel Davet' | 'Smart Casual';
  wearCount: number;
  price?: number;
  image?: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
}

export interface Outfit {
  id: string;
  title: string;
  selectedItemIds: string[];
  stylingAdvice: string;
  weatherNote: string;
  harmonyScore: number;
  occasion: string;
  occasionFit?: string;
  colorPalette?: string[];
  date: string;
  dayOfWeek?: string;
  worn: boolean;
}

export interface WeatherCondition {
  city: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface ClothingAnalysisResult {
  identifiedName: string;
  category: CategoryType;
  subCategory: string;
  colorName: string;
  colorHex: string;
  fabric: string;
  season: 'İlkbahar/Yaz' | 'Sonbahar/Kış' | 'Dört Mevsim';
  style: 'Old Money' | 'Minimalist' | 'Smart Casual' | 'Resmi' | 'Sokak Stili';
  capsuleScore: number;
  matchingColors: string[];
  stylingScenarios: {
    occasion: string;
    advice: string;
  }[];
  careTip: string;
}

export interface CapsuleAuditResult {
  capsuleRating: number;
  summary: string;
  strengths: string[];
  missingStaples: {
    item: string;
    reason: string;
    priority: 'Yüksek' | 'Orta';
  }[];
  colorBalanceAnalysis: string;
  versatilityTip: string;
}
