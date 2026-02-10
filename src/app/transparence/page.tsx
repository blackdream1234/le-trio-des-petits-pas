'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TransparencePage() {
    const [media, setMedia] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        async function fetchMedia() {
            // Fetch Media Gallery Only
            const { data: mediaData } = await supabase
                .from('site_media')
                .select('*')
                .eq('section', 'transparency')
                .order('created_at', { ascending: false });

            if (mediaData && mediaData.length > 0) {
                setMedia(mediaData);
            }
        }
        fetchMedia();
    }, []);

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 bg-surface-elevated">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-text-primary mb-6">
                        Transparence
                    </h1>
                    <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                        La transparence est une de nos valeurs fondamentales. Chaque don est un investissement direct dans l'avenir d'un enfant.
                    </p>
                </div>
            </section>

            {/* Impact Breakdown - "Un Stage c'est quoi ?" */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
                        <div className="w-full md:w-1/2">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                <img
                                    src="/stage-visual.jpg"
                                    alt="Enfant en stage"
                                    className="w-full h-[500px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold w-fit mb-2">Concrètement</span>
                                    <h3 className="text-white font-display font-bold text-3xl">Un Stage Intensif</h3>
                                    <p className="text-white/90 mt-2">15 jours pour gagner des mois d'autonomie.</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2 className="text-3xl font-display font-bold text-text-primary">Pourquoi finançons-nous des stages ?</h2>
                            <div className="text-lg text-text-secondary leading-relaxed space-y-4">
                                <p>
                                    Parce que pour nos enfants, progresser demande plus de temps, plus de soins et plus d’accompagnement.
                                </p>
                                <p>
                                    Les stages intensifs offrent un cadre spécialisé qui permet d’accélérer les progrès en mobilité et en autonomie, mais ils sont rarement pris en charge financièrement.
                                </p>
                                <p>
                                    Nous aidons donc les familles à y accéder, pour que chaque enfant puisse continuer à avancer.
                                </p>
                                <p className="font-bold text-primary">
                                    Chaque progrès change le quotidien d’un enfant et de sa famille.
                                </p>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    { emoji: "💶", title: "Coût moyen", desc: "2000€ à 3000€ pour 2 semaines" },
                                    { emoji: "🌍", title: "Lieu", desc: "Souvent à l'étranger (Espagne, USA, Pologne)" },
                                    { emoji: "💪", title: "Résultat", desc: "Acquisition de la marche, tenue de tête, communication" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-border hover:border-primary transition-colors shadow-sm">
                                        <span className="text-3xl">{item.emoji}</span>
                                        <div>
                                            <h4 className="font-bold text-text-primary">{item.title}</h4>
                                            <p className="text-sm text-text-secondary">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Media Gallery "En Images" */}
                    <div className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-display font-bold text-text-primary mb-4">La preuve par l'image 📸</h2>
                            <p className="text-text-secondary">Découvrez les progrès réalisés grâce à votre soutien.</p>
                        </div>

                        {media.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-text-secondary">Galerie à venir...</p>
                                <p className="text-xs text-text-secondary mt-2">Connectez-vous à l'admin pour ajouter des photos.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {media.map((item) => (
                                    <div key={item.id} className="relative group cursor-pointer overflow-hidden rounded-2xl h-64 shadow-lg bg-black">
                                        {item.type === 'video' ? (
                                            <>
                                                <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" controls />
                                                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">VIDÉO</div>
                                            </>
                                        ) : (
                                            <img src={item.url} alt={item.caption || "Photo"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        )}

                                        {item.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                <span className="text-white font-bold text-sm bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                                    {item.caption}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
