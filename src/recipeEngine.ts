import type {
  CookingEquipment,
  CookingTimeOption,
  PortionOption,
  DifficultyOption,
  FlavorOption,
  Recipe,
  GenerateRecipesResponse,
} from './types';

/**
 * Intelligent fallback recipe generator for when Gemini API temporarily encounters
 * 503 spikes or network interruptions. Ensures users never encounter a blank screen.
 */
export function generateFallbackRecipes(params: {
  ingredients: string[];
  seasonings?: string[];
  equipments: CookingEquipment[];
  cookingTime: CookingTimeOption;
  portion: PortionOption;
  difficulty: DifficultyOption;
  flavor: FlavorOption;
  prioritizeExpiring: boolean;
}): GenerateRecipesResponse {
  const { ingredients, seasonings = [], equipments, cookingTime, portion, difficulty, flavor } = params;

  const recipes: Recipe[] = [];
  const primaryIng = ingredients[0] || '時令時蔬';
  const secondaryIng = ingredients[1] || '新鮮雞蛋';
  const thirdIng = ingredients[2] || '洋蔥';

  // Distribute equipments across the 3 recipes
  const eq1 = equipments[0];
  const eq2 = equipments[1] || equipments[0];
  const eq3 = equipments[2] || equipments[0];

  // Helper to build equipment-specific details
  const getSpecifics = (eq: CookingEquipment, mainName: string) => {
    switch (eq) {
      case '電鍋':
        return {
          electricSteamer: {
            potPlacement: `將耐熱瓷盤置於電鍋內鍋中央，易熟食材（如${secondaryIng}）鋪於上層`,
            outerWater: '1 米杯水（約 160ml，蒸煮約 18～20 分鐘）',
            steamerRack: true,
            simmerTime: '電鍋開關跳起後，務必加蓋燜煮 5 分鐘，以餘溫讓食材熟透',
          },
        };
      case '瓦斯爐':
        return {
          gasStove: {
            heatLevel: '爆香用中火，翻炒轉中大火，最後收汁轉微火',
            heatingTime: '熱鍋 1 分鐘，爆香 1 分鐘，主料拌炒約 4～6 分鐘',
            ingredientOrder: `先下蔥蒜辛香料，接著下${primaryIng}炒至半熟，再加入${secondaryIng}一同翻炒`,
            stirOrCover: '大火快炒均勻受熱，可蓋鍋燜煮 2 分鐘加速軟化入味',
          },
        };
      case '壓力鍋':
        return {
          pressureCooker: {
            pressureTime: '加壓閥升起後轉小火，計時加壓 6～8 分鐘',
            releaseMethod: '建議關火後「自然洩壓」，待浮標完全落下再開蓋，以保食材軟嫩',
            safetyWarning: '食材與湯水總量請勿超過內鍋 Max 刻度 2/3，開蓋前請先確認洩壓完畢！',
          },
        };
      case '氣炸鍋':
        return {
          airFryer: {
            temperature: '建議設定 180°C',
            cookingTime: '烘烤約 12～15 分鐘',
            preheat: true,
            flipOrShake: '烘烤至第 7 分鐘時拉出炸籃，將食材翻面或輕輕搖晃一次',
          },
        };
    }
  };

  // Recipe 1
  const name1 = `${eq1}家常${primaryIng}佐${secondaryIng}`;
  recipes.push({
    id: 'recipe-fallback-1',
    name: name1,
    tagline: `充分善用冰箱現有${primaryIng}，溫暖多汁且不耗時`,
    ratingStars: 4.9,
    recommendReason: `完美消耗現有的${primaryIng}與${secondaryIng}，口味親民又營養均衡`,
    estimatedTime: cookingTime === '15 分鐘內' ? '15 分鐘' : '20 分鐘',
    portions: portion,
    equipment: eq1,
    difficulty: difficulty === '一般' ? '一般' : '簡單',
    flavor: flavor === '清淡' ? '清爽甘甜' : '家常鹹香',
    existingIngredients: [
      { name: primaryIng, amount: '適量（約 150～200g）' },
      { name: secondaryIng, amount: '適量' },
    ],
    supplementIngredients: [
      { name: '青蔥或大蒜', amount: '少許（提香用）' },
    ],
    seasonings: [
      { name: '醬油', amount: '1 大匙' },
      { name: '白胡椒粉', amount: '少許' },
      { name: '鹽', amount: '1/2 茶匙' },
      { name: '香油', amount: '少許' },
    ],
    equipmentSpecifics: getSpecifics(eq1, primaryIng),
    steps: [
      {
        stepNumber: 1,
        title: '備料切洗',
        instruction: `將${primaryIng}切成適口大小，${secondaryIng}洗淨切段或切塊備用。`,
        equipmentTip: '切薄片受熱更快均勻。',
      },
      {
        stepNumber: 2,
        title: '調味混合',
        instruction: '加入醬油、少許白胡椒粉、鹽與少許香油抓醃約 3 分鐘。',
      },
      {
        stepNumber: 3,
        title: '設備烹調',
        instruction:
          eq1 === '電鍋'
            ? '將食材裝盤放入電鍋，外鍋倒入 1 杯水，按下開關開始蒸煮。'
            : eq1 === '氣炸鍋'
            ? '放入氣炸鍋炸籃鋪平，以 180°C 烘烤 12 分鐘，中途翻面一次。'
            : eq1 === '壓力鍋'
            ? '放入壓力鍋加入少許水或高湯，上蓋鎖緊，中火加壓 8 分鐘後自然洩壓。'
            : '瓦斯爐起中火熱鍋下油，先爆香辛香料，再下主食材大火翻炒至熟透。',
        equipmentTip:
          eq1 === '電鍋'
            ? '外鍋水滾蒸氣充足，跳起後切記燜 5 分鐘'
            : eq1 === '氣炸鍋'
            ? '避免食材過度重疊'
            : eq1 === '瓦斯爐'
            ? '火候維持中火即可'
            : '注意排氣孔清潔',
      },
      {
        stepNumber: 4,
        title: '起鍋盛盤',
        instruction: '確認食材已完全熟透，起鍋裝盤趁熱享用。',
        safetyNotice: '生肉或雞蛋請務必加熱至中心熟透無血水。',
      },
    ],
    safetyReminder: '生鮮肉品及蛋類請務必完全加熱熟透，避免生熟食器具交叉感染。',
    chefTip: '食材下鍋前稍微擦乾表面水分，香氣更濃郁！',
  });

  // Recipe 2
  const name2 = `${eq2}鮮味${secondaryIng}燴${thirdIng || primaryIng}`;
  recipes.push({
    id: 'recipe-fallback-2',
    name: name2,
    tagline: `清甜爽口，善用${eq2}特性鎖住食材原汁`,
    ratingStars: 4.8,
    recommendReason: '以清爽家常手法呈現，老少咸宜且非常開胃',
    estimatedTime: cookingTime === '15 分鐘內' ? '15 分鐘' : '25 分鐘',
    portions: portion,
    equipment: eq2,
    difficulty: '簡單',
    flavor: '鮮甜開胃',
    existingIngredients: [
      { name: secondaryIng, amount: '適量' },
      { name: thirdIng || primaryIng, amount: '適量' },
    ],
    supplementIngredients: [
      { name: '飲用水或高湯', amount: '約 100ml' },
    ],
    seasonings: [
      { name: '鹽', amount: '1/2 茶匙' },
      { name: '砂糖', amount: '1/3 茶匙' },
      { name: '薄鹽醬油', amount: '1 茶匙' },
    ],
    equipmentSpecifics: getSpecifics(eq2, secondaryIng),
    steps: [
      {
        stepNumber: 1,
        title: '刀工整理',
        instruction: `將${secondaryIng}處理妥當，${thirdIng || primaryIng}切絲或薄片，增加受熱面積。`,
      },
      {
        stepNumber: 2,
        title: '依序下鍋加熱',
        instruction:
          eq2 === '電鍋'
            ? '內鍋鋪上食材，倒入少許清水與調味料，外鍋加 3/4 杯水蒸煮。'
            : eq2 === '氣炸鍋'
            ? '食材拌入少許油與調味料，置入氣炸鍋以 175°C 烤 10 分鐘。'
            : eq2 === '壓力鍋'
            ? '將食材與調味料放入壓力鍋內，中火加壓 6 分鐘後洩壓。'
            : '瓦斯爐中火起油鍋，先下蔥白或蒜末炒出香味，再倒入食材快速翻炒。',
      },
      {
        stepNumber: 3,
        title: '燜透調味',
        instruction: '待食材軟嫩香甜後，拌入薄鹽醬油與鹽巴均勻調味。',
      },
      {
        stepNumber: 4,
        title: '美味出鍋',
        instruction: '熄火出鍋，湯汁淋在白飯上特別開胃。',
      },
    ],
    safetyReminder: '使用熱鍋或開蓋時請注意蒸氣，小心防燙。',
    chefTip: '起鍋前滴入 2 滴香油或烏醋，風味層次立刻昇華。',
  });

  // Recipe 3
  const name3 = `${eq3}風味綜合${primaryIng}炒／燜時蔬`;
  recipes.push({
    id: 'recipe-fallback-3',
    name: name3,
    tagline: '一次耗盡冰箱剩餘食材的百搭清冰箱大作戰',
    ratingStars: 5.0,
    recommendReason: '能夠一次性將剩餘的所有食材融合，零剩食的最佳夥伴',
    estimatedTime: '20 分鐘',
    portions: portion,
    equipment: eq3,
    difficulty: '簡單',
    flavor: '香氣四溢',
    existingIngredients: ingredients.map((ing) => ({
      name: ing,
      amount: '適量',
    })),
    supplementIngredients: [],
    seasonings: [
      { name: '黑胡椒粒', amount: '少許' },
      { name: '大蒜粉或蒜末', amount: '1 茶匙' },
      { name: '鹽', amount: '1/2 茶匙' },
    ],
    equipmentSpecifics: getSpecifics(eq3, primaryIng),
    steps: [
      {
        stepNumber: 1,
        title: '食材切配切塊',
        instruction: '將所有現有食材切成大小相仿的塊狀或條狀，便於均勻受熱。',
      },
      {
        stepNumber: 2,
        title: '入鍋均勻受熱',
        instruction:
          eq3 === '氣炸鍋'
            ? '所有食材噴上少許食用油，均勻放入炸籃以 180°C 氣炸 12 分鐘。'
            : eq3 === '電鍋'
            ? '放入內鍋，外鍋 1 杯水，利用蒸氣將食材水分與甜味完整鎖住。'
            : eq3 === '壓力鍋'
            ? '食材與調味料入鍋，加壓 5 分鐘後自然洩壓，口感軟嫩多汁。'
            : '瓦斯爐大火熱鍋，所有食材分批快速翻炒爆香，炒出鑊氣。',
      },
      {
        stepNumber: 3,
        title: '胡椒調味撒香',
        instruction: '出鍋前撒上現磨黑胡椒與少許鹽，稍微翻拌即可香氣逼人。',
      },
      {
        stepNumber: 4,
        title: '上桌品嚐',
        instruction: '滿滿一盤色彩繽紛，輕鬆解決冰箱食材庫存！',
      },
    ],
    safetyReminder: '確認食材中心皆受熱熟透，確保飲食安全健康。',
    chefTip: '蔬菜與肉類先分開過油或過熱水，炒出來色澤更翠綠透亮！',
  });

  return {
    status: 'success',
    explanation: `為您量身搭配了 3 道能充分利用冰箱「${ingredients.join('、')}」的美味佳餚，完全遵守您勾選的「${equipments.join('、')}」烹煮設備！`,
    suggestedAdditions: ['大蒜', '青蔥', '白芝麻'],
    recipes,
  };
}

export function generateSingleFallbackRecipe(params: {
  ingredients: string[];
  seasonings?: string[];
  equipments: CookingEquipment[];
  cookingTime: CookingTimeOption;
  portion: PortionOption;
  difficulty: DifficultyOption;
  flavor: FlavorOption;
  prioritizeExpiring: boolean;
  recipeToReplaceId: string;
  recipeToReplaceName: string;
  existingRecipeNames?: string[];
}): Recipe {
  const { ingredients, equipments, portion } = params;
  const eq = equipments[Math.floor(Math.random() * equipments.length)] || '瓦斯爐';
  const mainIng = ingredients[Math.floor(Math.random() * ingredients.length)] || '精選食材';
  const timestamp = Date.now();

  return {
    id: `recipe-swap-${timestamp}`,
    name: `${eq}私房香煎${mainIng}`,
    tagline: `替換特選：以${eq}打造濃郁香氣的家常私房料理`,
    ratingStars: 4.9,
    recommendReason: `精準發揮${mainIng}的天然甜味，烹調簡便`,
    estimatedTime: '15 分鐘',
    portions: portion,
    equipment: eq,
    difficulty: '簡單',
    flavor: '家常鹹香',
    existingIngredients: ingredients.map((ing) => ({ name: ing, amount: '適量' })),
    supplementIngredients: [],
    seasonings: [
      { name: '醬油', amount: '1 大匙' },
      { name: '蒜頭', amount: '2 瓣拍碎' },
      { name: '白胡椒粉', amount: '少許' },
    ],
    equipmentSpecifics: {
      gasStove: {
        heatLevel: '中火熱鍋熱油，下鍋煎至金黃後轉微火',
        heatingTime: '兩面各煎約 3～4 分鐘',
        ingredientOrder: '熱油爆香蒜瓣，再放入食材下鍋慢煎',
        stirOrCover: '翻面後加蓋燜煮 1 分鐘，鎖住鮮甜肉汁',
      },
    },
    steps: [
      { stepNumber: 1, title: '準備食材', instruction: '食材洗淨吸乾表面水分，切成適口大小。' },
      { stepNumber: 2, title: '爆香入鍋', instruction: '鍋中倒入少許食用油，蒜瓣爆香後放入食材。' },
      { stepNumber: 3, title: '慢火香煎', instruction: '以中小火煎至表面金黃微焦，翻面續煎。' },
      { stepNumber: 4, title: '淋汁起鍋', instruction: '起鍋前鍋邊淋入一茶匙醬油熗香，立刻上菜。' },
    ],
    safetyReminder: '煎煮時注意油噴，可使用防油噴蓋。',
    chefTip: '下鍋前食材表面務必吸乾水分，更容易煎出誘人金黃色澤！',
  };
}
