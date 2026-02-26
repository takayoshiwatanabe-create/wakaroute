import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { UserPlan } from "@/lib/auth";

// Define a type for the expected metadata
interface StripeMetadata {
  userId: string;
  plan: UserPlan;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Ensure event.data.object is correctly typed as Stripe.Checkout.Session
  const data = event.data.object;
  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        const session = data as Stripe.Checkout.Session;
        const metadata = session.metadata as StripeMetadata | undefined;

        if (!metadata?.userId || !metadata?.plan) {
          console.error("Stripe Webhook: Missing userId or plan in metadata for checkout.session.completed.", metadata);
          return new NextResponse("Missing metadata", { status: 400 });
        }

        // Payment is successful and the subscription is created.
        // Provision the customer's access to the subscription.
        if (!session.subscription) {
          console.error("Stripe Webhook: Checkout session completed but no subscription ID found.");
          return new NextResponse("No subscription ID", { status: 400 });
        }
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await db.user.update({
          where: { id: metadata.userId },
          data: {
            plan: metadata.plan,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            monthlyAiDecompositions: 0, // Reset AI decomposition count for new subscription (or upgrade)
          },
        });
        console.log(`User ${metadata.userId} plan updated to ${metadata.plan}.`);
        break;
      }

      case "invoice.payment_succeeded": {
        // This event is useful for handling recurring payments after the initial checkout.
        // It confirms a payment was made for an invoice, which typically means a subscription
        // is active and paid for the current period.
        const invoice = data as Stripe.Invoice;
        // You might want to log this or update a 'lastPaid' timestamp for the user.
        // For plan updates, `checkout.session.completed` and `customer.subscription.updated` are more direct.
        console.log(`Invoice payment succeeded for customer: ${invoice.customer}. Invoice ID: ${invoice.id}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = data as Stripe.Subscription;
        // This event fires for various subscription changes, including plan changes, renewals, etc.
        // We need to check if the status indicates an active subscription.
        if (subscription.status === 'active') {
          const user = await db.user.findFirst({
            where: { stripeSubscriptionId: subscription.id },
          });

          if (user) {
            // Retrieve the product associated with the subscription item to determine the plan
            const priceId = subscription.items.data[0]?.price.id;
            let newPlan: UserPlan = "Free"; // Default to Free if priceId not found or mapped

            if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
              newPlan = "Premium";
            } else if (priceId === process.env.STRIPE_FAMILY_PRICE_ID) {
              newPlan = "Family";
            }
            // School plan is not handled via direct subscription updates here as it's custom.

            if (user.plan !== newPlan) {
              await db.user.update({
                where: { id: user.id },
                data: {
                  plan: newPlan,
                  monthlyAiDecompositions: 0, // Reset count on plan change
                },
              });
              console.log(`User ${user.id} subscription updated. Plan changed to ${newPlan}.`);
            }
          } else {
            console.warn(`User not found for subscription ID: ${subscription.id} during update.`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        // Handle subscription cancelled or deleted.
        // Revoke access to the subscription.
        const deletedSubscription = data as Stripe.Subscription;
        // Find the user by stripeSubscriptionId
        const userToDowngrade = await db.user.findFirst({
          where: { stripeSubscriptionId: deletedSubscription.id },
        });

        if (userToDowngrade) {
          // CLAUDE.md Section 5.2: 解約はワンクリックで完了できること - This webhook handles the backend part of cancellation.
          await db.user.update({
            where: { id: userToDowngrade.id },
            data: {
              plan: "Free", // Downgrade to Free plan
              stripeSubscriptionId: null,
              // Optionally, keep stripeCustomerId for future re-subscriptions
              monthlyAiDecompositions: 0, // Reset count on downgrade
            },
          });
          console.log(`Subscription deleted for user ${userToDowngrade.id}. Downgraded to Free plan.`);
        } else {
          console.warn(`User not found for subscription ID: ${deletedSubscription.id}.`);
        }
        break;
      }

      default:
        console.warn(`Unhandled event type ${eventType}`);
    }
  } catch (error) {
    console.error("Stripe Webhook Handler Error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}

