import React from 'react';
import type { Recipe, CookingEquipment } from '../types';
import {
  Clock,
  Users,
  ChefHat,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  ExternalLink,
  Flame,
  Wind,
  Gauge,
  Layers,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails: (recipe: Recipe) => void;
  onSwapRecipe: (recipeId: string) => void;
  isSwapping?: boolean;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onViewDetails,
  onSwapRecipe,
  isSwapping = false,
  isFavorite,
  onToggleFavorite,
}) => {
  // Equipment icon helper
  const getEquipmentIcon = (eq: CookingEquipment) => {
    switch (eq) {
      case '電鍋':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case '瓦斯爐':
        return <Flame className="w-4 h-4 text-orange-600" />;
      case '壓力鍋':
        return <Gauge className="w-4 h-4 text-indigo-600" />;
      case '氣炸鍋':
        return <Wind className="w-4 h-4 text-rose-600" />;
    }
  };

  const getEquipmentBadgeColor = (eq: CookingEquipment) => {
    switch (eq) {
      case '電鍋':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case '瓦斯爐':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case '壓力鍋':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case '氣炸鍋':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  const { equipmentSpecifics, equipment } = recipe;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/90 hover:shadow-md hover:border-amber-300/80 transition-all flex flex-col justify-between relative group">
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${getEquipmentBadgeColor(
                equipment
              )}`}
            >
              {getEquipmentIcon(equipment)}
              <span>{equipment}</span>
            </span>

            <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              🟢 {recipe.difficulty}
            </span>

            {recipe.flavor && (
              <span className="px-2.5 py-1 rounded-xl text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                {recipe.flavor}
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite(recipe)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'bg-stone-100 text-stone-400 hover:text-amber-600 hover:bg-amber-50'
            }`}
            title={isFavorite ? '取消收藏' : '加入我的收藏'}
          >
            {isFavorite ? (
              <BookmarkCheck className="w-5 h-5 fill-amber-600" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Recipe Title & Tagline */}
        <h3 className="text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
          {recipe.name}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-3">
          {recipe.tagline}
        </p>

        {/* Meta Stats bar */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50/80 rounded-2xl border border-stone-100 mb-4 text-xs font-medium text-stone-600">
          <div className="flex items-center gap-1.5 justify-center">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{recipe.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center border-x border-stone-200/70">
            <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{recipe.portions}</span>
          </div>
          <div className="flex items-center gap-1 justify-center text-amber-700 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            <span>{recipe.ratingStars.toFixed(1)} 分推薦</span>
          </div>
        </div>

        {/* Recommend Reason */}
        {recipe.recommendReason && (
          <div className="mb-4 text-xs text-stone-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50 flex items-start gap-1.5">
            <span className="text-amber-700 font-bold shrink-0">⭐ 推薦：</span>
            <span>{recipe.recommendReason}</span>
          </div>
        )}

        {/* Ingredients & Seasonings Overview */}
        <div className="space-y-3 mb-4 text-xs">
          {/* 已有食材 */}
          <div>
            <div className="text-[11px] font-bold text-emerald-800 mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>已有食材：</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recipe.existingIngredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-emerald-50/80 text-emerald-900 border border-emerald-200/70 rounded-lg text-xs"
                >
                  {ing.name} <span className="text-emerald-700/70">{ing.amount}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 需要補充 */}
          {recipe.supplementIngredients && recipe.supplementIngredients.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-orange-800 mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>需要補充食材：</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recipe.supplementIngredients.map((sup, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-orange-50 text-orange-900 border border-orange-200/70 rounded-lg text-xs"
                  >
                    + {sup.name} <span className="text-orange-700/70">{sup.amount}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 調味料 */}
          {recipe.seasonings && recipe.seasonings.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                <span>調味料：</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recipe.seasonings.map((sea, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-lg text-xs border border-stone-200/60"
                  >
                    {sea.name} <span className="text-stone-500">{sea.amount}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Specialized Equipment Parameters Box */}
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
            {getEquipmentIcon(equipment)}
            <span>【{equipment}】專屬烹調關鍵設定</span>
          </div>

          {equipment === '電鍋' && equipmentSpecifics?.electricSteamer && (
            <div className="grid grid-cols-2 gap-2 text-stone-700 pt-1">
              <div>
                <span className="text-stone-500">外鍋水量：</span>
                <span className="font-bold text-amber-900">
                  {equipmentSpecifics.electricSteamer.outerWater}
                </span>
              </div>
              <div>
                <span className="text-stone-500">蒸架：</span>
                <span className="font-medium">
                  {equipmentSpecifics.electricSteamer.steamerRack ? '需要使用蒸架' : '直接放外鍋底'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500">擺放方式：</span>
                <span>{equipmentSpecifics.electricSteamer.potPlacement}</span>
              </div>
              <div className="col-span-2 text-amber-800 font-medium">
                💡 {equipmentSpecifics.electricSteamer.simmerTime}
              </div>
            </div>
          )}

          {equipment === '瓦斯爐' && equipmentSpecifics?.gasStove && (
            <div className="grid grid-cols-2 gap-2 text-stone-700 pt-1">
              <div>
                <span className="text-stone-500">建議火力：</span>
                <span className="font-bold text-amber-900">
                  {equipmentSpecifics.gasStove.heatLevel}
                </span>
              </div>
              <div>
                <span className="text-stone-500">加熱時間：</span>
                <span className="font-medium">
                  {equipmentSpecifics.gasStove.heatingTime}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500">入鍋順序：</span>
                <span>{equipmentSpecifics.gasStove.ingredientOrder}</span>
              </div>
              <div className="col-span-2 text-amber-800 font-medium">
                🔥 {equipmentSpecifics.gasStove.stirOrCover}
              </div>
            </div>
          )}

          {equipment === '壓力鍋' && equipmentSpecifics?.pressureCooker && (
            <div className="grid grid-cols-2 gap-2 text-stone-700 pt-1">
              <div>
                <span className="text-stone-500">加壓時間：</span>
                <span className="font-bold text-amber-900">
                  {equipmentSpecifics.pressureCooker.pressureTime}
                </span>
              </div>
              <div>
                <span className="text-stone-500">洩壓方式：</span>
                <span className="font-bold text-indigo-900">
                  {equipmentSpecifics.pressureCooker.releaseMethod}
                </span>
              </div>
              <div className="col-span-2 text-red-600 bg-red-50/70 p-1.5 rounded-lg border border-red-200/60 font-medium">
                ⚠️ {equipmentSpecifics.pressureCooker.safetyWarning}
              </div>
            </div>
          )}

          {equipment === '氣炸鍋' && equipmentSpecifics?.airFryer && (
            <div className="grid grid-cols-2 gap-2 text-stone-700 pt-1">
              <div>
                <span className="text-stone-500">設定溫度：</span>
                <span className="font-bold text-amber-900">
                  {equipmentSpecifics.airFryer.temperature}
                </span>
              </div>
              <div>
                <span className="text-stone-500">烘烤時間：</span>
                <span className="font-bold text-amber-900">
                  {equipmentSpecifics.airFryer.cookingTime}
                </span>
              </div>
              <div>
                <span className="text-stone-500">預熱：</span>
                <span>{equipmentSpecifics.airFryer.preheat ? '需要預熱 3 分鐘' : '免預熱'}</span>
              </div>
              <div>
                <span className="text-stone-500">翻面提醒：</span>
                <span>{equipmentSpecifics.airFryer.flipOrShake}</span>
              </div>
            </div>
          )}
        </div>

        {/* Steps Preview (First 3 steps) */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>烹煮步驟精選：</span>
            <span className="text-stone-400 font-normal">
              共 {recipe.steps.length} 步驟
            </span>
          </div>
          <div className="space-y-1.5">
            {recipe.steps.slice(0, 3).map((st) => (
              <div
                key={st.stepNumber}
                className="flex items-start gap-2 text-xs text-stone-600 bg-stone-50/50 p-2 rounded-xl border border-stone-100"
              >
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold shrink-0 text-[10px]">
                  Step {st.stepNumber}
                </span>
                <p className="line-clamp-2">{st.instruction}</p>
              </div>
            ))}
            {recipe.steps.length > 3 && (
              <div className="text-center text-[11px] text-stone-400 pt-0.5">
                ... 還有 {recipe.steps.length - 3} 個詳細步驟
              </div>
            )}
          </div>
        </div>

        {/* Safety reminder */}
        {recipe.safetyReminder && (
          <div className="mb-4 p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/60 text-[11px] text-orange-800 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
            <span>食安叮嚀：{recipe.safetyReminder}</span>
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 mt-auto">
        <button
          type="button"
          onClick={() => onViewDetails(recipe)}
          className="w-full py-2.5 px-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <span>查看完整步驟</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          disabled={isSwapping}
          onClick={() => onSwapRecipe(recipe.id)}
          className="w-full py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSwapping ? 'animate-spin' : ''}`} />
          <span>{isSwapping ? '更換中...' : '換一道'}</span>
        </button>
      </div>
    </div>
  );
};
