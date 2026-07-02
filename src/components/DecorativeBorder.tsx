import React from 'react';

export default function DecorativeBorder() {
  return (
    <div className="flex items-center justify-center py-6 select-none opacity-80" id="decorative-border">
      <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
      <div className="mx-4 flex items-center gap-1.5 text-[#D4AF37]">
        {/* Sparkle */}
        <span className="text-xs animate-pulse">✦</span>
        {/* Diya SVG Icon */}
        <svg
          className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flame */}
          <path
            d="M12 2C12 2 15 5.5 15 8C15 10.5 13 12 12 12C11 12 9 10.5 9 8C9 5.5 12 2 12 2Z"
            className="text-[#FF9933] animate-bounce duration-1000"
          />
          {/* Base of Diya */}
          <path
            d="M4 14C4 18.5 7.5 21 12 21C16.5 21 20 18.5 20 14C20 14 16 16 12 16C8 16 4 14 4 14Z"
            fill="#D4AF37"
          />
          {/* Diya bottom decoration */}
          <circle cx="12" cy="18.5" r="1.5" fill="#7A0C1E" />
        </svg>
        <span className="text-xs animate-pulse">✦</span>
      </div>
      <div className="h-[1px] w-20 bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent"></div>
    </div>
  );
}

// Simple festive fairy lights banner
export function FairyLights() {
  return (
    <div className="w-full flex justify-between px-4 overflow-hidden select-none pointer-events-none absolute top-0 left-0 right-0 h-4 z-20" id="fairy-lights">
      {Array.from({ length: 16 }).map((_, i) => {
        const colors = [
          'bg-yellow-400 shadow-yellow-300',
          'bg-orange-500 shadow-orange-400',
          'bg-red-500 shadow-red-400',
          'bg-green-500 shadow-green-400',
        ];
        const color = colors[i % colors.length];
        const animationDelay = `${i * 0.15}s`;
        return (
          <div key={i} className="flex flex-col items-center flex-1">
            {/* Thread */}
            <div className="w-full h-[1px] bg-slate-600/40 rounded-full"></div>
            {/* Hanging bulb */}
            <div
              className={`w-1.5 h-2 rounded-full ${color} shadow-[0_0_8px_2px_rgba(255,255,255,0.5)] animate-ping duration-1000`}
              style={{ animationDelay }}
            ></div>
            <div
              className={`w-1.5 h-2 -mt-2 rounded-full ${color} shadow-[0_0_6px_1px_currentColor]`}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
