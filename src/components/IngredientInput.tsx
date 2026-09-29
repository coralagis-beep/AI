import React, { useState, KeyboardEvent } from 'react';
import { Plus, X, Sparkles, Trash2 } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
  error?: string | null;
}

const COMMON_STAPLES = [
  '雞蛋', '雞胸肉', '洋蔥', '金針菇', '高麗菜', '豬肉片', '豆腐', '番茄', '馬鈴薯', '紅蘿蔔', '蝦仁'
];

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onChange,
  error,
}) => {
  const [inputValue, setInputValue] = useState('');

  const parseAndAdd = (text: string) => {
    if (!text.trim()) return;
    // Split by comma, Chinese comma/enumeration mark, semicolon, spaces, newlines
    const rawTokens = text.split(/[,，、;；\n\r\t\s]+/);
    const validTokens = rawTokens
      .map(t => t.trim())
      .filter(t => t.length > 0 && !ingredients.includes(t));

    if (validTokens.length > 0) {
      onChange([...ingredients, ...validTokens]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      parseAndAdd(inputValue);
    }
  };

  const removeIngredient = (indexToRemove: number) => {
    onChange(ingredients.filter((_, idx) => idx !== indexToRemove));
  };

  const addQuickStaple = (staple: string) => {
    if (!ingredients.includes(staple)) {
      onChange([...ingredients, staple]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/80 transition-all hover:border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-100 text-amber-800 text-sm font-bold">
            1
          </span>
          <h2 className="text-lg font-bold text-stone-800">
            請輸入冰箱裡的食材
          </h2>
        </div>
        {ingredients.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空食材</span>
          </button>
        )}
      </div>

      <p className="text-xs sm:text-sm text-stone-500 mb-3">
        支援一次輸入多種食材，可用逗號、頓號（、）或換行分隔，按 Enter 即可快速加入。
      </p>

      {/* Large Input Box */}
      <div className="relative">
        <textarea
          rows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) parseAndAdd(inputValue);
          }}
          placeholder="請輸入冰箱裡的食材，例如：雞胸肉、蛋、洋蔥、青椒、金針菇"
          className={`w-full p-4 text-stone-800 text-base placeholder:text-stone-400 bg-stone-50/70 border rounded-2xl focus:bg-white focus:outline-none focus:ring-3 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none ${
            error ? 'border-red-400 bg-red-50/20' : 'border-stone-200'
          }`}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => parseAndAdd(inputValue)}
            disabled={!inputValue.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs sm:text-sm font-medium hover:bg-amber-700 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>加入</span>
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs sm:text-sm text-red-600 font-medium">
          {error}
        </p>
      )}

      {/* Ingredients Tags List */}
      {ingredients.length > 0 ? (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600">
              已加入的冰箱食材 ({ingredients.length} 種)：
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-xl text-sm font-medium shadow-2xs hover:bg-amber-100 transition-colors"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-amber-700/60 hover:text-red-600 rounded-full p-0.5 transition-colors cursor-pointer"
                  title={`移除 ${item}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3 py-2 px-3 bg-amber-50/50 rounded-xl border border-dashed border-amber-200/70 text-center">
          <p className="text-xs text-stone-500">
            尚未加入任何食材。您可以直接在上方輸入，或點擊下方常見食材快速加入！
          </p>
        </div>
      )}

      {/* Quick Add Staples */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>快速點選常見食材：</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_STAPLES.map((staple) => {
            const isAdded = ingredients.includes(staple);
            return (
              <button
                key={staple}
                type="button"
                onClick={() => addQuickStaple(staple)}
                disabled={isAdded}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-stone-100 text-stone-400 border border-stone-200/60 line-through opacity-60 cursor-default'
                    : 'bg-stone-100/80 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 hover:border-amber-300'
                }`}
              >
                + {staple}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
