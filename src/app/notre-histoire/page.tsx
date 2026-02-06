import Link from 'next/link';

export default function PlaceholderPage() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-surface px-6 text-center pt-32">
            <h1 className="font-display font-bold text-4xl mb-4 text-primary">Page en construction 🚧</h1>
            <p className="text-xl text-text-secondary mb-8 max-w-md">
                Cette page est en cours de développement. Revenez bientôt pour découvrir notre histoire et nos actions !
            </p>
            <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105">
                Retour à l'accueil
            </Link>
        </div>
    );
}
