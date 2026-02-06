'use client';

import { HeroScene } from './HeroScene';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export function Hero() {
    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data && e.data.height) {
                const haWidgetElement = document.getElementById('haWidget');
                if (haWidgetElement) {
                    (haWidgetElement as HTMLIFrameElement).style.height = e.data.height + 'px';
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface">
            {/* 3D Background */}
            <HeroScene />

            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-surface pointer-events-none" />

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Text Interactive */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6 text-center lg:text-left"
                >
                    <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-tight text-text-primary">
                        Chaque petit pas compte... <br />
                        <span className="text-gradient">Ensemble, aidons-les à avancer.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Le Trio des Petits Pas est une association créée par des mamans pour soutenir les enfants en situation de handicap et leurs familles.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                        <Link
                            href="/notre-histoire"
                            className="bg-white/80 hover:bg-white text-text-primary px-8 py-4 rounded-full font-bold flex items-center space-x-2 transition-all transform hover:scale-105 shadow-md hover:shadow-xl backdrop-blur-sm border border-border"
                        >
                            <span>Notre Histoire</span>
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>

                {/* Glass Donation Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="flex justify-center lg:justify-end"
                >
                    <div className="glass p-8 rounded-3xl max-w-md w-full relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
                        {/* Decorative blob behind card content */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-all duration-700" />

                        <h3 className="text-2xl font-bold font-display text-text-primary mb-2 relative z-10">
                            Rejoignez le mouvement
                        </h3>
                        <p className="text-text-secondary mb-6 relative z-10">
                            Votre adhésion de 15€ permet de financer du matériel adapté pour nos enfants.
                        </p>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-secondary/20">
                                <span className="font-medium">Adhésion annuelle</span>
                                <span className="font-bold text-primary text-xl">15 €</span>
                            </div>

                            <iframe
                                id="haWidget"
                                src="https://www.helloasso.com/associations/le-trio-des-petits-pas/adhesions/adhesion/widget-bouton"
                                style={{ width: '100%', height: '70px', border: 'none' }}
                                // @ts-ignore
                                allowtransparency="true"
                            ></iframe>

                            <p className="text-center text-xs text-text-secondary mt-2">
                                Paiement sécurisé via HelloAsso • Déductible des impôts
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
