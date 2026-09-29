import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import type { GenerateRecipesRequest, SwapRecipeRequest } from './src/types';
import { generateFallbackRecipes } from './src/recipeEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const recipeResponseSchema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      description: "'success' if recipes could be generated, or 'insufficient_ingredients' if too few ingredients to reasonably cook.",
    },
    explanation: {
      type: Type.STRING,
      description: "溫暖的生活感語氣說明這幾道菜的設計概念，或若缺少食材時的親切建議。",
    },
    suggestedAdditions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "建議可順道採買或常備的簡單食材（若有）",
    },
    recipes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING, description: "料理名稱，例如「電鍋洋蔥雞肉蒸蛋」" },
          tagline: { type: Type.STRING, description: "一句話料理特色介紹" },
          ratingStars: { type: Type.NUMBER, description: "推薦星等 (4.5 ~ 5.0)" },
          recommendReason: { type: Type.STRING, description: "推薦理由，例如為什麼這道最適合目前食材" },
          estimatedTime: { type: Type.STRING, description: "預估料理時間，例如「20 分鐘」" },
          portions: { type: Type.STRING, description: "建議份量，例如「2 人份」" },
          equipment: {
            type: Type.STRING,
            description: "必須為使用者勾選的烹調設備之一：'電鍋'、'瓦斯爐'、'壓力鍋'、'氣炸鍋'",
          },
          difficulty: { type: Type.STRING, description: "'簡單' 或 '一般'" },
          flavor: { type: Type.STRING, description: "風味特點，例如「清淡鮮甜」、「家常香濃」" },
          existingIngredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING },
              },
              required: ["name", "amount"],
            },
            description: "來自使用者冰箱已有食材清單",
          },
          supplementIngredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING },
              },
              required: ["name", "amount"],
            },
            description: "需要額外補充的少量食材（請盡可能少，僅在必備時列出）",
          },
          seasonings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                amount: { type: Type.STRING },
              },
              required: ["name", "amount"],
            },
            description: "調味料與建議用量（如鹽 1/2茶匙、醬油 1大匙、白胡椒 少許）",
          },
          equipmentSpecifics: {
            type: Type.OBJECT,
            properties: {
              electricSteamer: {
                type: Type.OBJECT,
                properties: {
                  potPlacement: { type: Type.STRING, description: "內鍋食材放置方式" },
                  outerWater: { type: Type.STRING, description: "外鍋加水量（例如：1杯水，約160ml）" },
                  steamerRack: { type: Type.BOOLEAN, description: "是否需要蒸架" },
                  simmerTime: { type: Type.STRING, description: "電鍋跳起後燜煮時間（例如：跳起後燜 5 分鐘）" },
                },
              },
              gasStove: {
                type: Type.OBJECT,
                properties: {
                  heatLevel: { type: Type.STRING, description: "火力控制：大火／中火／小火" },
                  heatingTime: { type: Type.STRING, description: "各階段加熱時間" },
                  ingredientOrder: { type: Type.STRING, description: "食材下鍋順序" },
                  stirOrCover: { type: Type.STRING, description: "是否需要翻炒或加蓋燜煮" },
                },
              },
              pressureCooker: {
                type: Type.OBJECT,
                properties: {
                  pressureTime: { type: Type.STRING, description: "加壓時間（例如：中火加壓 8 分鐘）" },
                  releaseMethod: { type: Type.STRING, description: "洩壓方式（自然洩壓 或 快速洩壓）" },
                  safetyWarning: { type: Type.STRING, description: "壓力鍋安全提醒（例如：食材湯水勿超過 2/3 容量）" },
                },
              },
              airFryer: {
                type: Type.OBJECT,
                properties: {
                  temperature: { type: Type.STRING, description: "建議溫度（例如：180°C）" },
                  cookingTime: { type: Type.STRING, description: "烹調時間（例如：12 分鐘）" },
                  preheat: { type: Type.BOOLEAN, description: "是否需要預熱" },
                  flipOrShake: { type: Type.STRING, description: "中途是否需要翻面或搖晃" },
                },
              },
            },
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                instruction: { type: Type.STRING, description: "具體步驟說明，不要只寫煮熟即可" },
                equipmentTip: { type: Type.STRING, description: "針對該設備的技巧叮嚀" },
                safetyNotice: { type: Type.STRING, description: "食安或設備操作提醒" },
              },
              required: ["stepNumber", "instruction"],
            },
          },
          safetyReminder: {
            type: Type.STRING,
            description: "食品安全重要提醒（例如生肉/蛋需充分加熱至中心無血水、高溫防燙等）",
          },
          chefTip: { type: Type.STRING, description: "主廚私房料理撇步" },
        },
        required: [
          "id",
          "name",
          "tagline",
          "ratingStars",
          "recommendReason",
          "estimatedTime",
          "portions",
          "equipment",
          "difficulty",
          "flavor",
          "existingIngredients",
          "supplementIngredients",
          "seasonings",
          "equipmentSpecifics",
          "steps",
          "safetyReminder",
        ],
      },
    },
  },
  required: ["status", "explanation", "recipes"],
};

const SYSTEM_INSTRUCTION = `
你是一位專業、溫暖、擅長善用冰箱剩餘食材的台灣家常料理主廚與生活美食專家。
使用者會提供：
1. 冰箱現有食材清單
2. 廚房現有調味料與辛香料清單（若有提供）
3. 可使用的烹調設備（限於：電鍋、瓦斯爐、壓力鍋、氣炸鍋 四種中的一個或多個）
4. 料理條件（烹調時間限制、份量人數、難度偏好、口味偏好、是否優先消耗快過期食材）

你必須嚴格遵守以下準則：
1. 語言：一律使用自然親切的繁體中文（台灣習慣用語，例如：洋蔥、青蔥、黑胡椒、電鍋外鍋、杯水、燜煮）。
2. 絕對優先使用使用者已輸入的現有食材與現有調味料/辛香料，大幅減少額外採買。如果缺少少量必要食材，可列在「需要補充」中，但切勿要求採買昂貴或大量的主食材。
3. 調味與辛香料運用：請積極善用使用者所勾選的調味料與辛香料（如蔥薑蒜、白胡椒、醬油、米酒、蠔油等），避免推薦使用者未擁有的冷門或昂貴香料。
4. 嚴格限定設備：料理必須「完全符合」使用者所勾選的烹調設備！絕對不能推薦使用者沒有選擇的設備。如果使用者選擇多種設備，請儘可能為不同道菜分配不同設備（例如勾選電鍋和氣炸鍋時，一道電鍋蒸蛋、一道氣炸肉品、一道電鍋燉湯）。
5. 針對各設備產生符合特性的專業步驟：
   - 【電鍋】：必須詳細註明內鍋食材放置方式、外鍋水量（幾杯水、約幾cc）、是否需要蒸架、電鍋跳起後是否燜煮（燜幾分鐘）。
   - 【瓦斯爐】：必須詳細註明火力（大火／中火／小火／微火）、各步驟加熱時間、食材入鍋順序、翻炒或加蓋燜煮要求。
   - 【壓力鍋】：必須詳細註明中火/高壓加壓時間、洩壓方式（自然洩壓或手動快速洩壓）、並提供絕對不能超過 Max 容量（如2/3或易起泡食材1/2）的安全警示。
   - 【氣炸鍋】：必須詳細註明建議溫度（如180°C）、烘烤時間、是否需預熱（如180°C預熱3分鐘）、中途是否拉出翻面或搖晃炸籃（如第幾分鐘翻面）。
6. 料理步驟具體明確：使用清楚有邏輯的編號 Step 1, Step 2...，明確指出刀工、調味順序與火候時間，不要只寫含糊的「煮熟即可」。
7. 食安與安全提醒：
   - 涉及生雞肉、豬肉、海鮮或雞蛋等食材時，步驟與 safetyReminder 必須明確提醒「確認肉品內部無血水、中心溫度達標，雞蛋充分凝固加熱熟透」。
   - 壓力鍋與氣炸鍋須提醒避免高溫蒸氣燙傷或洩壓安全。
8. 「優先消耗快過期食材」：若為開啟狀態，請在食譜設計中大量使用使用者所列出的主要生鮮食材，減少浪費。
9. 數量要求：一次產生 3 道風味不同、搭配適宜的料理。如果食材組合較極限，不要胡亂拼湊不合理的黑暗料理，應親切說明原因並建議補充 1~2 樣百搭食材（如雞蛋或豆腐）。
`;

// Helper function to call Gemini with fallback model
async function callGeminiGenerate(userPrompt: string) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: recipeResponseSchema,
        },
      });

      const text = response.text;
      if (text) {
        return JSON.parse(text);
      }
    } catch (err: any) {
      console.warn(`Call to ${model} encountered issue:`, err.message || err);
      // If 503 or transient error, continue to next model
    }
  }

  throw new Error('Gemini API models temporarily busy');
}

// API endpoint: Generate 3 recipes
app.post('/api/recipes/generate', async (req: Request, res: Response) => {
  const body = req.body as GenerateRecipesRequest;
  const {
    ingredients,
    seasonings = [],
    equipments,
    cookingTime,
    portion,
    difficulty,
    flavor,
    prioritizeExpiring,
  } = body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: '請提供至少一項食材' });
  }
  if (!equipments || equipments.length === 0) {
    return res.status(400).json({ error: '請至少選擇一種烹調設備' });
  }

  const userPrompt = `
請根據以下條件，為我構思 3 道日常美味家常料理：

【冰箱現有食材】：
${ingredients.join('、')}

【廚房現有調味料與辛香料】：
${seasonings.length > 0 ? seasonings.join('、') : '僅基本油、鹽、清水'}

【可用烹調設備】（嚴格限制只使用其中一種或多種）：
${equipments.join('、')}

【料理時間限制】：${cookingTime}
【建議份量】：${portion}
【難度偏好】：${difficulty}
【口味偏好】：${flavor}
【優先消耗快過期食材】：${prioritizeExpiring ? '是（請大方且有效率地耗盡現有生鮮食材）' : '否'}

請嚴格根據各設備的物理烹調特性（電鍋的外鍋水與燜煮、瓦斯爐火候順序、壓力鍋加壓與洩壓、氣炸鍋溫度翻面）提供完整詳細的結構化 JSON。每道菜必須給予獨特 id (如 recipe-1, recipe-2, recipe-3)。
`;

  try {
    const data = await callGeminiGenerate(userPrompt);
    return res.json(data);
  } catch (error: any) {
    console.warn('Falling back to local culinary engine due to API condition:', error.message);
    const fallbackData = generateFallbackRecipes(body);
    return res.json(fallbackData);
  }
});

// API endpoint: Swap one recipe
app.post('/api/recipes/swap-one', async (req: Request, res: Response) => {
  const body = req.body as SwapRecipeRequest;
  const {
    ingredients,
    seasonings = [],
    equipments,
    cookingTime,
    portion,
    difficulty,
    flavor,
    prioritizeExpiring,
    recipeToReplaceName,
    existingRecipeNames,
  } = body;

  const singleRecipeSchema = {
    type: Type.OBJECT,
    properties: {
      recipe: (recipeResponseSchema.properties.recipes as any).items,
    },
    required: ['recipe'],
  };

  const userPrompt = `
使用者想要換掉目前的這道料理：「${recipeToReplaceName}」。
目前菜單上已有的其他菜色包括：${existingRecipeNames.join('、')}。

請利用使用者的現有條件，產生「另外一道全新、不同風格或作法」的料理來替換它：
【冰箱現有食材】：${ingredients.join('、')}
【廚房現有調味料與辛香料】：${seasonings.length > 0 ? seasonings.join('、') : '僅基本油、鹽、清水'}
【可用烹調設備】（嚴格限制）：${equipments.join('、')}
【料理時間限制】：${cookingTime}
【建議份量】：${portion}
【難度偏好】：${difficulty}
【口味偏好】：${flavor}
【優先消耗快過期食材】：${prioritizeExpiring ? '是' : '否'}

請給出一個獨特的新 id，並回傳結構化 JSON：{"recipe": { ... }}。
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.85,
        responseMimeType: 'application/json',
        responseSchema: singleRecipeSchema,
      },
    });

    const text = response.text;
    if (text) {
      const parsedData = JSON.parse(text);
      return res.json(parsedData.recipe);
    }
    throw new Error('Empty response from Gemini');
  } catch (error: any) {
    console.warn('Swap one fallback due to:', error.message);
    const fallbackList = generateFallbackRecipes(body);
    // Return a recipe that is not in existingRecipeNames
    const candidate =
      fallbackList.recipes.find((r) => !existingRecipeNames.includes(r.name)) ||
      fallbackList.recipes[0];
    return res.json({
      ...candidate,
      id: `recipe-swap-${Date.now()}`,
      name: `${equipments[0]}特製${ingredients[0] || '美味'}佳餚`,
    });
  }
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
