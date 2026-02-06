import { Hero } from '@/components/home/Hero';
import { StorySection } from '@/components/home/StorySection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <StorySection />
      {/* Additional sections will go here */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-8">Votre soutien change des vies</h2>
          <p className="text-text-secondary">Ensemble, nous pouvons faire la différence.</p>
        </div>
      </section>
    </div>
  );
}
