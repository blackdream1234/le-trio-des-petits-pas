import { HelloAssoWidget } from '@/components/donation/HelloAssoWidget';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Faire un don - Le Trio des Petits Pas',
    description: 'Soutenez notre association et aidez les enfants atteints de paralysie cérébrale.',
};

export default function DonationPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-surface">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Context & Emotion */}
                    <div className="space-y-8 animate-in slide-in-from-left duration-700">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary">
                            Chaque don est un pas <span className="text-gradient">vers l'autonomie</span>
                        </h1>

                        <p className="text-xl text-text-secondary leading-relaxed">
                            Le Trio des Petits Pas est une association à but non lucratif. 100% de vos dons sont investis directement dans l'aide aux enfants et à leurs familles.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                            <FeatureCard
                                emoji="🪜"
                                title="Matériel Adapté"
                                desc="Financement de déambulateurs, sièges moulés et verticalisateurs non remboursés."
                            />
                            <FeatureCard
                                emoji="🤲"
                                title="Stages Intensifs"
                                desc="Prise en charge de thérapies spécialisées essentielles au développement moteur."
                            />
                            <FeatureCard
                                emoji="🤝"
                                title="Soutien Familles"
                                desc="Aide au répit et accompagnement dans les démarches administratives."
                            />
                            <FeatureCard
                                emoji="🔬"
                                title="Innovation"
                                desc="Accès aux nouvelles technologies comme les tablettes à commande oculaire."
                            />
                        </div>
                    </div>

                    {/* Right Column: Donation Form */}
                    <div className="animate-in slide-in-from-right duration-700 delay-200 flex justify-center lg:justify-end">
                        <HelloAssoWidget />
                    </div>

                </div>
            </div>
        </div>
    );
}

function FeatureCard({ emoji, title, desc }: { emoji: string, title: string, desc: string }) {
    return (
        <div className="bg-surface-elevated p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{emoji}</div>
            <h3 className="font-bold text-lg text-text-primary mb-2">{title}</h3>
            <p className="text-sm text-text-secondary">{desc}</p>
        </div>
    );
}
