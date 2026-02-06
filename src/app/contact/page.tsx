import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow pt-32 pb-20 bg-surface">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">

                        {/* Header Section */}
                        <div className="text-center mb-16">
                            <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-6">
                                Contactez-nous
                            </h1>
                            <p className="text-xl text-text-secondary">
                                Une question ? Envie de nous rejoindre ? <br />
                                Nous sommes là pour vous répondre.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-black">
                            {/* Contact Information */}
                            <div className="space-y-8">
                                <div className="glass p-8 rounded-3xl border border-primary/10">
                                    <h2 className="font-display font-bold text-2xl mb-6 text-primary">Nos Coordonnées</h2>

                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-primary">Adresse</h3>
                                                <p className="text-text-secondary">2 rue du lot appartement A08<br />31100 Toulouse, France</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                                <Phone size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-primary">Téléphone</h3>
                                                <p className="text-text-secondary">07 68 11 44 46</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-primary">Email</h3>
                                                <a href="mailto:letriodespetitspas@gmail.com" className="text-text-secondary hover:text-primary transition-colors">
                                                    letriodespetitspas@gmail.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass p-8 rounded-3xl border border-secondary/10">
                                    <h2 className="font-display font-bold text-2xl mb-4 text-secondary">Horaires</h2>
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-secondary/10 p-3 rounded-full text-secondary">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-text-secondary">
                                                Nous sommes une association de bénévoles.<br />
                                                Nous essayons de répondre dans les plus brefs délais, généralement sous 24h à 48h.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form Placeholder */}
                            <div className="glass p-8 rounded-3xl border border-accent/10 h-full">
                                <h2 className="font-display font-bold text-2xl mb-6 text-accent">Envoyez-nous un message</h2>
                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Nom complet</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">Message</label>
                                        <textarea
                                            id="message"
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-accent/30 transform hover:-translate-y-1">
                                        Envoyer le message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
