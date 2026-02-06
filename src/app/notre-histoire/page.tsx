import { StorySection } from '@/components/home/StorySection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Notre Histoire - Le Trio des Petits Pas',
    description: "L'histoire de notre association, née d'une rencontre entre deux mamans.",
};

export default function HistoirePage() {
    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 bg-surface-elevated">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-text-primary mb-8">
                        Notre <span className="text-gradient">Histoire</span>
                    </h1>

                    <div className="prose prose-lg mx-auto text-text-secondary leading-relaxed space-y-6 text-left">
                        <p>
                            <strong>Le Trio des Petits Pas</strong> est né d’une rencontre entre deux mamans, liées par une même réalité : celle d’accompagner leurs enfants en situation de handicap, jour après jour, sans jamais baisser les bras.
                        </p>
                        <p>
                            Derrière chaque enfant, il y a des rendez-vous médicaux, des rééducations, des stages intensifs, des équipements coûteux, des inquiétudes… mais surtout un immense amour et une détermination sans limite pour les aider à avancer.
                        </p>
                        <p>
                            Nous avons vite compris que trop de familles se retrouvent seules face aux obstacles financiers et administratifs, alors même que chaque progrès compte.
                        </p>
                        <p>
                            Notre association est née de cette volonté profonde : <strong>ne laisser aucune famille seule dans ce parcours.</strong>
                        </p>
                        <p>
                            Le nom <em>"Le Trio des Petits Pas"</em> rend hommage à trois enfants extraordinaires qui, malgré les difficultés, nous montrent chaque jour que les plus petites avancées sont déjà de grandes victoires.
                        </p>
                        <p>
                            Aujourd’hui, l’association soutient des enfants et leurs familles en France et à l’étranger, en aidant au financement de thérapies, de matériel adapté et de stages intensifs indispensables à leur évolution.
                        </p>
                        <p className="font-bold text-primary text-xl text-center pt-8">
                            Parce que derrière chaque petit pas, il y a un combat, un espoir… et tout un avenir à construire.
                        </p>
                        <p className="text-center font-display font-bold text-2xl text-text-primary">
                            Ensemble, aidons-les à avancer.
                        </p>
                    </div>
                </div>
            </section>

            {/* Reuse the StorySection component to show the children */}
            <StorySection />
        </div>
    );
}
