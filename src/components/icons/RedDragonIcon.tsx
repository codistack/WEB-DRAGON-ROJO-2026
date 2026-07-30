import React from 'react';

export const RedDragonIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} inline-block filter drop-shadow-[0_0_10px_rgba(230,30,42,0.9)] transition-all duration-300 hover:scale-110`}
  >
    {/* Dragon Head Outer Wings/Horns */}
    <path
      d="M2 10C2 6.5 4.5 3 8 2.5C10.5 2 13 3 15 4.5C17.5 2.5 20.5 2 22 4C20 6.5 19.5 9 18 11.5C20.5 13.5 22 17 20 20.5C17 21 13.5 19.5 11 17C8.5 19.5 5 21 2 20C3.5 16.5 2.5 13 2 10Z"
      fill="url(#red_dragon_body_gradient)"
    />
    
    {/* Snout & Fiery Jaw */}
    <path
      d="M12 7C14.5 7 17 8.5 18 11C16.5 13 14 14.5 11.5 14C9 13.5 8 11 9 9C10 7.5 11 7 12 7Z"
      fill="#E61E2A"
    />
    
    {/* Fiery Flames from Dragon Mouth */}
    <path
      d="M17.5 11.5C20 11.5 22.5 10 23.5 8.5C22.5 12 21 14 18 14.5C18.5 13.5 18 12.5 17.5 11.5Z"
      fill="url(#fire_flame_gradient)"
      className="animate-pulse"
    />
    
    {/* Glowing Gold Dragon Eye */}
    <circle cx="13.5" cy="9.5" r="1.5" fill="#FFD700" className="animate-ping" />
    <circle cx="13.5" cy="9.5" r="1" fill="#111111" />

    {/* Fiery Scales / Crest */}
    <path d="M7 3.5L8.5 1L10 3.5H7ZM12 2L13.5 0L15 2H12Z" fill="#FF9F1C" />

    <defs>
      <linearGradient id="red_dragon_body_gradient" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF2A3B" />
        <stop offset="0.5" stopColor="#E61E2A" />
        <stop offset="0.85" stopColor="#900C16" />
        <stop offset="1" stopColor="#4A0008" />
      </linearGradient>

      <linearGradient id="fire_flame_gradient" x1="17.5" y1="8.5" x2="23.5" y2="14.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD700" />
        <stop offset="0.5" stopColor="#FF9F1C" />
        <stop offset="1" stopColor="#E61E2A" />
      </linearGradient>
    </defs>
  </svg>
);
