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
  // The type for parts needs to be flexible to accommodate different structures
  const parts: ({ text: string } | { inlineData: { data: string, mimeType: string }})[] = [];

  if (isRegeneration) {
    textPrompt = `You are an expert digital image editor specializing in nail art. Your task is to modify the provided image based on the user's instructions.

**User's Instruction for Modification:**
"${prompt}"

**ABSOLUTE, NON-NEGOTIABLE CORE DIRECTIVE: PRESERVE THE BASE IMAGE**
- The input image is a locked, unchangeable canvas. You are only allowed to edit the existing nail art based on the user's instruction.
- **The output image MUST be a pixel-for-pixel perfect match to the input image in every aspect EXCEPT for the specific change requested on the nail art.** This includes:
  - **Hand Position & Shape:** Must be identical. No shifting, rotating, or resizing.
  - **Skin Tone & Lighting:** Must be identical.
  - **Background:** Must be identical.
  - **Unaltered Nail Areas:** Nails not mentioned in the prompt must remain unchanged.
- Any change, no matter how small, to anything other than the specific area of nail art you were told to edit is a critical failure. The hand must remain absolutely immutable.`;

    parts.push({ text: textPrompt });
    parts.push({ inlineData: { data: baseImage.data, mimeType: baseImage.mimeType } });

  } else {
    if (!styleImage) {
        throw new Error("Style image is required for initial generation.");
    }
    textPrompt = `You are an expert digital nail artist. Your task is to apply a new nail art design onto the fingernails in the first image (the user's hand).

**Inspiration:**
- The design should be inspired by the mood, colors, and textures of the second image (the style reference).
- The user's optional text prompt is: "${prompt || 'artist\'s choice'}".
- DO NOT simply copy the style image. Use it as an abstract inspiration to create a unique, sophisticated, and trendy design suitable for a high-fashion social media post.

**ABSOLUTE, NON-NEGOTIABLE CORE DIRECTIVE: PRESERVE THE BASE IMAGE**
- Think of this task as editing a photograph. The first image of the hand is a locked, unchangeable background layer.
- Your ONLY job is to paint a design exclusively on top of the fingernails.
- **The output image MUST be a pixel-for-pixel perfect match to the first input image in every aspect EXCEPT for the nail surfaces.** This includes:
  - **Hand Position & Shape:** Must be identical. No shifting, rotating, or resizing.
  - **Number of Hands/Fingers:** Must be identical. Do not add, remove, or duplicate any body part.
  - **Skin Tone & Lighting:** Must be identical. Do not alter shadows, highlights, or skin color.
  - **Background:** Must be identical.
- Any change, no matter how small, to anything other than the fingernails is a failure. The hand must remain absolutely immutable.`;

    parts.push({ text: textPrompt });
    parts.push({ inlineData: { data: baseImage.data, mimeType: baseImage.mimeType } });
    parts.push({ inlineData: { data: styleImage.data, mimeType: styleImage.mimeType } });
  }

  const contents = { parts };
  const config = {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
  };

  try {
    const response = await ai.models.generateContent({ model, contents, config });
    
    // Find the image part in the response
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
            return part.inlineData.data;
        }
    }
    
    throw new Error("API response did not contain an image.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('quota') || errorMessage.includes('resource has been exhausted')) {
            throw new Error("QUOTA_EXHAUSTED");
        }
    }
    throw new Error("The AI model failed to generate an image. Please try again.");
  }
}