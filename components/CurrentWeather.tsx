import React from 'react';
import { WeatherData } from '../types';
import { getWeatherIcon, Wind, Droplets, Thermometer, Gauge, MapPin, Eye, Leaf } from './Icons';

interface CurrentWeatherProps {
  data: WeatherData;
}

const getAQIColor = (index: number) => {
  if (index <= 50) return 'bg-green-500';
  if (index <= 100) return 'bg-yellow-500';
  if (index <= 150) return 'bg-orange-500';
  if (index <= 200) return 'bg-red-500';
  if (index <= 300) return 'bg-purple-500';
  return 'bg-rose-900';
};

const getAQITextColor = (index: number) => {
  if (index <= 50) return 'text-green-300';
  if (index <= 100) return 'text-yellow-300';
  if (index <= 150) return 'text-orange-300';
  if (index <= 200) return 'text-red-300';
  if (index <= 300) return 'text-purple-300';
  return 'text-rose-300';
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { current, location, analysis, coordinates, sources } = data;

  // Find a map link if it exists in sources, or construct one
  const mapSource = sources?.find(s => s.type === 'map');
  const mapUrl = mapSource?.uri || (coordinates ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lon}` : null);

  const aqiColorClass = current.aqi ? getAQIColor(current.aqi.index) : 'bg-gray-500';
  const aqiTextClass = current.aqi ? getAQITextColor(current.aqi.index) : 'text-gray-300';

  return (
    <div className="w-full space-y-6 mb-8 animate-fade-in">
      {/* Main Weather Card */}
      <div className="w-full bg-white/20 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border border-white/30 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          
          {/* Location & Temp */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-blue-100 text-sm font-bold uppercase tracking-wider mb-2 bg-blue-900/30 w-fit px-3 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              <span>{coordinates ? `${coordinates.lat.toFixed(2)}, ${coordinates.lon.toFixed(2)}` : 'Location'}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{location}</h2>
            
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl shadow-inner border border-white/10 backdrop-blur-sm">
                {getWeatherIcon(current.condition, "w-20 h-20")}
              </div>
              <div>
                <div className="text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-blue-100">
                  {Math.round(current.temp)}°
                </div>
                <div className="text-xl font-medium text-blue-100 mt-1">{current.condition}</div>
              </div>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <StatCard icon={<Wind />} label="Wind" value={current.windSpeed} />
            <StatCard icon={<Droplets />} label="Humidity" value={current.humidity} />
            <StatCard icon={<Thermometer />} label="Feels Like" value={`${Math.round(current.feelsLike)}°`} />
            <StatCard icon={<Gauge />} label="Pressure" value={current.pressure || "N/A"} />
          </div>
        </div>

        {/* AQI Section */}
        {current.aqi && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className={`p-3 rounded-full ${aqiColorClass} bg-opacity-20`}>
                <Leaf className={`w-6 h-6 ${aqiTextClass}`} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-sm font-bold uppercase tracking-wider text-blue-200">Air Quality Index</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 ${aqiTextClass}`}>
                    {current.aqi.index} AQI
                  </span>
                </div>
                <div className="text-lg font-semibold">{current.aqi.category}</div>
                <div className="text-sm text-blue-100/70">{current.aqi.description}</div>
              </div>
            </div>
          </div>
        )}

        {/* Map Button */}
        {mapUrl && (
          <div className="mt-6 border-t border-white/10 pt-4 flex justify-end">
            <a 
              href={mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-all group text-blue-50 hover:text-white hover:shadow-lg"
            >
              <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
              View on Google Maps
            </a>
          </div>
        )}
      </div>

      {/* AI Analysis Card ("WeatherNext 2" Feature) */}
      {analysis && (
        <div className="w-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-xl rounded-3xl p-6 text-white shadow-lg border border-white/20 flex items-start gap-4">
          <div className="p-3 bg-white/10 rounded-full shrink-0">
            <Eye className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200 mb-1">WeatherNext 2 Analysis</h3>
            <p className="text-lg leading-relaxed font-light text-white/95">
              {analysis}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center min-w-[110px] transition-colors group">
    <div className="text-blue-200 mb-2 group-hover:scale-110 transition-transform duration-300 w-5 h-5 [&>svg]:w-full [&>svg]:h-full">
      {icon}
    </div>
    <span className="text-xs text-blue-200/80 uppercase tracking-wide mb-1">{label}</span>
    <span className="text-lg font-bold">{value}</span>
  </div>
);