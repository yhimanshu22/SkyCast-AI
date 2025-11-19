import React from 'react';
import { WeatherAlert } from '../types';
import { AlertTriangle, X } from './Icons';

interface AlertBannerProps {
  alerts?: WeatherAlert[];
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  // We display the most severe alert first or just the first one
  const alert = alerts[0];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'warning':
        return 'bg-red-600/90 border-red-500 shadow-red-900/50';
      case 'watch':
        return 'bg-orange-500/90 border-orange-400 shadow-orange-900/50';
      case 'advisory':
      default:
        return 'bg-yellow-500/90 border-yellow-400 shadow-yellow-900/50';
    }
  };

  return (
    <div className={`w-full mb-6 rounded-2xl border backdrop-blur-md shadow-xl overflow-hidden animate-fade-in-down ${getSeverityColor(alert.severity)}`}>
      <div className="p-4 flex items-start gap-4 relative">
        <div className="p-2 bg-white/20 rounded-full shrink-0 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-extrabold uppercase tracking-wider text-xs bg-white/20 px-2 py-0.5 rounded text-white">
              {alert.severity}
            </span>
            <h3 className="font-bold text-white leading-none">{alert.title}</h3>
          </div>
          <p className="text-white/90 text-sm leading-relaxed font-medium">
            {alert.description}
          </p>
        </div>

        <button 
          onClick={onDismiss}
          className="p-1 text-white/60 hover:text-white hover:bg-white/20 rounded-full transition-colors absolute top-2 right-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};