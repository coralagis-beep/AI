import React from 'react';
import type { CookingEquipment } from '../types';
import { Check, Flame, Wind, Gauge, Layers } from 'lucide-react';

interface EquipmentSelectorProps {
  selectedEquipments: CookingEquipment[];
  onChange: (equipments: CookingEquipment[]) => void;
  error?: string | null;
}

interface EquipmentOption {
  id: CookingEquipment;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  badge: string;
}

const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: '電鍋',
    name: '電鍋',
    icon: <Layers className="w-5 h-5 text-emerald-600" />,
    tagline: '無油煙・原汁原味',
    description: '善用外鍋水量與燜煮，蒸蛋、燉湯、炊飯首選',
    badge: '蒸 / 煮 / 燉',
  },
  {
    id: '瓦斯爐',
    name: '瓦斯爐',
    icon: <Flame className="w-5 h-5 text-orange-600" />,
    tagline: '爆香快炒・火候鑊氣',
    description: '掌控大中小火、翻炒順序與煎煮時間',
    badge: '炒 / 煎 / 滾湯',
  },
  {
    id: '壓力鍋',
    name: '壓力鍋',
    icon: <Gauge className="w-5 h-5 text-indigo-600" />,
    tagline: '快速軟爛・深層入味',
    description: '高壓省時燜煮，注意洩壓方式與安全刻度',
    badge: '加壓 / 快速燉爛',
  },
  {
    id: '氣炸鍋',
    name: '氣炸鍋',
    icon: <Wind className="w-5 h-5 text-rose-600" />,
    tagline: '少油酥脆・烘烤逼油',
    description: '掌握溫控時間與中途翻面，酥脆不油膩',
    badge: '烤 / 酥炸 / 逼油',
  },
];

export const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  selectedEquipments,
  onChange,
  error,
}) => {
  const toggleEquipment = (id: CookingEquipment) => {
    if (selectedEquipments.includes(id)) {
      onChange(selectedEquipments.filter((item) => item !== id));
    } else {
      onChange([...selectedEquipments, id]);
    }
  };

  const selectAll = () => {
    onChange(['電鍋', '瓦斯爐', '壓力鍋', '氣炸鍋']);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/80 transition-all hover:border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-100 text-amber-800 text-sm font-bold">
            3
          </span>
          <h2 className="text-lg font-bold text-stone-800">
            選擇烹調設備（可複選）
          </h2>
        </div>
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-amber-700 hover:text-amber-800 font-medium hover:underline cursor-pointer"
        >
          全選設備
        </button>
      </div>

      <p className="text-xs sm:text-sm text-stone-500 mb-4">
        AI 會完全依照您勾選的設備量身設計料理步驟與專屬參數，不推薦未勾選的器具。
      </p>

      {/* Grid of 4 equipments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EQUIPMENT_OPTIONS.map((item) => {
          const isSelected = selectedEquipments.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleEquipment(item.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                  : 'border-stone-200/80 hover:border-stone-300 bg-stone-50/40 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white shadow-2xs' : 'bg-stone-100'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-800 text-base">
                        {item.name}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-xs text-amber-700 font-medium">
                      {item.tagline}
                    </span>
                  </div>
                </div>

                {/* Checkbox indicator */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'border-2 border-stone-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              <p className="text-xs text-stone-500 mt-1 pl-1">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700 font-medium animate-shake">
          <span>⚠️ {error}</span>
        </div>
      )}
    </div>
  );
};
