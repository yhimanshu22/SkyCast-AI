import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { WeatherBackground } from './components/WeatherBackground';
import { AlertBanner } from './components/AlertBanner';
import { fetchWeather, fetchWeatherByCoords } from './services/geminiService';
import { WeatherData } from './types';
import { Loader2, CloudLightning } from 'lucide-react';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alertsDismissed, setAlertsDismissed] = useState<boolean>(false);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setAlertsDismissed(false); // Reset alerts on new search
    try {
      const data = await fetchWeather(city);
      setWeather(data);
    } catch (err) {
      setError("Unable to retrieve weather data. Please check the city name or try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    setAlertsDismissed(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByCoords(latitude, longitude);
          setWeather(data);
        } catch (err) {
          setError("Failed to get weather for your location.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError("Unable to retrieve your location. Please ensure location permissions are allowed.");
        console.error(err);
      }
    );
  }, []);

  return (
    <div className="min-h-screen relative font-sans text-slate-50 flex flex-col items-center p-4 md:p-8 overflow-hidden">
      {/* Dynamic Background Layer */}
      <WeatherBackground condition={weather?.current.condition} />

      <div className="z-10 w-full max-w-4xl flex flex-col gap-6 relative">
        
        {/* Header */}
        <header className="text-center py-6 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm shadow-lg ring-1 ring-white/20">
            <CloudLightning className="w-8 h-8 text-yellow-300 mr-2" />
            <h1 className="text-2xl font-bold tracking-tight">SkyCast <span className="font-extralight opacity-80">AI</span></h1>
          </div>
          <p className="text-blue-100 text-sm font-medium tracking-wide uppercase opacity-70">Powered by WeatherNext 2 Model</p>
        </header>

        {/* Search */}
        <div className="z-50 sticky top-4">
           <SearchBar 
            onSearch={handleSearch} 
            onLocationRequest={handleLocationRequest}
            isLoading={loading} 
          />
        </div>

        {/* Content Area */}
        <main className="flex-grow">
          {error && (
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-100 p-4 rounded-2xl text-center animate-shake mx-auto max-w-md shadow-lg">
              <p className="font-semibold">Error</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          )}

          {!weather && !loading && !error && (
            <div className="text-center text-white/40 mt-12 animate-pulse">
              <p className="text-lg font-light">Search for a city or use current location</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center mt-16 text-white/80">
              <Loader2 className="w-16 h-16 animate-spin mb-6 text-blue-300" />
              <p className="text-lg font-light animate-pulse">Initializing WeatherNext 2 Analysis...</p>
            </div>
          )}

          {weather && !loading && (
            <div className="animate-fade-in-up space-y-6">
              
              {/* Alerts Banner */}
              {!alertsDismissed && weather.alerts && weather.alerts.length > 0 && (
                <AlertBanner 
                  alerts={weather.alerts} 
                  onDismiss={() => setAlertsDismissed(true)} 
                />
              )}

              <CurrentWeather data={weather} />
              <Forecast forecast={weather.forecast} />
              
              {/* Sources / Footer */}
              <footer className="pt-8 pb-4 border-t border-white/10">
                {weather.sources && weather.sources.length > 0 && (
                  <div className="text-center space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-blue-200/50 font-bold">Verified Sources</p>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                      {weather.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-200/70 hover:text-white hover:underline transition-colors flex items-center gap-1"
                        >
                          {source.type === 'map' ? '🗺️' : '🔗'}
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-center text-white/20 mt-6">
                  Generated by Gemini 2.5 Flash • Google Search Grounding • Google Maps
                </p>
              </footer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;