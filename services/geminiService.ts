import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateNailArt(
  baseImage: ImageData,
  styleImage: ImageData | null,
  prompt: string,
  isRegeneration: boolean = false
): Promise<string> {
  const model = 'gemini-2.5-flash-image-preview';
  
  let textPrompt: string;
  const parts: ({ text: string } | { inlineData: { data: string, mimeType: string }})[] = [];

  if (isRegeneration) {
    // Simplified prompt for regeneration
    textPrompt = `Edit the nail art on the hand in the image based on the following instruction: "${prompt}". Only modify the nail art. Do not change the hand, skin, or background.`;
    
    parts.push({ inlineData: { data: baseImage.data, mimeType: baseImage.mimeType } });
    parts.push({ text: textPrompt });

  } else {
    if (!styleImage) {
        throw new Error("Style image is required for initial generation.");
    }
    // Simplified prompt for initial generation
    textPrompt = `Apply nail art to the user's hand (first image) inspired by the style of the second image. The user's specific request is: "${prompt || 'a creative design based on the style image'}". Only apply art to the nails. The hand, skin tone, and background must not be changed.`;

    // The order of parts can matter. Let's provide images first, then the prompt.
    parts.push({ inlineData: { data: baseImage.data, mimeType: baseImage.mimeType } }); // User's hand
    parts.push({ inlineData: { data: styleImage.data, mimeType: styleImage.mimeType } }); // Style reference
    parts.push({ text: textPrompt });
  }

  const contents = { parts };
  const config = {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
  };

  try {
    const response = await ai.models.generateContent({ model, contents, config });
    
    // Find the image part in the response more safely
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData?.data);

    if (imagePart && imagePart.inlineData) {
        return imagePart.inlineData.data;
    }
    
    // For debugging: if no image, log if there's text
    const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
    if (textPart?.text) {
      console.warn("Gemini API returned text instead of an image:", textPart.text);
    }
    
    throw new Error("API response did not contain an image.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('quota') || errorMessage.includes('resource has been exhausted')) {
            throw new Error("QUOTA_EXHAUSTED");
        }
        // Re-throw our specific error to be caught in the UI
        if (errorMessage.includes('api response did not contain an image')) {
            throw error;
        }
    }
    throw new Error("The AI model failed to generate an image. Please try again.");
  }
}