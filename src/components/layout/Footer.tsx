import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-surface-elevated border-t border-border pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h3 className="font-display text-2xl font-bold text-gradient">
                            Le Trio des Petits Pas
                        </h3>
                        <p className="text-text-secondary leading-relaxed">
                            Ensemble pour le handicap. Une association créée par des mamans pour soutenir les enfants atteints de paralysie cérébrale.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink href="#" icon={<Facebook size={20} />} />
                            <SocialLink href="#" icon={<Instagram size={20} />} />
                            <SocialLink href="#" icon={<Linkedin size={20} />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-lg">Navigation</h4>
                        <ul className="space-y-4 text-text-secondary">
                            <li><Link href="/notre-histoire" className="hover:text-primary transition-colors">Notre Histoire</Link></li>
                            <li><Link href="/actions" className="hover:text-primary transition-colors">Nos Actions</Link></li>
                            <li><Link href="/transparence" className="hover:text-primary transition-colors">Transparence</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-lg">Contact</h4>
                        <ul className="space-y-4 text-text-secondary">
                            <li className="flex items-start space-x-3">
                                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                                <span>2 rue du lot appartement A08<br />31100 Toulouse, France</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={20} className="text-primary shrink-0" />
                                <span>07 68 11 44 46</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={20} className="text-primary shrink-0" />
                                <a href="mailto:letriodespetitspas@gmail.com" className="hover:text-primary transition-colors">letriodespetitspas@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-lg">Newsletter</h4>
                        <p className="text-text-secondary">Restez informés de nos actions et des progrès des enfants.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Votre email"
                                className="w-full px-4 py-3 rounded-lg bg-surface border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-primary/25">
                                S'inscrire
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-secondary">
                    <p>© {new Date().getFullYear()} Le Trio des Petits Pas. Tous droits réservés.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/mentions-legales" className="hover:text-primary">Mentions Légales</Link>
                        <Link href="/confidentialite" className="hover:text-primary">Politique de Confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 transform hover:-translate-y-1"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </a>
    );
}
