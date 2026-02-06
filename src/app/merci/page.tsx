'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle, Home, Download } from 'lucide-react';

function ThankYouContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Fire confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen py-32 bg-surface flex items-center justify-center">
            <div className="container mx-auto px-6 max-w-2xl text-center">
                <div className="mb-8 flex justify-center">
                    <div className="bg-secondary/10 p-6 rounded-full text-secondary animate-bounce">
                        <CheckCircle size={64} />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
                    Merci du fond du cœur !
                </h1>

                <p className="text-xl text-text-secondary mb-12 leading-relaxed">
                    Votre générosité est un pas de plus vers l'autonomie pour nos enfants.
                    Vous recevrez votre reçu fiscal par email dans quelques instants.
                </p>

                <div className="glass p-8 rounded-3xl mb-12 border border-secondary/20 bg-secondary/5">
                    <h3 className="font-bold text-lg mb-4">Que se passe-t-il maintenant ?</h3>
                    <ul className="text-left space-y-4 text-text-secondary">
                        <li className="flex items-start gap-3">
                            <span className="bg-white rounded-full p-1 shadow-sm shrink-0">📧</span>
                            <span>Vous allez recevoir un email de confirmation.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-white rounded-full p-1 shadow-sm shrink-0">🧾</span>
                            <span>Votre attestation fiscale est jointe à l'email.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-white rounded-full p-1 shadow-sm shrink-0">🧸</span>
                            <span>Votre don est immédiatement alloué à nos projets.</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2"
                    >
                        <Home size={20} />
                        <span>Retour à l'accueil</span>
                    </Link>

                    <button className="bg-surface hover:bg-surface-elevated text-text-primary border border-border px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2">
                        <Download size={20} />
                        <span>Télécharger le reçus</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <ThankYouContent />
        </Suspense>
    );
}
