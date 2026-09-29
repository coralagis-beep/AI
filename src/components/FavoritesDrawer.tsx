import React from 'react';
import type { Recipe } from '../types';
import { X, Bookmark, Trash2, ExternalLink, UtensilsCrossed } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveFavorite: (recipeId: string) => void;
  onClearFavorites: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectRecipe,
  onRemoveFavorite,
  onClearFavorites,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Bookmark className="w-5 h-5 fill-amber-700/30" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                我的料理收藏庫
              </h3>
              <span className="text-xs text-stone-500">
                已儲存 {favorites.length} 道美味食譜
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {favorites.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-3 text-stone-300">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-stone-700">目前尚無收藏食譜</p>
              <p className="text-xs text-stone-500 mt-1">
                在食譜卡片上點擊「書籤圖示」，即可永久收藏在此處隨時查閱。
              </p>
            </div>
          ) : (
            favorites.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 rounded-2xl border border-stone-200/90 bg-white hover:border-amber-300 transition-all shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-bold">
                      {recipe.equipment}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      ⏱ {recipe.estimatedTime}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFavorite(recipe.id)}
                    className="text-stone-300 hover:text-red-600 transition-colors p-1"
                    title="移除收藏"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-stone-900 text-base group-hover:text-amber-700 transition-colors mb-1">
                  {recipe.name}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1 mb-3">
                  {recipe.tagline}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRecipe(recipe);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>查看完整步驟</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearFavorites}
              className="text-xs text-stone-400 hover:text-red-600 font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空所有收藏</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900 cursor-pointer"
            >
              關閉
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
