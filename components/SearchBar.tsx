import React, { useState } from 'react';
import { Search, Navigation, Loader2 } from './Icons';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationRequest: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationRequest, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto mb-8 group">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-blue-200 w-5 h-5" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search city..."
          disabled={isLoading}
          className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white placeholder-blue-200 rounded-full py-3 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
        />
        <button
          type="button"
          onClick={onLocationRequest}
          disabled={isLoading}
          className="absolute right-2 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white disabled:opacity-50"
          title="Use current location"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
        </button>
      </div>
    </form>
  );
};