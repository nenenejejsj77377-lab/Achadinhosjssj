import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ParsedProductData {
  title: string;
  price: number;
  description: string;
  category: string;
  suggestedImageKeyword: string;
}

const PRODUCT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A clean, short product title (max 40 chars)." },
    price: { type: Type.NUMBER, description: "Estimated price in BRL (number only). If unknown, guess a reasonable market price." },
    description: { type: Type.STRING, description: "A witty, catchy marketing sentence in Portuguese convincing someone to buy this." },
    category: { type: Type.STRING, description: "One of: Casa, Tech, Moda, Beleza, Cozinha. Default to Casa if unsure." },
    suggestedImageKeyword: { type: Type.STRING, description: "A single English keyword to search for an image of this product (e.g., 'headphones', 'lipstick')." },
  },
  required: ["title", "price", "description", "category", "suggestedImageKeyword"],
};

export const parseProductInfo = async (inputText: string): Promise<ParsedProductData> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this raw product text/url from Shopee and extract structured data: "${inputText}". Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: PRODUCT_SCHEMA,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ParsedProductData;
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Error parsing product with Gemini:", error);
    // Fallback if AI fails
    return {
      title: "Novo Achadinho",
      price: 0,
      description: "Confira este produto incrível que separamos para você.",
      category: "Casa",
      suggestedImageKeyword: "gift"
    };
  }
};

export const syncStoreRecommendations = async (storeUrl: string): Promise<ParsedProductData[]> => {
  const listSchema: Schema = {
    type: Type.ARRAY,
    items: PRODUCT_SCHEMA
  };

  try {
    // Uses Google Search to find real trending items
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for 3 trending, viral "Achadinhos Shopee" products that are currently popular in Brazil and would fit a store like ${storeUrl}. Look for useful gadgets, home organizers, or kitchen tools. Return them as a JSON list.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: listSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ParsedProductData[];
    }
    return [];
  } catch (error) {
    console.error("Error syncing store:", error);
    return [];
  }
};