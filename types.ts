export interface AQI {
  index: number; // US AQI standard 0-500
  category: string; // e.g., "Good", "Moderate"
  description: string; // Short health implication
}

export interface WeatherCondition {
  temp: number;
  condition: string;
  humidity: string;
  windSpeed: string;
  feelsLike: number;
  pressure?: string;
  uvIndex?: string;
  aqi?: AQI;
}

export interface ForecastDay {
  day: string; // e.g., "Monday" or "Tomorrow"
  date: string; // e.g., "Oct 25"
  tempHigh: number;
  tempLow: number;
  condition: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherAlert {
  title: string; // e.g. "Severe Thunderstorm Warning"
  severity: 'advisory' | 'watch' | 'warning';
  description: string;
}

export interface WeatherData {
  location: string;
  coordinates?: Coordinates;
  current: WeatherCondition;
  forecast: ForecastDay[];
  alerts?: WeatherAlert[]; // New Alert field
  analysis?: string; 
  sources?: Array<{ title: string; uri: string; type: 'web' | 'map' }>;
}

export interface SearchState {
  query: string;
  loading: boolean;
  error: string | null;
}