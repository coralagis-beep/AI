import React from 'react';
import { Sparkles, Bookmark, UtensilsCrossed, RotateCcw } from 'lucide-react';

interface HeaderProps {
  favoriteCount: number;
  onOpenFavorites: () => void;
  onReset: () => void;
  hasResults: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  favoriteCount,
  onOpenFavorites,
  onReset,
  hasResults,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="回首頁"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-stone-800 tracking-tight group-hover:text-amber-700 transition-colors">
                日常食譜小幫手
              </span>
              <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-md">
                AI 智慧清冰箱
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">把現有食材交給 AI，輕鬆做出好料理</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasResults && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white rounded-xl border border-stone-200 shadow-2xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新輸入</span>
            </button>
          )}

          <button
            onClick={onOpenFavorites}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-900 bg-amber-100/90 hover:bg-amber-200 rounded-xl border border-amber-300/60 shadow-2xs transition-all cursor-pointer relative"
          >
            <Bookmark className="w-4 h-4 text-amber-700 fill-amber-700/20" />
            <span>我的收藏</span>
            {favoriteCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold bg-amber-600 text-white rounded-full">
                {favoriteCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
