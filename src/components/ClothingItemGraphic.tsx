import React from 'react';

interface ClothingItemGraphicProps {
  category: string;
  subCategory?: string;
  colorHex: string;
  className?: string;
  imageUrl?: string;
}

export const ClothingItemGraphic: React.FC<ClothingItemGraphicProps> = ({
  category,
  subCategory = '',
  colorHex,
  className = 'w-full h-full',
  imageUrl,
}) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={subCategory || category}
        referrerPolicy="no-referrer"
        className={`object-cover ${className}`}
        onError={(e) => {
          // Fallback to SVG if image fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const sub = (subCategory || '').toLowerCase();
  const cat = (category || '').toLowerCase();

  // Helper colors
  const primary = colorHex || '#4A3E3D';
  const shade = '#1A1817';

  // SVG Renderers based on clothing type
  if (sub.includes('blazer') || sub.includes('ceket')) {
    return (
      <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
        <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm transition-transform hover:scale-105 duration-200" fill="none">
          {/* Blazer Silhouette */}
          <path
            d="M 28 20 L 12 40 L 16 100 L 84 100 L 88 40 L 72 20 Z"
            fill={primary}
            stroke={shade}
            strokeWidth="1.5"
          />
          {/* Lapels */}
          <path d="M 28 20 L 44 65 L 50 65 L 50 20 Z" fill="#FFFFFF" fillOpacity="0.1" stroke={shade} strokeWidth="1.2" />
          <path d="M 72 20 L 56 65 L 50 65 L 50 20 Z" fill="#000000" fillOpacity="0.1" stroke={shade} strokeWidth="1.2" />
          {/* Inner Shirt Collar */}
          <path d="M 42 20 L 50 35 L 58 20 Z" fill="#FAF8F5" stroke="#D1C7BD" strokeWidth="1" />
          {/* Buttons */}
          <circle cx="50" cy="74" r="2" fill="#E5DCCF" stroke={shade} strokeWidth="0.8" />
          <circle cx="50" cy="86" r="2" fill="#E5DCCF" stroke={shade} strokeWidth="0.8" />
          {/* Breast Pocket */}
          <line x1="30" y1="52" x2="40" y2="52" stroke={shade} strokeWidth="1.2" />
          {/* Side pockets */}
          <line x1="22" y1="84" x2="36" y2="84" stroke={shade} strokeWidth="1.2" />
          <line x1="64" y1="84" x2="78" y2="84" stroke={shade} strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  if (sub.includes('gömlek') || sub.includes('shirt')) {
    return (
      <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
        <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm transition-transform hover:scale-105 duration-200" fill="none">
          {/* Shirt Body */}
          <path
            d="M 30 18 L 15 32 L 20 100 L 80 100 L 85 32 L 70 18 Z"
            fill={primary}
            stroke={shade}
            strokeWidth="1.5"
          />
          {/* Placket */}
          <rect x="47" y="24" width="6" height="76" fill="#000000" fillOpacity="0.05" stroke={shade} strokeWidth="0.8" />
          {/* Collar */}
          <path d="M 30 18 L 42 28 L 50 22 L 58 28 L 70 18 Z" fill={primary} stroke={shade} strokeWidth="1.5" />
          {/* Buttons */}
          <circle cx="50" cy="34" r="1.5" fill="#FAF8F5" stroke={shade} strokeWidth="0.8" />
          <circle cx="50" cy="50" r="1.5" fill="#FAF8F5" stroke={shade} strokeWidth="0.8" />
          <circle cx="50" cy="66" r="1.5" fill="#FAF8F5" stroke={shade} strokeWidth="0.8" />
          <circle cx="50" cy="82" r="1.5" fill="#FAF8F5" stroke={shade} strokeWidth="0.8" />
          {/* Pocket */}
          <path d="M 60 42 L 72 42 L 72 56 L 66 60 L 60 56 Z" fill="none" stroke={shade} strokeWidth="0.8" strokeDasharray="2 1" />
        </svg>
      </div>
    );
  }

  if (sub.includes('triko') || sub.includes('kazak') || sub.includes('hırka')) {
    return (
      <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
        <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm transition-transform hover:scale-105 duration-200" fill="none">
          {/* Knit Sweater */}
          <path
            d="M 32 18 L 12 36 L 18 98 L 82 98 L 88 36 L 68 18 Z"
            fill={primary}
            stroke={shade}
            strokeWidth="1.5"
          />
          {/* Ribbed Hem & Cuffs */}
          <rect x="18" y="93" width="64" height="5" fill="#000000" fillOpacity="0.08" stroke={shade} strokeWidth="0.8" />
          {/* Crew Neck Collar */}
          <ellipse cx="50" cy="20" rx="14" ry="7" fill={primary} stroke={shade} strokeWidth="1.5" />
          {/* Subtle Knit Texture Lines */}
          <path d="M 36 38 C 36 60, 36 75, 36 90" stroke={shade} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="3 3" />
          <path d="M 50 32 C 50 55, 50 75, 50 90" stroke={shade} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="3 3" />
          <path d="M 64 38 C 64 60, 64 75, 64 90" stroke={shade} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="3 3" />
        </svg>
      </div>
    );
  }

  if (sub.includes('tişört') || sub.includes('t-shirt') || cat === 'tops') {
    return (
      <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
        <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm transition-transform hover:scale-105 duration-200" fill="none">
          {/* T-Shirt */}
          <path
            d="M 34 18 L 10 32 L 20 48 L 26 44 L 24 100 L 76 100 L 74 44 L 80 48 L 90 32 L 66 18 Z"
            fill={primary}
            stroke={shade}
            strokeWidth="1.5"
          />
          {/* Ribbed Collar */}
          <path d="M 36 18 C 42 26, 58 26, 64 18" fill="none" stroke={shade} strokeWidth="1.5" />
          <path d="M 36 18 C 44 23, 56 23, 64 18" fill="none" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  if (cat === 'bottoms' || sub.includes('pantolon') || sub.includes('jean') || sub.includes('şort')) {
    const isShort = sub.includes('şort');
    const bottomY = isShort ? 65 : 105;
    return (
      <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
        <svg viewBox="0 0 100 120" className="w-22 h-28 drop-shadow-sm transition-transform hover:scale-105 duration-200" fill="none">
          {/* Trousers / Jeans */}
          <path
            d={`M 26 14 L 74 14 L 70 ${bottomY} L 54 ${bottomY} L 50 48 L 46 ${bottomY} L 30 ${bottomY} Z`}
            fill={primary}
            stroke={shade}
            strokeWidth="1.5"
          />
          {/* Waistband */}
          <path d="M 26 14 L 74 14 L 74 20 L 26 20 Z" fill="#000000" fillOpacity="0.08" stroke={shade} strokeWidth="1" />
          {/* Fly Placket */}
          <path d="M 50 20 L 50 38 C 50 44, 46 46, 42 44" fill="none" stroke={shade} strokeWidth="1" />
          {/* Belt Loops */}
          <line x1="34" y1="14" x2="34" y2="20" stroke={shade} strokeWidth="1.2" />
          <line x1="66" y1="14" x2="66" y2="20" stroke={shade} strokeWidth="1.2" />
          {/* Front Crease */}
          {!sub.includes('jean') && (
            <>
              <line x1="38" y1="28" x2="40" y2={bottomY} stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="0.8" />
              <line x1="62" y1="28" x2="60" y2={bottomY} stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="0.8" />
            </>
          )}
        </svg>
      </div>
    );
  }

  if (cat === 'outerwear' || sub.includes('trençkot') || sub.includes('palto')) {
    return (
      <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
        <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-sm transition-transform hover:scale-105 duration-200" fill="none">
          {/* Trench / Overcoat */}
          <path
            d="M 28 16 L 8 36 L 14 108 L 86 108 L 92 36 L 72 16 Z"
            fill={primary}
            stroke={shade}
            strokeWidth="1.5"
          />
          {/* Wide Collar */}
          <path d="M 28 16 L 46 44 L 50 44 L 50 16 Z" fill="#000000" fillOpacity="0.1" stroke={shade} strokeWidth="1.2" />
          <path d="M 72 16 L 54 44 L 50 44 L 50 16 Z" fill="#000000" fillOpacity="0.1" stroke={shade} strokeWidth="1.2" />
          {/* Waist Belt */}
          <rect x="20" y="58" width="60" height="7" fill="#000000" fillOpacity="0.15" stroke={shade} strokeWidth="1" />
          {/* Buckle */}
          <rect x="46" y="56" width="8" height="11" fill="#E5DCCF" stroke={shade} strokeWidth="1" />
          {/* Double Breasted Buttons */}
          <circle cx="42" cy="38" r="2" fill="#3E2723" stroke={shade} strokeWidth="0.8" />
          <circle cx="58" cy="38" r="2" fill="#3E2723" stroke={shade} strokeWidth="0.8" />
          <circle cx="42" cy="50" r="2" fill="#3E2723" stroke={shade} strokeWidth="0.8" />
          <circle cx="58" cy="50" r="2" fill="#3E2723" stroke={shade} strokeWidth="0.8" />
          <circle cx="42" cy="74" r="2" fill="#3E2723" stroke={shade} strokeWidth="0.8" />
          <circle cx="58" cy="74" r="2" fill="#3E2723" stroke={shade} strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  if (cat === 'shoes' || sub.includes('loafer') || sub.includes('sneaker') || sub.includes('çizme')) {
    const isSneaker = sub.includes('sneaker');
    return (
      <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
        <svg viewBox="0 0 120 80" className="w-28 h-20 drop-shadow-sm transition-transform hover:scale-105 duration-200" fill="none">
          {/* Shoe Outline */}
          <path
            d="M 16 52 C 16 38, 30 28, 48 30 C 64 32, 88 40, 102 46 C 108 48, 110 58, 104 62 L 14 62 C 12 58, 16 54, 16 52 Z"
            fill={primary}
            stroke={shade}
            strokeWidth="1.5"
          />
          {/* Sole */}
          <path
            d="M 12 62 L 106 62 C 108 62, 108 66, 104 68 L 14 68 C 10 68, 10 62, 12 62 Z"
            fill={isSneaker ? '#FFFFFF' : '#3E2723'}
            stroke={shade}
            strokeWidth="1.2"
          />
          {/* Heel */}
          {!isSneaker && (
            <rect x="14" y="68" width="22" height="4" fill="#2E1C12" stroke={shade} strokeWidth="1" />
          )}
          {/* Loafer Penny Strap or Sneaker Laces */}
          {!isSneaker ? (
            <path d="M 44 32 C 48 34, 56 34, 60 36 L 58 48 L 42 44 Z" fill="#000000" fillOpacity="0.2" stroke={shade} strokeWidth="1" />
          ) : (
            <g stroke="#FFFFFF" strokeWidth="1.2">
              <line x1="44" y1="36" x2="52" y2="40" />
              <line x1="52" y1="38" x2="60" y2="42" />
              <line x1="60" y1="40" x2="68" y2="44" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Accessories (Saat, Kemer, etc.)
  if (sub.includes('saat') || sub.includes('watch')) {
    return (
      <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-sm transition-transform hover:scale-105 duration-200" fill="none">
          {/* Watch Strap */}
          <rect x="42" y="8" width="16" height="84" rx="2" fill="#2E1C12" stroke={shade} strokeWidth="1.2" />
          {/* Watch Case */}
          <circle cx="50" cy="50" r="22" fill={primary} stroke={shade} strokeWidth="1.5" />
          {/* Bezel Ring */}
          <circle cx="50" cy="50" r="18" fill="#1C1917" stroke="#A8A29E" strokeWidth="0.8" />
          {/* Dial Hands */}
          <line x1="50" y1="50" x2="50" y2="38" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="50" x2="60" y2="50" stroke="#FAF8F5" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="2" fill="#E5DCCF" />
        </svg>
      </div>
    );
  }

  // General Accessories / Fallback
  return (
    <div className={`flex items-center justify-center p-4 bg-[#F5F2EB] ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <div
          className="w-14 h-14 rounded-full border border-stone-300 shadow-sm flex items-center justify-center"
          style={{ backgroundColor: primary }}
        >
          <div className="w-6 h-6 rounded-full border border-white/40" />
        </div>
        <span className="text-[11px] font-medium text-stone-500 mt-2 tracking-wide uppercase">
          {subCategory || category}
        </span>
      </div>
    </div>
  );
};
