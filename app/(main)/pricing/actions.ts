"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserPlan } from "@/lib/auth";
import { z } from "zod";
import { stripe } from "@/lib/stripe"; // Import Stripe instance
import { absoluteUrl } from "@/lib/utils"; // Utility for absolute URLs

// CLAUDE.md Section 2.3: すべてのServer Actionsは入力バリデーション（Zod）を実施
const planSchema = z.enum(["Free", "Premium", "Family", "School"]);

// Map UserPlan to Stripe Price ID (these should be configured in Stripe Dashboard)
// CLAUDE.md Section 5.1: Defines Premium, Family, School plans
const PLAN_PRICE_IDS: Record<UserPlan, string | null> = {
  Free: null, // Free plan has no Stripe price
  Premium: process.env.STRIPE_PREMIUM_PRICE_ID || null,
  Family: process.env.STRIPE_FAMILY_PRICE_ID || null,
  School: null, // School plan requires custom contact, no direct Stripe checkout
};

export async function createStripeCheckoutSessionAction(newPlan: UserPlan): Promise<{ success: boolean; url?: string; error?: string }> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return { success: false, error: "Authentication required." };
  }

  const validatedPlan = planSchema.safeParse(newPlan);
  if (!validatedPlan.success) {
    return { success: false, error: "Invalid plan selected." };
  }

  const userId = session.user.id;
  const userEmail = session.user.email;
  const priceId = PLAN_PRICE_IDS[validatedPlan.data];

  // Handle Free plan selection (downgrade or initial selection)
  if (validatedPlan.data === "Free") {
    // If the user is already on the Free plan, no action needed
    if (session.user.plan === "Free") {
      return { success: true, url: absoluteUrl(`/pricing?status=success&plan=Free`) };
    }
    try {
      // CLAUDE.md Section 5.1: Freemium境界の明確化 - Free プラン
      await db.user.update({
        where: { id: userId },
        data: {
          plan: "Free",
          stripeCustomerId: null, // Clear Stripe IDs for Free plan
          stripeSubscriptionId: null,
          monthlyAiDecompositions: 0, // Reset count on plan change
        },
      });
      return { success: true, url: absoluteUrl(`/pricing?status=success&plan=Free`) };
    } catch (e) {
      console.error("Failed to downgrade to Free plan:", e);
      return { success: false, error: "Failed to downgrade to Free plan. Please try again." };
    }
  }

  // Handle School plan (contact us)
  if (validatedPlan.data === "School") {
    // CLAUDE.md Section 5.1: School プラン requires custom contact
    // This action should ideally trigger an email or redirect to a contact form,
    // not a Stripe checkout. For now, we'll return an error.
    return { success: false, error: "Please contact us for School plan details." };
  }

  // For Premium and Family plans, proceed with Stripe checkout
  if (!priceId) {
    return { success: false, error: "Price ID not configured for this plan." };
  }

  try {
    let stripeCustomerId = session.user.stripeCustomerId;

    // If user doesn't have a Stripe customer ID, create one
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId,
        },
      });
      stripeCustomerId = customer.id;

      // Update user in DB with new Stripe customer ID
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId: stripeCustomerId },
      });
    }

    // Create a Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription", // For recurring payments
      success_url: absoluteUrl(`/pricing?status=success&session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absoluteUrl(`/pricing?status=cancelled`),
      metadata: {
        userId: userId,
        plan: validatedPlan.data,
      },
    });

    if (stripeSession.url) {
      return { success: true, url: stripeSession.url };
    } else {
      return { success: false, error: "Failed to create Stripe checkout session URL." };
    }
  } catch (e) {
    console.error("Failed to create Stripe checkout session:", e);
    return { success: false, error: "Failed to initiate payment. Please try again." };
  }
}

