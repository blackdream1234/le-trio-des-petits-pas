'use client';

import { motion } from 'framer-motion';
import { Accessibility, HandHeart, HeartHandshake, Microscope, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react'; // Add imports
import { createClient } from '@/utils/supabase/client'; // Add import

export default function ActionsPage() {
    // ... existing actions array ...
    const actions = [
        {
            title: "Matériel Adapté",
            icon: <Accessibility size={40} />,
            description: "Financement de déambulateurs, sièges moulés et verticalisateurs non remboursés.",
            color: "bg-primary/10 text-primary border-primary/20"
        },
        {
            title: "Stages Intensifs",
            icon: <HandHeart size={40} />,
            description: "Prise en charge de thérapies spécialisées essentielles au développement moteur.",
            color: "bg-secondary/10 text-secondary border-secondary/20"
        },
        {
            title: "Soutien Familles",
            icon: <HeartHandshake size={40} />,
            description: "Aide au répit et accompagnement dans les démarches administratives.",
            color: "bg-accent/10 text-accent border-accent/20"
        },
        {
            title: "Innovation",
            icon: <Microscope size={40} />,
            description: "Accès aux nouvelles technologies comme les tablettes à commande oculaire.",
            color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
        }
    ];

    const [content, setContent] = useState({
        title: "Chaque don est un pas vers l'autonomie",
        desc: "Le Trio des Petits Pas est une association à but non lucratif. 100% de vos dons sont investis directement dans l'aide aux enfants et à leurs familles."
    });
    const supabase = createClient();

    useEffect(() => {
        async function fetchContent() {
            const { data } = await supabase.from('site_content').select('*').eq('section', 'actions');
            if (data) {
                const title = data.find(c => c.key === 'actions_title')?.content;
                const desc = data.find(c => c.key === 'actions_desc')?.content;
                if (title || desc) {
                    setContent(prev => ({
                        title: title || prev.title,
                        desc: desc || prev.desc
                    }));
                }
            }
        }
        fetchContent();
    }, []);

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 bg-gradient-to-b from-surface-elevated to-surface">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6 leading-tight"
                    >
                        {content.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto"
                    >
                        {content.desc}
                    </motion.p>
                </div>
            </section>

            {/* Actions Grid */}
            <section className="pb-32 px-6">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {actions.map((action, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`glass p-8 rounded-3xl border ${action.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${action.color.split(' ')[0]} ${action.color.split(' ')[1]}`}>
                                    {action.icon}
                                </div>
                                <h3 className="font-display font-bold text-2xl text-text-primary mb-4">
                                    {action.title}
                                </h3>
                                <p className="text-lg text-text-secondary leading-relaxed">
                                    {action.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-20"
                    >
                        <Link href="/don" className="inline-flex items-center space-x-3 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-primary/30 transform hover:scale-105">
                            <span>Soutenir nos actions</span>
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
