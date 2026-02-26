"use server";

import { z } from "zod";
import { decomposeInputSchema } from "@/lib/schemas/decompose";
import { generateDecomposition } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { UserPlan } from "@/lib/auth"; // Import UserPlan

// Initialize Upstash Redis for rate limiting
// Ensure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set in environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limit: 10 requests per minute per user
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1m"),
  analytics: true,
  /**
   * Optional: A function to call to retrieve the current timestamp.
   * By default, the built-in `Date.now()` is used.
   */
  // get_current_time: () => Date.now(),
});

export async function decomposeAction(formData: FormData): Promise<{ success: boolean; message: string; type: "success" | "info"; rateLimit?: { limit: number; reset: number; remaining: number } }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Authentication required.", type: "info" };
  }

  const userId = session.user.id;

  // Apply rate limiting
  // CLAUDE.md Section 3.2: Rate Limiting: AI APIエンドポイントは1ユーザー/分10リクエスト上限
  const { success, limit, reset, remaining } = await ratelimit.limit(userId);

  if (!success) {
    return {
      success: false,
      message: `Rate limit exceeded. Please try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
      type: "info",
      rateLimit: { limit, reset, remaining },
    };
  }

  const textInput = formData.get("textInput") as string;
  const imageFile = formData.get("imageFile") as File | null;

  const inputData = {
    textInput: textInput || undefined,
    imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
  };

  // CLAUDE.md Section 2.3: すべてのServer Actionsは入力バリデーション（Zod）を実施
  const validatedFields = decomposeInputSchema.safeParse(inputData);

  if (!validatedFields.success) {
    return { success: false, message: "Invalid input. Please provide text or an image.", type: "info" };
  }

  const { textInput: validatedTextInput, imageFile: validatedImageFile } = validatedFields.data;

  try {
    // Check if the user is a free plan user and has exceeded the limit
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true, monthlyAiDecompositions: true }
    });

    // CLAUDE.md Section 5.1: Free プラン: AI分解: 月5回まで
    if (user?.plan === 'Free' && user.monthlyAiDecompositions >= 5) {
      return {
        success: false,
        message: "Free plan limit reached. Upgrade to Premium for unlimited decompositions. 💡",
        type: "info",
      };
    }

    const result = await generateDecomposition(validatedTextInput, validatedImageFile);

    if (result.error) {
      // Log the error but return a generic positive message as per "ポジティブ・ファースト"
      console.error("AI decomposition error:", result.error);
      return {
        success: false,
        message: "AI processing encountered an issue. Please try again or rephrase. 💡",
        type: "info", // Use 'info' or 'success' for positive framing
      };
    }

    // Update user's AI decomposition count only if not a Premium/Family/School plan
    // CLAUDE.md Section 5.1: Premium プラン: AI分解: 無制限
    // CLAUDE.md Section 5.1: Family プラン: AI分解: 無制限
    // CLAUDE.md Section 5.1: School プラン: AI分解: 無制限
    if (user?.plan === 'Free') {
      await db.user.update({
        where: { id: userId },
        data: { monthlyAiDecompositions: { increment: 1 } }
      });
    }

    return {
      success: true,
      message: result.decomposition!, // We know decomposition exists if no error
      type: "success",
    };
  } catch (e) {
    console.error("Server action decompose error:", e);
    return {
      success: false,
      message: "An unexpected error occurred during decomposition. Please try again. 💡",
      type: "info", // Use 'info' or 'success' for positive framing
    };
  }
}
