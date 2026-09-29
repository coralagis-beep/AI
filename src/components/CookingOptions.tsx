import React from 'react';
import type {
  CookingTimeOption,
  PortionOption,
  DifficultyOption,
  FlavorOption,
} from '../types';
import { Clock, Users, ChefHat, Sparkles, AlertCircle } from 'lucide-react';

interface CookingOptionsProps {
  cookingTime: CookingTimeOption;
  setCookingTime: (val: CookingTimeOption) => void;
  portion: PortionOption;
  setPortion: (val: PortionOption) => void;
  difficulty: DifficultyOption;
  setDifficulty: (val: DifficultyOption) => void;
  flavor: FlavorOption;
  setFlavor: (val: FlavorOption) => void;
  prioritizeExpiring: boolean;
  setPrioritizeExpiring: (val: boolean) => void;
}

const TIME_OPTIONS: CookingTimeOption[] = ['不限', '15 分鐘內', '30 分鐘內', '60 分鐘內'];
const PORTION_OPTIONS: PortionOption[] = ['1 人', '2 人', '3～4 人', '5 人以上'];
const DIFFICULTY_OPTIONS: DifficultyOption[] = ['簡單', '一般', '不限'];
const FLAVOR_OPTIONS: FlavorOption[] = ['清淡', '家常', '辣', '不限'];

export const CookingOptions: React.FC<CookingOptionsProps> = ({
  cookingTime,
  setCookingTime,
  portion,
  setPortion,
  difficulty,
  setDifficulty,
  flavor,
  setFlavor,
  prioritizeExpiring,
  setPrioritizeExpiring,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/80 transition-all hover:border-amber-200 space-y-6">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-100 text-amber-800 text-sm font-bold">
          4
        </span>
        <h2 className="text-lg font-bold text-stone-800">
          設定料理偏好
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* 料理時間 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>料理時間</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-stone-100/70 p-1 rounded-2xl border border-stone-200/60">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setCookingTime(opt)}
                className={`py-2 px-1 text-xs font-medium rounded-xl transition-all cursor-pointer text-center ${
                  cookingTime === opt
                    ? 'bg-white text-amber-900 font-bold shadow-xs border border-stone-200/50'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 建議份量 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mb-2">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>用餐份量</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-stone-100/70 p-1 rounded-2xl border border-stone-200/60">
            {PORTION_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setPortion(opt)}
                className={`py-2 px-1 text-xs font-medium rounded-xl transition-all cursor-pointer text-center ${
                  portion === opt
                    ? 'bg-white text-amber-900 font-bold shadow-xs border border-stone-200/50'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 料理難度 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mb-2">
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span>料理難度</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-stone-100/70 p-1 rounded-2xl border border-stone-200/60">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setDifficulty(opt)}
                className={`py-2 px-1 text-xs font-medium rounded-xl transition-all cursor-pointer text-center ${
                  difficulty === opt
                    ? 'bg-white text-amber-900 font-bold shadow-xs border border-stone-200/50'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 口味 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>風味偏好</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-stone-100/70 p-1 rounded-2xl border border-stone-200/60">
            {FLAVOR_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFlavor(opt)}
                className={`py-2 px-1 text-xs font-medium rounded-xl transition-all cursor-pointer text-center ${
                  flavor === opt
                    ? 'bg-white text-amber-900 font-bold shadow-xs border border-stone-200/50'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 優先消耗快過期食材開關 (預設開啟) */}
      <div className="pt-4 border-t border-stone-100 flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-800 text-sm">
                優先消耗快過期食材
              </span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-md">
                推薦開啟
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              AI 會優先在食譜中大方耗盡現有食材，幫您把冰箱生鮮庫存清空，避免食物浪費。
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
          <input
            type="checkbox"
            checked={prioritizeExpiring}
            onChange={(e) => setPrioritizeExpiring(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
        </label>
      </div>
    </div>
  );
};
