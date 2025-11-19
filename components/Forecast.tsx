import React from 'react';
import { ForecastDay } from '../types';
import { getWeatherIcon, ArrowUp, ArrowDown } from './Icons';

interface ForecastProps {
  forecast: ForecastDay[];
}

export const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  return (
    <div className="w-full bg-white/20 backdrop-blur-xl rounded-3xl p-6 text-white shadow-2xl border border-white/30">
      <h3 className="text-xl font-semibold mb-6 px-2">5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <div 
            key={index} 
            className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-between gap-3 hover:bg-white/20 transition-colors"
          >
            <div className="text-center">
              <p className="font-bold">{day.day}</p>
              <p className="text-xs text-blue-200">{day.date}</p>
            </div>
            
            <div className="p-2 bg-white/10 rounded-full">
              {getWeatherIcon(day.condition, "w-8 h-8")}
            </div>

            <div className="w-full flex justify-between items-center px-2 text-sm">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3 text-red-300" />
                <span className="font-bold">{Math.round(day.tempHigh)}°</span>
              </div>
              <div className="flex items-center gap-1 text-blue-200">
                <ArrowDown className="w-3 h-3 text-blue-300" />
                <span>{Math.round(day.tempLow)}°</span>
              </div>
            </div>
            <p className="text-xs text-center opacity-80 truncate w-full">{day.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};