'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TransparencePage() {
    const [stories, setStories] = useState<any[]>([]);
    const [media, setMedia] = useState<any[]>([]); // Keep for unassigned media if needed
    const [content, setContent] = useState({
        title: "Transparence",
        desc: "La transparence est une de nos valeurs fondamentales. Chaque don est un investissement direct dans l'avenir d'un enfant.",
        galleryTitle: "Nos Histoires et Progrès", // Default value
        galleryDesc: "Découvrez les parcours inspirants des enfants que nous soutenons et les étapes franchies grâce à votre générosité." // Default value
    });
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            // 1. Fetch Text Content
            const { data: textData } = await supabase.from('site_content').select('*').eq('section', 'transparency');
            if (textData) {
                const title = textData.find(c => c.key === 'transparency_title')?.content;
                const desc = textData.find(c => c.key === 'transparency_desc')?.content;
                const galleryTitle = textData.find(c => c.key === 'transparency_gallery_title')?.content;
                const galleryDesc = textData.find(c => c.key === 'transparency_gallery_desc')?.content;

                setContent(prev => ({
                    title: title || prev.title,
                    desc: desc || prev.desc,
                    galleryTitle: galleryTitle || prev.galleryTitle,
                    galleryDesc: galleryDesc || prev.galleryDesc
                }));
            }

            // 2. Fetch Stories
            const { data: storiesData } = await supabase
                .from('stories')
                .select('*')
                .order('created_at', { ascending: false });

            // 3. Fetch All Media
            const { data: mediaData } = await supabase
                .from('site_media')
                .select('*')
                .eq('section', 'transparency')
                .order('created_at', { ascending: false });

            // 4. Combine
            if (storiesData && mediaData) {
                const storiesWithMedia = storiesData.map(story => ({
                    ...story,
                    media: mediaData.filter(m => m.story_id === story.id)
                }));
                setStories(storiesWithMedia);

                // Optional: valid media that is NOT in a story could be in 'media' state
                setMedia(mediaData.filter(m => !m.story_id));
                // For now let's just keep all media in 'media' if we want a gallery at bottom, or just stories.
                // The user seems to want a feed. Let's prioritize stories.
            }
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section - Static */}
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
                                    { emoji: "💶", title: "Coût moyen", desc: "2000€ à 3000€ pour 2 semaines" }
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

                    {/* Material Section - Image Right, Text Left */}
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center mb-24">
                        <div className="w-full md:w-1/2">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                <img
                                    src="/materiel-visual.jpg"
                                    alt="Matériel adapté"
                                    className="w-full h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                                    <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold w-fit mb-2">Autonomie</span>
                                    <h3 className="text-white font-display font-bold text-3xl">Le Matériel Adapté</h3>
                                    <p className="text-white/90 mt-2">Donner les moyens à chaque enfant d'avancer.</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            <h2 className="text-3xl font-display font-bold text-text-primary">Pourquoi finançons-nous le matériel adapté ?</h2>
                            <div className="text-lg text-text-secondary leading-relaxed space-y-4">
                                <p>
                                    Un fauteuil adapté, un déambulateur, un siège spécialisé ou du matériel de positionnement peuvent coûter plusieurs milliers d’euros, et restent souvent mal remboursés ou avec de longs délais d’attente.
                                </p>
                                <p>
                                    Pourtant, ces équipements sont essentiels : ils permettent aux enfants de se déplacer, éviter les douleurs, progresser dans leurs soins et gagner en autonomie au quotidien.
                                </p>
                                <p>
                                    À travers Le Trio des Petits Pas, nous aidons les familles à financer ce matériel indispensable pour que les progrès d’un enfant ne dépendent pas des moyens financiers de ses parents.
                                </p>
                                <p className="font-bold text-primary">
                                    Parce que chaque petit pas mérite toutes les chances d’avancer.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Latest Stage / Media Gallery Section */}

                    {/* Stories Feed */}
                    <div className="space-y-12 mb-24">
                        <div className="text-center">
                            <h2 className="text-3xl font-display font-bold text-text-primary mb-4">{content.galleryTitle}</h2>
                            <p className="text-text-secondary">{content.galleryDesc}</p>
                        </div>

                        {stories.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-text-secondary">Aucune story pour le moment...</p>
                            </div>
                        ) : (
                            stories.map(story => (
                                <div key={story.id} className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm scroll-mt-32" id={`story-${story.id}`}>
                                    {/* Story Header */}
                                    <div className="mb-8 border-b border-border pb-6">
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {new Date(story.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-4">
                                            {story.title}
                                        </h3>
                                        {story.description && (
                                            <div className="prose prose-lg text-text-secondary max-w-none whitespace-pre-line leading-relaxed">
                                                {story.description}
                                            </div>
                                        )}
                                    </div>

                                    {/* Story Gallery */}
                                    {story.media && story.media.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {story.media.map((item: any) => (
                                                <div key={item.id} className="relative group cursor-pointer overflow-hidden rounded-2xl h-64 shadow-lg bg-black">
                                                    {item.type === 'video' ? (
                                                        <>
                                                            <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" controls />
                                                            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">VIDÉO</div>
                                                        </>
                                                    ) : (
                                                        <img src={item.url} alt={item.caption || "Photo"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-text-secondary italic">Aucune photo pour cette story.</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
