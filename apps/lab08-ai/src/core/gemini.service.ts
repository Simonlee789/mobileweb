import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "./firebase";
import { imageAnalysisSchema, type Base64Image, type ImageAnalysisResult } from "./ai.interface";

export const ai = getAI(app, { backend: new GoogleAIBackend() });
export const visionModel = getGenerativeModel(ai, {
  model: "gemini-1.5-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: imageAnalysisSchema,
  },
});

export class GeminiVisionService {
  static async analyze(image: Base64Image): Promise<ImageAnalysisResult> {
    const prompt = "วิเคราะห์ภาพนี้และตอบกลับตาม JSON schema เท่านั้น: caption เป็นภาษาไทย, tags 3-8 ค่า";
    const imagePart = { inlineData: { data: image.base64, mimeType: image.mimeType } };
    const resp = await visionModel.generateContent([prompt, imagePart]);
    return JSON.parse(resp.response.text()) as ImageAnalysisResult;
  }
}