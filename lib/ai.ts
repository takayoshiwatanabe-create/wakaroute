import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Ensure GOOGLE_GEMINI_API_KEY is set in environment variables
const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

// Initialize the Gemini Pro Vision model for text and image input
const model = genAI.getGenerativeModel({
  model: "gemini-pro-vision",
  // Configure safety settings as per CLAUDE.md Section 6.1
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// Helper function to convert File to GoogleGenerativeAI.Part
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Extract base64 part (e.g., "data:image/png;base64,iVBORw0...")
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Handle cases where result is not a string
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

/**
 * Generates a decomposition of a given text and/or image using Google Gemini.
 * Adheres to "ポジティブ・ファースト" and "AI補助・人間主体" principles.
 *
 * @param textInput The text to decompose.
 * @param imageFile An optional image file to analyze.
 * @returns An object containing the decomposition string or an error message.
 */
export async function generateDecomposition(
  textInput?: string,
  imageFile?: File
): Promise<{ decomposition?: string; error?: string }> {
  if (!textInput && !imageFile) {
    return { error: "Either text or an image must be provided for decomposition." };
  }

  const parts: (string | { inlineData: { data: string; mimeType: string } })[] = [];

  // Construct the prompt based on available input
  let prompt = "以下の内容について、子どもにもわかるように、ポジティブな言葉で、スモールステップで分解して説明してください。難しい言葉は使わず、比喩や具体例を交えてください。答えは「提案」として提示し、断定的な表現は避けてください。";

  if (textInput) {
    parts.push(prompt + `\n\n内容: ${textInput}`);
  } else {
    parts.push(prompt);
  }

  if (imageFile) {
    try {
      const imagePart = await fileToGenerativePart(imageFile);
      parts.push(imagePart);
    } catch (e) {
      console.error("Error processing image file:", e);
      return { error: "Failed to process image file." };
    }
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    const response = result.response;
    const text = response.text();

    if (!text) {
      return { error: "AI did not return a valid decomposition." };
    }

    // AI生成コンテンツには視覚的マーカー（🤖アイコン等）を付与
    return { decomposition: `🤖 ${text}` };
  } catch (e: any) {
    console.error("Gemini API error:", e);
    // Check for specific safety errors
    if (e.response && e.response.promptFeedback && e.response.promptFeedback.safetyRatings) {
      const safetyRatings = e.response.promptFeedback.safetyRatings;
      const blockedCategories = safetyRatings
        .filter((rating: any) => rating.blocked)
        .map((rating: any) => rating.category);
      if (blockedCategories.length > 0) {
        return {
          error: `Content blocked due to safety concerns: ${blockedCategories.join(", ")}. Please try different input.`,
        };
      }
    }
    return { error: "Failed to generate decomposition from AI." };
  }
}
