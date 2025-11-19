import React from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer,
  MapPin,
  Search,
  Navigation,
  Loader2,
  ArrowUp,
  ArrowDown,
  Gauge,
  Eye,
  Leaf,
  AlertTriangle,
  X
} from 'lucide-react';

export const getWeatherIcon = (condition: string, className: string = "w-6 h-6") => {
  const lower = condition.toLowerCase();
  if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className={`text-blue-400 ${className}`} />;
  if (lower.includes('storm') || lower.includes('thunder')) return <CloudLightning className={`text-purple-500 ${className}`} />;
  if (lower.includes('snow') || lower.includes('ice')) return <CloudSnow className={`text-cyan-300 ${className}`} />;
  if (lower.includes('cloud') || lower.includes('overcast')) return <Cloud className={`text-gray-400 ${className}`} />;
  if (lower.includes('clear') || lower.includes('sun')) return <Sun className={`text-yellow-400 ${className}`} />;
  if (lower.includes('wind')) return <Wind className={`text-slate-400 ${className}`} />;
  return <Sun className={`text-yellow-400 ${className}`} />; // Default
};

export { 
  Wind, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Search, 
  Navigation, 
  Loader2,
  ArrowUp,
  ArrowDown,
  Gauge,
  Eye,
  Leaf,
  AlertTriangle,
  X
};