import React from 'react';
import type { CookingEquipment } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface QuickPresetsProps {
  onApplyPreset: (ingredients: string[], equipments: CookingEquipment[]) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onApplyPreset }) => {
  const PRESETS: {
    label: string;
    ingredients: string[];
    equipments: CookingEquipment[];
    desc: string;
  }[] = [
    {
      label: '情境 1：電鍋清蒸',
      ingredients: ['雞胸肉', '雞蛋', '洋蔥'],
      equipments: ['電鍋'],
      desc: '測試電鍋外鍋水與蒸煮特性',
    },
    {
      label: '情境 2：氣炸酥烤',
      ingredients: ['豬肉', '高麗菜'],
      equipments: ['氣炸鍋'],
      desc: '測試氣炸鍋溫度控管與中途翻面',
    },
    {
      label: '情境 3：高壓燜燉',
      ingredients: ['馬鈴薯', '紅蘿蔔'],
      equipments: ['壓力鍋'],
      desc: '測試壓力鍋加壓時間與洩壓方式',
    },
    {
      label: '情境 4：瓦斯爐爆香',
      ingredients: ['番茄', '雞蛋'],
      equipments: ['瓦斯爐'],
      desc: '測試瓦斯爐火候掌控與翻炒順序',
    },
  ];

  return (
    <div className="bg-amber-100/50 rounded-2xl p-4 border border-amber-200/70">
      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
        <span>快速測試推薦組合（一鍵帶入體驗）：</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onApplyPreset(preset.ingredients, preset.equipments)}
            className="text-left p-2.5 bg-white/90 hover:bg-white rounded-xl border border-amber-200/80 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1">
              <span>{preset.label}</span>
              <ArrowRight className="w-3 h-3 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-amber-800 font-medium truncate">
              {preset.ingredients.join(' + ')} ＋ {preset.equipments.join(', ')}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              {preset.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
