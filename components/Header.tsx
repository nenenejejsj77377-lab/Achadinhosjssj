import React from 'react';
import { ShoppingBag, Search, Store } from 'lucide-react';

interface HeaderProps {
  onSearch: (term: string) => void;
  storeUrl: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, storeUrl }) => {
  return (
    <header className="sticky top-0 z-50 bg-shopee-orange shadow-md">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-white">
            <ShoppingBag className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">Achadinhos AI</h1>
          </div>
          <a 
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs text-white font-medium transition-colors"
          >
            <Store size={14} />
            <span>Ir para Loja</span>
          </a>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar nos achadinhos..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm placeholder-gray-400"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>
    </header>
  );
};