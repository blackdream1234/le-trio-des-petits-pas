import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { amount, isRecurring, email } = await req.json();
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_URL;

        // Validate inputs
        if (!amount || amount < 1) {
            return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'paypal'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: isRecurring ? 'Don Mensuel - Le Trio des Petits Pas' : 'Don Ponctuel - Le Trio des Petits Pas',
                            description: 'Merci de soutenir nos actions pour les enfants.',
                        },
                        unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents
                        recurring: isRecurring ? { interval: 'month' } : undefined,
                    },
                    quantity: 1,
                },
            ],
            mode: isRecurring ? 'subscription' : 'payment',
            customer_email: email, // Pre-fill email if provided
            success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/don`,
            metadata: {
                donation_type: isRecurring ? 'monthly' : 'one_time',
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
