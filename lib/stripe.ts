import Stripe from "stripe";

// Ensure STRIPE_SECRET_KEY is set in environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
}

// Initialize Stripe with the API key and API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10", // Use a recent stable API version
  typescript: true, // Enable TypeScript support
});

// Utility function to get an absolute URL for Stripe redirects
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}

