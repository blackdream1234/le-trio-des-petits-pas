'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, CreditCard, Calendar, Check } from 'lucide-react';

export function DonationForm() {
    const [amount, setAmount] = useState<number>(15);
    const [isRecurring, setIsRecurring] = useState(true); // Default to monthly membership
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const predefinedAmounts = [10, 15, 30, 50, 100];

    const handleDonate = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, isRecurring, email }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Une erreur est survenue.');
            }
        } catch (e) {
            console.error(e);
            alert('Erreur de connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-surface-elevated rounded-3xl shadow-xl overflow-hidden border border-border">
            {/* Header */}
            <div className="bg-gradient-primary p-6 text-white text-center">
                <h3 className="font-display text-2xl font-bold mb-2">Faire un don</h3>
                <p className="opacity-90">Soutenez nos petits pas vers de grandes victoires</p>
            </div>

            <div className="p-8 space-y-8">
                {/* Frequency Toggle */}
                <div className="flex bg-surface rounded-full p-1 border border-border">
                    <button
                        onClick={() => setIsRecurring(false)}
                        className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${!isRecurring ? 'bg-white shadow-md text-primary' : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        Une fois
                    </button>
                    <button
                        onClick={() => setIsRecurring(true)}
                        className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${isRecurring ? 'bg-white shadow-md text-secondary' : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <span>Mensuel</span>
                        <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full uppercase tracking-wider">Adhésion</span>
                    </button>
                </div>

                {/* Amount Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-text-secondary uppercase tracking-wider">Montant du don</label>
                    <div className="grid grid-cols-3 gap-3">
                        {predefinedAmounts.map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setAmount(amt)}
                                className={`py-3 rounded-xl font-bold border-2 transition-all ${amount === amt
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-border bg-surface hover:border-primary/50 text-text-secondary'
                                    }`}
                            >
                                {amt} €
                            </button>
                        ))}
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className={`w-full h-full py-3 px-4 rounded-xl font-bold border-2 text-center outline-none transition-all ${!predefinedAmounts.includes(amount) ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface'
                                    }`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold">€</span>
                        </div>
                    </div>
                </div>

                {/* Impact Message */}
                <div className="bg-surface p-4 rounded-xl border border-secondary/20 flex items-start gap-3">
                    <div className="bg-secondary/10 p-2 rounded-full text-secondary shrink-0">
                        <Heart size={20} className="fill-current" />
                    </div>
                    <p className="text-sm text-text-secondary">
                        <span className="font-bold text-text-primary">Votre impact :</span> Avec {amount}€ {isRecurring && 'par mois'}, vous financez {amount >= 15 ? "une partie du matériel adapté" : "des fournitures essentielles"} pour les enfants.
                    </p>
                </div>

                {/* Email Input (Optional for guest, usually handled by Stripe, but good to capture early) */}
                {/* Skipping strict validation here, Stripe handles it well, but passing it helps */}

                {/* Donate Button */}
                <button
                    onClick={handleDonate}
                    disabled={loading}
                    className="w-full bg-accent hover:bg-accent-light text-white font-bold py-4 rounded-xl shadow-lg shadow-accent/25 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    ) : (
                        <>
                            {isRecurring ? <Calendar size={20} /> : <CreditCard size={20} />}
                            <span>{isRecurring ? 'Devenir membre' : 'Faire un don'} de {amount} €</span>
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-text-secondary">
                    Site sécurisé • Paiement via Stripe • Reçu fiscal envoyé automatiquement
                </p>
            </div>
        </div>
    );
}
