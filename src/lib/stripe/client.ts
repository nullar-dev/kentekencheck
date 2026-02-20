import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

export const PRICE_IDS = {
  free: null,
  pro: 'price_xxx', // Replace with actual price ID
  enterprise: 'price_yyy', // Replace with actual price ID
} as const;
