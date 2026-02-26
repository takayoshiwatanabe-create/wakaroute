import { z } from "zod";
import { UserPlan } from "@/lib/auth";

// Schema for validating the plan type when creating a Stripe checkout session
export const stripePlanSchema = z.enum(["Free", "Premium", "Family", "School"]);

// Schema for validating metadata received from Stripe webhooks
export const stripeWebhookMetadataSchema = z.object({
  userId: z.string(),
  plan: stripePlanSchema, // Use stripePlanSchema for validation
});

export type StripeWebhookMetadata = z.infer<typeof stripeWebhookMetadataSchema>;

