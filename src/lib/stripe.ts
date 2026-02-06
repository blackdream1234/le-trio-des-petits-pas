import Stripe from 'stripe';

// Prevent build failure if key is missing
const key = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_build';

export const stripe = new Stripe(key, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
});
