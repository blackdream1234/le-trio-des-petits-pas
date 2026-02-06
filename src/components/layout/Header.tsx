'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Notre Histoire', href: '/notre-histoire' },
        { name: 'Nos Actions', href: '/actions' },
        { name: 'Transparence', href: '/transparence' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'
                }`}
        >
            <div className={`container mx-auto px-6 transition-all duration-300 ${scrolled ? 'glass rounded-full max-w-6xl' : ''
                }`}>
                <nav className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        {/* Placeholder for when user adds the file */}
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-white group-hover:border-primary transition-colors shrink-0">
                            <img src="/logo.jpeg" alt="Logo Le Trio des Petits Pas" className="object-cover w-full h-full" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-xl text-primary font-bold group-hover:text-secondary transition-colors duration-300 leading-tight">
                                Le Trio des Petits Pas
                            </span>
                            <span className="text-xs text-text-secondary font-medium tracking-wide">Ensemble pour le handicap</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-text-secondary'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <Link
                            href="/don"
                            className="bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                        >
                            <Heart size={18} className="fill-current" />
                            <span>Faire un don</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-text-primary p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-md border-b border-border md:hidden"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-lg font-medium py-2 border-b border-border/50 ${pathname === link.href ? 'text-primary' : 'text-text-primary'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/don"
                                onClick={() => setIsOpen(false)}
                                className="bg-accent text-white py-3 rounded-xl font-bold text-center mt-4 shadow-lg"
                            >
                                Faire un don ❤️
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
