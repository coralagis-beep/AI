export type CookingEquipment = '電鍋' | '瓦斯爐' | '壓力鍋' | '氣炸鍋';

export type CookingTimeOption = '不限' | '15 分鐘內' | '30 分鐘內' | '60 分鐘內';

export type PortionOption = '1 人' | '2 人' | '3～4 人' | '5 人以上';

export type DifficultyOption = '簡單' | '一般' | '不限';

export type FlavorOption = '清淡' | '家常' | '辣' | '不限';

export interface IngredientItem {
  name: string;
  amount: string;
}

export interface ElectricSteamerDetails {
  potPlacement: string; // 內鍋食材放置方式
  outerWater: string;   // 外鍋加水量
  steamerRack: boolean; // 是否需要蒸架
  simmerTime: string;   // 跳起後是否需要燜煮
}

export interface GasStoveDetails {
  heatLevel: string;       // 火力：大火／中火／小火
  heatingTime: string;     // 加熱時間
  ingredientOrder: string; // 食材加入順序
  stirOrCover: string;     // 是否需要翻炒或加蓋
}

export interface PressureCookerDetails {
  pressureTime: string;    // 加壓時間
  releaseMethod: string;   // 洩壓方式：自然洩壓或快速洩壓
  safetyWarning: string;   // 安全提醒 (如容量限制)
}

export interface AirFryerDetails {
  temperature: string;  // 建議溫度 (如 180°C)
  cookingTime: string;  // 烹調時間
  preheat: boolean;     // 是否需要預熱
  flipOrShake: string;  // 中途是否需要翻面或搖晃
}

export interface EquipmentSpecifics {
  electricSteamer?: ElectricSteamerDetails;
  gasStove?: GasStoveDetails;
  pressureCooker?: PressureCookerDetails;
  airFryer?: AirFryerDetails;
}

export interface RecipeStep {
  stepNumber: number;
  title?: string;
  instruction: string;
  equipmentTip?: string;
  safetyNotice?: string;
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  ratingStars: number;
  recommendReason: string;
  estimatedTime: string;
  portions: string;
  equipment: CookingEquipment;
  difficulty: '簡單' | '一般';
  flavor: string;
  existingIngredients: IngredientItem[];
  supplementIngredients: IngredientItem[];
  seasonings: IngredientItem[];
  equipmentSpecifics: EquipmentSpecifics;
  steps: RecipeStep[];
  safetyReminder: string;
  chefTip?: string;
}

export interface GenerateRecipesRequest {
  ingredients: string[];
  seasonings?: string[];
  equipments: CookingEquipment[];
  cookingTime: CookingTimeOption;
  portion: PortionOption;
  difficulty: DifficultyOption;
  flavor: FlavorOption;
  prioritizeExpiring: boolean;
}

export interface GenerateRecipesResponse {
  status: 'success' | 'insufficient_ingredients';
  explanation: string;
  recipes: Recipe[];
  suggestedAdditions?: string[];
}

export interface SwapRecipeRequest extends GenerateRecipesRequest {
  recipeToReplaceId: string;
  recipeToReplaceName: string;
  existingRecipeNames: string[];
}
