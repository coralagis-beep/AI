import React, { useState, KeyboardEvent } from 'react';
import {
  Sparkles,
  Plus,
  X,
  Check,
  RotateCcw,
  CheckCheck,
  Utensils,
  Flame,
} from 'lucide-react';

interface SeasoningSelectorProps {
  selectedSeasonings: string[];
  onChange: (seasonings: string[]) => void;
}

// Grouped popular Taiwanese kitchen seasonings & spices
export const FEATURED_QUICK_PICKS = [
  { name: '蔥', icon: '🌱' },
  { name: '薑', icon: '🫚' },
  { name: '蒜頭', icon: '🧄' },
  { name: '泡菜', icon: '🥬' },
  { name: '醬油', icon: '🍶' },
  { name: '味醂', icon: '🍯' },
  { name: '鹽麴', icon: '✨' },
];

export const COMMON_AROMATICS = [
  '蔥',
  '薑',
  '蒜頭',
  '辣椒',
  '九層塔',
  '黑胡椒',
  '白胡椒',
  '洋蔥',
  '香菜',
  '花椒',
  '八角',
];

export const BASIC_SEASONINGS = [
  '醬油',
  '鹽',
  '砂糖',
  '味醂',
  '鹽麴',
  '米酒',
  '香油',
  '烏醋',
  '白醋',
  '蠔油',
  '白芝麻',
];

export const SPECIAL_SEASONINGS = [
  '泡菜',
  '辣豆瓣醬',
  '沙茶醬',
  '味噌',
  '番茄醬',
  '咖哩塊',
  '五香粉',
  '柴魚粉',
  '美乃滋',
  '孜然粉',
];

// Essential staple bundle for one-click setup
export const ESSENTIAL_BUNDLE = [
  '鹽',
  '砂糖',
  '醬油',
  '米酒',
  '味醂',
  '白胡椒',
  '香油',
  '蒜頭',
  '蔥',
  '薑',
];

export const SeasoningSelector: React.FC<SeasoningSelectorProps> = ({
  selectedSeasonings,
  onChange,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'spices' | 'sauces'>('all');

  const toggleSeasoning = (item: string) => {
    if (selectedSeasonings.includes(item)) {
      onChange(selectedSeasonings.filter((s) => s !== item));
    } else {
      onChange([...selectedSeasonings, item]);
    }
  };

  const handleAddCustom = (text: string) => {
    if (!text.trim()) return;
    const tokens = text
      .split(/[,，、;；\n\r\t\s]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !selectedSeasonings.includes(t));

    if (tokens.length > 0) {
      onChange([...selectedSeasonings, ...tokens]);
      setCustomInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom(customInput);
    }
  };

  const selectEssentialBundle = () => {
    // Merge essential bundle into current selections
    const set = new Set([...selectedSeasonings, ...ESSENTIAL_BUNDLE]);
    onChange(Array.from(set));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/80 transition-all hover:border-amber-200 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-100 text-amber-800 text-sm font-bold">
            2
          </span>
          <div>
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
              <span>現有調味與辛香料</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                已選 {selectedSeasonings.length} 種
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              告知 AI 廚房現有的調味料，能做出更符合您口味且不需額外採買的食譜。
            </p>
          </div>
        </div>

        {/* Quick helper buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={selectEssentialBundle}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100/80 hover:bg-amber-200 rounded-xl border border-amber-300/60 shadow-2xs transition-all cursor-pointer"
            title="一鍵勾選蔥薑蒜、醬油、鹽、糖、米酒等家常必備"
          >
            <CheckCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>必備常備款一鍵全選</span>
          </button>

          {selectedSeasonings.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>清空</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Quick Picks (蔥、薑、蒜頭、泡菜、醬油、味醂、鹽麴) */}
      <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>常用高頻辛香調味（點擊即選）：</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FEATURED_QUICK_PICKS.map((item) => {
            const isSelected = selectedSeasonings.includes(item.name);
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => toggleSeasoning(item.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs scale-102 ring-2 ring-amber-400/50'
                    : 'bg-white hover:bg-amber-100/70 text-stone-800 border border-amber-200 shadow-2xs'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          全部調味
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('spices')}
          className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'spices'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🌶️ 生鮮辛香料
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sauces')}
          className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'sauces'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🍶 醬料與油品
        </button>
      </div>

      {/* Seasoning Grid Sections */}
      <div className="space-y-3">
        {(activeTab === 'all' || activeTab === 'spices') && (
          <div>
            <div className="text-xs font-bold text-stone-500 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>生鮮辛香料：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_AROMATICS.map((item) => {
                const isSelected = selectedSeasonings.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleSeasoning(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'bg-stone-100/90 hover:bg-stone-200 text-stone-700 border border-stone-200/80'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'sauces') && (
          <div>
            <div className="text-xs font-bold text-stone-500 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>常備基本調味：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BASIC_SEASONINGS.map((item) => {
                const isSelected = selectedSeasonings.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleSeasoning(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs font-bold'
                        : 'bg-stone-100/90 hover:bg-stone-200 text-stone-700 border border-stone-200/80'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'sauces') && (
          <div>
            <div className="text-xs font-bold text-stone-500 mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>醬料與特色調味：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SPECIAL_SEASONINGS.map((item) => {
                const isSelected = selectedSeasonings.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleSeasoning(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs font-bold'
                        : 'bg-stone-100/90 hover:bg-stone-200 text-stone-700 border border-stone-200/80'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Custom Seasonings Input */}
      <div className="pt-3 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="加入其他特殊調味料（如：迷迭香、義大利香料、XO醬...）"
            className="flex-1 py-2 px-3.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => handleAddCustom(customInput)}
            disabled={!customInput.trim()}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium disabled:opacity-30 transition-all flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>自訂加入</span>
          </button>
        </div>

        {/* Selected non-preset custom tags if any */}
        {selectedSeasonings.some(
          (s) =>
            !COMMON_AROMATICS.includes(s) &&
            !BASIC_SEASONINGS.includes(s) &&
            !SPECIAL_SEASONINGS.includes(s)
        ) && (
          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-stone-400">已加入自訂款：</span>
            {selectedSeasonings
              .filter(
                (s) =>
                  !COMMON_AROMATICS.includes(s) &&
                  !BASIC_SEASONINGS.includes(s) &&
                  !SPECIAL_SEASONINGS.includes(s)
              )
              .map((custom) => (
                <span
                  key={custom}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold"
                >
                  <span>{custom}</span>
                  <button
                    type="button"
                    onClick={() => toggleSeasoning(custom)}
                    className="text-amber-600 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
