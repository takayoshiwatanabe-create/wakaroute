"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserPlan } from "@/lib/auth";
import { z } from "zod";

const planSchema = z.enum(["Free", "Premium", "Family", "School"]);

export async function updatePlanAction(newPlan: UserPlan): Promise<{ success: boolean; error?: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Authentication required." };
  }

  const validatedPlan = planSchema.safeParse(newPlan);
  if (!validatedPlan.success) {
    return { success: false, error: "Invalid plan selected." };
  }

  const userId = session.user.id;

  try {
    // In a real application, this would involve Stripe API calls for payment processing
    // and subscription management. For this project, we'll simulate the update directly.

    // Update the user's plan in the database
    await db.user.update({
      where: { id: userId },
      data: { plan: validatedPlan.data },
    });

    // Revalidate session to reflect the new plan immediately
    // Note: NextAuth.js v5 handles session updates more dynamically,
    // but a client-side `getSession({ force: true })` might be needed
    // or a redirect to trigger a new session fetch.
    // For a server action, the session object itself needs to be updated.
    // This is a simplification for the current scope.

    return { success: true };
  } catch (e) {
    console.error("Failed to update user plan:", e);
    return { success: false, error: "Failed to update plan. Please try again." };
  }
}
