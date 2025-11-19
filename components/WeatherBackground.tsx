import React, { useMemo } from 'react';

interface WeatherBackgroundProps {
  condition?: string;
}

// Configuration for different weather types
const BACKGROUNDS = [
  {
    id: 'rain',
    keywords: ['rain', 'storm', 'drizzle', 'thunder', 'wet'],
    className: 'bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900'
  },
  {
    id: 'cloud',
    keywords: ['cloud', 'overcast', 'gloomy'],
    className: 'bg-gradient-to-br from-gray-600 via-slate-600 to-slate-800'
  },
  {
    id: 'sunny',
    keywords: ['sun', 'clear', 'fair', 'hot', 'bright'],
    className: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600'
  },
  {
    id: 'snow',
    keywords: ['snow', 'ice', 'blizzard', 'cold', 'freeze'],
    className: 'bg-gradient-to-br from-cyan-600 via-blue-700 to-blue-900'
  },
  {
    id: 'fog',
    keywords: ['fog', 'mist', 'haze', 'smoke'],
    className: 'bg-gradient-to-br from-gray-500 via-gray-500 to-slate-600'
  },
  // Default background (used as a base layer or fallback)
  {
    id: 'default',
    keywords: [],
    className: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800'
  }
];

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition }) => {
  // Determine the active background ID based on the condition string
  const activeId = useMemo(() => {
    if (!condition) return 'default';
    const lower = condition.toLowerCase();
    const match = BACKGROUNDS.find(bg => 
      bg.keywords.some(keyword => lower.includes(keyword))
    );
    return match ? match.id : 'default';
  }, [condition]);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] bg-slate-900">
      {/* Render all backgrounds, but only the active one has opacity 1 */}
      {BACKGROUNDS.map((bg) => (
        <div
          key={bg.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${bg.className} ${
            activeId === bg.id ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      ))}
      
      {/* Optional: Subtle noise or pattern overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>
    </div>
  );
};