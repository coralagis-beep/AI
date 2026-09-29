import React, { useState, useEffect } from 'react';
import type {
  CookingEquipment,
  CookingTimeOption,
  PortionOption,
  DifficultyOption,
  FlavorOption,
  Recipe,
  GenerateRecipesResponse,
} from './types';
import { Header } from './components/Header';
import { QuickPresets } from './components/QuickPresets';
import { IngredientInput } from './components/IngredientInput';
import { SeasoningSelector, ESSENTIAL_BUNDLE } from './components/SeasoningSelector';
import { EquipmentSelector } from './components/EquipmentSelector';
import { CookingOptions } from './components/CookingOptions';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { generateFallbackRecipes, generateSingleFallbackRecipe } from './recipeEngine';
import {
  Sparkles,
  RotateCcw,
  Plus,
  SlidersHorizontal,
  UtensilsCrossed,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  CookingPot,
} from 'lucide-react';

export default function App() {
  // Input State
  const [ingredients, setIngredients] = useState<string[]>([
    '雞胸肉',
    '雞蛋',
    '洋蔥',
    '金針菇',
  ]);
  const [selectedSeasonings, setSelectedSeasonings] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recipe_assistant_seasonings');
      return saved ? JSON.parse(saved) : ESSENTIAL_BUNDLE;
    } catch (e) {
      return ESSENTIAL_BUNDLE;
    }
  });
  const [selectedEquipments, setSelectedEquipments] = useState<CookingEquipment[]>([
    '電鍋',
    '氣炸鍋',
  ]);
  const [cookingTime, setCookingTime] = useState<CookingTimeOption>('30 分鐘內');
  const [portion, setPortion] = useState<PortionOption>('2 人');
  const [difficulty, setDifficulty] = useState<DifficultyOption>('簡單');
  const [flavor, setFlavor] = useState<FlavorOption>('家常');
  const [prioritizeExpiring, setPrioritizeExpiring] = useState<boolean>(true);

  // Form Validation State
  const [equipmentError, setEquipmentError] = useState<string | null>(null);
  const [ingredientError, setIngredientError] = useState<string | null>(null);

  // Generation & Results State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [suggestedAdditions, setSuggestedAdditions] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  // Swapping specific recipe state
  const [swappingRecipeId, setSwappingRecipeId] = useState<string | null>(null);

  // Additional ingredients input on results page
  const [moreIngredientsInput, setMoreIngredientsInput] = useState<string>('');

  // Modal & Drawer State
  const [activeRecipeForModal, setActiveRecipeForModal] = useState<Recipe | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  const handleSeasoningsChange = (newSeasonings: string[]) => {
    setSelectedSeasonings(newSeasonings);
    try {
      localStorage.setItem('recipe_assistant_seasonings', JSON.stringify(newSeasonings));
    } catch (e) {
      console.error('Failed to save seasonings', e);
    }
  };

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recipe_assistant_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  }, []);

  // Save favorites to localStorage
  const saveFavorites = (newFavs: Recipe[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem('recipe_assistant_favorites', JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  };

  const toggleFavorite = (recipe: Recipe) => {
    const exists = favorites.some((f) => f.id === recipe.id || f.name === recipe.name);
    if (exists) {
      saveFavorites(favorites.filter((f) => f.id !== recipe.id && f.name !== recipe.name));
    } else {
      saveFavorites([recipe, ...favorites]);
    }
  };

  const isFavorite = (recipe: Recipe) => {
    return favorites.some((f) => f.id === recipe.id || f.name === recipe.name);
  };

  // Loading animation cycle messages
  const LOADING_MESSAGES = [
    '正在翻閱家常料理食譜筆記...',
    '根據現有食材調配最合適的下鍋順序...',
    '精確計算各烹調設備的火候與水量...',
    '即將端出 3 道客製化美味方案...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Apply Quick Preset
  const handleApplyPreset = (presetIngredients: string[], presetEquipments: CookingEquipment[]) => {
    setIngredients(presetIngredients);
    setSelectedEquipments(presetEquipments);
    setEquipmentError(null);
    setIngredientError(null);
    setApiError(null);
  };

  // Generate Recipes
  const handleGenerateRecipes = async () => {
    // Validation
    let hasError = false;
    if (ingredients.length === 0) {
      setIngredientError('請至少輸入或選擇一項食材！');
      hasError = true;
    } else {
      setIngredientError(null);
    }

    if (selectedEquipments.length === 0) {
      setEquipmentError('請至少選擇一種烹調設備');
      hasError = true;
    } else {
      setEquipmentError(null);
    }

    if (hasError) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          seasonings: selectedSeasonings,
          equipments: selectedEquipments,
          cookingTime,
          portion,
          difficulty,
          flavor,
          prioritizeExpiring,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '產生食譜失敗');
      }

      const data: GenerateRecipesResponse = await response.json();
      setRecipes(data.recipes || []);
      setAiExplanation(data.explanation || '');
      setSuggestedAdditions(data.suggestedAdditions || []);
      setHasGenerated(true);

      // Scroll to top of results smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('API unavailable or static demo environment, using intelligent engine:', err);
      // Fallback seamlessly so static demos (e.g. GitHub Pages) work 100% interactively
      const fallbackData = generateFallbackRecipes({
        ingredients,
        seasonings: selectedSeasonings,
        equipments: selectedEquipments,
        cookingTime,
        portion,
        difficulty,
        flavor,
        prioritizeExpiring,
      });
      setRecipes(fallbackData.recipes || []);
      setAiExplanation(fallbackData.explanation || '');
      setSuggestedAdditions(fallbackData.suggestedAdditions || []);
      setHasGenerated(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  // Swap One Recipe
  const handleSwapOneRecipe = async (recipeId: string) => {
    const targetRecipe = recipes.find((r) => r.id === recipeId);
    if (!targetRecipe) return;

    setSwappingRecipeId(recipeId);

    try {
      const otherRecipeNames = recipes
        .filter((r) => r.id !== recipeId)
        .map((r) => r.name);

      const response = await fetch('/api/recipes/swap-one', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          seasonings: selectedSeasonings,
          equipments: selectedEquipments,
          cookingTime,
          portion,
          difficulty,
          flavor,
          prioritizeExpiring,
          recipeToReplaceId: recipeId,
          recipeToReplaceName: targetRecipe.name,
          existingRecipeNames: otherRecipeNames,
        }),
      });

      if (!response.ok) {
        throw new Error('更換料理失敗');
      }

      const newRecipe: Recipe = await response.json();
      setRecipes((prev) =>
        prev.map((r) => (r.id === recipeId ? { ...newRecipe, id: recipeId } : r))
      );
    } catch (err: any) {
      console.warn('API unavailable, generating fallback replacement recipe:', err);
      const fallbackOne = generateSingleFallbackRecipe({
        ingredients,
        seasonings: selectedSeasonings,
        equipments: selectedEquipments,
        cookingTime,
        portion,
        difficulty,
        flavor,
        prioritizeExpiring,
        recipeToReplaceId: recipeId,
        recipeToReplaceName: targetRecipe.name,
      });
      setRecipes((prev) =>
        prev.map((r) => (r.id === recipeId ? { ...fallbackOne, id: recipeId } : r))
      );
    } finally {
      setSwappingRecipeId(null);
    }
  };

  // Add more ingredients and refresh from result page
  const handleAddMoreIngredients = () => {
    if (!moreIngredientsInput.trim()) return;
    const tokens = moreIngredientsInput
      .split(/[,，、;；\n\r\t\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !ingredients.includes(t));

    if (tokens.length > 0) {
      const updated = [...ingredients, ...tokens];
      setIngredients(updated);
      setMoreIngredientsInput('');
      // Trigger new generation with new list
      setTimeout(() => {
        handleGenerateRecipes();
      }, 50);
    }
  };

  // Reset to form
  const handleResetToForm = () => {
    setHasGenerated(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50/60 pb-20">
      {/* Header */}
      <Header
        favoriteCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onReset={handleResetToForm}
        hasResults={hasGenerated}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Loading Overlay State */}
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-xl animate-bounce mb-6">
              <CookingPot className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              主廚正在為您設計專屬食譜...
            </h3>
            <p className="text-sm text-amber-200 font-medium max-w-sm transition-all duration-300">
              {LOADING_MESSAGES[loadingMessageIndex]}
            </p>
            <div className="mt-6 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-xs text-stone-300">AI 正在計算最佳烹調時間與外鍋水量</span>
            </div>
          </div>
        )}

        {/* Global API Error Alert */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">食譜產生發生狀況：</span>
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => handleGenerateRecipes()}
              className="px-3 py-1.5 bg-red-600 text-white font-semibold rounded-xl text-xs hover:bg-red-700 cursor-pointer"
            >
              重試一次
            </button>
          </div>
        )}

        {!hasGenerated ? (
          /* ==========================================
             INPUT CONFIGURATION VIEW
             ========================================== */
          <div className="space-y-6 animate-fade-in">
            {/* Hero Banner */}
            <div className="text-center py-6 sm:py-8 px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold tracking-wide uppercase mb-3 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>日常智慧廚房助手</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                🍳 今天吃什麼？
              </h1>
              <p className="mt-2 text-stone-600 text-base sm:text-lg max-w-lg mx-auto">
                把冰箱裡的食材交給我，幫你想一道簡單的料理。
              </p>
            </div>

            {/* Quick Presets for instant testing of the 4 required scenarios */}
            <QuickPresets onApplyPreset={handleApplyPreset} />

            {/* 1. Ingredients Input */}
            <IngredientInput
              ingredients={ingredients}
              onChange={(newIngs) => {
                setIngredients(newIngs);
                if (newIngs.length > 0) setIngredientError(null);
              }}
              error={ingredientError}
            />

            {/* 2. Seasoning & Aromatics Selection */}
            <SeasoningSelector
              selectedSeasonings={selectedSeasonings}
              onChange={handleSeasoningsChange}
            />

            {/* 3. Cooking Equipment Selection */}
            <EquipmentSelector
              selectedEquipments={selectedEquipments}
              onChange={(newEqs) => {
                setSelectedEquipments(newEqs);
                if (newEqs.length > 0) setEquipmentError(null);
              }}
              error={equipmentError}
            />

            {/* 3. Cooking Options & Expiration Toggle */}
            <CookingOptions
              cookingTime={cookingTime}
              setCookingTime={setCookingTime}
              portion={portion}
              setPortion={setPortion}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              flavor={flavor}
              setFlavor={setFlavor}
              prioritizeExpiring={prioritizeExpiring}
              setPrioritizeExpiring={setPrioritizeExpiring}
            />

            {/* Main Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerateRecipes}
                disabled={isLoading}
                className="w-full py-4 sm:py-5 px-6 rounded-3xl bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>🍳 幫我想今天吃什麼！</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-stone-400 mt-2.5">
                點擊後 AI 將根據現有食材、設備特性與火力條件，為您產生 3 道客製化菜單
              </p>
            </div>
          </div>
        ) : (
          /* ==========================================
             RESULTS VIEW
             ========================================== */
          <div className="space-y-6 animate-fade-in">
            {/* Results Title & Explanation */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs font-bold text-amber-700 tracking-wide uppercase">
                    菜單已精心搭配完成
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
                    今天可以吃這些！
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToForm}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-stone-600" />
                    <span>調整條件</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateRecipes}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>重新產生</span>
                  </button>
                </div>
              </div>

              {/* AI Concept Statement */}
              {aiExplanation && (
                <div className="mt-4 text-sm text-stone-700 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 flex items-start gap-2.5">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 block mb-0.5">
                      主廚搭配思維：
                    </span>
                    <p className="text-stone-700">{aiExplanation}</p>
                  </div>
                </div>
              )}

              {/* Suggested Additions */}
              {suggestedAdditions && suggestedAdditions.length > 0 && (
                <div className="mt-3 text-xs text-stone-600 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-stone-500">🛒 若手邊剛好有，也可以隨意加點：</span>
                  {suggestedAdditions.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md border border-stone-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Active seasonings tag */}
              {selectedSeasonings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                  <span className="font-bold text-amber-900">🧂 參考廚房調味庫存：</span>
                  <span className="text-stone-600">
                    {selectedSeasonings.slice(0, 10).join('、')}
                    {selectedSeasonings.length > 10 ? ` 等共 ${selectedSeasonings.length} 種` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* 3 Recipe Cards Grid */}
            <div className="grid grid-cols-1 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewDetails={(rec) => setActiveRecipeForModal(rec)}
                  onSwapRecipe={handleSwapOneRecipe}
                  isSwapping={swappingRecipeId === recipe.id}
                  isFavorite={isFavorite(recipe)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {/* "我還有這些食材" Feature */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/90 mt-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-800">
                    我還有這些食材...
                  </h3>
                  <p className="text-xs text-stone-500">
                    突然在冰箱深處發現其他東西？隨時補充食材，AI 會結合新食材重新構思料理方案！
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <input
                  type="text"
                  value={moreIngredientsInput}
                  onChange={(e) => setMoreIngredientsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddMoreIngredients();
                  }}
                  placeholder="輸入更多食材，例如：蒜頭、米酒、玉米筍..."
                  className="flex-1 p-3.5 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddMoreIngredients}
                  disabled={!moreIngredientsInput.trim() || isLoading}
                  className="px-6 py-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-xs transition-colors disabled:opacity-40 cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>加入食材並更新菜單</span>
                </button>
              </div>

              {/* Current ingredients pill preview */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                <span className="font-medium text-stone-400">目前清單：</span>
                {ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200/60"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={handleResetToForm}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-stone-500" />
                <span>返回修改設備與食材</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateRecipes}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>整份菜單重新產生</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Recipe Detail & Step-by-Step Cooking Modal */}
      <RecipeDetailModal
        recipe={activeRecipeForModal}
        onClose={() => setActiveRecipeForModal(null)}
        isFavorite={activeRecipeForModal ? isFavorite(activeRecipeForModal) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectRecipe={(recipe) => {
          setActiveRecipeForModal(recipe);
        }}
        onRemoveFavorite={(id) => {
          saveFavorites(favorites.filter((f) => f.id !== id));
        }}
        onClearFavorites={() => {
          if (window.confirm('確定要清空所有收藏的食譜嗎？')) {
            saveFavorites([]);
          }
        }}
      />
    </div>
  );
}
