import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddItem: () => void;
  itemCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddItem,
  itemCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('wardrobe')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <span className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1917] group-hover:text-[#8B5A2B] transition-colors whitespace-nowrap">
              Dolabımda Ne Var
            </span>
            <span className="text-[11px] font-sans font-medium uppercase tracking-widest text-[#8B5A2B] bg-[#F0EBE1] px-2 py-0.5 rounded">
              AI
            </span>
          </button>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#78716C]">
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'wardrobe'
                  ? 'text-[#1C1917] border-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              Gardırobum ({itemCount})
            </button>
            <button
              onClick={() => setActiveTab('outfit')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'outfit'
                  ? 'text-[#1C1917] border-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              AI Kombin
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'scanner'
                  ? 'text-[#1C1917] border-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              Kıyafet Analizi
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'calendar'
                  ? 'text-[#1C1917] border-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              Kombin Takvimi
            </button>
            <button
              onClick={() => setActiveTab('capsule')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'capsule'
                  ? 'text-[#1C1917] border-[#1C1917] font-semibold'
                  : 'border-transparent hover:text-[#1C1917]'
              }`}
            >
              Kapsül Raporu
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1C1917] rounded-lg hover:bg-[#322E2B] transition-colors whitespace-nowrap shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Parça Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
