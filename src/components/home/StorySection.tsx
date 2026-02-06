'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { X, ZoomIn } from 'lucide-react';

const fallbackStories = [
    {
        id: '1',
        name: "Adam",
        age: "6 ans",
        story: "Adam rêve de courir avec ses copains. Grâce à vos dons, nous avons pu financer un déambulateur adapté qui lui offre cette liberté.",
        color: "bg-primary-light",
        image_url: "/adam.jpg",
        imageAlt: "Photo d'Adam",
        imagePosition: "object-[center_bottom]"
    },
    {
        id: '2',
        name: "Rime",
        age: "8 ans",
        story: "Pour Rime, la communication était un défi. La tablette à commande oculaire que nous avons fournie lui a donné une voix.",
        color: "bg-secondary-light",
        image_url: "/rime.jpg",
        imageAlt: "Photo de Rime",
        imagePosition: "object-top"
    },
    {
        id: '3',
        name: "Marwan",
        age: "18 mois",
        story: "Les séances de rééducation intensive sont cruciales pour Marwan. Le Trio finance ses soins pour lui offrir le meilleur départ possible.",
        color: "bg-accent-light",
        image_url: "/marwan.jpg",
        imageAlt: "Photo de Marwan",
        imagePosition: "object-top"
    }
];

export function StorySection() {
    const [stories, setStories] = useState<any[]>(fallbackStories);
    const [pageContent, setPageContent] = useState({ title: 'Nos Histoires', desc: 'Derrière chaque don, il y a un sourire, une victoire, un pas en avant. Découvrez ceux que vous aidez.' });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const containerRef = useRef(null);
    const supabase = createClient();
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    useEffect(() => {
        async function fetchData() {
            // Fetch Stories
            try {
                const { data, error } = await supabase
                    .from('children')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data && data.length > 0) {
                    const mappedStories = data.map((child, index) => ({
                        ...child,
                        color: index % 3 === 0 ? "bg-primary-light" : index % 3 === 1 ? "bg-secondary-light" : "bg-accent-light",
                        imageAlt: `Photo de ${child.name}`,
                        imagePosition: child.image_position || "object-top" // Default to top for faces
                    }));
                    setStories(mappedStories);
                }
            } catch (e) {
                console.error("Using fallback stories:", e);
            }

            // Fetch Page Text
            try {
                const { data } = await supabase
                    .from('site_content')
                    .select('*')
                    .eq('section', 'home');

                if (data) {
                    const title = data.find(c => c.key === 'home_stories_title')?.content;
                    const desc = data.find(c => c.key === 'home_stories_desc')?.content;
                    if (title || desc) {
                        setPageContent(prev => ({
                            title: title || prev.title,
                            desc: desc || prev.desc
                        }));
                    }
                }
            } catch (e) { console.error(e); }
        }
        fetchData();
    }, []);

    return (
        <section ref={containerRef} className="py-24 bg-surface-elevated relative overflow-hidden" id="notre-histoire">
            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out backdrop-blur-sm"
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={40} />
                        </button>
                        <motion.img
                            src={selectedImage}
                            layoutId={selectedImage}
                            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image itself if desired, or let it close
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="text-secondary font-bold tracking-wider uppercase text-sm">Chaque enfant est unique</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mt-3 mb-6">
                        {pageContent.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-text-secondary text-lg">
                        {pageContent.desc}
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent opacity-20 hidden md:block" />

                    <div className="space-y-32">
                        {stories.map((child, index) => (
                            <StoryCard
                                key={child.id}
                                child={child}
                                index={index}
                                onImageClick={() => setSelectedImage(child.image_url || child.imageSrc)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function StoryCard({ child, index, onImageClick }: { child: any; index: number; onImageClick: () => void }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col md:flex-row items-center gap-12 ${isEven ? '' : 'md:flex-row-reverse'}`}
        >
            {/* Image Side */}
            <div className="w-full md:w-1/2 relative group perspective-1000 flex justify-center">
                {/* Floating Effect Container */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: isEven ? 2 : -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative cursor-zoom-in w-80 h-80 md:w-96 md:h-96"
                    onClick={onImageClick}
                >
                    {/* Simplified, elegant border offset */}
                    <div className={`absolute top-0 ${isEven ? 'left-2' : 'right-2'} w-full h-full border-2 border-primary/20 rounded-full -z-10 transition-transform duration-300 group-hover:scale-105`} />

                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl bg-gray-100 border-4 border-white">
                        <motion.img
                            layoutId={child.image_url || child.imageSrc}
                            src={child.image_url || child.imageSrc}
                            alt={child.imageAlt}
                            className={`object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 ${child.imagePosition || 'object-top'}`}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="flex items-center justify-center h-full w-full bg-gray-100"><span class="text-4xl">📸</span></div>`;
                            }}
                        />

                        {/* Overlay with Zoom Icon */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <ZoomIn className="text-primary w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Content Side */}
            <div className={`w-full md:w-1/2 ${isEven ? 'md:text-left' : 'md:text-right'} flex flex-col justify-center`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-display font-bold text-2xl text-text-primary">{child.name}</h3>
                        <span className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-text-secondary border border-black/5">
                            {child.age}
                        </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-4">
                        {child.story}
                    </p>
                    {child.video_url && (
                        <a
                            href={child.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                            Voir la vidéo
                        </a>
                    )}
                </div>
                <div className={`flex ${isEven ? '' : 'md:justify-end'}`}>
                    <button className="text-primary font-bold hover:text-secondary transition-colors underline decoration-2 decoration-primary/30 hover:decoration-primary underline-offset-4 text-lg">
                        Lire l'histoire complète
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
