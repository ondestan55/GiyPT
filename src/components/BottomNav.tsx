import React from 'react';
import { Layers, Sparkles, Scan, Calendar, PieChart } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'wardrobe', label: 'Gardırop', icon: Layers },
    { id: 'outfit', label: 'AI Kombin', icon: Sparkles },
    { id: 'scanner', label: 'Analiz', icon: Scan },
    { id: 'calendar', label: 'Takvim', icon: Calendar },
    { id: 'capsule', label: 'Kapsül', icon: PieChart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E7E3DC] pb-safe">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors focus:outline-none"
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'text-[#1C1917] scale-110' : 'text-[#A8A29E]'
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-[#1C1917] font-semibold' : 'text-[#A8A29E]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
