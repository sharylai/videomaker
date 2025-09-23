import { GoogleGenAI, Type } from "@google/genai";
import type { VideoScript } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        videoType: {
            type: Type.STRING,
            description: "影片的類型 (例如: 廣告, 教學, 開箱)。"
        },
        scenes: {
            type: Type.ARRAY,
            description: "影片的場景陣列。",
            items: {
                type: Type.OBJECT,
                properties: {
                    scene: {
                        type: Type.INTEGER,
                        description: "場景編號。"
                    },
                    storyboard: {
                        type: Type.STRING,
                        description: "分鏡腳本：對這個場景的視覺描述，使用繁體中文。"
                    },
                    voiceover: {
                        type: Type.STRING,
                        description: "口白文字腳本：這個場景的旁白或對話，使用繁體中文。"
                    },
                    imagePrompt: {
                        type: Type.STRING,
                        description: "圖片生成提示詞：一個詳細的英文提示詞，用於AI圖片生成工具（如Imagen）來創造這個場景的靜態圖片。"
                    },
                    characterPrompt: {
                        type: Type.STRING,
                        description: "人物生成提示詞：一個詳細的英文提示詞，用於生成場景中出現的人物。如果沒有人物，則返回 'N/A'。"
                    },
                    veoPrompt: {
                        type: Type.STRING,
                        description: "Veo影片生成提示詞：一個詳細的英文提示詞，用於AI影片生成工具（如Veo）來創造這個場景的動態影片。"
                    },
                    seconds: {
                        type: Type.INTEGER,
                        description: "場景的預估秒數。"
                    },
                    music: {
                        type: Type.STRING,
                        description: "場景的背景音樂或音效描述，使用繁體中文。"
                    }
                },
                required: ["scene", "storyboard", "voiceover", "imagePrompt", "characterPrompt", "veoPrompt", "seconds", "music"]
            }
        }
    },
    required: ["videoType", "scenes"]
};

const buildPrompt = (topic: string, duration: string, style: string): string => {
    let regulatoryNotice = '';
    // Check for keywords related to health education to add a special notice.
    if (topic.includes('衛教') || topic.includes('醫藥') || topic.includes('健康') || topic.includes('法規')) {
        regulatoryNotice = `
    **特別注意事項：**
    由於主題涉及健康或醫療教育，所有內容（特別是「口白文字腳本」）都必須嚴格遵守台灣的醫藥衛生法規。
    - **禁止** 宣稱療效或誇大不實的效果。
    - 內容應基於科學事實，語氣客觀、中立。
    - 避免使用「治癒」、「保證」、「根治」、「最強」等絕對性或最高級詞語。
    - 若提及特定產品，僅能陳述一般性用途或產品資訊，不得涉及醫療效能。
    - 腳本結尾強烈建議加入「請諮詢專業醫師或藥師」等警語。
    `;
    }

    return `
    你是一位專業的影片製作人與AI腳本家，同時也是一位嚴謹的醫藥法規專家。
    你的任務是根據使用者提供的主題，為一個總長度約為${duration}的影片（例如 YouTube Short, TikTok, 或 Instagram Reel）生成一個完整的影片腳本。
    使用者提供的主題是：「${topic}」。
    影片的整體風格應為「${style}」。
    
    ${regulatoryNotice}

    請為這個主題生成一個【${style}】風格的腳本，總時長應接近${duration}。你可以自行決定場景數量以達到最佳的敘事節奏。
    你的輸出必須是嚴格的JSON格式，並完全符合提供的schema。
    
    對於每個場景，請提供以下八個欄位的內容：
    1.  scene (場景編號): 數字。
    2.  storyboard (分鏡腳本): 場景的視覺描述，包含鏡頭角度、設定和動作。請使用繁體中文。
    3.  voiceover (口白文字腳本): 場景的旁白或對話。請使用繁體中文。
    4.  imagePrompt (圖片生成提示詞): 一段詳細、電影感的英文提示詞，給AI圖片生成模型使用。
    5.  characterPrompt (人物生成提示詞): 一段詳細的英文提示詞，用於生成場景中的人物，注重外觀一致性。如果此場景沒有人物，請填寫 "N/A"。
    6.  veoPrompt (Veo影片生成提示詞): 一段詳細、描述動作的英文提示詞，給AI影片生成模型使用。
    7.  seconds (秒數): 這個場景的預估持續秒數。所有場景的秒數總和應接近${duration}。
    8.  music (音樂): 這個場景的背景音樂或音效描述。請使用繁體中文。

    請確保所有prompt都是英文，而腳本描述則是繁體中文。
    `;
};


export const generateScript = async (topic: string, duration: string, style: string): Promise<Omit<VideoScript, 'id' | 'topic' | 'createdAt' | 'style'>> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: buildPrompt(topic, duration, style),
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
                topP: 0.9,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation
        if (!parsedJson.videoType || !Array.isArray(parsedJson.scenes)) {
            throw new Error("AI返回的資料格式不正確。");
        }

        return parsedJson;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("無法從AI服務獲取腳本。請檢查您的API金鑰或稍後再試。");
    }
};