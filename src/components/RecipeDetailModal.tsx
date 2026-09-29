import React, { useState } from 'react';
import type { Recipe, CookingEquipment } from '../types';
import {
  X,
  Clock,
  Users,
  ChefHat,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Flame,
  Wind,
  Gauge,
  Layers,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { KitchenTimer } from './KitchenTimer';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!recipe) return null;

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const toggleIngredient = (id: string) => {
    if (checkedIngredients.includes(id)) {
      setCheckedIngredients(checkedIngredients.filter((i) => i !== id));
    } else {
      setCheckedIngredients([...checkedIngredients, id]);
    }
  };

  const copyRecipe = () => {
    const text = `【${recipe.name}】（${recipe.portions}／預估 ${recipe.estimatedTime}）
推薦指數：${recipe.ratingStars} 星
使用設備：${recipe.equipment}
風味難度：${recipe.flavor}、${recipe.difficulty}

【已有食材】
${recipe.existingIngredients.map((i) => `・${i.name} ${i.amount}`).join('\n')}

${
  recipe.supplementIngredients && recipe.supplementIngredients.length > 0
    ? `【需要補充】\n${recipe.supplementIngredients.map((i) => `・${i.name} ${i.amount}`).join('\n')}\n`
    : ''
}【調味料】
${recipe.seasonings.map((i) => `・${i.name} ${i.amount}`).join('\n')}

【烹煮步驟】
${recipe.steps.map((s) => `Step ${s.stepNumber}：${s.instruction}`).join('\n')}

食安叮嚀：${recipe.safetyReminder}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEquipmentIcon = (eq: CookingEquipment) => {
    switch (eq) {
      case '電鍋':
        return <Layers className="w-5 h-5 text-emerald-600" />;
      case '瓦斯爐':
        return <Flame className="w-5 h-5 text-orange-600" />;
      case '壓力鍋':
        return <Gauge className="w-5 h-5 text-indigo-600" />;
      case '氣炸鍋':
        return <Wind className="w-5 h-5 text-rose-600" />;
    }
  };

  const { equipmentSpecifics, equipment } = recipe;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden relative">
        {/* Top Sticky Header */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex items-start justify-between gap-4 bg-white/95 sticky top-0 z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/70">
                {getEquipmentIcon(equipment)}
                <span>{equipment}</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700">
                🟢 {recipe.difficulty}
              </span>
              {recipe.flavor && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-medium bg-stone-100 text-stone-600">
                  {recipe.flavor}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              {recipe.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {recipe.tagline}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={copyRecipe}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="複製食譜文字"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? '已複製！' : '複製'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(recipe)}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
              title={isFavorite ? '已在收藏清單' : '加入收藏'}
            >
              {isFavorite ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-600 text-amber-700" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{isFavorite ? '已收藏' : '收藏'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 text-center">
            <div>
              <div className="text-[11px] text-stone-500 font-medium">預估時間</div>
              <div className="text-sm sm:text-base font-bold text-stone-800 mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{recipe.estimatedTime}</span>
              </div>
            </div>
            <div className="border-x border-stone-200">
              <div className="text-[11px] text-stone-500 font-medium">建議份量</div>
              <div className="text-sm sm:text-base font-bold text-stone-800 mt-0.5 flex items-center justify-center gap-1">
                <Users className="w-4 h-4 text-amber-600" />
                <span>{recipe.portions}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">主廚推薦</div>
              <div className="text-sm sm:text-base font-bold text-amber-700 mt-0.5 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{recipe.ratingStars.toFixed(1)} ⭐</span>
              </div>
            </div>
          </div>

          {/* Kitchen Timer Tool */}
          <KitchenTimer />

          {/* Equipment specifics full banner */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              {getEquipmentIcon(equipment)}
              <span>【{equipment}】料理專屬重要參數指南</span>
            </div>

            {equipment === '電鍋' && equipmentSpecifics?.electricSteamer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700 pt-1">
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">外鍋水量：</span>
                  <span className="font-bold text-amber-900 ml-1">
                    {equipmentSpecifics.electricSteamer.outerWater}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">蒸架使用：</span>
                  <span className="font-medium ml-1">
                    {equipmentSpecifics.electricSteamer.steamerRack ? '需要使用蒸架' : '直接放外鍋底即可'}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60 sm:col-span-2">
                  <span className="font-semibold text-amber-950">內鍋食材放置方式：</span>
                  <p className="mt-1 text-stone-700">
                    {equipmentSpecifics.electricSteamer.potPlacement}
                  </p>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60 sm:col-span-2">
                  <span className="font-semibold text-amber-950">跳起後燜煮：</span>
                  <span className="text-amber-800 font-bold ml-1">
                    {equipmentSpecifics.electricSteamer.simmerTime}
                  </span>
                </div>
              </div>
            )}

            {equipment === '瓦斯爐' && equipmentSpecifics?.gasStove && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700 pt-1">
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">火力掌握：</span>
                  <span className="font-bold text-amber-900 ml-1">
                    {equipmentSpecifics.gasStove.heatLevel}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">加熱預估時間：</span>
                  <span className="font-medium ml-1">
                    {equipmentSpecifics.gasStove.heatingTime}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60 sm:col-span-2">
                  <span className="font-semibold text-amber-950">食材下鍋順序：</span>
                  <p className="mt-1 text-stone-700">
                    {equipmentSpecifics.gasStove.ingredientOrder}
                  </p>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60 sm:col-span-2">
                  <span className="font-semibold text-amber-950">翻炒／加蓋說明：</span>
                  <p className="mt-1 text-amber-900 font-medium">
                    {equipmentSpecifics.gasStove.stirOrCover}
                  </p>
                </div>
              </div>
            )}

            {equipment === '壓力鍋' && equipmentSpecifics?.pressureCooker && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700 pt-1">
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">加壓時間：</span>
                  <span className="font-bold text-amber-900 ml-1">
                    {equipmentSpecifics.pressureCooker.pressureTime}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">洩壓方式：</span>
                  <span className="font-bold text-indigo-900 ml-1">
                    {equipmentSpecifics.pressureCooker.releaseMethod}
                  </span>
                </div>
                <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-red-700 sm:col-span-2 font-medium">
                  ⚠️ 壓力安全注意：{equipmentSpecifics.pressureCooker.safetyWarning}
                </div>
              </div>
            )}

            {equipment === '氣炸鍋' && equipmentSpecifics?.airFryer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700 pt-1">
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">設定溫度：</span>
                  <span className="font-bold text-amber-900 ml-1">
                    {equipmentSpecifics.airFryer.temperature}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">烘烤時間：</span>
                  <span className="font-bold text-amber-900 ml-1">
                    {equipmentSpecifics.airFryer.cookingTime}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">是否預熱：</span>
                  <span className="font-medium ml-1">
                    {equipmentSpecifics.airFryer.preheat ? '建議預熱 3 分鐘' : '免預熱'}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-semibold text-amber-950">中途翻面：</span>
                  <span className="font-medium text-amber-900 ml-1">
                    {equipmentSpecifics.airFryer.flipOrShake}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ingredients & Seasonings checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ingredients */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <h4 className="text-sm font-bold text-stone-800 mb-3 flex items-center justify-between">
                <span>食材清單（點擊可打勾備妥）</span>
                <span className="text-xs font-normal text-stone-500">
                  {checkedIngredients.length} 項備妥
                </span>
              </h4>

              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-800">已有食材：</div>
                {recipe.existingIngredients.map((ing, i) => {
                  const id = `ex-${i}`;
                  const isChecked = checkedIngredients.includes(id);
                  return (
                    <div
                      key={id}
                      onClick={() => toggleIngredient(id)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50 text-stone-400 line-through' : 'bg-white text-stone-800 hover:bg-stone-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span>{ing.name}</span>
                      </div>
                      <span className="font-medium text-stone-500">{ing.amount}</span>
                    </div>
                  );
                })}

                {recipe.supplementIngredients && recipe.supplementIngredients.length > 0 && (
                  <>
                    <div className="text-xs font-bold text-orange-800 pt-2">需要補充食材：</div>
                    {recipe.supplementIngredients.map((ing, i) => {
                      const id = `sup-${i}`;
                      const isChecked = checkedIngredients.includes(id);
                      return (
                        <div
                          key={id}
                          onClick={() => toggleIngredient(id)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors ${
                            isChecked ? 'bg-orange-50 text-stone-400 line-through' : 'bg-orange-50/50 text-stone-800 hover:bg-orange-100/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-orange-300 shrink-0" />
                            )}
                            <span className="text-orange-950 font-medium">+ {ing.name}</span>
                          </div>
                          <span className="font-medium text-orange-700">{ing.amount}</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Seasonings */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <h4 className="text-sm font-bold text-stone-800 mb-3">
                調味料建議份量
              </h4>
              <div className="space-y-2">
                {recipe.seasonings.map((sea, i) => {
                  const id = `sea-${i}`;
                  const isChecked = checkedIngredients.includes(id);
                  return (
                    <div
                      key={id}
                      onClick={() => toggleIngredient(id)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors ${
                        isChecked ? 'bg-stone-200/60 text-stone-400 line-through' : 'bg-white text-stone-800 hover:bg-stone-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span>{sea.name}</span>
                      </div>
                      <span className="font-medium text-stone-500">{sea.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step by step Cooking Mode */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-600" />
                <span>詳細烹調步驟（料理時可點擊完成勾選）</span>
              </h4>
              <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                進度：{completedSteps.length} / {recipe.steps.length}
              </span>
            </div>

            <div className="space-y-3">
              {recipe.steps.map((st) => {
                const isDone = completedSteps.includes(st.stepNumber);
                return (
                  <div
                    key={st.stepNumber}
                    onClick={() => toggleStep(st.stepNumber)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50/50 border-emerald-300 text-stone-500'
                        : 'bg-white border-stone-200/90 hover:border-amber-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                            {st.stepNumber}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isDone ? 'text-emerald-700' : 'text-amber-800'
                            }`}
                          >
                            Step {st.stepNumber} {st.title ? `・${st.title}` : ''}
                          </span>
                        </div>

                        <p
                          className={`text-sm sm:text-base leading-relaxed ${
                            isDone ? 'line-through text-stone-400' : 'text-stone-800 font-medium'
                          }`}
                        >
                          {st.instruction}
                        </p>

                        {st.equipmentTip && (
                          <div className="text-xs text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200/60 flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>器具秘訣：{st.equipmentTip}</span>
                          </div>
                        )}

                        {st.safetyNotice && (
                          <div className="text-xs text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200/60 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>安全提醒：{st.safetyNotice}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Reminder & Chef Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {recipe.safetyReminder && (
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">食品衛生與設備安全叮嚀：</span>
                  <span>{recipe.safetyReminder}</span>
                </div>
              </div>
            )}

            {recipe.chefTip && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">主廚料理小撇步：</span>
                  <span>{recipe.chefTip}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            按右上角 ✕ 或點擊此按鈕關閉
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            完成檢視
          </button>
        </div>
      </div>
    </div>
  );
};
